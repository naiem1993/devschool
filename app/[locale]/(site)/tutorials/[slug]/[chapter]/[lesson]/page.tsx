import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import TutorialShell from '@/components/TutorialShell'
import LessonContent from '@/components/LessonContent'
import TryIt from '@/components/TryIt'
import { getTutorialNav } from '@/lib/tutorial-data'

type PageProps = {
  params: Promise<{ slug: string; chapter: string; lesson: string }>
}

export const revalidate = 86400

/** শুধু nested chapter-এর ২য়+ lesson-এর জন্য static params (first lesson chapter-এ redirect) */
export async function generateStaticParams() {
  try {
    const tutorials = await prisma.tutorial.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        chapters: {
          select: {
            slug: true,
            lessons: { orderBy: { sortOrder: 'asc' }, select: { slug: true } },
          },
        },
      },
      take: 100,
    })
    return tutorials.flatMap((t) =>
      t.chapters.flatMap((c) =>
        c.lessons.slice(1).map((l) => ({
          slug: t.slug,
          chapter: c.slug,
          lesson: l.slug,
        }))
      )
    )
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, chapter, lesson } = await params
  try {
    const ls = await prisma.lesson.findFirst({
      where: {
        slug: lesson,
        chapter: { slug: chapter, tutorial: { slug, isPublished: true } },
      },
      select: {
        title: true,
        chapter: {
          select: {
            title: true,
            tutorial: { select: { title: true } },
          },
        },
      },
    })
    if (!ls) {
      return { title: 'পাওয়া যায়নি | DevSchool', robots: { index: false, follow: false } }
    }
    return {
      title: `${ls.title} — ${ls.chapter.title} — ${ls.chapter.tutorial.title} | DevSchool`,
      alternates: { canonical: `/tutorials/${slug}/${chapter}/${lesson}` },
    }
  } catch {
    return { title: 'DevSchool' }
  }
}

export default async function LessonPage({ params }: PageProps) {
  const { slug, chapter, lesson } = await params

  const tutorial = await prisma.tutorial
    .findUnique({
      where: { slug, isPublished: true },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    })
    .catch(() => null)

  if (!tutorial) notFound()

  const ch = await prisma.chapter.findFirst({
    where: { tutorialId: tutorial.id, slug: chapter },
    select: {
      id: true,
      slug: true,
      title: true,
      sortOrder: true,
      lessons: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          slug: true,
          title: true,
          content: true,
          codeExample: true,
          sortOrder: true,
        },
      },
    },
  })

  if (!ch) notFound()

  // First lesson-এর canonical URL হলো chapter URL (D3/D4) — redirect
  const firstLesson = ch.lessons[0]
  if (firstLesson && firstLesson.slug === lesson) {
    permanentRedirect(`/tutorials/${slug}/${chapter}`)
  }

  const current = ch.lessons.find((l) => l.slug === lesson)
  if (!current) notFound()

  const nav = await getTutorialNav(tutorial.id)
  const sortedChapters = [...nav.chapters].sort((a, b) => a.sortOrder - b.sortOrder)
  const chIdx = sortedChapters.findIndex((c) => c.id === ch.id)

  // Prev / Next — lesson-এর ভেতরে, তারপর chapter bound হলে chapter-এ
  const lessonIdx = ch.lessons.findIndex((l) => l.id === current.id)
  const prevLesson = lessonIdx > 0 ? ch.lessons[lessonIdx - 1] : null
  const nextLesson =
    lessonIdx >= 0 && lessonIdx < ch.lessons.length - 1 ? ch.lessons[lessonIdx + 1] : null

  let prevHref: string
  let prevLabel: string
  if (prevLesson) {
    prevHref = `/tutorials/${slug}/${chapter}/${prevLesson.slug}`
    prevLabel = '❮ ' + prevLesson.title
  } else if (firstLesson) {
    prevHref = `/tutorials/${slug}/${chapter}`
    prevLabel = '❮ ' + firstLesson.title
  } else {
    prevHref = `/tutorials/${slug}`
    prevLabel = '❮ Home'
  }

  let nextHref: string | null = null
  if (nextLesson) {
    nextHref = `/tutorials/${slug}/${chapter}/${nextLesson.slug}`
  } else if (chIdx >= 0 && chIdx < sortedChapters.length - 1) {
    nextHref = `/tutorials/${slug}/${sortedChapters[chIdx + 1].slug}`
  }

  const lessonPath = `${chapter}/${current.slug}`

  return (
    <TutorialShell
      tutorialSlug={tutorial.slug}
      tutorialTitle={tutorial.title}
      nav={nav}
      active={{ chapterSlug: chapter, lessonSlug: current.slug }}
    >
      <nav className="mb-6 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#22C55E]">হোম</Link>
        <span>/</span>
        <Link href={`/tutorials/${tutorial.slug}`} className="hover:text-[#22C55E]">
          {tutorial.title}
        </Link>
        <span>/</span>
        <Link
          href={`/tutorials/${tutorial.slug}/${chapter}`}
          className="hover:text-[#22C55E]"
        >
          {ch.title}
        </Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300">{current.title}</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">{current.title}</h1>

      {current.content && (
        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <LessonContent content={current.content} lessonPath={lessonPath} />
        </div>
      )}

      {current.codeExample && (
        <div className="mt-6 rounded-lg overflow-hidden border border-emerald-200/60 dark:border-emerald-900/40">
          <div className="px-3 py-2 bg-[#0a0f0c] text-[11px] text-slate-500 font-mono border-b border-emerald-900/30">
            example.html
          </div>
          <pre className="bg-[#050806] text-[#4ADE80] p-4 overflow-x-auto text-sm font-mono">
            <code>{current.codeExample}</code>
          </pre>
        </div>
      )}

      {current.codeExample && <TryIt code={current.codeExample} lessonPath={lessonPath} />}

      <div className="flex justify-between items-center gap-3 mt-10 pt-6 border-t border-emerald-200/60 dark:border-emerald-900/40">
        <Link
          href={prevHref}
          className="px-5 py-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-[#22C55E]/10 hover:border-[#22C55E] transition-colors"
        >
          {prevLabel}
        </Link>

        {nextHref ? (
          <Link
            href={nextHref}
            className="px-5 py-2.5 rounded-lg bg-[#22C55E] text-[#050806] text-sm font-bold hover:bg-[#4ADE80] transition-colors"
          >
            Next ❯
          </Link>
        ) : (
          <Link
            href={`/tutorials/${tutorial.slug}`}
            className="px-5 py-2.5 rounded-lg bg-[#22C55E] text-[#050806] text-sm font-bold hover:bg-[#4ADE80] transition-colors"
          >
            সম্পন্ন ✓
          </Link>
        )}
      </div>
    </TutorialShell>
  )
}
