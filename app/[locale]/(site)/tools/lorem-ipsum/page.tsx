import { Metadata } from 'next'
import Link from 'next/link'
import LoremIpsumTool from '@/components/tools/LoremIpsumTool'
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
  const t = dict.toolPages.pageLoremIpsum
  return {
    title: `${t.title} — DevSchool`,
    description: t.subtitle,
    keywords: ['lorem ipsum', 'placeholder', 'dummy text', 'generator', 'DevSchool'],
    alternates: {
      canonical: `/${locale}/tools/lorem-ipsum`,
      languages: {
        bn: '/bn/tools/lorem-ipsum',
        en: '/en/tools/lorem-ipsum',
        'x-default': '/bn/tools/lorem-ipsum',
      },
    },
    openGraph: {
      title: `${t.title} | DevSchool`,
      description: t.subtitle,
      type: 'website',
      url: `/${locale}/tools/lorem-ipsum`,
      siteName: 'DevSchool',
      locale: isEn ? 'en_US' : 'bn_BD',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t.title} | DevSchool`,
      description: t.subtitle,
    },
  }
}

export default async function LoremIpsumPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const dict = getDictionarySync(locale)
  const t = dict.toolPages.pageLoremIpsum
  return (
    <div className="min-h-screen bg-white dark:bg-[#050806] text-slate-900 dark:text-slate-100">
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
              <li>
                <Link href={`/${locale}/tools`} className="hover:text-[#22C55E] transition">
                  {dict.toolPages.breadcrumbTools}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-slate-800 dark:text-slate-200 font-medium">Lorem Ipsum</li>
            </ol>
          </nav>
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
              {t.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <LoremIpsumTool />
      </div>
    </div>
  )
}
