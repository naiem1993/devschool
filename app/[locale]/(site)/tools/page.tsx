import { Metadata } from 'next'
import Link from 'next/link'
import { DEV_TOOLS } from '@/lib/tools'
import ToolsGrid from './ToolsGrid'
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
    title: dict.tools.metaTitle,
    description: dict.tools.metaDesc,
    keywords: ['tools', 'developer', 'json', 'base64', 'color picker', 'DevSchool'],
    alternates: {
      canonical: `/${locale}/tools`,
      languages: { bn: '/bn/tools', en: '/en/tools' },
    },
    openGraph: {
      title: dict.tools.metaOgTitle,
      description: dict.tools.metaOgDesc,
      type: 'website',
      url: '/tools',
      siteName: 'DevSchool',
      locale: isEn ? 'en_US' : 'bn_BD',
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.tools.metaOgTitle,
      description: dict.tools.metaOgDesc,
    },
  }
}

export default async function ToolsPage({
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

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href={`/${locale}`} className="hover:text-[#22C55E] transition">
                  {dict.listing.breadcrumbHome}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-slate-800 dark:text-slate-200 font-medium">{dict.nav.tools}</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
              {dict.tools.heroTitle}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {dict.tools.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════ GRID + FILTERS ══════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <ToolsGrid tools={DEV_TOOLS} />
      </div>
    </div>
  )
}
