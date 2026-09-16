import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import TryItFullClient from '@/components/TryItFullClient'

type PageProps = {
  params: Promise<{ slug: string; chapter: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, chapter } = await params
  const chapterNo = parseInt(chapter, 10)
  if (isNaN(chapterNo)) return { title: 'Try it | DevSchool', robots: { index: false } }
  try {
    const tutorial = await prisma.tutorial.findUnique({
      where: { slug },
      select: { title: true, contents: { where: { chapterNo }, select: { title: true } } },
    })
    if (!tutorial || !tutorial.contents[0]) {
      return { title: 'Try it | DevSchool', robots: { index: false } }
    }
    return {
      title: `Try it: ${tutorial.contents[0].title} — ${tutorial.title} | DevSchool`,
      robots: { index: false, follow: false },
    }
  } catch {
    return { title: 'Try it | DevSchool', robots: { index: false } }
  }
}

export default async function TryItPage({ params }: PageProps) {
  const { slug, chapter } = await params
  const chapterNo = parseInt(chapter, 10)
  if (isNaN(chapterNo) || chapterNo < 1) notFound()

  const tutorial = await prisma.tutorial
    .findUnique({
      where: { slug, isPublished: true },
      select: {
        title: true,
        slug: true,
        contents: { where: { chapterNo }, select: { title: true, chapterNo: true, codeExample: true } },
      },
    })
    .catch(() => null)

  if (!tutorial) notFound()
  const current = tutorial.contents[0]
  if (!current) notFound()

  // codeExample না থাকলে খালি editor-এ টাইপ করার সুযোগ থাকুক
  const code = current.codeExample || '<!-- এখানে তোমার HTML লিখো -->\n<h1>Hello World</h1>' 

  return (
    <TryItFullClient
      code={code}
      tutorialTitle={tutorial.title}
      chapterTitle={current.title}
      slug={tutorial.slug}
      chapterNo={current.chapterNo}
    />
  )
}
