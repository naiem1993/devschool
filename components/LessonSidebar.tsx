'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  type TutorialNav,
  type SidebarActive,
  type ChapterNav,
  type LessonNav,
  buildSidebarSections,
  chapterTargetUrl,
  lessonUrl,
} from '@/lib/tutorial-types'

export default function LessonSidebar({
  tutorialSlug,
  tutorialTitle,
  nav,
  active,
}: {
  tutorialSlug: string
  tutorialTitle: string
  nav: TutorialNav
  active: SidebarActive
}) {
  const [open, setOpen] = useState(false)

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>()
    if (active.chapterSlug) {
      const ch = nav.chapters.find((c) => c.slug === active.chapterSlug)
      if (ch && ch.lessons.length > 1) s.add(ch.id)
    }
    return s
  })

  const toggleChapter = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  useEffect(() => {
    const onToggle = () => setOpen((o) => !o)
    const onClose = () => setOpen(false)
    window.addEventListener('toggle-tutorial-sidebar', onToggle)
    window.addEventListener('close-tutorial-sidebar', onClose)
    return () => {
      window.removeEventListener('toggle-tutorial-sidebar', onToggle)
      window.removeEventListener('close-tutorial-sidebar', onClose)
    }
  }, [])

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [])

  const sections = buildSidebarSections(nav.groups, nav.chapters)
  const activeChapterSlug = active.chapterSlug
  const activeLessonSlug = active.lessonSlug
  const isHome = !activeChapterSlug

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={[
          'fixed inset-0 z-[55] lg:hidden',
          'bg-black/65 backdrop-blur-sm',
          'transition-opacity duration-200',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      <aside
        className={[
          'w-[270px] lg:w-[250px] flex-shrink-0',
          'fixed lg:sticky top-[105px] left-0 z-[60] lg:z-auto',
          'h-[calc(100vh-105px)] overflow-y-auto',
          'bg-gradient-to-b from-white to-[#F2FBF4]',
          'dark:from-[#080c0a] dark:to-[#050806]',
          'border-r border-slate-200 dark:border-emerald-900/40',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <h2 className="flex items-center gap-2 px-4 py-4 text-xs font-extrabold uppercase tracking-widest text-[#15803d] dark:text-[#4ADE80] border-b border-slate-200 dark:border-emerald-900/40">
          <span className="w-[3px] h-[14px] rounded-sm bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,.4)]" />
          {tutorialTitle}
        </h2>

        <nav aria-label="Tutorial navigation" className="py-2 pb-6">
          <ul>
            {sections.map((section) => {
              if (section.type === 'group') {
                return (
                  <li key={'g-' + section.group.id} className="mt-5 mb-1.5 px-3">
                    <span className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                      {section.group.title}
                    </span>
                  </li>
                )
              }

              const ch = section.chapter
              const isActiveChapter = activeChapterSlug === ch.slug
              const hasLessons = ch.lessons.length > 0
              const isExpanded = expanded.has(ch.id)
              const chapterUrl = chapterTargetUrl(tutorialSlug, ch)

              return (
                <li key={'c-' + ch.id}>
                  <div className="flex items-stretch">
                    <Link
                      href={chapterUrl}
                      onClick={(e) => {
                        const onFirstLesson = isActiveChapter && !activeLessonSlug
                        if (hasLessons && onFirstLesson) {
                          e.preventDefault()
                          toggleChapter(ch.id)
                        } else if (hasLessons) {
                          setExpanded((p) => new Set(p).add(ch.id))
                        }
                        setOpen(false)
                      }}
                      className={[
                        'flex-1 block px-5 py-2 text-[13.5px] border-l-[3px] transition-all',
                        isActiveChapter
                          ? 'bg-gradient-to-r from-[#22C55E]/20 to-[#22C55E]/5 border-[#22C55E] text-[#15803d] dark:text-[#4ADE80] font-bold'
                          : 'border-transparent text-slate-700 dark:text-slate-200 hover:bg-[#22C55E]/10 dark:hover:bg-[#22C55E]/5 hover:border-[#22C55E]/40 dark:hover:border-[#4ADE80]/40',
                      ].join(' ')}
                    >
                      {ch.title}
                    </Link>

                    {hasLessons && (
                      <button
                        type="button"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        aria-expanded={isExpanded}
                        onClick={() => toggleChapter(ch.id)}
                        className="px-3 text-slate-400 dark:text-slate-500 hover:text-[#22C55E] transition-colors"
                      >
                        <span
                          className="inline-block text-[10px] transition-transform"
                          style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                        >
                          {'\u25B8'}
                        </span>
                      </button>
                    )}
                  </div>

                  {hasLessons && isExpanded && (
                    <ul className="mt-0.5 mb-1">
                      {[...ch.lessons]
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((lesson) => {
                          const isActiveLesson =
                            isActiveChapter &&
                            (activeLessonSlug === lesson.slug ||
                              (activeLessonSlug === null && isFirstLesson(ch, lesson)))
                          const href = lessonUrl(tutorialSlug, ch, lesson)
                          return (
                            <li key={lesson.id}>
                              <Link
                                href={href}
                                onClick={() => setOpen(false)}
                                className={[
                                  'block pl-9 pr-4 py-1.5 text-[12.5px] border-l-[3px] transition-all',
                                  isActiveLesson
                                    ? 'bg-[#22C55E]/15 border-[#22C55E] text-[#15803d] dark:text-[#4ADE80] font-semibold'
                                    : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-[#22C55E]/10 hover:text-[#15803d] dark:hover:text-[#4ADE80]',
                                ].join(' ')}
                              >
                                {lesson.title}
                              </Link>
                            </li>
                          )
                        })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}

function isFirstLesson(chapter: ChapterNav, lesson: LessonNav): boolean {
  const sorted = [...chapter.lessons].sort((a, b) => a.sortOrder - b.sortOrder)
  return sorted[0]?.id === lesson.id
}
