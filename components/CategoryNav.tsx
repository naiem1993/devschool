'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Cat = { name: string; slug: string }

export default function CategoryNav({ categories }: { categories: Cat[] }) {
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 2)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories])

  const scrollByAmount = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = Math.max(el.clientWidth * 0.7, 200)
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  // Homepage-এ দেখাব না
  if (pathname === '/') return null
  if (!categories || categories.length === 0) return null

  const isTutorialPage = pathname?.startsWith('/tutorials/')
  const toggleChapters = () => {
    window.dispatchEvent(new CustomEvent('toggle-tutorial-sidebar'))
  }

  return (
    <nav className="sticky top-16 z-40 w-full border-b border-emerald-200/70 dark:border-emerald-900/40 bg-[#E8F7ED]/95 dark:bg-[#030504]/95 backdrop-blur-xl">
      <div className="flex items-stretch w-full">
        {/* ☰ Chapters toggle — mobile only, tutorial pages */}
        {isTutorialPage && (
          <button
            type="button"
            onClick={toggleChapters}
            aria-label="Toggle chapters"
            className="lg:hidden flex-shrink-0 px-3 flex items-center justify-center bg-emerald-500/15 dark:bg-emerald-500/15 border-r border-emerald-200/70 dark:border-emerald-900/40 text-emerald-700 dark:text-[#4ADE80] hover:bg-emerald-500/25 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <div className="relative flex-1 min-w-0">
        {/* ◀ Left arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollByAmount('left')}
            aria-label="Scroll left"
            className="absolute left-0 top-0 bottom-0 z-10 w-9 flex items-center justify-center bg-gradient-to-r from-[#E8F7ED] dark:from-[#030504] via-[#E8F7ED]/90 dark:via-[#030504]/90 to-transparent text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-[#4ADE80] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Scrollable tabs */}
        <div
          ref={scrollRef}
          className="flex items-stretch overflow-x-auto w-full scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((c) => {
            const href = `/courses/${c.slug}`
            const isActive = pathname === href || pathname?.startsWith(href + '/')

            return (
              <Link
                key={c.slug}
                href={href}
                className={[
                  'shrink-0 px-4 py-3 text-xs font-semibold font-mono uppercase tracking-wider',
                  'border-b-2 transition-all whitespace-nowrap',
                  isActive
                    ? 'text-emerald-700 dark:text-[#4ADE80] border-[#22C55E] bg-emerald-500/10'
                    : 'text-slate-500 dark:text-slate-500 border-transparent hover:text-emerald-700 dark:hover:text-[#4ADE80] hover:bg-emerald-500/5',
                ].join(' ')}
              >
                {c.name}
              </Link>
            )
          })}
        </div>

        {/* ▶ Right arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollByAmount('right')}
            aria-label="Scroll right"
            className="absolute right-0 top-0 bottom-0 z-10 w-9 flex items-center justify-center bg-gradient-to-l from-[#E8F7ED] dark:from-[#030504] via-[#E8F7ED]/90 dark:via-[#030504]/90 to-transparent text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-[#4ADE80] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        </div>
      </div>
    </nav>
  )
}
