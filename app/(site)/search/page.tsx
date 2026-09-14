import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import SearchClient, { type CategoryOption } from './SearchClient'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'সার্চ — টিউটোরিয়াল ও রেফারেন্স খুঁজুন | DevSchool',
  description:
    'DevSchool-এর সম্পূর্ণ কনটেন্ট সার্চ করুন — টিউটোরিয়াল, রেফারেন্স, সিনট্যাক্স ও কোড উদাহরণ, সব এক জায়গায়।',
  keywords: ['search', 'tutorial', 'reference', 'programming', 'DevSchool'],
  alternates: { canonical: '/search' },
  openGraph: {
    title: 'সার্চ | DevSchool',
    description: 'টিউটোরিয়াল ও রেফারেন্স খুঁজুন',
    type: 'website',
    url: '/search',
    siteName: 'DevSchool',
    locale: 'bn_BD',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: false, follow: true },
}

async function getFilterData() {
  try {
    const [categories, langRows] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.reference.findMany({
        where: { language: { not: null } },
        select: { language: true },
        distinct: ['language'],
      }),
    ])

    const languages = Array.from(
      new Set(langRows.map((r) => r.language).filter((l): l is string => Boolean(l)))
    ).sort()

    return { categories: categories as CategoryOption[], languages }
  } catch (err) {
    console.error('Search page filter data error:', err)
    return { categories: [] as CategoryOption[], languages: [] as string[] }
  }
}

export default async function SearchPage() {
  const { categories, languages } = await getFilterData()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: 'DevSchool Search',
    inLanguage: 'bn-BD',
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
                  <Link href="/" className="hover:text-[#22C55E] transition">
                    হোম
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-slate-800 dark:text-slate-200 font-medium">সার্চ</li>
              </ol>
            </nav>

            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                সার্চ
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                পুরো DevSchool-এর টিউটোরিয়াল, রেফারেন্স ও সিনট্যাক্স — সেকেন্ডেই খুঁজে
                নিন।
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <Suspense fallback={<SearchSkeleton />}>
            <SearchClient categories={categories} languages={languages} />
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
