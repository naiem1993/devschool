'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export type TutorialCard = {
  id: string
  title: string
  slug: string
  description: string | null
  difficulty: string
  viewCount: number
  duration: number | null
  rating: number | null
  chapterCount: number
  createdAt: string
}

type SortKey = 'popular' | 'title' | 'latest'

const inputBase =
  'bg-white dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition'

const DIFFICULTIES = [
  { value: 'all', label: 'সব লেভেল' },
  { value: 'beginner', label: 'বিগিনার' },
  { value: 'intermediate', label: 'ইন্টারমিডিয়েট' },
  { value: 'advanced', label: 'অ্যাডভান্সড' },
]

const difficultyLabel = (d: string) => {
  const k = (d || '').toLowerCase()
  if (k === 'beginner') return { text: 'বিগিনার', cls: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' }
  if (k === 'intermediate') return { text: 'ইন্টারমিডিয়েট', cls: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' }
  if (k === 'advanced') return { text: 'অ্যাডভান্সড', cls: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20' }
  return { text: d, cls: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20' }
}

export default function TutorialsFilter({ tutorials }: { tutorials: TutorialCard[] }) {
  const [query, setQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [sort, setSort] = useState<SortKey>('latest')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    let result = tutorials.filter((t) => {
      const matchesQuery = q
        ? t.title.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q)
        : true

      const matchesDifficulty =
        difficultyFilter === 'all' ||
        (t.difficulty || '').toLowerCase() === difficultyFilter.toLowerCase()

      return matchesQuery && matchesDifficulty
    })

    result = [...result].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      if (sort === 'popular') return b.viewCount - a.viewCount
      if (sort === 'latest') return b.createdAt.localeCompare(a.createdAt)
      return 0
    })

    return result
  }, [tutorials, query, difficultyFilter, sort])

  const activeFilters = query || difficultyFilter !== 'all'

  const reset = () => {
    setQuery('')
    setDifficultyFilter('all')
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
            placeholder="টিউটোরিয়াল খুঁজুন... (যেমন: HTML, JavaScript, Python)"
            aria-label="টিউটোরিয়াল সার্চ"
            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm ${inputBase}`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            aria-label="লেভেল ফিল্টার"
            className={`px-4 py-3 rounded-2xl text-sm font-medium cursor-pointer ${inputBase}`}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="সাজানোর ধরন"
            className={`px-4 py-3 rounded-2xl text-sm font-medium cursor-pointer ${inputBase}`}
          >
            <option value="latest">সর্বশেষ</option>
            <option value="popular">জনপ্রিয়</option>
            <option value="title">নাম (A-Z)</option>
          </select>
        </div>
      </div>

      {/* ─── Result Count ─── */}
      <div className="flex items-center justify-between mb-5 text-sm">
        <p className="text-slate-500 dark:text-slate-400">
          {filtered.length} টি টিউটোরিয়াল
          {activeFilters && (
            <span className="ml-2 text-xs text-[#22C55E]">(ফিল্টার করা)</span>
          )}
        </p>
        {activeFilters && (
          <button
            onClick={reset}
            className="text-xs text-slate-500 hover:text-[#22C55E] transition"
          >
            সব ফিল্টার মুছুন ✕
          </button>
        )}
      </div>

      {/* ─── Grid ─── */}
      {filtered.length === 0 ? (
        <div className="bg-slate-50 dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/5 rounded-3xl p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-bold mb-2">কিছু পাওয়া যায়নি</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন অথবা ফিল্টার রিসেট করুন।
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#22C55E] hover:bg-[#1faf53] text-black rounded-xl text-sm font-semibold transition"
          >
            সব টিউটোরিয়াল দেখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => {
            const diff = difficultyLabel(t.difficulty)
            return (
              <Link
                key={t.id}
                href={`/tutorials/${t.slug}`}
                className="group bg-slate-50 dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-[#22C55E]/50 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3 gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#22C55E] transition line-clamp-2">
                    {t.title}
                  </h3>
                  <span className={`flex-shrink-0 text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${diff.cls}`}>
                    {diff.text}
                  </span>
                </div>

                {t.description ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                    {t.description}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 italic mb-4 flex-1">
                    বিস্তারিত শীঘ্রই যুক্ত হবে
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      📖 {t.chapterCount} চ্যাপ্টার
                    </span>
                  </div>
                  <span className="text-[#22C55E] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    শুরু করুন →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
