import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import TryItFullClient from '@/components/TryItFullClient'

type PageProps = {
  params: Promise<{ slug: string; chapter: string; lesson: string }>
}

const EMPTY_CODE = '<!-- এখানে তোমার HTML লিখো -->\n<h1>Hello World</h1>'

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
        chapter: { select: { tutorial: { select: { title: true } } } },
      },
    })
    if (!ls) return { title: 'Try it | DevSchool', robots: { index: false } }
    return {
      title: `Try it: ${ls.title} — ${ls.chapter.tutorial.title} | DevSchool`,
      robots: { index: false, follow: false },
    }
  } catch {
    return { title: 'Try it | DevSchool', robots: { index: false } }
  }
}

export default async function TryItLessonPage({ params }: PageProps) {
  const { slug, chapter, lesson } = await params

  const tutorial = await prisma.tutorial
    .findUnique({
      where: { slug, isPublished: true },
      select: { id: true, slug: true, title: true },
    })
    .catch(() => null)

  if (!tutorial) notFound()

  const ch = await prisma.chapter.findFirst({
    where: { tutorialId: tutorial.id, slug: chapter },
    select: {
      slug: true,
      lessons: {
        orderBy: { sortOrder: 'asc' },
        select: { slug: true, title: true, codeExample: true },
      },
    },
  })
  if (!ch) notFound()

  // first lesson → canonical is chapter tryit route
  const first = ch.lessons[0]
  if (first && first.slug === lesson) {
    permanentRedirect(`/tutorials/${slug}/${chapter}/tryit`)
  }

  const current = ch.lessons.find((l) => l.slug === lesson)
  if (!current) notFound()

  return (
    <TryItFullClient
      code={current.codeExample || EMPTY_CODE}
      tutorialTitle={tutorial.title}
      chapterTitle={current.title}
      slug={tutorial.slug}
      lessonPath={`${ch.slug}/${current.slug}`}
    />
  )
}
