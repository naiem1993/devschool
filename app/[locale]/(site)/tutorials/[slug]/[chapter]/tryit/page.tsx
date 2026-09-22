import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import TryItFullClient from '@/components/TryItFullClient'

type PageProps = {
  params: Promise<{ slug: string; chapter: string }>
}

const EMPTY_CODE = '<!-- এখানে তোমার HTML লিখো -->\n<h1>Hello World</h1>'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, chapter } = await params
  try {
    const ch = await prisma.chapter.findFirst({
      where: { slug: chapter, tutorial: { slug, isPublished: true } },
      select: {
        title: true,
        content: true,
        lessons: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
          select: { title: true },
        },
        tutorial: { select: { title: true } },
      },
    })
    if (!ch) return { title: 'Try it | DevSchool', robots: { index: false } }
    const display = ch.content ? ch.title : (ch.lessons[0]?.title ?? ch.title)
    return {
      title: `Try it: ${display} — ${ch.tutorial.title} | DevSchool`,
      robots: { index: false, follow: false },
    }
  } catch {
    return { title: 'Try it | DevSchool', robots: { index: false } }
  }
}

export default async function TryItChapterPage({ params }: PageProps) {
  const { slug, chapter } = await params

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
      title: true,
      content: true,
      codeExample: true,
      lessons: {
        orderBy: { sortOrder: 'asc' },
        select: { slug: true, title: true, content: true, codeExample: true },
      },
    },
  })

  if (!ch) notFound()

  const isSinglePage = ch.lessons.length === 0
  const firstLesson = ch.lessons[0] ?? null

  // nested হলে chapter URL = first lesson URL — এই route-এ প্রথম lesson হবে না (canonical protection)
  // তবে nested chapter-এর প্রথম lesson-এর tryit হলে সেটা এই route থেকেই serve হবে (same URL segment)
  // কারণ chapter URL = first lesson URL। তাই এখানে কিছু redirect করার দরকার নেই।

  const displayTitle = isSinglePage ? ch.title : (firstLesson?.title ?? ch.title)
  const code = (isSinglePage ? ch.codeExample : firstLesson?.codeExample) || EMPTY_CODE

  return (
    <TryItFullClient
      code={code}
      tutorialTitle={tutorial.title}
      chapterTitle={displayTitle}
      slug={tutorial.slug}
      lessonPath={ch.slug}
    />
  )
}

// unused export guard — keep TS happy about permanentRedirect import
void permanentRedirect
