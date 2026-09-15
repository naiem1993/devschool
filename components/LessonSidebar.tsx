'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

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
  const [open, setOpen] = useState(false)

  // Listen for toggle events from CategoryNav ☰
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

  // ESC key closes sidebar
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [])

  return (
    <>
      {/* ═════ BACKDROP (mobile only) ═════ */}
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

      {/* ═════ SIDEBAR ═════ */}
      <aside
        className={[
          'w-[270px] lg:w-[250px] flex-shrink-0',
          'fixed lg:sticky top-[105px] left-0 z-[60] lg:z-auto',
          'h-[calc(100vh-105px)] overflow-y-auto',
          'bg-gradient-to-b from-[#080c0a] to-[#050806]',
          'border-r border-emerald-900/40',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* Heading with green accent bar */}
        <h2 className="flex items-center gap-2 px-4 py-4 text-xs font-extrabold uppercase tracking-widest text-[#4ADE80] border-b border-emerald-900/40">
          <span className="w-[3px] h-[14px] rounded-sm bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,.4)]" />
          {tutorialTitle}
        </h2>

        <nav aria-label="Tutorial chapters" className="py-2 pb-6">
          <ul>
            {/* Home link */}
            <li>
              <Link
                href={`/tutorials/${tutorialSlug}`}
                onClick={() => setOpen(false)}
                className={[
                  'block px-5 py-2 text-[13.5px] border-l-[3px] transition-all',
                  !currentChapter
                    ? 'bg-gradient-to-r from-[#22C55E]/20 to-[#22C55E]/5 border-[#22C55E] text-[#4ADE80] font-bold shadow-[inset_0_0_20px_rgba(34,197,94,.08)]'
                    : 'border-transparent text-slate-200 hover:bg-[#22C55E]/5 hover:border-[#4ADE80]/40',
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
                    onClick={() => setOpen(false)}
                    className={[
                      'block px-5 py-2 text-[13.5px] border-l-[3px] transition-all',
                      active
                        ? 'bg-gradient-to-r from-[#22C55E]/20 to-[#22C55E]/5 border-[#22C55E] text-[#4ADE80] font-bold shadow-[inset_0_0_20px_rgba(34,197,94,.08)]'
                        : 'border-transparent text-slate-200 hover:bg-[#22C55E]/5 hover:border-[#4ADE80]/40',
                    ].join(' ')}
                  >
                    {c.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
