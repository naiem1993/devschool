'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export type ReferenceCard = {
  id: string
  title: string
  slug: string
  description: string | null
  syntax: string | null
  example: string | null
  tags: string[]
  language: string | null
  category: { name: string; slug: string }
}

type SortKey = 'title' | 'category' | 'language'

export default function ReferencesFilter({
  references,
  categories,
  languages,
}: {
  references: ReferenceCard[]
  categories: { id: string; name: string; slug: string }[]
  languages: string[]
}) {
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
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

      const matchesCategory =
        categoryFilter === 'all' || r.category.slug === categoryFilter

      const matchesLanguage =
        languageFilter === 'all' ||
        (r.language || '').toLowerCase() === languageFilter.toLowerCase()

      return matchesQuery && matchesCategory && matchesLanguage
    })

    result = [...result].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      if (sort === 'category') return a.category.name.localeCompare(b.category.name)
      if (sort === 'language')
        return (a.language || '').localeCompare(b.language || '')
      return 0
    })

    return result
  }, [references, query, categoryFilter, languageFilter, sort])

  const activeFilters =
    query || categoryFilter !== 'all' || languageFilter !== 'all'

  const reset = () => {
    setQuery('')
    setCategoryFilter('all')
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
            placeholder="রেফারেন্স খুঁজুন... (যেমন: map, forEach, fetch)"
            aria-label="রেফারেন্স সার্চ"
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="ক্যাটাগরি ফিল্টার"
            className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
          >
            <option value="all">সব ক্যাটাগরি</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            aria-label="ভাষা ফিল্টার"
            className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
          >
            <option value="all">সব ভাষা</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="সাজানোর ধরন"
            className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
          >
            <option value="title">নাম (A-Z)</option>
            <option value="category">ক্যাটাগরি</option>
            <option value="language">ভাষা</option>
          </select>
        </div>
      </div>

      {/* ─── Result Count ─── */}
      <div className="flex items-center justify-between mb-5 text-sm">
        <p className="text-slate-500 dark:text-slate-400">
          {filtered.length} টি রেফারেন্স
          {activeFilters && (
            <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">
              (ফিল্টার করা)
            </span>
          )}
        </p>
        {activeFilters && (
          <button
            onClick={reset}
            className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            সব ফিল্টার মুছুন ✕
          </button>
        )}
      </div>

      {/* ─── Grid ─── */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold mb-2">কিছু পাওয়া যায়নি</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন অথবা ফিল্টার রিসেট করুন।
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition"
          >
            সব রেফারেন্স দেখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <Link
              key={r.id}
              href={`/references/${r.slug}`}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3 gap-2">
                <h3 className="font-bold text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-1">
                  {r.title}
                </h3>
                {r.language && (
                  <span className="flex-shrink-0 text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                    {r.language}
                  </span>
                )}
              </div>

              {r.syntax && (
                <pre className="bg-slate-900 dark:bg-black border border-slate-800 rounded-lg px-3 py-2 text-[11px] text-emerald-300 font-mono overflow-x-auto mb-3 line-clamp-2 whitespace-pre-wrap">
                  <code>{r.syntax}</code>
                </pre>
              )}

              {r.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 flex-1">
                  {r.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
                <span className="text-[10px] text-slate-400 truncate">
                  📂 {r.category.name}
                </span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  দেখুন →
                </span>
              </div>

              {r.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {r.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
