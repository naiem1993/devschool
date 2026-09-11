import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ReferencesFilter, { type ReferenceCard } from './ReferencesFilter'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [refCount, langCount] = await Promise.all([
      prisma.reference.count(),
      prisma.reference.findMany({
        where: { language: { not: null } },
        select: { language: true },
        distinct: ['language'],
      }),
    ])

    const description = `${refCount}+ টি প্রোগ্রামিং রেফারেন্স — syntax, উদাহরণ ও ট্যাগ সহ ${langCount.length} টি ভাষার সম্পূর্ণ ডিকশনারি।`

    return {
      title: 'প্রোগ্রামিং রেফারেন্স — সম্পূর্ণ ডিকশনারি | DevSchool',
      description,
      keywords: ['reference', 'syntax', 'dictionary', 'programming', 'DevSchool'],
      alternates: { canonical: '/references' },
      openGraph: {
        title: 'প্রোগ্রামিং রেফারেন্স | DevSchool',
        description,
        type: 'website',
        url: '/references',
        siteName: 'DevSchool',
        locale: 'bn_BD',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'প্রোগ্রামিং রেফারেন্স | DevSchool',
        description,
      },
    }
  } catch {
    return { title: 'রেফারেন্স | DevSchool' }
  }
}

export default async function ReferencesListingPage() {
  let references: ReferenceCard[] = []
  let categories: { id: string; name: string; slug: string }[] = []
  let languages: string[] = []
  let dbError = false
  let errorMessage = ''

  try {
    const raw = await prisma.reference.findMany({
      include: {
        category: { select: { name: true, slug: true } },
      },
      orderBy: { title: 'asc' },
    })

    references = raw.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      description: r.description,
      syntax: r.syntax,
      example: r.example,
      tags: r.tags,
      language: r.language,
      category: { name: r.category.name, slug: r.category.slug },
    }))

    const catMap = new Map<string, { id: string; name: string; slug: string }>()
    for (const r of raw) {
      if (!catMap.has(r.category.slug)) {
        catMap.set(r.category.slug, {
          id: r.categoryId,
          name: r.category.name,
          slug: r.category.slug,
        })
      }
    }
    categories = Array.from(catMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )

    languages = Array.from(
      new Set(raw.map((r) => r.language).filter((l): l is string => Boolean(l)))
    ).sort()
  } catch (err: any) {
    console.error('References listing error:', err)
    dbError = true
    if (err?.code === 'P1001') errorMessage = 'ডেটাবেজে সংযোগ করা যাচ্ছে না।'
    else if (err?.code === 'P2021') errorMessage = 'ডেটাবেজ টেবিল পাওয়া যাচ্ছে না।'
    else errorMessage = 'রেফারেন্স লোড করতে সমস্যা হয়েছে।'
  }

  if (dbError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19] p-4">
        <div className="text-center max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="text-6xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            সংযোগ সমস্যা
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">{errorMessage}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition"
          >
            হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'প্রোগ্রামিং রেফারেন্স — DevSchool',
    description: `${references.length} টি রেফারেন্স`,
    inLanguage: 'bn-BD',
    numberOfItems: references.length,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-cyan-50 via-white to-indigo-50 dark:from-slate-950 dark:via-[#0b0f19] dark:to-cyan-950/30">
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            aria-hidden
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    হোম
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-slate-800 dark:text-slate-200 font-medium">রেফারেন্স</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                📖 প্রোগ্রামিং রেফারেন্স
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                প্রতিটা ফাংশন, মেথড ও সিনট্যাক্সের সম্পূর্ণ ডিকশনারি — কোড উদাহরণ,
                ট্যাগ ও ভাষা অনুযায়ী খুঁজে নিন। আপনার পকেট ডেভেলপার।
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <StatCard value={references.length} label="রেফারেন্স" color="indigo" />
                <StatCard value={languages.length} label="ভাষা" color="cyan" />
                <StatCard value={categories.length} label="ক্যাটাগরি" color="purple" />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {references.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-xl font-bold mb-2">এখনো কোনো রেফারেন্স নেই</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                শীঘ্রই নতুন রেফারেন্স যুক্ত করা হবে।
              </p>
            </div>
          ) : (
            <ReferencesFilter
              references={references}
              categories={categories}
              languages={languages}
            />
          )}
        </div>
      </div>
    </>
  )
}

function StatCard({
  value,
  label,
  color,
}: {
  value: number
  label: string
  color: 'indigo' | 'cyan' | 'purple'
}) {
  const colorMap = {
    indigo: 'text-indigo-600 dark:text-indigo-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    purple: 'text-purple-600 dark:text-purple-400',
  } as const

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3">
      <div className={`text-2xl font-extrabold ${colorMap[color]}`}>
        {value.toLocaleString()}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
        {label}
      </div>
    </div>
  )
}
