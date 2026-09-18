import 'server-only'
import prisma from '@/lib/prisma'
import type { TutorialNav, GroupNav, ChapterNav } from '@/lib/tutorial-types'

/**
 * একটা tutorial-এর sidebar navigation tree আনে (groups + chapters + lessons)।
 * সব query সাজানো (sortOrder ascending)।
 */
export async function getTutorialNav(tutorialId: string): Promise<TutorialNav> {
  const [groups, chapters] = await Promise.all([
    prisma.chapterGroup.findMany({
      where: { tutorialId },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, title: true, sortOrder: true },
    }),
    prisma.chapter.findMany({
      where: { tutorialId },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        sortOrder: true,
        groupId: true,
        lessons: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, slug: true, title: true, sortOrder: true },
        },
      },
    }),
  ])

  return {
    groups: groups as GroupNav[],
    chapters: chapters as ChapterNav[],
  }
}
