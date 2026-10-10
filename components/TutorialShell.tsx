import LessonSidebar from './LessonSidebar'
import TutorialPromo from './TutorialPromo'
import type { TutorialNav, SidebarActive } from '@/lib/tutorial-types'

export default function TutorialShell({
  tutorialSlug,
  tutorialTitle,
  nav,
  active,
  children,
  locale = 'bn',
}: {
  tutorialSlug: string
  tutorialTitle: string
  nav: TutorialNav
  active?: SidebarActive
  children: React.ReactNode
  locale?: 'bn' | 'en'
}) {
  const activeState: SidebarActive = active || { chapterSlug: null, lessonSlug: null }

  // Promo widget-এর জন্য কোন chapter-এ আছি তার 1-based position
  const currentChapterOrder = activeState.chapterSlug
    ? nav.chapters.findIndex((c) => c.slug === activeState.chapterSlug) + 1
    : 0

  return (
    <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806] text-slate-900 dark:text-slate-100">
      {/* ══════════ 3-COLUMN LAYOUT ══════════ */}
      <div className="w-full px-0">
        <div className="flex flex-col lg:flex-row">
          {/* ── LEFT: Sidebar ── */}
          <LessonSidebar
            tutorialSlug={tutorialSlug}
            tutorialTitle={tutorialTitle}
            nav={nav}
            active={activeState}
          />

          {/* ── CENTER: Main Content ── */}
          <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-10 py-6 lg:py-8">
            {children}
          </main>

          {/* ── RIGHT: Promo ── */}
          <div className="px-4 lg:px-6 py-6">
            <TutorialPromo
              chapterCount={nav.chapters.length}
              currentChapter={currentChapterOrder}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
