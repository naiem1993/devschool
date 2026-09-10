'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { debounce } from 'lodash'

interface Tutorial {
  id: string
  title: string
  slug: string
  difficulty: string
  views: number
  content?: string
  category?: { name: string }
}

export default function HomeSearch({ tutorials }: { tutorials: Tutorial[] }) {
  const [query, setQuery] = useState('')
  const [filtered, setFiltered] = useState<Tutorial[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      if (searchTerm.trim() === '') {
        setFiltered([])
        setIsLoading(false)
        return
      }
      const results = tutorials.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.category?.name && t.category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.content && t.content.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFiltered(results)
      setIsLoading(false)
    }, 300),
    [tutorials]
  )

  useEffect(() => {
    setIsLoading(true)
    debouncedSearch(query)
    return () => debouncedSearch.cancel()
  }, [query, debouncedSearch])

  return (
    <div className="max-w-2xl mx-auto mt-8 relative">
      <div className="relative flex items-center">
        <span className="absolute left-4 text-slate-400 text-lg">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="কী শিখতে চান? (যেমন: JavaScript, Python, React...)"
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

      {/* Loading Spinner */}
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

      {/* Search Results Dropdown */}
      {!isLoading && query.trim() !== '' && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto text-left">
          {filtered.length > 0 ? (
            <div className="p-2 divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((t) => (
                <Link
                  key={t.id}
                  href={`/tutorials/${t.slug}`}
                  onClick={() => setQuery('')}
                  className="block p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                >
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{t.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">{t.category?.name || 'টিউটোরিয়াল'}</span>
                    <span>•</span>
                    <span>{t.difficulty}</span>
                  </div>
                  {t.content && (
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                      {t.content}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              কোনো টিউটোরিয়াল পাওয়া যায়নি 😕
            </div>
          )}
        </div>
      )}
    </div>
  )
}
