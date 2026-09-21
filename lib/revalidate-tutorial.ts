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
  } catch (e) {
    // silent — পরের request-এ Next.js ঠিকভাবে handle করবে
    console.error('revalidateTutorialPaths failed:', e)
  }
}

/**
 * নতুন tutorial বা tutorial list-এর কোনো পরিবর্তনে শুধু list-pages revalidate।
 */
export function revalidateTutorialListPaths(): void {
  try {
    revalidatePath('/')
    revalidatePath('/tutorials')
    revalidatePath('/sitemap.xml')
  } catch (e) {
    console.error('revalidateTutorialListPaths failed:', e)
  }
}
