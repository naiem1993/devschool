'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  TOOL_CATEGORY_KEYS,
  type DevTool,
  type ToolCategory,
} from '@/lib/tools'
import { useDict } from '@/lib/i18n/I18nProvider'

export default function ToolsGrid({ tools }: { tools: DevTool[] }) {
  const dict = useDict()
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<'all' | ToolCategory>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tools.filter((t) => {
      const matchesCat = cat === 'all' || t.category === cat
      const matchesQuery =
        !q ||
        [t.name, dict.toolPages[t.descKey], t.slug, ...t.tags].some((v) =>
          v.toLowerCase().includes(q)
        )
      return matchesCat && matchesQuery
    })
  }, [tools, query, cat])

  const catKeys = Object.keys(TOOL_CATEGORY_KEYS) as ToolCategory[]

  return (
    <>
      {/* ─── Controls ─── */}
      <div className="space-y-3 mb-8">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.tools.searchPlaceholder}
            aria-label={dict.tools.searchAria}
            className="ds-input w-full pl-11 pr-4 py-3 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCat('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              cat === 'all'
                ? 'bg-[#22C55E] text-black'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {dict.tools.allCategory} ({tools.length})
          </button>
          {catKeys.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setCat(k)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                cat === k
                  ? 'bg-[#22C55E] text-black'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              {dict.toolPages[TOOL_CATEGORY_KEYS[k]]}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Result Count ─── */}
      <div className="flex items-center justify-between mb-5 text-sm">
        <p className="text-slate-500 dark:text-slate-400">{dict.tools.countTpl.replace('{count}', String(filtered.length))}</p>
        {(query || cat !== 'all') && (
          <button
            onClick={() => {
              setQuery('')
              setCat('all')
            }}
            className="text-xs text-slate-500 hover:text-[#22C55E] transition"
          >
            {dict.tools.clearFilters}
          </button>
        )}
      </div>

      {/* ─── Grid ─── */}
      {filtered.length === 0 ? (
        <div className="ds-card p-12 text-center">
          <div className="text-5xl mb-4">🔎</div>
          <h3 className="text-xl font-bold mb-2">{dict.tools.noResultsTitle}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {dict.tools.noResultsDesc}
          </p>
          <button
            onClick={() => {
              setQuery('')
              setCat('all')
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#22C55E] hover:bg-[#1faf53] text-black rounded-xl text-sm font-semibold transition"
          >
            {dict.tools.viewAll}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => {
            const CardInner = (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xl font-bold text-[#22C55E] group-hover:scale-110 transition-transform">
                    {t.icon}
                  </div>
                  {t.comingSoon ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full">
                      {dict.tools.comingSoon}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-full">
                      #{t.slug}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white group-hover:text-[#22C55E] transition">
                  {t.name}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1">
                  {dict.toolPages[t.descKey]}
                </p>

                {t.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {t.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/5 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    {dict.toolPages[TOOL_CATEGORY_KEYS[t.category]]}
                  </span>
                  <span className="text-[#22C55E] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    {t.comingSoon ? dict.tools.comingSoonArrow : dict.tools.open}
                  </span>
                </div>
              </>
            )

            const cardCls =
              'group ds-card ds-card-sm ds-card-hover p-5 flex flex-col'

            // comingSoon হলে লিংক নিষ্ক্রিয় (তবু hover effect থাকবে)
            return t.comingSoon ? (
              <div key={t.slug} className={`${cardCls} cursor-default opacity-90`}>
                {CardInner}
              </div>
            ) : (
              <Link key={t.slug} href={t.href} className={cardCls}>
                {CardInner}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
