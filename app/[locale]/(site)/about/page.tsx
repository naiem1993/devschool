import { Metadata } from 'next'
import Link from 'next/link'
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
    title: dict.about.metaTitle,
    description: dict.about.metaDesc,
    alternates: {
      canonical: `/${locale}/about`,
      languages: { bn: '/bn/about', en: '/en/about' },
    },
    openGraph: {
      title: dict.about.metaTitle,
      description: dict.about.metaDesc,
      type: 'website',
      url: '/about',
      siteName: 'DevSchool',
      locale: isEn ? 'en_US' : 'bn_BD',
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const dict = getDictionarySync(locale)
  const isEn = locale === 'en'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: dict.about.heroTitle,
    inLanguage: isEn ? 'en' : 'bn-BD',
    url: '/about',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white dark:bg-[#050806] text-slate-900 dark:text-slate-100">
        {/* ══════════ HERO — green glow (Home-এর মতো) ══════════ */}
        <section className="relative overflow-hidden bg-[#f6f8f7] dark:bg-[#050806] border-b border-slate-200 dark:border-white/5">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[820px] max-w-full"
            style={{
              background:
                'radial-gradient(ellipse at center top, rgba(34,197,94,0.18), rgba(34,197,94,0.06) 45%, transparent 72%)',
            }}
          />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <li>
                  <Link href={`/${locale}`} className="hover:text-[#22C55E] transition">
                    {dict.listing.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-slate-800 dark:text-slate-200 font-medium">
                  {dict.nav.about}
                </li>
              </ol>
            </nav>
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                {dict.about.heroTitle}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {dict.about.heroSubtitle}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
          {/* ══════════ Mission + Vision ══════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4">
                🎯
              </div>
              <h2 className="text-xl font-bold">{dict.about.missionTitle}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {dict.about.missionDesc}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl mb-4">
                🚀
              </div>
              <h2 className="text-xl font-bold">{dict.about.visionTitle}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {dict.about.visionDesc}
              </p>
            </div>
          </div>

          {/* ══════════ Values ══════════ */}
          <div>
            <h2 className="text-2xl font-extrabold text-center mb-8">
              {dict.about.valuesTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center">
                <div className="text-3xl mb-3">💚</div>
                <h3 className="text-lg font-bold">{dict.about.valuesFree}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {dict.about.valuesFreeDesc}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center">
                <div className="text-3xl mb-3">✋</div>
                <h3 className="text-lg font-bold">{dict.about.valuesPractical}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {dict.about.valuesPracticalDesc}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center">
                <div className="text-3xl mb-3">🇧🇩</div>
                <h3 className="text-lg font-bold">{dict.about.valuesBengali}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {dict.about.valuesBengaliDesc}
                </p>
              </div>
            </div>
          </div>

          {/* ══════════ Contact ══════════ */}
          <div className="bg-[#22C55E]/5 dark:bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-3xl p-8 text-center">
            <h2 className="text-xl font-bold">{dict.about.contactTitle}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
              {dict.about.contactDesc}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
