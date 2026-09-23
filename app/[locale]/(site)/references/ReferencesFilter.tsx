'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useDict } from '@/lib/i18n/I18nProvider'

export type ReferenceCard = {
  id: string
  title: string
  slug: string
  description: string | null
  syntax: string | null
  example: string | null
  tags: string[]
  language: string | null
}

type SortKey = 'title' | 'language'

const inputBase =
  'bg-white dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition'

export default function ReferencesFilter({
  references,
  languages,
}: {
  references: ReferenceCard[]
  languages: string[]
}) {
  const dict = useDict()
  const [query, setQuery] = useState('')
  const [languageFilter, setLanguageFilter] = useState<string>('all')
  const [sort, setSort] = useState<SortKey>('title')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    let result = references.filter((r) => {
      const matchesQuery = q
        ? r.title.toLowerCase().includes(q) ||
          r.slug.toLowerCase().includes(q) ||
          (r.description || '').toLowerCase().includes(q) ||
          (r.syntax || '').toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
        : true

      const matchesLanguage =
        languageFilter === 'all' ||
        (r.language || '').toLowerCase() === languageFilter.toLowerCase()

      return matchesQuery && matchesLanguage
    })

    result = [...result].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      if (sort === 'language')
        return (a.language || '').localeCompare(b.language || '')
      return 0
    })

    return result
  }, [references, query, languageFilter, sort])

  const activeFilters = query || languageFilter !== 'all'

  const reset = () => {
    setQuery('')
    setLanguageFilter('all')
  }

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
            placeholder={dict.references.searchPlaceholder}
            aria-label={dict.references.searchAria}
            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm ${inputBase}`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            aria-label={dict.references.filterLanguage}
            className={`px-4 py-3 rounded-2xl text-sm font-medium cursor-pointer ${inputBase}`}
          >
            <option value="all">{dict.references.allLanguages}</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label={dict.references.sortAria}
            className={`px-4 py-3 rounded-2xl text-sm font-medium cursor-pointer ${inputBase}`}
          >
            <option value="title">{dict.references.sortTitle}</option>
            <option value="language">{dict.references.sortLanguage}</option>
          </select>
        </div>
      </div>

      {/* ─── Result Count ─── */}
      <div className="flex items-center justify-between mb-5 text-sm">
        <p className="text-slate-500 dark:text-slate-400">
          {dict.references.countTpl.replace('{count}', String(filtered.length))}
          {activeFilters && (
            <span className="ml-2 text-xs text-[#22C55E]">{dict.references.filteredLabel}</span>
          )}
        </p>
        {activeFilters && (
          <button
            onClick={reset}
            className="text-xs text-slate-500 hover:text-[#22C55E] transition"
          >
            {dict.references.clearFilters}
          </button>
        )}
      </div>

      {/* ─── Grid ─── */}
      {filtered.length === 0 ? (
        <div className="bg-slate-50 dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/5 rounded-3xl p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-bold mb-2">{dict.references.noResultsTitle}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {dict.references.noResultsDesc}
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#22C55E] hover:bg-[#1faf53] text-black rounded-xl text-sm font-semibold transition"
          >
            {dict.references.viewAll}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <Link
              key={r.id}
              href={`/references/${r.slug}`}
              className="group bg-slate-50 dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-[#22C55E]/50 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3 gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#22C55E] transition line-clamp-1">
                  {r.title}
                </h3>
                {r.language && (
                  <span className="flex-shrink-0 text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                    {r.language}
                  </span>
                )}
              </div>

              {r.syntax && (
                <pre className="bg-slate-900 dark:bg-black border border-slate-800 dark:border-white/10 rounded-lg px-3 py-2 text-[11px] text-[#86EFAC] font-mono overflow-x-auto mb-3 line-clamp-2 whitespace-pre-wrap">
                  {r.syntax}
                </pre>
              )}

              {r.description ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 flex-1">
                  {r.description}
                </p>
              ) : (
                <p className="text-sm text-slate-400 italic mb-3 flex-1">
                  {dict.references.detailsSoon}
                </p>
              )}

              {r.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {r.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end pt-3 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                <span className="text-[#22C55E] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  দেখুন →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
