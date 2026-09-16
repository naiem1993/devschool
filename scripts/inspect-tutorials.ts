import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const slugs = ['html', 'html-introduction', 'html-elements', 'html-attributes', 'html-headings', 'html-paragraphs']
  const tutorials = await prisma.tutorial.findMany({
    where: { slug: { in: slugs } },
    include: { contents: { orderBy: { chapterNo: 'asc' } } },
    orderBy: { createdAt: 'asc' },
  })
  for (const t of tutorials) {
    console.log('---')
    console.log('TUTORIAL id=' + t.id + ' slug=' + t.slug + ' title=' + t.title + ' published=' + t.isPublished)
    for (const c of t.contents) {
      console.log('   ch#' + c.chapterNo + ' | ' + c.title + ' | len=' + c.content.length)
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
