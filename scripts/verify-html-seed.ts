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
      category: true,
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

  console.log('✅ Tutorial:', tutorial.title, `(${tutorial.slug})`)
  console.log('   Category:', tutorial.category.name)
  console.log('   isPublished:', tutorial.isPublished)
  console.log('   Chapters:', tutorial.chapters.length)

  for (const ch of tutorial.chapters) {
    console.log(`\n   📖 Chapter ${ch.sortOrder}: ${ch.title} [${ch.slug}]`)
    console.log(`      content: ${ch.content ? 'yes' : 'null'}`)
    console.log(`      lessons: ${ch.lessons.length}`)
    for (const l of ch.lessons) {
      console.log(`        ${l.sortOrder + 1}. ${l.title} [${l.slug}]`)
      console.log(`           content ${l.content.length} chars, code ${l.codeExample ? l.codeExample.length + ' chars' : 'null'}`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
