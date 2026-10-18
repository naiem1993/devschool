import { Metadata } from 'next'
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
      languages: { bn: '/bn/playground', en: '/en/playground', 'x-default': '/bn/playground' },
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

export default async function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050806] text-slate-900 dark:text-slate-100">
      {/* Full-width editor */}
      <div className="p-2 sm:p-3">
        <PlaygroundClient />
      </div>
    </div>
  )
}
