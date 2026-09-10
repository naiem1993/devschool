import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import LessonSidebar from '@/components/LessonSidebar'

// ─────────────────────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────────────────────
type PageProps = {
  params: Promise<{ slug: string }>
}

// ─────────────────────────────────────────────────────────────
//  STATIC PARAMS (build-time SSG for published tutorials)
// ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const tutorials = await prisma.tutorial.findMany({
      where: { isPublished: true },
      select: { slug: true },
      take: 500,
    })
    return tutorials.map((t) => ({ slug: t.slug }))
  } catch {
    return []
  }
}

// ─────────────────────────────────────────────────────────────
//  DYNAMIC METADATA (SEO + OpenGraph + Twitter)
// ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const tutorial = await prisma.tutorial.findUnique({
      where: { slug },
      select: {
        title: true,
        description: true,
        difficulty: true,
        category: { select: { name: true } },
      },
    })

    if (!tutorial) {
      return {
        title: 'টিউটোরিয়াল পাওয়া যায়নি | DevSchool',
        robots: { index: false, follow: false },
      }
    }

    const description =
      tutorial.description ||
      `${tutorial.title} — ${tutorial.category.name} ক্যাটাগরির ${tutorial.difficulty} লেভেলের টিউটোরিয়াল`

    return {
      title: `${tutorial.title} | DevSchool`,
      description,
      keywords: [tutorial.title, tutorial.category.name, 'tutorial', 'programming', 'DevSchool'],
      alternates: { canonical: `/tutorials/${slug}` },
      openGraph: {
        title: tutorial.title,
        description,
        type: 'article',
        url: `/tutorials/${slug}`,
        siteName: 'DevSchool',
        locale: 'bn_BD',
      },
      twitter: {
        card: 'summary_large_image',
        title: tutorial.title,
        description,
      },
    }
  } catch {
    return { title: 'DevSchool' }
  }
}

// ─────────────────────────────────────────────────────────────
//  DIFFICULTY BADGE COLOR
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
export default async function TutorialPage({ params }: PageProps) {
  const { slug } = await params

  // ─── Fetch tutorial with all relations ───
  const tutorial = await prisma.tutorial
    .findUnique({
      where: { slug, isPublished: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        contents: { orderBy: { chapterNo: 'asc' } },
        _count: { select: { quizzes: true, challenges: true } },
      },
    })
    .catch(() => null)

  if (!tutorial) notFound()

  // ─── Fetch sibling tutorials from same category (for sidebar nav + related) ───
  const siblings = await prisma.tutorial
    .findMany({
      where: {
        categoryId: tutorial.categoryId,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        duration: true,
        viewCount: true,
      },
      orderBy: [{ difficulty: 'asc' }, { createdAt: 'desc' }],
    })
    .catch(() => [])

  // ─── Fetch related tutorials (excluding current, for bottom grid) ───
  const related = siblings.filter((s) => s.id !== tutorial.id).slice(0, 4)

  // ─── Increment view count (fire-and-forget) ───
  prisma.tutorial
    .update({ where: { id: tutorial.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {})

  // ─── JSON-LD Structured Data ───
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: tutorial.title,
    description: tutorial.description,
    educationalLevel: tutorial.difficulty,
    inLanguage: 'bn-BD',
    isAccessibleForFree: true,
    provider: {
      '@type': 'Organization',
      name: 'DevSchool',
      url: 'https://devschool.com',
    },
    about: tutorial.category.name,
  }

  const totalDuration = tutorial.duration
    ? `${tutorial.duration} মিনিট`
    : tutorial.contents.length
      ? `~${tutorial.contents.length * 5} মিনিট`
      : 'নিজস্ব গতি'

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
        {/* ══════════ BREADCRUMB ══════════ */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <nav
            aria-label="Breadcrumb"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
          >
            <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <li>
                <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  হোম
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  টিউটোরিয়াল
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/categories/${tutorial.category.slug}`}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  {tutorial.category.name}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px]">
                {tutorial.title}
              </li>
            </ol>
          </nav>
        </div>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
            {/* ─────── ARTICLE ─────── */}
            <article className="min-w-0">
              {/* Hero / Meta */}
              <header className="mb-10">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <Link
                    href={`/categories/${tutorial.category.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-950 transition"
                  >
                    📂 {tutorial.category.name}
                  </Link>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${difficultyStyle(tutorial.difficulty)}`}
                  >
                    {tutorial.difficulty}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  {tutorial.title}
                </h1>

                {tutorial.description && (
                  <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tutorial.description}
                  </p>
                )}

                {/* Meta stats */}
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden>👁️</span>
                    {tutorial.viewCount.toLocaleString()} ভিউ
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden>⏱️</span>
                    {totalDuration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden>📖</span>
                    {tutorial.contents.length} চ্যাপ্টার
                  </span>
                  {tutorial._count.quizzes > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden>🧠</span>
                      {tutorial._count.quizzes} কুইজ
                    </span>
                  )}
                  {tutorial._count.challenges > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden>⚔️</span>
                      {tutorial._count.challenges} চ্যালেঞ্জ
                    </span>
                  )}
                </div>
              </header>

              {/* Chapters */}
              {tutorial.contents.length > 0 ? (
                <div className="space-y-6">
                  {tutorial.contents.map((chapter, idx) => (
                    <section
                      key={chapter.id}
                      id={`chapter-${chapter.chapterNo}`}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm scroll-mt-24"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                          {chapter.chapterNo}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight pt-1.5">
                          {chapter.title}
                        </h2>
                      </div>

                      <div
                        className="prose prose-slate dark:prose-invert max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-2xl prose-headings:scroll-mt-24"
                        dangerouslySetInnerHTML={{ __html: chapter.content }}
                      />

                      {chapter.codeExample && (
                        <div className="mt-6">
                          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 dark:bg-black border border-slate-800 rounded-t-2xl">
                            <span className="text-xs font-mono text-slate-400">
                              example-{chapter.chapterNo}.code
                            </span>
                            <span className="flex gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                            </span>
                          </div>
                          <pre className="bg-slate-950 text-emerald-300 text-sm leading-relaxed p-5 rounded-b-2xl overflow-x-auto font-mono border border-t-0 border-slate-800">
                            <code>{chapter.codeExample}</code>
                          </pre>
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center">
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="text-lg font-bold mb-2">কন্টেন্ট এখনো যুক্ত হয়নি</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    এই টিউটোরিয়ালের চ্যাপ্টারগুলো খুব শীঘ্রই যুক্ত করা হবে।
                  </p>
                </div>
              )}

              {/* ─── Related Tutorials ─── */}
              {related.length > 0 && (
                <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                  <h2 className="text-2xl font-bold mb-6 tracking-tight">
                    🔗 একই ক্যাটাগরির আরো টিউটোরিয়াল
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.map((r) => (
                      <Link
                        key={r.id}
                        href={`/tutorials/${r.slug}`}
                        className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${difficultyStyle(r.difficulty)}`}>
                            {r.difficulty}
                          </span>
                          {r.duration && (
                            <span className="text-xs text-slate-400">{r.duration}min</span>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2">
                          {r.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 mt-3">
                          👁️ {r.viewCount} ভিউ
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* ─────── STICKY SIDEBAR ─────── */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1">
                <LessonSidebar
                  lessons={siblings.map((s) => ({
                    id: s.id,
                    title: s.title,
                    slug: s.slug,
                  }))}
                  currentSlug={tutorial.slug}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
