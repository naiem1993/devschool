import 'server-only'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

/**
 * Tutorial mutation-এর পর সব relevant cached path revalidate করি।
 *
 * Home + categories + sitemap — tutorial list বদলাতে পারে
 * /tutorials/{slug} (layout mode) — সব nested chapter/lesson সহ
 *
 * ISR দিয়ে page চিরকাল static থাকে, কিন্তু admin save করলে শুধু এই paths
 * on-demand refresh হয় → instant update, কোনো background regeneration নেই।
 *
 * ⚠️ গুরুত্বপূর্ণ: `app/(site)/layout.tsx`-এ `revalidate = 300` ISR cache আছে এবং
 * সেই layout-এর ভেতরে `LanguageTabsServer` (nav tab row) বাস করে। তাই শুধু
 * revalidatePath('/tutorials') দিলে nav tab update হয় না — layout-level bust দরকার।
 * `revalidatePath(path, 'layout')` দিলে layout + সব nested page একসাথে revalidate হয়।
 */
export async function revalidateTutorialPaths(tutorialId: string): Promise<void> {
  try {
    const tut = await prisma.tutorial.findUnique({
      where: { id: tutorialId },
      select: { slug: true },
    })
    if (!tut) return

    revalidatePath('/')
    revalidatePath('/tutorials')
    revalidatePath('/sitemap.xml')
    // layout mode — সব nested chapter/lesson page একসাথে revalidate
    revalidatePath(`/tutorials/${tut.slug}`, 'layout')
    // 🔑 (site)/layout-এর LanguageTabsServer cache bust — নাহলে নতুন
    // tutorial-এর nav tab ৫ মিনিট (revalidate=300) পুরোনো HTML দেখাবে।
    revalidatePath('/', 'layout')
    revalidatePath('/tutorials', 'layout')
  } catch (e) {
    // silent — পরের request-এ Next.js ঠিকভাবে handle করবে
    console.error('revalidateTutorialPaths failed:', e)
  }
}

/**
 * নতুন tutorial বা tutorial list-এর কোনো পরিবর্তনে শুধু list-pages revalidate।
 *
 * ⚠️ `revalidatePath('/', 'layout')` — (site)/layout-এর LanguageTabsServer
 * (nav tab row) cache-ও bust করে, নাহলে নতুন tutorial (যেমন CSS) তৈরি করার
 * সাথে সাথে nav tab-এ দেখা যাবে না।
 */
export function revalidateTutorialListPaths(): void {
  try {
    revalidatePath('/')
    revalidatePath('/tutorials')
    revalidatePath('/sitemap.xml')
    // 🔑 layout-level bust — LanguageTabsServer nav tab-এর জন্য
    revalidatePath('/', 'layout')
    revalidatePath('/tutorials', 'layout')
  } catch (e) {
    console.error('revalidateTutorialListPaths failed:', e)
  }
}
