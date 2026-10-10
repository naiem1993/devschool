import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import TryItFullClient from '@/components/TryItFullClient'
import type { Locale } from '@/lib/i18n/config'
import { pickText, localizeChapter, localizeLesson } from '@/lib/i18n/localize'

type PageProps = {
  params: Promise<{ locale: string; slug: string; chapter: string }>
}

const EMPTY_CODE = '<!-- এখানে তোমার HTML লিখো -->\n<h1>Hello World</h1>'

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
    if (!ch) return { title: 'Try it | DevSchool', robots: { index: false } }
    const loc = locale as Locale
    const chapterTitle = pickText(loc, ch.titleBn, ch.titleEn)
    const contentL = pickText(loc, ch.contentBn, ch.contentEn)
    const firstLesson = ch.lessons[0]
    const lessonTitle = firstLesson ? pickText(loc, firstLesson.titleBn, firstLesson.titleEn) : null
    const display = contentL ? chapterTitle : (lessonTitle ?? chapterTitle)
    const tutorialTitle = pickText(loc, ch.tutorial.titleBn, ch.tutorial.titleEn)
    if (!display) return { title: 'Try it | DevSchool', robots: { index: false } }
    return {
      title: `Try it: ${display} — ${tutorialTitle ?? 'DevSchool'} | DevSchool`,
      robots: { index: false, follow: false },
    }
  } catch {
    return { title: 'Try it | DevSchool', robots: { index: false } }
  }
}

export default async function TryItChapterPage({ params }: PageProps) {
  const { locale, slug, chapter } = await params
  const loc = locale as Locale

  const tutorial = await prisma.tutorial
    .findUnique({
      where: { slug, isPublished: true },
      select: { id: true, slug: true, titleBn: true, titleEn: true },
    })
    .catch(() => null)

  if (!tutorial) notFound()

  const tutorialTitle = pickText(loc, tutorial.titleBn, tutorial.titleEn)
  if (!tutorialTitle) notFound()

  const ch = await prisma.chapter.findFirst({
    where: { tutorialId: tutorial.id, slug: chapter },
    select: {
      slug: true,
      titleBn: true,
      titleEn: true,
      contentBn: true,
      contentEn: true,
      codeExampleBn: true,
      codeExampleEn: true,
      lessons: {
        orderBy: { sortOrder: 'asc' },
        select: {
          slug: true,
          titleBn: true,
          titleEn: true,
          contentBn: true,
          contentEn: true,
          codeExampleBn: true,
          codeExampleEn: true,
        },
      },
    },
  })

  if (!ch) notFound()

  const isSinglePage = ch.lessons.length === 0
  const firstLesson = ch.lessons[0] ?? null

  const chapterL = localizeChapter(loc, ch)
  const firstLessonL = firstLesson ? localizeLesson(loc, firstLesson) : null

  // strict: title না থাকলে 404 (আগের ধাপের নিয়ম)
  const displayTitle = isSinglePage
    ? chapterL.title
    : (firstLessonL?.title ?? chapterL.title)
  if (!displayTitle) notFound()

  // codeExample খালি হলে EMPTY_CODE placeholder (আপনার অনুমোদিত)
  const rawCode = isSinglePage ? chapterL.codeExample : firstLessonL?.codeExample
  const code = rawCode || EMPTY_CODE

  return (
    <TryItFullClient
      code={code}
      tutorialTitle={tutorialTitle}
      chapterTitle={displayTitle}
      slug={tutorial.slug}
      lessonPath={ch.slug}
      sessionKey={`tryit:${tutorial.slug}:${ch.slug}`}
    />
  )
}

// unused export guard — keep TS happy about permanentRedirect import
void permanentRedirect
