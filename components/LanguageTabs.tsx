'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDict } from '@/lib/i18n/I18nProvider'
import { localeHref, stripLocale } from '@/lib/i18n/link'
import type { Locale } from '@/lib/i18n/config'

export type LanguageTab = {
  slug: string
  title: string
}

/**
 * w3schools-style Language tab row (Underline variant)।
 *
 * Arrow behavior (w3schools-এর মতো):
 *  - সব tab screen-এ fit হলে → কোনো arrow দেখাবে না।
 *  - ডানে scroll করার মতো tab থাকলে → শুধু ডান arrow।
 *  - বামে scroll করা যায় (মানে আগে scroll করা হয়েছে) → শুধু বাম arrow।
 *  - দুইদিকেই থাকলে → দুইদিকে arrow।
 *
 * কোনো hard-coded arrow নেই — scroll position + overflow measure করে
 * dynamic ভাবে দেখানো/লুকানো হয়। ResizeObserver + scroll listener + window
 * resize — তিনটাই handle করা।
 */
export default function LanguageTabs({
  tabs,
  locale,
}: {
  tabs: LanguageTab[]
  locale: Locale
}) {
  const pathname = usePathname()
  const dict = useDict()
  // pathname-এ locale prefix থাকে (/bn/... বা /en/...) — সেটা কেটে আসল path
  const { path } = stripLocale(pathname || '/')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    const hasOverflow = maxScroll > 1
    setCanScrollLeft(hasOverflow && el.scrollLeft > 1)
    setCanScrollRight(hasOverflow && el.scrollLeft < maxScroll - 1)
  }, [])

  useEffect(() => {
    updateArrows()
    const el = scrollRef.current
    if (!el) return

    el.addEventListener('scroll', updateArrows, { passive: true })
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    window.addEventListener('resize', updateArrows)

    return () => {
      el.removeEventListener('scroll', updateArrows)
      ro.disconnect()
      window.removeEventListener('resize', updateArrows)
    }
  }, [updateArrows, tabs])

  if (tabs.length === 0) return null

  const scroll = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' })
  }

  // Home page-এ tab row hide (floating pill nav-এর সাথে clash করে)
  const isHome = path === '/'
  if (isHome) return null

  // ☰ Mobile tutorial-menu button — শুধু tutorial lesson/chapter page-এ দেখাবে
  // (sidebar শুধু ওখানেই render হয়; listing page-এ dead button এড়াতে gate করা)
  const showMobileMenu = /^\/tutorials\/.+/.test(path)

  const arrowBtnClass =
    'hidden sm:flex shrink-0 w-8 items-center justify-center text-slate-500 hover:text-emerald-700 dark:hover:text-[#4ADE80] transition-colors'

  return (
    <div className="sticky top-16 z-40 border-b border-emerald-200/70 dark:border-emerald-900/40 bg-[#F2FBF4]/95 dark:bg-[#050806]/95 backdrop-blur-xl">
      <div className="flex items-stretch">
        {/* ☰ Mobile tutorial menu — w3schools-এর মতো sub-nav-এর একদম বামে (dark square)।
            শুধু mobile/tablet-এ (lg:hidden), কারণ sidebar ওখানেই drawer হয়ে বেরোয়।
            Click করলে LessonSidebar-এর window event dispatch হয় → drawer খুলে যায়। */}
        {showMobileMenu && (
          <button
            type="button"
            aria-label={dict.tabs.tutorialMenu}
            onClick={() => window.dispatchEvent(new Event('toggle-tutorial-sidebar'))}
            className="lg:hidden shrink-0 flex items-center justify-center w-12 bg-[#0a0f0c] text-white hover:text-[#4ADE80] active:bg-[#111a15] transition-colors border-r border-emerald-900/30"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* ← Left arrow — শুধু তখনই render হয় যখন বামে scroll করার মতো কিছু আছে */}
        {canScrollLeft && (
          <button
            type="button"
            aria-label={dict.tabs.prevTab}
            onClick={() => scroll(-1)}
            className={arrowBtnClass}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Tabs scroll area */}
        <div
          ref={scrollRef}
          className="flex-1 flex items-stretch overflow-x-auto scrollbar-hide"
        >
          {tabs.map((t) => {
            const href = localeHref(locale, `/tutorials/${t.slug}`)
            const linkPath = stripLocale(href).path
            const active = path === linkPath || path?.startsWith(linkPath + '/')
            return (
              <Link
                key={t.slug}
                href={href}
                className={[
                  'relative shrink-0 px-4 py-3 text-[13px] whitespace-nowrap transition-colors border-b-2',
                  active
                    ? 'border-[#22C55E] text-emerald-700 dark:text-[#4ADE80] font-semibold'
                    : 'border-transparent text-slate-600 dark:text-slate-400 font-medium hover:text-emerald-700 dark:hover:text-[#4ADE80]',
                ].join(' ')}
              >
                {t.title}
              </Link>
            )
          })}
        </div>

        {/* → Right arrow — শুধু তখনই render হয় যখন ডানে scroll করার মতো কিছু আছে */}
        {canScrollRight && (
          <button
            type="button"
            aria-label={dict.tabs.nextTab}
            onClick={() => scroll(1)}
            className={arrowBtnClass}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
