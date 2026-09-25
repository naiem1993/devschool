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
import { DEFAULT_FOOTER, DEFAULT_FOOTER_EN, FOOTER_SETTINGS_KEY, FOOTER_EN_SETTINGS_KEY, mergeFooter, type FooterContent } from '@/lib/footer-content'
import { DEFAULT_REVIEWS, REVIEWS_SETTINGS_KEY, mergeReviews, type ReviewsSettings } from '@/lib/reviews-content'
import { DEFAULT_FAQ, DEFAULT_FAQ_EN, FAQ_SETTINGS_KEY, mergeFaq, type FaqSettings, type FaqItem } from '@/lib/faq-content'

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

/**
 * DB থেকে footer settings পড়ে — locale-নির্ভর।
 *  - locale='bn' → 'footer' key
 *  - locale='en' → 'footer_en' key; না থাকলে DEFAULT_FOOTER_EN
 * socialLinks সর্বদা 'footer' (bn) থেকেই আসে — bn/en দুই view-এ একই social links থাকে।
 */
export async function getFooterSettings(
  locale: Locale = 'bn'
): Promise<FooterContent> {
  try {
    const bnRow = await prisma.siteSettings.findUnique({
      where: { key: FOOTER_SETTINGS_KEY },
    })
    const bnFooter = bnRow ? mergeFooter(bnRow.value, DEFAULT_FOOTER) : DEFAULT_FOOTER

    if (locale !== 'en') return bnFooter

    const enRow = await prisma.siteSettings.findUnique({
      where: { key: FOOTER_EN_SETTINGS_KEY },
    })
    const enFooter = enRow ? mergeFooter(enRow.value, DEFAULT_FOOTER_EN) : DEFAULT_FOOTER_EN
    // socialLinks bn-এর সাথে share — social links ভাষা-নিরপেক্ষ
    return { ...enFooter, socialLinks: bnFooter.socialLinks }
  } catch (e) {
    console.error('[site-settings] getFooterSettings failed — using defaults:', e)
    return locale === 'en'
      ? { ...DEFAULT_FOOTER_EN, socialLinks: DEFAULT_FOOTER.socialLinks }
      : DEFAULT_FOOTER
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

/**
 * DB থেকে FAQ settings পড়ে — locale-নির্ভর (PART 9j, paired items)।
 *  - locale='bn' → items থেকে q/a নেয়
 *  - locale='en' → items থেকে qEn/aEn নেয়; যেসব items-এ qEn+aEn দুটোই আছে শুধু সেগুলোই ফেরত দেয়
 * row-ই না থাকলে locale অনুযায়ী DEFAULT_FAQ / DEFAULT_FAQ_EN
 */
export async function getFaqSettings(
  locale: Locale = 'bn'
): Promise<FaqSettings> {
  try {
    const row = await prisma.siteSettings.findUnique({
      where: { key: FAQ_SETTINGS_KEY },
    })
    if (!row) {
      return locale === 'en'
        ? DEFAULT_FAQ_EN
        : { items: DEFAULT_FAQ.items.map((it) => ({ q: it.q, a: it.a })) }
    }
    const full = mergeFaq(row.value, DEFAULT_FAQ)
    if (locale === 'en') {
      const enItems: FaqItem[] = full.items
        .map((it) => ({
          q: (it.qEn ?? '').trim(),
          a: (it.aEn ?? '').trim(),
        }))
        .filter((it) => it.q.length > 0 && it.a.length > 0)
      return { items: enItems }
    }
    return { items: full.items.map((it) => ({ q: it.q, a: it.a })) }
  } catch (e) {
    console.error('[site-settings] getFaqSettings failed — using defaults:', e)
    return locale === 'en'
      ? DEFAULT_FAQ_EN
      : { items: DEFAULT_FAQ.items.map((it) => ({ q: it.q, a: it.a })) }
  }
}

/**
 * hero + footer + reviews + faq একসাথে (admin form/API-র জন্য)।
 * admin সবসময় বাংলায়, তাই bn view-গুলো dominant; সাথে ইংরেজি ভার্সনগুলোও দিই
 * যাতে form-এ দুটো ভাষা পাশাপাশি এডিট করা যায়।
 * FAQ-এর ক্ষেত্রে items-এ qEn/aEn সহ full paired view ফেরত দিই (admin-এর ৪টা ইনপুট লাগে)।
 */
export async function getSiteSettings(): Promise<{
  hero: HeroContent
  heroEn: HeroContent | null
  footer: FooterContent
  footerEn: FooterContent
  reviews: ReviewsSettings
  faq: FaqSettings
}> {
  const [hero, heroEn, footer, footerEn, reviews, faqRow] = await Promise.all([
    getHeroSettings('bn').then((h) => h ?? DEFAULT_HERO_BN),
    getHeroSettings('en'),
    getFooterSettings('bn'),
    getFooterSettings('en'),
    getReviewsSettings(),
    prisma.siteSettings.findUnique({ where: { key: FAQ_SETTINGS_KEY } }),
  ])
  // admin form-এ paired view দরকার (qEn/aEn সহ) — তাই mergeFaq সরাসরি
  const faq = faqRow ? mergeFaq(faqRow.value, DEFAULT_FAQ) : DEFAULT_FAQ
  return { hero, heroEn, footer, footerEn, reviews, faq }
}
