import 'server-only'
import prisma from '@/lib/prisma'
import type { TutorialNav, GroupNav, ChapterNav, LessonNav } from '@/lib/tutorial-types'
import type { Locale } from '@/lib/i18n/config'
import { pickText } from '@/lib/i18n/localize'

/**
 * একটা tutorial-এর sidebar navigation tree আনে (groups + chapters + lessons)।
 * সব query সাজানো (sortOrder ascending)।
 */
export async function getTutorialNav(
  tutorialId: string,
  locale: Locale
): Promise<TutorialNav> {
  const [groups, chapters] = await Promise.all([
    prisma.chapterGroup.findMany({
      where: { tutorialId },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, titleBn: true, titleEn: true, sortOrder: true },
    }),
    prisma.chapter.findMany({
      where: { tutorialId },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        titleBn: true,
        titleEn: true,
        sortOrder: true,
        groupId: true,
        lessons: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            slug: true,
            titleBn: true,
            titleEn: true,
            sortOrder: true,
          },
        },
      },
    }),
  ])

  // locale অনুযায়ী group-এর title বেছে নাও — যেটার নেই, সেটা বাদ
  const localizedGroups: GroupNav[] = groups
    .map((g) => {
      const title = pickText(locale, g.titleBn, g.titleEn)
      if (!title) return null
      return { id: g.id, title, sortOrder: g.sortOrder }
    })
    .filter((g): g is GroupNav => g !== null)

  // locale অনুযায়ী chapter-এর title বেছে নাও।
  // ⚠️ যদি chapter-টা কোনো group-এর অধীনে থাকে কিন্তু সেই group-এর
  //    title এই ভাষায় না থাকে (বাদ পড়েছে), তাহলে chapter-ও বাদ —
  //    নাহলে sidebar-এ orphan chapter দেখা যেত।
  const localizedChapters: ChapterNav[] = chapters
    .map((ch) => {
      const title = pickText(locale, ch.titleBn, ch.titleEn)
      if (!title) return null

      // group-এর অধীনে থাকলে, তার group-ও টিকে আছে কি না দেখো
      if (ch.groupId) {
        const parentGroup = localizedGroups.find((g) => g.id === ch.groupId)
        if (!parentGroup) return null
      }

      // lesson-গুলোরও locale-সঠিক title — যেটার নেই, সেটা বাদ
      const lessons: LessonNav[] = ch.lessons
        .map((l) => {
          const lTitle = pickText(locale, l.titleBn, l.titleEn)
          if (!lTitle) return null
          return {
            id: l.id,
            slug: l.slug,
            title: lTitle,
            sortOrder: l.sortOrder,
          }
        })
        .filter((l): l is LessonNav => l !== null)

      return {
        id: ch.id,
        slug: ch.slug,
        title,
        sortOrder: ch.sortOrder,
        groupId: ch.groupId,
        lessons,
      }
    })
    .filter((ch): ch is ChapterNav => ch !== null)

  return {
    groups: localizedGroups,
    chapters: localizedChapters,
  }
}
