import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import SearchClient from './SearchClient'
import { isLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config'
import { getDictionarySync } from '@/lib/i18n/dictionaries'

export const revalidate = 300

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
    title: dict.search.metaTitle,
    description: dict.search.metaDesc,
    keywords: ['search', 'tutorial', 'reference', 'programming', 'DevSchool'],
    alternates: {
      canonical: `/${locale}/search`,
      languages: { bn: '/bn/search', en: '/en/search' },
    },
    openGraph: {
      title: dict.search.metaOgTitle,
      description: dict.search.metaOgDesc,
      type: 'website',
      url: '/search',
      siteName: 'DevSchool',
      locale: isEn ? 'en_US' : 'bn_BD',
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: false, follow: true },
  }
}

async function getFilterData() {
  try {
    const langRows = await prisma.reference.findMany({
      where: { language: { not: null } },
      select: { language: true },
      distinct: ['language'],
    })

    const languages = Array.from(
      new Set(langRows.map((r) => r.language).filter((l): l is string => Boolean(l)))
    ).sort()

    return { languages }
  } catch (err) {
    console.error('Search page filter data error:', err)
    return { languages: [] as string[] }
  }
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const dict = getDictionarySync(locale)
  const isEn = locale === 'en'
  const { languages } = await getFilterData()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: dict.search.jsonLdName,
    inLanguage: isEn ? 'en' : 'bn-BD',
    url: '/search',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
                  <Link href={`/${locale}`} className="hover:text-[#22C55E] transition">
                    {dict.listing.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-slate-800 dark:text-slate-200 font-medium">{dict.nav.search}</li>
              </ol>
            </nav>

            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                {dict.search.heroTitle}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {dict.search.heroSubtitle}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <Suspense fallback={<SearchSkeleton />}>
            <SearchClient languages={languages} />
          </Suspense>
        </div>
      </div>
    </>
  )
}

function SearchSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
      <div className="h-10 w-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
    </div>
  )
}
