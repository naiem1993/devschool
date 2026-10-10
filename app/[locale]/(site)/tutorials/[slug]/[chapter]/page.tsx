import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import TutorialShell from '@/components/TutorialShell'
import LessonContent from '@/components/LessonContent'
import TryIt from '@/components/TryIt'
import { getTutorialNav } from '@/lib/tutorial-data'
import type { Locale } from '@/lib/i18n/config'
import { pickText, localizeChapter, localizeLesson } from '@/lib/i18n/localize'
import { TRYIT_TEXT } from '@/lib/i18n/tryit-text'

type PageProps = {
  params: Promise<{ locale: string; slug: string; chapter: string }>
}

export const revalidate = 86400

/** সব published tutorial-এর সব chapter-এর জন্য static params */
export async function generateStaticParams() {
  try {
    const tutorials = await prisma.tutorial.findMany({
      where: { isPublished: true },
      select: { slug: true, chapters: { select: { slug: true } } },
      take: 100,
    })
    return tutorials.flatMap((t) =>
      t.chapters.map((c) => ({ slug: t.slug, chapter: c.slug }))
    )
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug, chapter } = await params
  try {
    const ch = await prisma.chapter.findFirst({
      where: { slug: chapter, tutorial: { slug, isPublished: true } },
      select: {
        titleBn: true,
        titleEn: true,
        contentBn: true,
        contentEn: true,
        lessons: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
          select: { titleBn: true, titleEn: true },
        },
        tutorial: { select: { titleBn: true, titleEn: true } },
      },
    })
    if (!ch) {
      return { title: 'পাওয়া যায়নি | DevSchool', robots: { index: false, follow: false } }
    }
    const loc = locale as Locale
    const chapterTitle = pickText(loc, ch.titleBn, ch.titleEn)
    const firstLesson = ch.lessons[0]
    const lessonTitle = firstLesson ? pickText(loc, firstLesson.titleBn, firstLesson.titleEn) : null
    const contentL = pickText(loc, ch.contentBn, ch.contentEn)
    const displayTitle = contentL ? chapterTitle : (lessonTitle ?? chapterTitle)
    const tutorialTitle = pickText(loc, ch.tutorial.titleBn, ch.tutorial.titleEn)
    if (!displayTitle) {
      return { title: 'DevSchool' }
    }
    return {
      title: `${displayTitle} — ${tutorialTitle ?? 'DevSchool'} | DevSchool`,
      alternates: {
        canonical: `/${locale}/tutorials/${slug}/${chapter}`,
        languages: {
          bn: `/bn/tutorials/${slug}/${chapter}`,
          en: `/en/tutorials/${slug}/${chapter}`,
          'x-default': `/bn/tutorials/${slug}/${chapter}`,
        },
      },
    }
  } catch {
    return { title: 'DevSchool' }
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const { locale, slug, chapter } = await params
  const loc = locale as Locale
  const t = TRYIT_TEXT[loc === 'bn' ? 'bn' : 'en']

  const tutorial = await prisma.tutorial
    .findUnique({
      where: { slug, isPublished: true },
      select: {
        id: true,
        slug: true,
        titleBn: true,
        titleEn: true,
      },
    })
    .catch(() => null)

  if (!tutorial) notFound()

  const tutorialTitle = pickText(loc, tutorial.titleBn, tutorial.titleEn)
  if (!tutorialTitle) notFound()

  const ch = await prisma.chapter.findFirst({
    where: { tutorialId: tutorial.id, slug: chapter },
    select: {
      id: true,
      slug: true,
      titleBn: true,
      titleEn: true,
      contentBn: true,
      contentEn: true,
      codeExampleBn: true,
      codeExampleEn: true,
      sortOrder: true,
      lessons: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          slug: true,
          titleBn: true,
          titleEn: true,
          contentBn: true,
          contentEn: true,
          codeExampleBn: true,
          codeExampleEn: true,
          sortOrder: true,
        },
      },
    },
  })

  if (!ch) notFound()

  const nav = await getTutorialNav(tutorial.id, loc)

  // প্রথম lesson (nested হলে) অথবা chapter নিজেই (single-page)
  const firstLesson = ch.lessons[0] ?? null
  const isSinglePage = ch.lessons.length === 0

  const chapterL = localizeChapter(loc, ch)
  const firstLessonL = firstLesson ? localizeLesson(loc, firstLesson) : null

  // strict: title না থাকলে 404
  const displayTitle = isSinglePage
    ? chapterL.title
    : (firstLessonL?.title ?? chapterL.title)
  if (!displayTitle) notFound()

  // content: না থাকলে সেকশন বাদ (খালি null)
  const displayContent = isSinglePage ? chapterL.content : firstLessonL?.content
  // codeExample: না থাকলে null (section বাদ)
  const displayCode = isSinglePage ? chapterL.codeExample : firstLessonL?.codeExample

  // Previous / Next — chapters-এর flat list বানিয়ে
  const sortedChapters = [...nav.chapters].sort((a, b) => a.sortOrder - b.sortOrder)
  const currentIdx = sortedChapters.findIndex((c) => c.id === ch.id)
  const prevChapter = currentIdx > 0 ? sortedChapters[currentIdx - 1] : null
  const nextChapter =
    currentIdx >= 0 && currentIdx < sortedChapters.length - 1
      ? sortedChapters[currentIdx + 1]
      : null

  return (
    <TutorialShell
      tutorialSlug={tutorial.slug}
      tutorialTitle={tutorialTitle}
      nav={nav}
      active={{ chapterSlug: ch.slug, lessonSlug: null }}
      locale={loc === 'bn' ? 'bn' : 'en'}
    >
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#22C55E]">{t.homeCrumb}</Link>
        <span>/</span>
        <Link href={`/tutorials/${tutorial.slug}`} className="hover:text-[#22C55E]">
          {tutorialTitle}
        </Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300">{chapterL.title}</span>
        {!isSinglePage && firstLessonL && (
          <>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300">{firstLessonL.title}</span>
          </>
        )}
      </nav>

      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">{displayTitle}</h1>

      {displayContent && (
        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <LessonContent content={displayContent} slug={tutorial.slug} lessonPath={ch.slug} locale={loc} />
        </div>
      )}

      {displayCode && (
        <div className="mt-6 rounded-lg overflow-hidden border border-emerald-200/60 dark:border-emerald-900/40">
          <div className="px-3 py-2 bg-[#0a0f0c] text-[11px] text-slate-500 font-mono border-b border-emerald-900/30">
            example.html
          </div>
          <pre className="bg-[#050806] text-[#4ADE80] p-4 overflow-x-auto text-sm font-mono">
            <code>{displayCode}</code>
          </pre>
        </div>
      )}

      {displayCode && <TryIt code={displayCode} slug={tutorial.slug} lessonPath={ch.slug} />}

      {/* Prev / Next */}
      <div className="flex justify-between items-center gap-3 mt-10 pt-6 border-t border-emerald-200/60 dark:border-emerald-900/40">
        {prevChapter ? (
          <Link
            href={`/tutorials/${tutorial.slug}/${prevChapter.slug}`}
            className="px-5 py-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-[#22C55E]/10 hover:border-[#22C55E] transition-colors"
          >
            ❮ {prevChapter.title}
          </Link>
        ) : (
          <Link
            href={`/tutorials/${tutorial.slug}`}
            className="px-5 py-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-[#22C55E]/10 hover:border-[#22C55E] transition-colors"
          >
            {t.home}
          </Link>
        )}

        {nextChapter ? (
          <Link
            href={`/tutorials/${tutorial.slug}/${nextChapter.slug}`}
            className="px-5 py-2.5 rounded-lg bg-[#22C55E] text-[#050806] text-sm font-bold hover:bg-[#4ADE80] transition-colors"
          >
            {t.next}
          </Link>
        ) : (
          <Link
            href={`/tutorials/${tutorial.slug}`}
            className="px-5 py-2.5 rounded-lg bg-[#22C55E] text-[#050806] text-sm font-bold hover:bg-[#4ADE80] transition-colors"
          >
            {t.complete}
          </Link>
        )}
      </div>
    </TutorialShell>
  )
}
