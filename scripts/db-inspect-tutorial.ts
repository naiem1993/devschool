import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

async function main() {
  const cols: any[] = await p.$queryRawUnsafe(
    `SELECT column_name, data_type, is_nullable, column_default
     FROM information_schema.columns
     WHERE table_name = 'Tutorial'
     ORDER BY ordinal_position`
  )
  console.log('=== Tutorial columns in DB ===')
  for (const c of cols) {
    console.log(`  ${c.column_name}  ${c.data_type}  null=${c.is_nullable}  default=${c.column_default ?? '-'}`)
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => p.$disconnect())
