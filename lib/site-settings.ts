import prisma from '@/lib/prisma'
import { DEFAULT_HERO, HERO_SETTINGS_KEY, mergeHero, type HeroContent } from '@/lib/hero-content'
import { DEFAULT_FOOTER, FOOTER_SETTINGS_KEY, mergeFooter, type FooterContent } from '@/lib/footer-content'

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

/** hero + footer একসাথে (admin form/API-র জন্য)। */
export async function getSiteSettings(): Promise<{ hero: HeroContent; footer: FooterContent }> {
  const [hero, footer] = await Promise.all([getHeroSettings(), getFooterSettings()])
  return { hero, footer }
}
