import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import TutorialsFilter, { type TutorialCard } from './TutorialsFilter'
import { absoluteUrl } from '@/lib/site-url'

// ─────────────────────────────────────────────────────────────
//  ISR — revalidate every 5 minutes
// ─────────────────────────────────────────────────────────────
export const revalidate = 300

// ─────────────────────────────────────────────────────────────
//  METADATA (SEO)
// ─────────────────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  try {
    const [tutCount, refCount] = await Promise.all([
      prisma.tutorial.count({ where: { isPublished: true } }),
      prisma.reference.count(),
    ])

    const description = `${tutCount}+ টি টিউটোরিয়াল ও ${refCount} টি প্রোগ্রামিং রেফারেন্স — HTML, CSS, JavaScript, Python সহ সব প্রোগ্রামিং ভাষা বিনামূল্যে শিখুন।`

    return {
      title: 'সব টিউটোরিয়াল — ব্রাউজ করুন | DevSchool',
      description,
      keywords: ['tutorials', 'programming', 'learn to code', 'DevSchool'],
      alternates: { canonical: '/tutorials' },
      openGraph: {
        title: 'সব টিউটোরিয়াল | DevSchool',
        description,
        type: 'website',
        url: '/tutorials',
        siteName: 'DevSchool',
        locale: 'bn_BD',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'সব টিউটোরিয়াল | DevSchool',
        description,
      },
    }
  } catch {
    return { title: 'সব টিউটোরিয়াল | DevSchool' }
  }
}

// ─────────────────────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────────────────────
export default async function TutorialsListingPage() {
  let tutorials: TutorialCard[] = []
  let totalChapters = 0
  let totalReferences = 0
  let dbError = false
  let errorMessage = ''

  try {
    const [raw, refCount] = await Promise.all([
      prisma.tutorial.findMany({
        where: { isPublished: true },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          difficulty: true,
          viewCount: true,
          duration: true,
          rating: true,
          createdAt: true,
          _count: { select: { chapters: true } },
        },
        orderBy: [{ viewCount: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.reference.count(),
    ])

    tutorials = raw.map((t) => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      description: t.description,
      difficulty: t.difficulty,
      viewCount: t.viewCount,
      duration: t.duration,
      rating: t.rating,
      chapterCount: t._count.chapters,
      createdAt: t.createdAt.toISOString(),
    }))

    totalChapters = tutorials.reduce((sum, t) => sum + t.chapterCount, 0)
    totalReferences = refCount
  } catch (err: any) {
    console.error('Tutorials listing error:', err)
    dbError = true
    if (err?.code === 'P1001') {
      errorMessage = 'ডেটাবেজ সার্ভারে সংযোগ করা যাচ্ছে না।'
    } else if (err?.code === 'P2021') {
      errorMessage = 'ডেটাবেজ টেবিল পাওয়া যাচ্ছে না। মাইগ্রেশন চালান।'
    } else {
      errorMessage = 'টিউটোরিয়াল লোড করতে সমস্যা হয়েছে।'
    }
  }

  // ─── DB ERROR STATE ───
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

  // ─── JSON-LD Structured Data ───
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'সব টিউটোরিয়াল — DevSchool',
    description: `${tutorials.length} টি টিউটোরিয়াল`,
    inLanguage: 'bn-BD',
    numberOfItems: tutorials.length,
    hasPart: tutorials.slice(0, 20).map((t) => ({
      '@type': 'Course',
      name: t.title,
      url: absoluteUrl(`/tutorials/${t.slug}`),
    })),
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
          {/* soft radial green glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[820px] max-w-full"
            style={{
              background:
                'radial-gradient(ellipse at center top, rgba(34,197,94,0.18), rgba(34,197,94,0.06) 45%, transparent 72%)',
            }}
          />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-2">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <li>
                  <Link href="/" className="hover:text-[#22C55E] transition">
                    হোম
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-slate-800 dark:text-slate-200 font-medium">টিউটোরিয়াল</li>
              </ol>
            </nav>

            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                সব টিউটোরিয়াল
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                আপনার পছন্দের প্রোগ্রামিং ভাষা বেছে নিন এবং স্ট্রাকচার্ড টিউটোরিয়াল দিয়ে
                শেখা শুরু করুন। সব কন্টেন্ট ১০০% বিনামূল্যে।
              </p>

              {/* Stats */}
              <div className="mt-8 flex flex-wrap gap-3">
                <StatCard value={tutorials.length} label="টিউটোরিয়াল" />
                <StatCard value={totalChapters} label="চ্যাপ্টার" />
                <StatCard value={totalReferences} label="রেফারেন্স" />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ LISTING + FILTERS ══════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {tutorials.length === 0 ? (
            <div className="bg-slate-50 dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/5 rounded-3xl p-12 text-center">
              <div className="text-5xl mb-4">📚</div>
              <h2 className="text-xl font-bold mb-2">এখনো কোনো টিউটোরিয়াল নেই</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                শীঘ্রই নতুন টিউটোরিয়াল যুক্ত করা হবে।
              </p>
            </div>
          ) : (
            <TutorialsFilter tutorials={tutorials} />
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
