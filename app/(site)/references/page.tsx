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
      <div className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-[#050806] p-4">
        <div className="text-center max-w-md bg-slate-50 dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/5 rounded-3xl p-8">
          <div className="text-5xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            সংযোগ সমস্যা
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{errorMessage}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#22C55E] hover:bg-[#1faf53] text-black rounded-xl text-sm font-semibold transition"
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
                <li className="text-slate-800 dark:text-slate-200 font-medium">রেফারেন্স</li>
              </ol>
            </nav>

            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                প্রোগ্রামিং রেফারেন্স
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                প্রতিটা ফাংশন, মেথড ও সিনট্যাক্সের সম্পূর্ণ ডিকশনারি — কোড উদাহরণ,
                ট্যাগ ও ভাষা অনুযায়ী খুঁজে নিন। আপনার পকেট ডেভেলপার।
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <StatCard value={references.length} label="রেফারেন্স" />
                <StatCard value={languages.length} label="ভাষা" />
                <StatCard value={categories.length} label="ক্যাটাগরি" />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ LISTING + FILTERS ══════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {references.length === 0 ? (
            <div className="bg-slate-50 dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/5 rounded-3xl p-12 text-center">
              <div className="text-5xl mb-4">📚</div>
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

// ─────────────────────────────────────────────────────────────
//  StatCard — neutral surface, green value only
// ─────────────────────────────────────────────────────────────
function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-2 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] px-4 py-2.5">
      <span className="text-xl font-bold tabular-nums text-[#22C55E]">
        {value.toLocaleString()}
      </span>
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  )
}
