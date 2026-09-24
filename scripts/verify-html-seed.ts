/**
 * Quick verification: is the HTML course seeded correctly?
 * Run: npm run verify:html-seed
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const tutorial = await prisma.tutorial.findUnique({
    where: { slug: 'html' },
    include: {
      chapters: {
        orderBy: { sortOrder: 'asc' },
        include: {
          lessons: { orderBy: { sortOrder: 'asc' } },
        },
      },
    },
  })

  if (!tutorial) {
    console.log('❌ Tutorial "html" not found in DB')
    return
  }

  console.log('✅ Tutorial:', tutorial.titleBn, `(${tutorial.slug})`)
  console.log('   isPublished:', tutorial.isPublished)
  console.log('   Chapters:', tutorial.chapters.length)

  for (const ch of tutorial.chapters) {
    console.log(`\n   📖 Chapter ${ch.sortOrder}: ${ch.titleBn} [${ch.slug}]`)
    console.log(`      content: ${ch.contentBn ? 'yes' : 'null'}`)
    console.log(`      lessons: ${ch.lessons.length}`)
    for (const l of ch.lessons) {
      console.log(`        ${l.sortOrder + 1}. ${l.titleBn} [${l.slug}]`)
      console.log(`           content ${l.contentBn.length} chars, code ${l.codeExampleBn ? l.codeExampleBn.length + ' chars' : 'null'}`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
