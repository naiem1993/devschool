import 'server-only'
import prisma from '@/lib/prisma'
import LanguageTabs, { type LanguageTab } from './LanguageTabs'
import { pickOr } from '@/lib/i18n/pick'
import type { Locale } from '@/lib/i18n/config'

/**
 * DB থেকে published tutorial গুলো এনে LanguageTabs-এ পাঠায়।
 * Admin থেকে নতুন tutorial (isPublished = true) যোগ করলেই nav tab-এ auto যোগ হবে।
 * এখন locale অনুযায়ী titleBn/titleEn থেকে সঠিক title বেছে নেয়।
 */
export default async function LanguageTabsServer({ locale }: { locale: Locale }) {
  let tabs: LanguageTab[] = []
  try {
    const rows = await prisma.tutorial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'asc' },
      select: { slug: true, titleBn: true, titleEn: true },
    })
    tabs = rows.map((r) => ({
      slug: r.slug,
      title: pickOr(locale, r.titleBn, r.titleEn, r.slug),
    }))
  } catch {
    tabs = []
  }

  return <LanguageTabs tabs={tabs} locale={locale} />
}
