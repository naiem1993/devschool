/**
 * One-off DB diagnostic for the seed blocker:
 * "The column `new` does not exist in the current database."
 *
 * Inspects triggers, rules, policies, and functions in the public schema
 * to find what references the PostgreSQL trigger variable `new`.
 *
 * Run: npm run diagnose:db
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/** Safe error message extractor — no `any` needed. */
function getErrMsg(e: unknown): string {
  if (e instanceof Error) return e.message
  if (typeof e === 'string') return e
  if (
    e &&
    typeof e === 'object' &&
    'message' in e &&
    typeof (e as { message: unknown }).message === 'string'
  ) {
    return (e as { message: string }).message
  }
  return String(e)
}

async function main() {
  console.log('=== DevSchool DB Diagnostic ===\n')

  // 1. Connectivity
  try {
    const r = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1 as ok`
    console.log('✅ Basic query works:', JSON.stringify(r))
  } catch (e: unknown) {
    console.log('❌ Basic query FAILED:', getErrMsg(e))
    return
  }

  // 2. Version / DB / user
  try {
    const v = await prisma.$queryRaw<
      Array<{ db: string; usr: string; v: string }>
    >`SELECT current_database() as db, current_user as usr, version() as v`
    console.log('\n--- DB / User / Version ---')
    console.log('  db   :', v[0].db)
    console.log('  user :', v[0].usr)
    console.log('  ver  :', String(v[0].v).split(',')[0])
  } catch (e: unknown) {
    console.log('version err:', getErrMsg(e))
  }

  // 3. Triggers in public schema
  try {
    const t = await prisma.$queryRaw<
      Array<{
        tbl: string
        trigger_name: string
        action_timing: string
        event_manipulation: string
      }>
    >`
      SELECT event_object_table AS tbl, trigger_name, action_timing, event_manipulation
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
      ORDER BY event_object_table, trigger_name
    `
    console.log('\n--- Triggers (public schema) ---')
    if (t.length === 0) console.log('  (none)')
    else
      t.forEach((x) =>
        console.log(
          `  ${x.tbl} :: ${x.trigger_name} [${x.action_timing} ${x.event_manipulation}]`
        )
      )
  } catch (e: unknown) {
    console.log('triggers err:', getErrMsg(e))
  }

  // 4. plpgsql functions in public schema
  try {
    const f = await prisma.$queryRaw<Array<{ fn: string; def: string }>>`
      SELECT proname AS fn, pg_get_functiondef(oid) AS def
      FROM pg_proc
      WHERE pronamespace = 'public'::regnamespace
        AND prokind = 'f'
        AND prolang = (SELECT oid FROM pg_language WHERE lanname = 'plpgsql')
    `
    console.log('\n--- plpgsql functions (public schema) ---')
    if (f.length === 0) console.log('  (none)')
    else
      f.forEach((x) => {
        console.log(`\n>>> ${x.fn}`)
        console.log(x.def)
      })
  } catch (e: unknown) {
    console.log('functions err:', getErrMsg(e))
  }

  // 5. RLS policies
  try {
    const p = await prisma.$queryRaw<
      Array<{ tablename: string; policyname: string; cmd: string }>
    >`
      SELECT tablename, policyname, cmd
      FROM pg_policies
      WHERE schemaname = 'public'
    `
    console.log('\n--- RLS policies (public schema) ---')
    if (p.length === 0) console.log('  (none)')
    else
      p.forEach((x) =>
        console.log(`  ${x.tablename} :: ${x.policyname} [${x.cmd}]`)
      )
  } catch (e: unknown) {
    console.log('policies err:', getErrMsg(e))
  }

  // 6. Rules
  try {
    const r = await prisma.$queryRaw<
      Array<{ tablename: string; rulename: string; definition: string }>
    >`
      SELECT tablename, rulename, definition
      FROM pg_rules
      WHERE schemaname = 'public'
    `
    console.log('\n--- Rules (public schema) ---')
    if (r.length === 0) console.log('  (none)')
    else
      r.forEach((x) =>
        console.log(`  ${x.tablename} :: ${x.rulename}\n    ${x.definition}`)
      )
  } catch (e: unknown) {
    console.log('rules err:', getErrMsg(e))
  }

  // 7. Tutorial columns
  try {
    const c = await prisma.$queryRaw<
      Array<{ column_name: string; data_type: string; is_nullable: string }>
    >`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'Tutorial'
      ORDER BY ordinal_position
    `
    console.log('\n--- Tutorial columns ---')
    c.forEach((x) =>
      console.log(
        `  ${x.column_name} (${x.data_type}${x.is_nullable === 'NO' ? ', NOT NULL' : ''})`
      )
    )
  } catch (e: unknown) {
    console.log('columns err:', getErrMsg(e))
  }

  // 8. Raw upsert test
  console.log('\n--- Test raw INSERT ... ON CONFLICT (slug) DO UPDATE ---')
  try {
    await prisma.$executeRaw`
      INSERT INTO "Tutorial" (id, title, slug, "isPublished", difficulty, "updatedAt")
      VALUES ('diag-1', 'Diag', 'diag-test-slug', false, 'beginner', now())
      ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
    `
    console.log('  ✅ Raw upsert works')
    await prisma.$executeRaw`DELETE FROM "Tutorial" WHERE slug = 'diag-test-slug'`
    console.log('  (cleaned up)')
  } catch (e: unknown) {
    console.log('  ❌ Raw upsert FAILED:', getErrMsg(e))
  }

  console.log('\n=== Done ===')
}

main()
  .catch((e) => console.error('Fatal:', e))
  .finally(() => prisma.$disconnect())
