import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { heroSettingsSchema, footerSettingsSchema, reviewsSettingsSchema, faqSettingsSchema, validateBody } from '@/lib/validators'
import { getSiteSettings } from '@/lib/site-settings'
import { HERO_SETTINGS_KEY, HERO_EN_SETTINGS_KEY } from '@/lib/hero-content'
import { FOOTER_SETTINGS_KEY, FOOTER_EN_SETTINGS_KEY } from '@/lib/footer-content'
import { REVIEWS_SETTINGS_KEY } from '@/lib/reviews-content'
import { FAQ_SETTINGS_KEY } from '@/lib/faq-content'
import { serverError } from '@/lib/api-error'
import { requireAdmin } from '@/lib/auth'
import type { Prisma } from '@prisma/client'

export async function GET() {
  const settings = await getSiteSettings()
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const body = await req.json()

  const heroRes = validateBody(heroSettingsSchema, body?.hero)
  if (heroRes.error) return NextResponse.json({ error: 'hero: ' + heroRes.error }, { status: 400 })

  // ইংরেজি hero — required (admin form থেকে খালি এলে 400)
  const heroEnRes = validateBody(heroSettingsSchema, body?.heroEn)
  if (heroEnRes.error) return NextResponse.json({ error: 'heroEn: ' + heroEnRes.error }, { status: 400 })

  const footerRes = validateBody(footerSettingsSchema, body?.footer)
  if (footerRes.error) return NextResponse.json({ error: 'footer: ' + footerRes.error }, { status: 400 })

  // ইংরেজি footer (PART 9j) — required
  const footerEnRes = validateBody(footerSettingsSchema, body?.footerEn)
  if (footerEnRes.error)
    return NextResponse.json({ error: 'footerEn: ' + footerEnRes.error }, { status: 400 })

  const reviewsRes = validateBody(reviewsSettingsSchema, body?.reviews)
  if (reviewsRes.error) return NextResponse.json({ error: 'reviews: ' + reviewsRes.error }, { status: 400 })

  const faqRes = validateBody(faqSettingsSchema, body?.faq)
  if (faqRes.error) return NextResponse.json({ error: 'faq: ' + faqRes.error }, { status: 400 })

  try {
    // All six settings are persisted atomically in a single transaction.
    // Previously each upsert ran separately — a mid-way failure left the site
    // in an inconsistent state (e.g. new hero with a stale footer).
    await prisma.$transaction([
      prisma.siteSettings.upsert({
        where: { key: HERO_SETTINGS_KEY },
        update: { value: heroRes.data as Prisma.InputJsonValue },
        create: {
          key: HERO_SETTINGS_KEY,
          value: heroRes.data as Prisma.InputJsonValue,
          description: 'Homepage hero section content',
        },
      }),

      // ইংরেজি hero — /en হোমপেজের জন্য
      prisma.siteSettings.upsert({
        where: { key: HERO_EN_SETTINGS_KEY },
        update: { value: heroEnRes.data as Prisma.InputJsonValue },
        create: {
          key: HERO_EN_SETTINGS_KEY,
          value: heroEnRes.data as Prisma.InputJsonValue,
          description: 'Homepage hero section content (English)',
        },
      }),

      prisma.siteSettings.upsert({
        where: { key: FOOTER_SETTINGS_KEY },
        update: { value: footerRes.data as Prisma.InputJsonValue },
        create: {
          key: FOOTER_SETTINGS_KEY,
          value: footerRes.data as Prisma.InputJsonValue,
          description: 'Site footer content',
        },
      }),

      // ইংরেজি footer (PART 9j) — socialLinks bn-এর সাথে share হবে, তাই এখানে সংরক্ষণ করলেও
      // পাঠক site এ bn-এর socialLinks ব্যবহার হবে (site-settings.ts দেখুন)
      prisma.siteSettings.upsert({
        where: { key: FOOTER_EN_SETTINGS_KEY },
        update: { value: footerEnRes.data as Prisma.InputJsonValue },
        create: {
          key: FOOTER_EN_SETTINGS_KEY,
          value: footerEnRes.data as Prisma.InputJsonValue,
          description: 'Site footer content (English)',
        },
      }),

      prisma.siteSettings.upsert({
        where: { key: REVIEWS_SETTINGS_KEY },
        update: { value: reviewsRes.data as Prisma.InputJsonValue },
        create: {
          key: REVIEWS_SETTINGS_KEY,
          value: reviewsRes.data as Prisma.InputJsonValue,
          description: 'Homepage reviews section toggle',
        },
      }),

      prisma.siteSettings.upsert({
        where: { key: FAQ_SETTINGS_KEY },
        update: { value: faqRes.data as Prisma.InputJsonValue },
        create: {
          key: FAQ_SETTINGS_KEY,
          value: faqRes.data as Prisma.InputJsonValue,
          description: 'Homepage FAQ section items',
        },
      }),
    ])

    // footer সব site page-এ থাকে → root layout revalidate করলে সব page-এ আপডেট হয়
    revalidatePath('/', 'layout')
    revalidatePath('/admin/settings')

    return NextResponse.json({
      ok: true,
      hero: heroRes.data,
      heroEn: heroEnRes.data,
      footer: footerRes.data,
      footerEn: footerEnRes.data,
      reviews: reviewsRes.data,
      faq: faqRes.data,
    })
  } catch (e: unknown) {
    return serverError(e, 'settings-update')
  }
}
