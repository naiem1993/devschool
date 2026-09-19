/**
 * One-off DB fix for the stale full-text-search triggers.
 *
 * Background:
 *   Migration 002_fts_and_attempts created two BEFORE INSERT/UPDATE triggers
 *   (tutorial_search_vec_update, reference_search_vec_update) whose plpgsql
 *   functions set NEW."searchVec" := to_tsvector(...).
 *
 *   Migration 20260918151014_nested_structure_chapter_lesson dropped the
 *   "searchVec" column on both Tutorial and Reference — but NOT the triggers.
 *
 *   Result: any INSERT/UPDATE on Tutorial or Reference fails with
 *     `record "new" has no field "searchVec"` (SQLSTATE 42703).
 *
 * Fix:
 *   Drop the 2 triggers + 2 trigger functions. The search API already falls
 *   back to ILIKE-based search when searchVec is missing (app/api/search/route.ts).
 *
 * Run: npm run fix:searchvec
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Dropping stale searchVec triggers + functions...\n')

  const stmts: string[] = [
    `DROP TRIGGER IF EXISTS tutorial_search_vec_update ON "Tutorial"`,
    `DROP TRIGGER IF EXISTS reference_search_vec_update ON "Reference"`,
    `DROP FUNCTION IF EXISTS public.tutorial_search_vec_trigger()`,
    `DROP FUNCTION IF EXISTS public.reference_search_vec_trigger()`,
  ]

  for (const s of stmts) {
    try {
      await prisma.$executeRawUnsafe(s)
      console.log('  ✅', s)
    } catch (e: any) {
      console.log('  ⚠️ ', s, '→', e.message)
    }
  }

  // Verify
  const triggers = await prisma.$queryRaw<any[]>`
    SELECT event_object_table AS tbl, trigger_name
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
    ORDER BY event_object_table, trigger_name
  `
  console.log('\n--- Remaining triggers in public schema ---')
  if (triggers.length === 0) console.log('  (none) ✅')
  else triggers.forEach((x: any) => console.log(`  ${x.tbl} :: ${x.trigger_name}`))

  // Smoke test: raw insert into Tutorial
  console.log('\n--- Smoke test: INSERT into Tutorial ---')
  try {
    await prisma.$executeRaw`
      INSERT INTO "Tutorial" (id, title, slug, "isPublished", difficulty, "updatedAt")
      VALUES ('diag-2', 'Diag', 'diag-test-slug-2', false, 'beginner', now())
      ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
    `
    console.log('  ✅ Raw insert/upsert works now')
    await prisma.$executeRaw`DELETE FROM "Tutorial" WHERE slug = 'diag-test-slug-2'`
    console.log('  (cleaned up)')
  } catch (e: any) {
    console.log('  ❌ Still failing:', e.message)
    process.exit(1)
  }

  console.log('\n✅ Fix complete.')
}

main()
  .catch((e) => {
    console.error('Fatal:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
