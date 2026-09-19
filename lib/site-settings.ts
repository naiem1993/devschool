import prisma from '@/lib/prisma'
import { DEFAULT_HERO, HERO_SETTINGS_KEY, mergeHero, type HeroContent } from '@/lib/hero-content'
import { DEFAULT_FOOTER, FOOTER_SETTINGS_KEY, mergeFooter, type FooterContent } from '@/lib/footer-content'
import { DEFAULT_REVIEWS, REVIEWS_SETTINGS_KEY, mergeReviews, type ReviewsSettings } from '@/lib/reviews-content'
import { DEFAULT_FAQ, FAQ_SETTINGS_KEY, mergeFaq, type FaqSettings } from '@/lib/faq-content'

/**
 * DB থেকে hero settings পড়ে।
 * Row না থাকলে বা DB error হলে silent ভাবে DEFAULT_HERO return করে — homepage কখনো ভাঙবে না।
 */
export async function getHeroSettings(): Promise<HeroContent> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key: HERO_SETTINGS_KEY } })
    if (!row) return DEFAULT_HERO
    return mergeHero(row.value)
  } catch (e) {
    console.error('[site-settings] getHeroSettings failed — using defaults:', e)
    return DEFAULT_HERO
  }
}

/** DB থেকে footer settings পড়ে। fail হলে silent default। */
export async function getFooterSettings(): Promise<FooterContent> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key: FOOTER_SETTINGS_KEY } })
    if (!row) return DEFAULT_FOOTER
    return mergeFooter(row.value)
  } catch (e) {
    console.error('[site-settings] getFooterSettings failed — using defaults:', e)
    return DEFAULT_FOOTER
  }
}

/** DB থেকে reviews settings পড়ে। fail হলে silent default (enabled=true)। */
export async function getReviewsSettings(): Promise<ReviewsSettings> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key: REVIEWS_SETTINGS_KEY } })
    if (!row) return DEFAULT_REVIEWS
    return mergeReviews(row.value)
  } catch (e) {
    console.error('[site-settings] getReviewsSettings failed — using defaults:', e)
    return DEFAULT_REVIEWS
  }
}

/** DB থেকে FAQ settings পড়ে। fail হলে silent default। */
export async function getFaqSettings(): Promise<FaqSettings> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key: FAQ_SETTINGS_KEY } })
    if (!row) return DEFAULT_FAQ
    return mergeFaq(row.value)
  } catch (e) {
    console.error('[site-settings] getFaqSettings failed — using defaults:', e)
    return DEFAULT_FAQ
  }
}

/** hero + footer + reviews + faq একসাথে (admin form/API-র জন্য)। */
export async function getSiteSettings(): Promise<{
  hero: HeroContent
  footer: FooterContent
  reviews: ReviewsSettings
  faq: FaqSettings
}> {
  const [hero, footer, reviews, faq] = await Promise.all([
    getHeroSettings(),
    getFooterSettings(),
    getReviewsSettings(),
    getFaqSettings(),
  ])
  return { hero, footer, reviews, faq }
}
