import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import CategoriesFilter, { type CategoryCard } from './CategoriesFilter'

// ─────────────────────────────────────────────────────────────
//  ISR — revalidate every 5 minutes
// ─────────────────────────────────────────────────────────────
export const revalidate = 300

// ─────────────────────────────────────────────────────────────
//  METADATA (SEO)
// ─────────────────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  try {
    const [catCount, tutCount] = await Promise.all([
      prisma.category.count({ where: { isActive: true } }),
      prisma.tutorial.count({ where: { isPublished: true } }),
    ])

    const description = `${catCount} টি ক্যাটাগরি ও ${tutCount}+ টি টিউটোরিয়াল — HTML, CSS, JavaScript, Python সহ সব প্রোগ্রামিং ভাষা বিনামূল্যে শিখুন।`

    return {
      title: 'সব ক্যাটাগরি — টিউটোরিয়াল ব্রাউজ করুন | DevSchool',
      description,
      keywords: ['categories', 'tutorials', 'programming', 'learn to code', 'DevSchool'],
      alternates: { canonical: '/categories' },
      openGraph: {
        title: 'সব ক্যাটাগরি | DevSchool',
        description,
        type: 'website',
        url: '/categories',
        siteName: 'DevSchool',
        locale: 'bn_BD',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'সব ক্যাটাগরি | DevSchool',
        description,
      },
    }
  } catch {
    return { title: 'সব ক্যাটাগরি | DevSchool' }
  }
}

// ─────────────────────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────────────────────
export default async function CategoriesListingPage() {
  // ─── Fetch categories with counts + difficulty spread ───
  let categories: CategoryCard[] = []
  let totalTutorials = 0
  let totalReferences = 0
  let dbError = false
  let errorMessage = ''

  try {
    const raw = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        description: true,
        sortOrder: true,
        _count: { select: { tutorials: true, references: true } },
        tutorials: {
          where: { isPublished: true },
          select: { difficulty: true },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })

    categories = raw.map((c) => {
      const spread = { Beginner: 0, Intermediate: 0, Advanced: 0 }
      for (const t of c.tutorials) {
        const key = t.difficulty.toLowerCase()
        if (key === 'beginner') spread.Beginner++
        else if (key === 'intermediate') spread.Intermediate++
        else if (key === 'advanced') spread.Advanced++
      }
      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        description: c.description,
        sortOrder: c.sortOrder,
        tutorialCount: c._count.tutorials,
        referenceCount: c._count.references,
        difficultySpread: spread,
      }
    })

    totalTutorials = categories.reduce((sum, c) => sum + c.tutorialCount, 0)
    totalReferences = categories.reduce((sum, c) => sum + c.referenceCount, 0)
  } catch (err: any) {
    console.error('Categories listing error:', err)
    dbError = true
    if (err?.code === 'P1001') {
      errorMessage = 'ডেটাবেজ সার্ভারে সংযোগ করা যাচ্ছে না।'
    } else if (err?.code === 'P2021') {
      errorMessage = 'ডেটাবেজ টেবিল পাওয়া যাচ্ছে না। মাইগ্রেশন চালান।'
    } else {
      errorMessage = 'ক্যাটাগরি লোড করতে সমস্যা হয়েছে।'
    }
  }

  // ─── DB ERROR STATE ───
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

  // ─── JSON-LD Structured Data ───
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'সব ক্যাটাগরি — DevSchool',
    description: `${categories.length} টি ক্যাটাগরি ও ${totalTutorials} টি টিউটোরিয়াল`,
    inLanguage: 'bn-BD',
    numberOfItems: categories.length,
    hasPart: categories.slice(0, 20).map((c) => ({
      '@type': 'Course',
      name: c.name,
      url: `https://devschool.com/categories/${c.slug}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
        {/* ══════════ HERO ══════════ */}
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-[#0b0f19] dark:to-indigo-950/40">
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
            {/* Breadcrumb */}
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
                <li className="text-slate-800 dark:text-slate-200 font-medium">ক্যাটাগরি</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                📚 সব ক্যাটাগরি
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                আপনার পছন্দের প্রোগ্রামিং ভাষা বেছে নিন এবং স্ট্রাকচার্ড টিউটোরিয়াল দিয়ে
                শেখা শুরু করুন। সব কন্টেন্ট ১০০% বিনামূল্যে।
              </p>

              {/* Stats */}
              <div className="mt-8 flex flex-wrap gap-4">
                <StatCard value={categories.length} label="ক্যাটাগরি" color="indigo" />
                <StatCard value={totalTutorials} label="টিউটোরিয়াল" color="purple" />
                <StatCard value={totalReferences} label="রেফারেন্স" color="emerald" />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ LISTING + FILTERS ══════════ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {categories.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h2 className="text-xl font-bold mb-2">এখনো কোনো ক্যাটাগরি নেই</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                শীঘ্রই নতুন ক্যাটাগরি যুক্ত করা হবে।
              </p>
            </div>
          ) : (
            <CategoriesFilter categories={categories} />
          )}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
//  STAT CARD (server component)
// ─────────────────────────────────────────────────────────────
function StatCard({
  value,
  label,
  color,
}: {
  value: number
  label: string
  color: 'indigo' | 'purple' | 'emerald'
}) {
  const colorMap = {
    indigo: 'text-indigo-600 dark:text-indigo-400',
    purple: 'text-purple-600 dark:text-purple-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
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
