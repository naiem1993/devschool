import prisma from '@/lib/prisma'
import {
  DEFAULT_HERO_BN,
  DEFAULT_HERO_EN,
  HERO_SETTINGS_KEY,
  HERO_EN_SETTINGS_KEY,
  mergeHero,
  type HeroContent,
} from '@/lib/hero-content'
import type { Locale } from '@/lib/i18n/config'
import { DEFAULT_FOOTER, FOOTER_SETTINGS_KEY, mergeFooter, type FooterContent } from '@/lib/footer-content'
import { DEFAULT_REVIEWS, REVIEWS_SETTINGS_KEY, mergeReviews, type ReviewsSettings } from '@/lib/reviews-content'
import { DEFAULT_FAQ, FAQ_SETTINGS_KEY, mergeFaq, type FaqSettings } from '@/lib/faq-content'

/**
 * DB থেকে hero settings পড়ে — locale-নির্ভর।
 *  - locale='bn' → 'hero' key পড়ে; না থাকলে DEFAULT_HERO_BN (কখনো null নয়)
 *  - locale='en' → 'hero_en' key পড়ে; না থাকলে null
 *                   (null মানে: এখনো admin ইংরেজি hero লেখেননি — PHASE C-তে
 *                    home এলে ContentComingSoon দেখাবে)
 */
export async function getHeroSettings(
  locale: Locale = 'bn'
): Promise<HeroContent | null> {
  if (locale === 'en') {
    try {
      const row = await prisma.siteSettings.findUnique({
        where: { key: HERO_EN_SETTINGS_KEY },
      })
      if (!row) return null
      return mergeHero(row.value, DEFAULT_HERO_EN)
    } catch (e) {
      console.error('[site-settings] getHeroSettings(en) failed:', e)
      return null
    }
  }

  // locale === 'bn' (default) — পুরনো আচরণ, কখনো null নয়
  try {
    const row = await prisma.siteSettings.findUnique({
      where: { key: HERO_SETTINGS_KEY },
    })
    if (!row) return DEFAULT_HERO_BN
    return mergeHero(row.value, DEFAULT_HERO_BN)
  } catch (e) {
    console.error('[site-settings] getHeroSettings(bn) failed — using defaults:', e)
    return DEFAULT_HERO_BN
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
  heroEn: HeroContent | null
  footer: FooterContent
  reviews: ReviewsSettings
  faq: FaqSettings
}> {
  const [hero, heroEn, footer, reviews, faq] = await Promise.all([
    // admin সবসময় বাংলায় — তাই স্পষ্টভাবে 'bn' পাস করছি।
    // getHeroSettings('bn') ব্যাবহারিকভাবে কখনো null দেয় না; তবুও TS-নিরাপদ
    // রাখতে ?? DEFAULT_HERO_BN বসানো হলো।
    getHeroSettings('bn').then((h) => h ?? DEFAULT_HERO_BN),
    // ইংরেজি hero — DB-তে 'hero_en' না থাকলে null (admin form-এ DEFAULT_HERO_EN দেখাবে)
    getHeroSettings('en'),
    getFooterSettings(),
    getReviewsSettings(),
    getFaqSettings(),
  ])
  return { hero, heroEn, footer, reviews, faq }
}
