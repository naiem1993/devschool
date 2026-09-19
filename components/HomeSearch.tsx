// 🤖 AI নির্দেশ: Add a 'see all results' footer link inside the search dropdown results container. In the block that renders 'NoResults' / results footer, there is currently a div with className 'px-3 py-2 text-[10px] text-slate-400 text-right border-t border-slate-100 dark:border-slate-800' that displays {result.tookMs}ms. Replace the inner content so it also includes a Link to the full search page. Specifically, change the tookMs footer to display BOTH a Link (href={'/search?q=' + encodeURIComponent(query)}) with text 'সব ফলাফল দেখুন →' on the left (with className 'text-[#15803d] dark:text-[#4ADE80] font-semibold') and the tookMs on the right, wrapped in a flex justify-between container.
// 🤖 AI নির্দেশ: Add a 'see all results' footer link inside the search dropdown results container. In the block that renders 'NoResults' / results footer, there is currently a div with className 'px-3 py-2 text-[10px] text-slate-400 text-right border-t border-slate-100 dark:border-slate-800' that displays {result.tookMs}ms. Replace the inner content so it also includes a Link to the full search page. Specifically, change the tookMs footer to display BOTH a Link (href={'/search?q=' + encodeURIComponent(query)}) with text 'সব ফলাফল দেখুন →' on the left (with className 'text-[#15803d] dark:text-[#4ADE80] font-semibold') and the tookMs on the right, wrapped in a flex justify-between container.
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { debounce } from 'lodash'

type TutorialHit = {
  id: string
  title: string
  slug: string
  description: string | null
  difficulty: string
  categoryName: string | null
}

type ReferenceHit = {
  id: string
  title: string
  slug: string
  syntax: string | null
  language: string | null
  categoryName: string | null
}

type SearchResult = {
  query: string
  tutorials: TutorialHit[]
  references: ReferenceHit[]
  tookMs: number
  fallback?: boolean
}

/**
 * Homepage search box.
 *
 * Uses server-side PostgreSQL Full-Text Search (`/api/search`).
 * The `tutorials` prop is kept for backwards-compat / SSR fallback,
 * but the actual search is performed server-side with FTS ranking.
 */
export default function HomeSearch(
  { placeholder = 'কী শিখতে চান? (যেমন: JavaScript, Python, React...)' }: {
    tutorials?: unknown[]
    placeholder?: string
  } = {}
) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runSearch = useCallback(
    debounce(async (q: string) => {
      if (q.trim().length < 2) {
        setResult(null)
        setIsLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`)
        if (res.ok) setResult(await res.json())
        else setResult(null)
      } catch {
        setResult(null)
      } finally {
        setIsLoading(false)
      }
    }, 280),
    []
  )

  useEffect(() => {
    if (query.trim().length >= 2) setIsLoading(true)
    runSearch(query)
    return () => runSearch.cancel()
  }, [query, runSearch])

  const hasHits =
    result && (result.tutorials.length > 0 || result.references.length > 0)

  return (
    <div className="max-w-2xl mx-auto mt-8 relative">
      <div className="relative flex items-center">
        <span className="absolute left-4 text-slate-400 text-lg">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition"
          >
            ক্লিয়ার
          </button>
        )}
      </div>

      {isLoading && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50">
          <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>খুঁজছি...</span>
          </div>
        </div>
      )}

      {!isLoading && result && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto text-left">
          {hasHits ? (
            <div className="p-2">
              {result.tutorials.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    📚 টিউটোরিয়াল
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {result.tutorials.map((t) => (
                      <Link
                        key={t.id}
                        href={`/tutorials/${t.slug}`}
                        onClick={() => setQuery('')}
                        className="block p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                      >
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{t.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                          <span className="text-blue-600 dark:text-blue-400">{t.categoryName || 'টিউটোরিয়াল'}</span>
                          <span>•</span>
                          <span>{t.difficulty}</span>
                        </div>
                        {t.description && (
                          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                            {t.description}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {result.references.length > 0 && (
                <div className="mt-2">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    📖 রেফারেন্স
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {result.references.map((r) => (
                      <Link
                        key={r.id}
                        href={`/references/${r.slug}`}
                        onClick={() => setQuery('')}
                        className="block p-3 rounded-xl hover:bg-[#22C55E]/10 dark:hover:bg-slate-800 transition"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{r.title}</span>
                          {r.language && (
                            <span className="text-[10px] font-mono uppercase text-cyan-600 dark:text-cyan-400">{r.language}</span>
                          )}
                        </div>
                        {r.syntax && (
                          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                            {r.syntax}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-3 py-2 text-[10px] text-slate-400 text-right border-t border-slate-100 dark:border-slate-800">
                {result.tookMs}ms
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              কিছু পাওয়া যায়নি 😕 — অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন
            </div>
          )}
        </div>
      )}
    </div>
  )
}
