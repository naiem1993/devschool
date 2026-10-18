// Vercel-এর মতো remote connection string দিয়ে connect করে টেবিল ও query test করে
// ব্যবহার: DATABASE_URL='...' npx tsx scripts/test-remote-db.ts
import { PrismaClient } from '@prisma/client';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('❌ DATABASE_URL set করা হয়নি');
  process.exit(1);
}

// মাস্ক করে দেখাই
const masked = url.replace(/:([^:@]+)@/, ':****@');
console.log('🔗 ব্যবহার হচ্ছে:', masked);

const prisma = new PrismaClient();

/** Safe error field extractor — no `any` needed. */
function getErrCode(e: unknown): string | undefined {
  if (e && typeof e === 'object' && 'code' in e) {
    const c = (e as { code: unknown }).code
    if (typeof c === 'string') return c
  }
  return undefined
}
function getErrMessage(e: unknown): string | undefined {
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
  return undefined
}

async function main() {
  try {
    // ১. raw query — connection test
    const t = await prisma.$queryRawUnsafe<{ tablename: string }[]>(
      "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
    );
    console.log('✅ কানেক্টেড। টেবিল সংখ্যা:', t.length);
    console.log('📋 টেবিল:', t.map((x) => x.tablename).join(', '));

    // ২. Prisma model query — টেবিল আছে কি না যাচাই
    const tutorials = await prisma.tutorial.findMany({ take: 3 });
    console.log('✅ Tutorial query OK। প্রথম 3:', tutorials.map((t) => t.slug).join(', '));
  } catch (e: unknown) {
    const code = getErrCode(e)
    const message = getErrMessage(e)
    console.error('❌ ERROR CODE:', code);
    console.error('❌ MESSAGE:', message);
    if (message?.includes('does not exist')) {
      console.error('👉 কারণ: টেবিলই নেই — ভুল ডেটাবেজে পয়েন্ট করছে');
    } else if (message?.includes('connect') || code === 'P1001') {
      console.error('👉 কারণ: কানেক্টই করতে পারছে না — URL/পাসওয়ার্ড/pooler ভুল');
    } else if (code === 'P2021') {
      console.error('👉 কারণ: টেবিল পাওয়া যায়নি (P2021)');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
