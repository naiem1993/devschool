import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { createReviewSchema, validateBody } from '@/lib/validators'
import { rateLimit } from '@/lib/auth'

const COOLDOWN_DAYS = 30

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
  // 1) Simple burst rate-limit per IP (cooldown আলাদা, DB-তে)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const rl = rateLimit(`review:${ip}`, 3, 60 * 60 * 1000) // ঘণ্টায় ৩বার
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'অনেকবার চেষ্টা করেছেন — একটু পরে আবার দিন।' },
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
          { error: `এই ডিভাইস থেকে ${daysLeft} দিন পর আবার রিভিউ দিতে পারবেন।`, daysLeft },
          { status: 429 }
        )
      }
    }
  }

  try {
    const review = await prisma.review.create({
      data: {
        name: data.name,
        role: data.role || null,
        stars: data.stars,
        text: data.text,
        status: 'pending',
        deviceId: deviceId || null,
      },
      select: { id: true },
    })

    if (deviceId) {
      await prisma.reviewCooldown.upsert({
        where: { deviceId },
        create: { deviceId, lastSubmittedAt: new Date() },
        update: { lastSubmittedAt: new Date() },
      })
    }

    return NextResponse.json({ success: true, pending: true, id: review.id }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
