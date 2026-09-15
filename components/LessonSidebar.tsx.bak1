import Link from 'next/link'

type Chapter = {
  chapterNo: number
  title: string
}

export default function LessonSidebar({
  tutorialSlug,
  tutorialTitle,
  chapters,
  currentChapter,
}: {
  tutorialSlug: string
  tutorialTitle: string
  chapters: Chapter[]
  currentChapter?: number
}) {
  return (
    <aside className="w-full lg:w-[240px] flex-shrink-0">
      {/* Sticky wrapper */}
      <div className="lg:sticky lg:top-[128px] max-h-[calc(100vh-140px)] overflow-y-auto bg-[#E8F7ED]/60 dark:bg-[#080c0a] lg:border-r border-emerald-200/60 dark:border-emerald-900/40">
        {/* Header */}
        <h2 className="px-4 py-3 text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-100 border-b border-emerald-200/60 dark:border-emerald-900/40">
          {tutorialTitle}
        </h2>

        <nav aria-label="Tutorial chapters" className="py-1">
          <ul>
            {/* Home link */}
            <li>
              <Link
                href={`/tutorials/${tutorialSlug}`}
                className={[
                  'block px-4 py-2 text-[13px] border-l-[3px] transition-colors',
                  !currentChapter
                    ? 'bg-[#22C55E]/20 border-[#22C55E] text-[#15803d] dark:text-[#4ADE80] font-semibold'
                    : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-[#22C55E]/10 hover:border-[#4ADE80]',
                ].join(' ')}
              >
                {tutorialTitle.toUpperCase()} HOME
              </Link>
            </li>

            {/* Chapters */}
            {chapters.map((c) => {
              const active = currentChapter === c.chapterNo
              return (
                <li key={c.chapterNo}>
                  <Link
                    href={`/tutorials/${tutorialSlug}/${c.chapterNo}`}
                    className={[
                      'block px-4 py-2 text-[13px] border-l-[3px] transition-colors',
                      active
                        ? 'bg-[#22C55E]/20 border-[#22C55E] text-[#15803d] dark:text-[#4ADE80] font-semibold'
                        : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-[#22C55E]/10 hover:border-[#4ADE80]',
                    ].join(' ')}
                  >
                    {c.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
