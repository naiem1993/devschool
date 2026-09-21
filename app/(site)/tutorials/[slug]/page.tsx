import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import TutorialShell from '@/components/TutorialShell'
import { getTutorialNav } from '@/lib/tutorial-data'

type PageProps = {
  params: Promise<{ slug: string }>
}

// Pure static — admin save করলে `revalidateTutorialPaths()` দিয়ে on-demand refresh হয়।
// ১ দিনের safety net: কোনো mutation route revalidate করতে ভুলে গেলে এই auto-refresh ধরবে।
export const revalidate = 86400

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const tutorial = await prisma.tutorial.findUnique({
      where: { slug },
      select: {
        title: true,
        description: true,
        difficulty: true,
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
      `${tutorial.title} — ${tutorial.difficulty} লেভেলের টিউটোরিয়াল`
    return {
      title: `${tutorial.title} | DevSchool`,
      description,
      alternates: { canonical: `/tutorials/${slug}` },
      openGraph: {
        title: tutorial.title,
        description,
        type: 'article',
        url: `/tutorials/${slug}`,
        siteName: 'DevSchool',
        locale: 'bn_BD',
      },
    }
  } catch {
    return { title: 'DevSchool' }
  }
}

export default async function TutorialPage({ params }: PageProps) {
  const { slug } = await params

  const tutorial = await prisma.tutorial
    .findUnique({
      where: { slug, isPublished: true },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
      },
    })
    .catch(() => null)

  if (!tutorial) notFound()

  const nav = await getTutorialNav(tutorial.id)
  const sortedChapters = [...nav.chapters].sort((a, b) => a.sortOrder - b.sortOrder)
  const firstChapterUrl = sortedChapters[0]
    ? `/tutorials/${tutorial.slug}/${sortedChapters[0].slug}`
    : null

  return (
    <TutorialShell
      tutorialSlug={tutorial.slug}
      tutorialTitle={tutorial.title}
      nav={nav}
      active={{ chapterSlug: null, lessonSlug: null }}
    >
      <nav className="mb-6 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#22C55E]">
          হোম
        </Link>
        <span>/</span>
        <Link href="/tutorials" className="hover:text-[#22C55E]">
          টিউটোরিয়াল
        </Link>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{tutorial.title}</h1>

      {tutorial.description && (
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          {tutorial.description}
        </p>
      )}

      <h2 className="text-xl font-bold mb-4">এই টিউটোরিয়ালে যা যা শিখবেন</h2>

      {sortedChapters.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">এখনো কোনো চ্যাপ্টার যোগ করা হয়নি।</p>
      ) : (
        <ol className="space-y-2 mb-8">
          {sortedChapters.map((c, i) => (
            <li key={c.id}>
              <Link
                href={`/tutorials/${tutorial.slug}/${c.slug}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-emerald-200/60 dark:border-emerald-900/40 bg-white dark:bg-[#0a0f0c] hover:border-[#22C55E] hover:bg-[#22C55E]/5 transition-all"
              >
                <span className="w-7 h-7 rounded-full bg-[#22C55E]/15 text-[#15803d] dark:text-[#4ADE80] flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium">{c.title}</span>
                {c.lessons.length > 0 && (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {c.lessons.length} lesson
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ol>
      )}

      <div className="flex justify-between items-center gap-3 mt-10 pt-6 border-t border-emerald-200/60 dark:border-emerald-900/40">
        <span className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 text-sm cursor-not-allowed">
          ❮ Home
        </span>
        {firstChapterUrl ? (
          <Link
            href={firstChapterUrl}
            className="px-5 py-2.5 rounded-lg bg-[#22C55E] text-[#050806] text-sm font-bold hover:bg-[#4ADE80] transition-colors"
          >
            Next ❯
          </Link>
        ) : (
          <span className="px-5 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-400 text-sm cursor-not-allowed">
            Next ❯
          </span>
        )}
      </div>
    </TutorialShell>
  )
}
