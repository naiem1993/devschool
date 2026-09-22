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
  } catch (e: any) {
    console.error('❌ ERROR CODE:', e?.code);
    console.error('❌ MESSAGE:', e?.message);
    if (e?.message?.includes('does not exist')) {
      console.error('👉 কারণ: টেবিলই নেই — ভুল ডেটাবেজে পয়েন্ট করছে');
    } else if (e?.message?.includes('connect') || e?.code === 'P1001') {
      console.error('👉 কারণ: কানেক্টই করতে পারছে না — URL/পাসওয়ার্ড/pooler ভুল');
    } else if (e?.code === 'P2021') {
      console.error('👉 কারণ: টেবিল পাওয়া যায়নি (P2021)');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
