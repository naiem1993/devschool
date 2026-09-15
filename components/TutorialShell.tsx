import LessonSidebar from './LessonSidebar'
import TutorialPromo from './TutorialPromo'

type Chapter = { chapterNo: number; title: string }

export default function TutorialShell({
  tutorialSlug,
  tutorialTitle,
  chapters,
  currentChapter,
  children,
}: {
  tutorialSlug: string
  tutorialTitle: string
  chapters: Chapter[]
  currentChapter?: number
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806] text-slate-900 dark:text-slate-100">
      {/* ══════════ 3-COLUMN LAYOUT ══════════ */}
      <div className="w-full px-2 sm:px-4 lg:px-0">
        <div className="flex flex-col lg:flex-row">
          {/* ── LEFT: Chapters Sidebar ── */}
          <LessonSidebar
            tutorialSlug={tutorialSlug}
            tutorialTitle={tutorialTitle}
            chapters={chapters}
            currentChapter={currentChapter}
          />

          {/* ── CENTER: Main Content ── */}
          <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-10 py-6 lg:py-8">
            {children}
          </main>

          {/* ── RIGHT: Promo ── */}
          <div className="px-4 lg:px-6 py-6">
            <TutorialPromo
              chapterCount={chapters.length}
              currentChapter={currentChapter}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
