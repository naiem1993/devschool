import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import TryItFullClient from '@/components/TryItFullClient'
import type { Locale } from '@/lib/i18n/config'
import { pickText, localizeLesson } from '@/lib/i18n/localize'

type PageProps = {
  params: Promise<{ locale: string; slug: string; chapter: string; lesson: string }>
}

const EMPTY_CODE = '<!-- এখানে তোমার HTML লিখো -->\n<h1>Hello World</h1>'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug, chapter, lesson } = await params
  try {
    const ls = await prisma.lesson.findFirst({
      where: {
        slug: lesson,
        chapter: { slug: chapter, tutorial: { slug, isPublished: true } },
      },
      select: {
        titleBn: true,
        titleEn: true,
        chapter: {
          select: { tutorial: { select: { titleBn: true, titleEn: true } } },
        },
      },
    })
    if (!ls) return { title: 'Try it | DevSchool', robots: { index: false } }
    const loc = locale as Locale
    const lessonTitle = pickText(loc, ls.titleBn, ls.titleEn)
    const tutorialTitle = pickText(loc, ls.chapter.tutorial.titleBn, ls.chapter.tutorial.titleEn)
    if (!lessonTitle) {
      return { title: 'Try it | DevSchool', robots: { index: false } }
    }
    return {
      title: `Try it: ${lessonTitle} — ${tutorialTitle ?? 'DevSchool'} | DevSchool`,
      robots: { index: false, follow: false },
    }
  } catch {
    return { title: 'Try it | DevSchool', robots: { index: false } }
  }
}

export default async function TryItLessonPage({ params }: PageProps) {
  const { locale, slug, chapter, lesson } = await params
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

  // first lesson → canonical is chapter tryit route (locale-aware)
  const first = ch.lessons[0]
  if (first && first.slug === lesson) {
    permanentRedirect(`/${locale}/tutorials/${slug}/${chapter}/tryit`)
  }

  const current = ch.lessons.find((l) => l.slug === lesson)
  if (!current) notFound()

  const currentL = localizeLesson(loc, current)
  if (!currentL.title) notFound()

  // codeExample খালি হলে EMPTY_CODE placeholder
  const code = currentL.codeExample || EMPTY_CODE

  return (
  <TryItFullClient
    code={code}
    tutorialTitle={tutorialTitle}
    chapterTitle={currentL.title}
    slug={tutorial.slug}
    lessonPath={`${ch.slug}/${current.slug}`}
    sessionKey={`tryit:${tutorial.slug}:${ch.slug}/${current.slug}`}
  />
)
}
