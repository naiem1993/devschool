/**
 * reset-tutorial-content.ts
 *
 * DevSchool nested structure migration-এর অংশ (Plan v3 §8)।
 *
 * ⚠️ এই script চলানোর আগে DB backup নিন।
 *
 * কী করে:
 *   ১. সব Lesson delete
 *   ২. সব Chapter delete
 *   ৩. সব ChapterGroup delete
 *
 * কী করে না:
 *   - Tutorial delete করে না
 *   - Category, Quiz, Challenge, Reference, Donation, SponsorImage,
 *     AdminUser, SiteSettings — কিছুই touch করে না
 *
 * চালানোর আগে:
 *   - Supabase/prod DB-তে হলে আগে backup (Supabase Dashboard → Database → Backups)
 *   - Local-এ হলে prisma/dev.db কপি করে রাখুন
 *
 * চালানোর নিয়ম:
 *   npx tsx scripts/reset-tutorial-content.ts
 *
 * Dry-run (কিছু delete না করে শুধু count দেখতে):
 *   npx tsx scripts/reset-tutorial-content.ts --dry-run
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const isDryRun = process.argv.includes('--dry-run')

async function main() {
  console.log('\n🔍 DevSchool — Nested Structure Content Reset')
  console.log('='.repeat(60))
  if (isDryRun) {
    console.log('⚠️  DRY RUN mode — কোনো data delete হবে না\n')
  } else {
    console.log('🚨 LIVE mode — data delete হবে\n')
  }

  // ── ১. বর্তমান অবস্থা দেখাও ──
  const [lessonCount, chapterCount, groupCount, tutorialCount] =
    await Promise.all([
      prisma.lesson.count(),
      prisma.chapter.count(),
      prisma.chapterGroup.count(),
      prisma.tutorial.count(),
    ])

  console.log('📊 Current DB state:')
  console.log(`   Lesson         : ${lessonCount}`)
  console.log(`   Chapter        : ${chapterCount}`)
  console.log(`   ChapterGroup   : ${groupCount}`)
  console.log(`   Tutorial       : ${tutorialCount}  (অপরিবর্তিত থাকবে)`)
  console.log('')

  if (isDryRun) {
    console.log('✅ Dry run complete. কিছু delete হয়নি।')
    console.log('   চালাতে হলে --dry-run ছাড়া আবার চালান।\n')
    return
  }

  // ── ২. Delete (cascade order: Lesson → Chapter → ChapterGroup) ──
  console.log('🗑️  Deleting...')

  const deletedLessons = await prisma.lesson.deleteMany()
  console.log(`   ✅ ${deletedLessons.count} Lesson deleted`)

  const deletedChapters = await prisma.chapter.deleteMany()
  console.log(`   ✅ ${deletedChapters.count} Chapter deleted`)

  const deletedGroups = await prisma.chapterGroup.deleteMany()
  console.log(`   ✅ ${deletedGroups.count} ChapterGroup deleted`)

  // ── ৩. Verify ──
  const [lessonAfter, chapterAfter, groupAfter, tutorialAfter] =
    await Promise.all([
      prisma.lesson.count(),
      prisma.chapter.count(),
      prisma.chapterGroup.count(),
      prisma.tutorial.count(),
    ])

  console.log('\n📊 After reset:')
  console.log(`   Lesson         : ${lessonAfter}  ${lessonAfter === 0 ? '✅' : '❌'}`)
  console.log(`   Chapter        : ${chapterAfter}  ${chapterAfter === 0 ? '✅' : '❌'}`)
  console.log(`   ChapterGroup   : ${groupAfter}  ${groupAfter === 0 ? '✅' : '❌'}`)
  console.log(`   Tutorial       : ${tutorialAfter}  ${tutorialAfter === tutorialCount ? '✅ unchanged' : '❌ CHANGED!'}`)

  console.log('\n' + '='.repeat(60))
  console.log('✅ Reset complete. এখন admin panel থেকে নতুন chapter/lesson যোগ করুন।\n')
}

main()
  .catch((e) => {
    console.error('\n❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
