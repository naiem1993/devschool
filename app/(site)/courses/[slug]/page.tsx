import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { SITE_URL } from '@/lib/site-url'

// ─────────────────────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────────────────────
type PageProps = {
  params: Promise<{ slug: string }>
}

// ─────────────────────────────────────────────────────────────
//  STATIC PARAMS
// ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    })
    return categories.map((c) => ({ slug: c.slug }))
  } catch {
    return []
  }
}

// ─────────────────────────────────────────────────────────────
//  DYNAMIC METADATA
// ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      select: { name: true, description: true },
    })

    if (!category) {
      return {
        title: 'ক্যাটাগরি পাওয়া যায়নি | DevSchool',
        robots: { index: false, follow: false },
      }
    }

    const description =
      category.description ||
      `${category.name} ভাষার সব টিউটোরিয়াল, কুইজ ও কোড চ্যালেঞ্জ — বিনামূল্যে শিখুন।`

    return {
      title: `${category.name} টিউটোরিয়াল | DevSchool`,
      description,
      keywords: [category.name, 'tutorial', 'programming', 'learn', 'DevSchool'],
      alternates: { canonical: `/courses/${slug}` },
      openGraph: {
        title: `${category.name} টিউটোরিয়াল | DevSchool`,
        description,
        type: 'website',
        url: `/courses/${slug}`,
        siteName: 'DevSchool',
        locale: 'bn_BD',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category.name} টিউটোরিয়াল | DevSchool`,
        description,
      },
    }
  } catch {
    return { title: 'DevSchool' }
  }
}

// ─────────────────────────────────────────────────────────────
//  DIFFICULTY STYLE
// ─────────────────────────────────────────────────────────────
function difficultyStyle(d: string) {
  const key = d.toLowerCase()
  if (key === 'beginner')
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  if (key === 'intermediate')
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  if (key === 'advanced')
    return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
  return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
}

// ─────────────────────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────────────────────
export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params

  // ─── Fetch category ───
  const category = await prisma.category
    .findUnique({
      where: { slug, isActive: true },
      include: {
        tutorials: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            difficulty: true,
            duration: true,
            viewCount: true,
            rating: true,
            createdAt: true,
          },
          orderBy: [{ difficulty: 'asc' }, { createdAt: 'desc' }],
        },
        _count: { select: { tutorials: true, references: true } },
      },
    })
    .catch(() => null)

  if (!category) notFound()

  // ─── Single-tutorial category → সরাসরি tutorial-এ (W3Schools feel) ───
  // ক্যাটাগরিতে একটাই published tutorial থাকলে মাঝের লিস্ট পেজটা বাদ দিয়ে
  // সোজা /tutorials/<slug>-এ নিয়ে যাই। ২+ tutorial থাকলে নিচের লিস্ট পেজই দেখাবে।
  if (category.tutorials.length === 1) {
    redirect(`/tutorials/${category.tutorials[0].slug}`)
  }

  // ─── Fetch other categories for footer navigation ───
  const otherCategories = await prisma.category
    .findMany({
      where: { isActive: true, id: { not: category.id } },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        _count: { select: { tutorials: true } },
      },
      orderBy: { sortOrder: 'asc' },
      take: 8,
    })
    .catch(() => [])

  // ─── Group tutorials by difficulty ───
  const grouped = {
    Beginner: category.tutorials.filter((t) => t.difficulty.toLowerCase() === 'beginner'),
    Intermediate: category.tutorials.filter(
      (t) => t.difficulty.toLowerCase() === 'intermediate'
    ),
    Advanced: category.tutorials.filter((t) => t.difficulty.toLowerCase() === 'advanced'),
  }
  const hasGroups =
    grouped.Beginner.length + grouped.Intermediate.length + grouped.Advanced.length > 0

  // ─── JSON-LD ───
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} টিউটোরিয়াল`,
    description: category.description,
    inLanguage: 'bn-BD',
    isPartOf: { '@type': 'WebSite', name: 'DevSchool', url: SITE_URL },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806] text-slate-900 dark:text-slate-100">
        {/* ══════════ BREADCRUMB ══════════ */}
        <div className="border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#050806]">
          <nav
            aria-label="Breadcrumb"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
          >
            <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-[#22C55E] transition">
                  হোম
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href="/courses"
                  className="hover:text-[#22C55E] transition"
                >
                  ক্যাটাগরি
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-slate-800 dark:text-slate-200 font-medium">{category.name}</li>
            </ol>
          </nav>
        </div>

        {/* ══════════ HERO ══════════ */}
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-white/5 bg-[#f6f8f7] dark:bg-[#050806]">
          {/* soft radial green glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[820px] max-w-full"
            style={{
              background:
                'radial-gradient(ellipse at center top, rgba(34,197,94,0.18), rgba(34,197,94,0.06) 45%, transparent 72%)',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-3xl">
              {category.icon && (
                <div className="text-6xl mb-4" aria-hidden>
                  {category.icon}
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {category.description}
                </p>
              )}

              {/* Stats */}
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3">
                  <div className="text-2xl font-extrabold text-[#22C55E]">
                    {category._count.tutorials}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                    টিউটোরিয়াল
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3">
                  <div className="text-2xl font-extrabold text-[#15803d] dark:text-[#4ADE80]">
                    {category._count.references}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                    রেফারেন্স
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ TUTORIALS LIST ══════════ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {category.tutorials.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-xl font-bold mb-2">এই ক্যাটাগরিতে এখনো টিউটোরিয়াল নেই</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                আমরা শীঘ্রই এই ক্যাটাগরির টিউটোরিয়াল যোগ করব।
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#22C55E] hover:bg-[#1faf53] text-black rounded-xl text-sm font-semibold transition"
              >
                অন্য ক্যাটাগরি দেখুন →
              </Link>
            </div>
          ) : hasGroups ? (
            <div className="space-y-12">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => {
                const list = grouped[level]
                if (list.length === 0) return null
                const icons = { Beginner: '🟢', Intermediate: '🟡', Advanced: '🔴' }
                return (
                  <section key={level}>
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-bold tracking-tight">
                        {icons[level]} {level}
                      </h2>
                      <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-full">
                        {list.length}
                      </span>
                    </div>
                    <TutorialGrid items={list} />
                  </section>
                )
              })}
            </div>
          ) : (
            <TutorialGrid items={category.tutorials} />
          )}
        </div>

        {/* ══════════ OTHER CATEGORIES ══════════ */}
        {otherCategories.length > 0 && (
          <section className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-2xl font-bold tracking-tight mb-6">
                🔍 আরো ক্যাটাগরি ব্রাউজ করুন
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {otherCategories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/courses/${c.slug}`}
                    className="group bg-slate-50 dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/5 rounded-2xl p-4 hover:border-[#22C55E]/50 hover:shadow-md transition"
                  >
                    <div className="text-3xl mb-2" aria-hidden>
                      {c.icon || '📘'}
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-[#22C55E] transition line-clamp-1">
                      {c.name}
                    </h3>
                    <span className="text-xs text-slate-400 mt-1 block">
                      {c._count.tutorials} টিউটোরিয়াল
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
//  TUTORIAL GRID (reusable server component)
// ─────────────────────────────────────────────────────────────
function TutorialGrid({
  items,
}: {
  items: Array<{
    id: string
    title: string
    slug: string
    description: string | null
    difficulty: string
    duration: number | null
    viewCount: number
    rating: number | null
  }>
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((t) => (
        <Link
          key={t.id}
          href={`/tutorials/${t.slug}`}
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col"
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${difficultyStyle(t.difficulty)}`}
            >
              {t.difficulty}
            </span>
            {t.rating != null && (
              <span className="text-xs text-amber-500 font-medium">⭐ {t.rating.toFixed(1)}</span>
            )}
          </div>

          <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-[#22C55E] transition line-clamp-2">
            {t.title}
          </h3>

          {t.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
              {t.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
            <span className="inline-flex items-center gap-1">👁️ {t.viewCount.toLocaleString()}</span>
            {t.duration && <span className="inline-flex items-center gap-1">⏱️ {t.duration}মি</span>}
            <span className="text-[#22C55E] font-semibold group-hover:translate-x-1 transition-transform">
              পড়ুন →
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
