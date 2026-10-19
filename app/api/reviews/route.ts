import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createReviewSchema, validateBody } from '@/lib/validators'
import { rateLimit } from '@/lib/auth'

const COOLDOWN_DAYS = 30

/** Locale-aware error messages — Accept-Language header থেকে detect করে */
const ERRORS = {
  bn: {
    tooMany: 'অনেকবার চেষ্টা করেছেন — একটু পরে আবার দিন।',
    cooldownTpl: (days: number) => `এই ডিভাইস থেকে ${days} দিন পর আবার রিভিউ দিতে পারবেন।`,
    generic: 'রিভিউ সাবমিট করা যায়নি — আবার চেষ্টা করুন।',
  },
  en: {
    tooMany: 'Too many attempts — please try again later.',
    cooldownTpl: (days: number) => `You can submit another review from this device in ${days} day(s).`,
    generic: 'Could not submit review — please try again.',
  },
} as const

function getErrorLang(req: NextRequest): 'bn' | 'en' {
  const accept = (req.headers.get('accept-language') || '').toLowerCase()
  return accept.startsWith('en') ? 'en' : 'bn'
}

/** Public GET — শুধু approved review, newest first (homepage-এর জন্য)। */
export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { status: 'approved' },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { id: true, name: true, role: true, stars: true, text: true, createdAt: true },
  })
  return NextResponse.json(reviews)
}

/** Public POST — ইউজার feedback submit করে (status = pending, admin approve করবে)। */
export async function POST(req: NextRequest) {
  const lang = getErrorLang(req)
  const E = ERRORS[lang]

  // 1) Simple burst rate-limit per IP (cooldown আলাদা, DB-তে)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const rl = rateLimit(`review:${ip}`, 3, 60 * 60 * 1000) // ঘণ্টায় ৩বার
  if (!rl.ok) {
    return NextResponse.json(
      { error: E.tooMany },
      { status: 429 }
    )
  }

  const body = await req.json().catch(() => ({}))
  const { data, error } = validateBody(createReviewSchema, body)
  if (error || !data) return NextResponse.json({ error: error || 'Invalid data' }, { status: 400 })

  // 2) honeypot — bot হলে চুপচাপ success দেখাই, DB-তে লিখি না
  if (data.website) return NextResponse.json({ success: true, pending: true })

  const deviceId = (req.headers.get('x-device-id') || '').trim()

  // 3) ৩০ দিনের cooldown — ১ device ১বার
  if (deviceId) {
    const cd = await prisma.reviewCooldown.findUnique({ where: { deviceId } })
    if (cd) {
      const nextAllowed = new Date(cd.lastSubmittedAt.getTime() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000)
      if (nextAllowed > new Date()) {
        const daysLeft = Math.ceil((nextAllowed.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
        return NextResponse.json(
          { error: E.cooldownTpl(daysLeft), daysLeft },
          { status: 429 }
        )
      }
    }
  }

  try {
    // Create the review and stamp the cooldown atomically. Previously these ran
    // separately, so two concurrent requests could both pass the cooldown check
    // above and each create a review (race condition).
    const now = new Date()
    const [review] = await prisma.$transaction([
      prisma.review.create({
        data: {
          name: data.name,
          role: data.role || null,
          stars: data.stars,
          text: data.text,
          status: 'pending',
          deviceId: deviceId || null,
        },
        select: { id: true },
      }),
      ...(deviceId
        ? [
            prisma.reviewCooldown.upsert({
              where: { deviceId },
              create: { deviceId, lastSubmittedAt: now },
              update: { lastSubmittedAt: now },
            }),
          ]
        : []),
    ])

    return NextResponse.json({ success: true, pending: true, id: review.id }, { status: 201 })
  } catch (e: unknown) {
    console.error('[api/reviews POST] error:', e)
    return NextResponse.json({ error: E.generic }, { status: 500 })
  }
}
