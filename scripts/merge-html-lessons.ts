import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MAIN_SLUG = 'html'
const MERGE_SLUGS = ['html-introduction', 'html-elements', 'html-attributes', 'html-headings', 'html-paragraphs']

async function main() {
  const target = await prisma.tutorial.findUnique({
    where: { slug: MAIN_SLUG },
    include: { contents: { orderBy: { chapterNo: 'asc' } } },
  })
  if (!target) throw new Error('Target tutorial not found: ' + MAIN_SLUG)

  const merged: { title: string; content: string; codeExample: string | null }[] = []
  for (const c of target.contents) {
    merged.push({ title: c.title, content: c.content, codeExample: c.codeExample })
  }

  for (const slug of MERGE_SLUGS) {
    const t = await prisma.tutorial.findUnique({
      where: { slug },
      include: { contents: { orderBy: { chapterNo: 'asc' } } },
    })
    if (!t) { console.log('skip (not found): ' + slug); continue }
    for (const c of t.contents) {
      merged.push({ title: c.title, content: c.content, codeExample: c.codeExample })
    }
  }

  await prisma.tutorialContent.deleteMany({ where: { tutorialId: target.id } })
  await prisma.tutorialContent.createMany({
    data: merged.map((c, i) => ({
      tutorialId: target.id,
      chapterNo: i + 1,
      title: c.title,
      content: c.content,
      codeExample: c.codeExample,
    })),
  })

  const del = await prisma.tutorial.deleteMany({ where: { slug: { in: MERGE_SLUGS } } })

  console.log('MERGE_DONE: target=' + target.slug + ' chapters=' + merged.length + ' deletedTutorials=' + del.count)
  for (let i = 0; i < merged.length; i++) console.log('  ch#' + (i + 1) + ' ' + merged[i].title)
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
