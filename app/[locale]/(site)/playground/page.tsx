import { Metadata } from 'next'
import Link from 'next/link'
import PlaygroundClient from './PlaygroundClient'
import { isLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config'
import { getDictionarySync } from '@/lib/i18n/dictionaries'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const dict = getDictionarySync(locale)
  const isEn = locale === 'en'
  return {
    title: dict.playground.metaTitle,
    description: dict.playground.metaDesc,
    keywords: ['playground', 'code editor', 'javascript', 'live code', 'DevSchool'],
    alternates: {
      canonical: `/${locale}/playground`,
      languages: { bn: '/bn/playground', en: '/en/playground' },
    },
    openGraph: {
      title: dict.playground.metaOgTitle,
      description: dict.playground.metaOgDesc,
      type: 'website',
      url: '/playground',
      siteName: 'DevSchool',
      locale: isEn ? 'en_US' : 'bn_BD',
    },
    twitter: { card: 'summary_large_image', title: dict.playground.metaOgTitle, description: dict.playground.metaOgDesc },
  }
}

export default async function PlaygroundPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const dict = getDictionarySync(locale)

  return (
    <div className="min-h-screen bg-white dark:bg-[#050806] text-slate-900 dark:text-slate-100">
      {/* ══════════ HERO — clean black + single green glow ══════════ */}
      <section className="relative overflow-hidden bg-[#f6f8f7] dark:bg-[#050806] border-b border-slate-200 dark:border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[820px] max-w-full"
          style={{
            background:
              'radial-gradient(ellipse at center top, rgba(34,197,94,0.18), rgba(34,197,94,0.06) 45%, transparent 72%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-2">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href={`/${locale}`} className="hover:text-[#22C55E] transition">{dict.listing.breadcrumbHome}</Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-slate-800 dark:text-slate-200 font-medium">{dict.nav.playground}</li>
            </ol>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
            {dict.playground.heroTitle}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {dict.playground.heroSubtitlePre}{' '}
            <span className="text-[#22C55E] font-semibold">{dict.playground.heroSubtitleHighlight}</span>
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <PlaygroundClient />
      </div>
    </div>
  )
}
