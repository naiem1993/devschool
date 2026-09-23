'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useDict } from '@/lib/i18n/I18nProvider'

export type ChallengeCard = {
  id: string
  title: string
  description: string
  difficulty: string
  points: number
  tutorialTitle: string
  testCaseCount: number
}

type DiffFilter = 'all' | 'Easy' | 'Medium' | 'Hard'

export default function ChallengeFilter({ challenges }: { challenges: ChallengeCard[] }) {
  const dict = useDict()
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState<DiffFilter>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return challenges.filter((c) => {
      const matchesQ = q
        ? c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
        : true
      const matchesD = difficulty === 'all' || c.difficulty === difficulty
      return matchesQ && matchesD
    })
  }, [challenges, query, difficulty])

  const diffStyle = (d: string) => {
    if (d === 'Easy') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    if (d === 'Medium') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    if (d === 'Hard') return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
    return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
  }

  return (
    <>
      <div className="space-y-3 mb-8">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🔍</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.challenges.searchPlaceholder}
            aria-label={dict.challenges.searchAria}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                difficulty === d
                  ? 'bg-[#22C55E] text-[#050806] border-[#22C55E] shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#22C55E]/60 dark:hover:border-[#22C55E]/60'
              }`}
            >
              {d === 'all' ? dict.challenges.allOption : d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-5 text-sm">
        <p className="text-slate-500 dark:text-slate-400">
          {dict.challenges.countTpl.replace('{count}', String(filtered.length))}
        </p>
        {(query || difficulty !== 'all') && (
          <button onClick={() => { setQuery(''); setDifficulty('all') }} className="text-xs text-slate-500 hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition">
            {dict.challenges.filterClear}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2">{dict.challenges.noResultsTitle}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{dict.challenges.noResultsDiffDesc}</p>
          <button onClick={() => { setQuery(''); setDifficulty('all') }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] rounded-xl text-sm font-semibold transition">{dict.challenges.viewAll}</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/challenges/${c.id}`}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-[#22C55E]/60 dark:hover:border-[#22C55E]/60 transition-all duration-200 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3 gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${diffStyle(c.difficulty)}`}>{c.difficulty}</span>
                <span className="text-xs font-bold text-[#15803d] dark:text-[#4ADE80]">⭐ {c.points} {dict.challenges.pts}</span>
              </div>
              <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-[#22C55E] dark:group-hover:text-[#4ADE80] transition line-clamp-2">{c.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">{c.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/5 text-xs text-slate-400">
                <span className="truncate max-w-[120px]" title={c.tutorialTitle}>📚 {c.tutorialTitle}</span>
                <span className="text-[#22C55E] font-semibold group-hover:translate-x-1 transition-transform">{dict.challenges.solve}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
