/**
 * Shared types for DevSchool tutorial sidebar & pages.
 *
 * Nested structure (D5, D8):
 *   ChapterGroup (section header, non-clickable)
 *     └── Chapter (single-page OR nested)
 *           └── Lesson (nested chapter-এর ভেতরে)
 *
 * URL rules (D3, D4):
 *   single-page chapter → /{tutorial}/{chapter.slug}
 *   nested chapter first lesson → /{tutorial}/{chapter.slug}
 *   nested chapter other lessons → /{tutorial}/{chapter.slug}/{lesson.slug}
 */

export type LessonNav = {
  id: string
  slug: string
  title: string
  sortOrder: number
}

export type ChapterNav = {
  id: string
  slug: string
  title: string
  sortOrder: number
  groupId: string | null
  /** lessons[] খালি থাকলে এটা single-page chapter */
  lessons: LessonNav[]
}

export type GroupNav = {
  id: string
  title: string
  sortOrder: number
}

export type TutorialNav = {
  groups: GroupNav[]
  chapters: ChapterNav[]
}

/** Sidebar-এর জন্য flat-order list (group → chapter → lesson hierarchy একসাথে) */
export type SidebarSection =
  | { type: 'group'; group: GroupNav }
  | { type: 'chapter'; chapter: ChapterNav }

/**
 * Sidebar-এ কোন item active — URL থেকে derive করি।
 * Nested chapter-এর জন্য currentChapterSlug + currentLessonSlug দুইটাই থাকবে।
 */
export type SidebarActive = {
  chapterSlug: string | null
  lessonSlug: string | null
}

/** Helper — tutorial navigation tree বানায় (groups + chapters merge করে sortable list) */
export function buildSidebarSections(
  groups: GroupNav[],
  chapters: ChapterNav[]
): SidebarSection[] {
  const sections: SidebarSection[] = []

  // Sort chapters by sortOrder
  const sortedChapters = [...chapters].sort((a, b) => a.sortOrder - b.sortOrder)

  // Group chapters under their group
  const chaptersByGroup = new Map<string, ChapterNav[]>()
  const orphanChapters: ChapterNav[] = []
  for (const ch of sortedChapters) {
    if (ch.groupId) {
      const arr = chaptersByGroup.get(ch.groupId) || []
      arr.push(ch)
      chaptersByGroup.set(ch.groupId, arr)
    } else {
      orphanChapters.push(ch)
    }
  }

  // Emit groups (sorted) then their chapters
  const sortedGroups = [...groups].sort((a, b) => a.sortOrder - b.sortOrder)
  let emittedOrphans = false
  for (const g of sortedGroups) {
    sections.push({ type: 'group', group: g })
    const groupChapters = chaptersByGroup.get(g.id) || []
    for (const ch of groupChapters) {
      sections.push({ type: 'chapter', chapter: ch })
    }
  }

  // Orphan chapters (groupId = null) — group-এর বাইরে থাকলে শেষে
  if (orphanChapters.length > 0) {
    if (!emittedOrphans && sections.length > 0) {
      // Already had groups — just append orphans silently
    }
    for (const ch of orphanChapters) {
      sections.push({ type: 'chapter', chapter: ch })
    }
    emittedOrphans = true
  }

  return sections
}

/** Helper — chapter-এর canonical URL বানায় (first lesson = /{chapter}, অন্য lesson = /{chapter}/{lesson}) */
export function chapterFirstUrl(tutorialSlug: string, chapter: ChapterNav): string {
  return `/tutorials/${tutorialSlug}/${chapter.slug}`
}

export function lessonUrl(
  tutorialSlug: string,
  chapter: ChapterNav,
  lesson: LessonNav
): string {
  const sorted = [...chapter.lessons].sort((a, b) => a.sortOrder - b.sortOrder)
  const isFirst = sorted[0]?.id === lesson.id
  return isFirst
    ? `/tutorials/${tutorialSlug}/${chapter.slug}`
    : `/tutorials/${tutorialSlug}/${chapter.slug}/${lesson.slug}`
}

/** Helper — chapter-এর URL সবসময় first lesson-এর দিকে যায় */
export function chapterTargetUrl(tutorialSlug: string, chapter: ChapterNav): string {
  return `/tutorials/${tutorialSlug}/${chapter.slug}`
}
