import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { heroSettingsSchema, footerSettingsSchema, reviewsSettingsSchema, faqSettingsSchema, validateBody } from '@/lib/validators'
import { getSiteSettings } from '@/lib/site-settings'
import { HERO_SETTINGS_KEY } from '@/lib/hero-content'
import { FOOTER_SETTINGS_KEY } from '@/lib/footer-content'
import { REVIEWS_SETTINGS_KEY } from '@/lib/reviews-content'
import { FAQ_SETTINGS_KEY } from '@/lib/faq-content'

export async function GET() {
  const settings = await getSiteSettings()
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const body = await req.json()

  const heroRes = validateBody(heroSettingsSchema, body?.hero)
  if (heroRes.error) return NextResponse.json({ error: 'hero: ' + heroRes.error }, { status: 400 })

  const footerRes = validateBody(footerSettingsSchema, body?.footer)
  if (footerRes.error) return NextResponse.json({ error: 'footer: ' + footerRes.error }, { status: 400 })

  const reviewsRes = validateBody(reviewsSettingsSchema, body?.reviews)
  if (reviewsRes.error) return NextResponse.json({ error: 'reviews: ' + reviewsRes.error }, { status: 400 })

  const faqRes = validateBody(faqSettingsSchema, body?.faq)
  if (faqRes.error) return NextResponse.json({ error: 'faq: ' + faqRes.error }, { status: 400 })

  try {
    await prisma.siteSettings.upsert({
      where: { key: HERO_SETTINGS_KEY },
      update: { value: heroRes.data as any },
      create: {
        key: HERO_SETTINGS_KEY,
        value: heroRes.data as any,
        description: 'Homepage hero section content',
      },
    })

    await prisma.siteSettings.upsert({
      where: { key: FOOTER_SETTINGS_KEY },
      update: { value: footerRes.data as any },
      create: {
        key: FOOTER_SETTINGS_KEY,
        value: footerRes.data as any,
        description: 'Site footer content',
      },
    })

    await prisma.siteSettings.upsert({
      where: { key: REVIEWS_SETTINGS_KEY },
      update: { value: reviewsRes.data as any },
      create: {
        key: REVIEWS_SETTINGS_KEY,
        value: reviewsRes.data as any,
        description: 'Homepage reviews section toggle',
      },
    })

    await prisma.siteSettings.upsert({
      where: { key: FAQ_SETTINGS_KEY },
      update: { value: faqRes.data as any },
      create: {
        key: FAQ_SETTINGS_KEY,
        value: faqRes.data as any,
        description: 'Homepage FAQ section items',
      },
    })

    // footer সব site page-এ থাকে → root layout revalidate করলে সব page-এ আপডেট হয়
    revalidatePath('/', 'layout')
    revalidatePath('/admin/settings')

    return NextResponse.json({
      ok: true,
      hero: heroRes.data,
      footer: footerRes.data,
      reviews: reviewsRes.data,
      faq: faqRes.data,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
