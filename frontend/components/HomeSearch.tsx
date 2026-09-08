'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Tutorial {
  id: string
  title: string
  slug: string
  difficulty: string
  views: number
  category?: { name: string }
}

export default function HomeSearch({ tutorials }: { tutorials: Tutorial[] }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim() === '' 
    ? [] 
    : tutorials.filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || (t.category?.name && t.category.name.toLowerCase().includes(query.toLowerCase())))

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

      {/* Live Search Results Dropdown */}
      {query.trim() !== '' && (
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
