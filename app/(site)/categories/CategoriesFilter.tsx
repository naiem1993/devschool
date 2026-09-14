'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export type CategoryCard = {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  sortOrder: number
  tutorialCount: number
  referenceCount: number
  difficultySpread: { Beginner: number; Intermediate: number; Advanced: number }
}

type SortKey = 'sortOrder' | 'name' | 'tutorials' | 'references'

const inputBase =
  'bg-white dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition'

export default function CategoriesFilter({ categories }: { categories: CategoryCard[] }) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('sortOrder')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = q
      ? categories.filter((c) =>
          [c.name, c.slug, c.description || ''].some((v) => v.toLowerCase().includes(q))
        )
      : categories

    const sorted = [...matches]
    sorted.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'tutorials') return b.tutorialCount - a.tutorialCount
      if (sort === 'references') return b.referenceCount - a.referenceCount
      return a.sortOrder - b.sortOrder
    })
    return sorted
  }, [categories, query, sort])

  return (
    <>
      {/* ─── Controls ─── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ক্যাটাগরি খুঁজুন... (যেমন: JavaScript, Python)"
            aria-label="ক্যাটাগরি সার্চ"
            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm ${inputBase}`}
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="সাজানোর ধরন"
          className={`px-4 py-3 rounded-2xl text-sm font-medium cursor-pointer ${inputBase}`}
        >
          <option value="sortOrder">নির্ধারিত ক্রম</option>
          <option value="name">নাম (A-Z)</option>
          <option value="tutorials">সর্বোচ্চ টিউটোরিয়াল</option>
          <option value="references">সর্বোচ্চ রেফারেন্স</option>
        </select>
      </div>

      {/* ─── Result Count ─── */}
      <div className="flex items-center justify-between mb-5 text-sm">
        <p className="text-slate-500 dark:text-slate-400">
          {filtered.length} টি ক্যাটাগরি
          {query && (
            <span className="ml-2 text-xs text-[#22C55E]">&quot;{query}&quot; এর জন্য</span>
          )}
        </p>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-xs text-slate-500 hover:text-[#22C55E] transition"
          >
            ফিল্টার মুছুন ✕
          </button>
        )}
      </div>

      {/* ─── Grid ─── */}
      {filtered.length === 0 ? (
        <div className="bg-slate-50 dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/5 rounded-3xl p-12 text-center">
          <div className="text-5xl mb-4">🔎</div>
          <h3 className="text-xl font-bold mb-2">কিছু পাওয়া যায়নি</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            আরো ভিন্ন কীওয়ার্ড দিয়ে চেষ্টা করুন অথবা ফিল্টার রিসেট করুন।
          </p>
          <button
            onClick={() => setQuery('')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#22C55E] hover:bg-[#1faf53] text-black rounded-xl text-sm font-semibold transition"
          >
            সব ক্যাটাগরি দেখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="group bg-slate-50 dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/5 rounded-3xl p-6 hover:border-[#22C55E]/50 hover:-translate-y-1 transition-all duration-200 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {c.icon || '📘'}
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-full">
                  #{c.slug}
                </span>
              </div>

              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white group-hover:text-[#22C55E] transition line-clamp-1">
                {c.name}
              </h3>

              {c.description ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                  {c.description}
                </p>
              ) : (
                <p className="text-sm text-slate-400 italic mb-4 flex-1">
                  এই ক্যাটাগরির বিস্তারিত শীঘ্রই যুক্ত হবে
                </p>
              )}

              {/* Difficulty spread — neutral chips, semantic dot */}
              {c.tutorialCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {c.difficultySpread.Beginner > 0 && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                      🟢 {c.difficultySpread.Beginner}
                    </span>
                  )}
                  {c.difficultySpread.Intermediate > 0 && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                      🟡 {c.difficultySpread.Intermediate}
                    </span>
                  )}
                  {c.difficultySpread.Advanced > 0 && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                      🔴 {c.difficultySpread.Advanced}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">📚 {c.tutorialCount} টিউটোরিয়াল</span>
                <span className="text-[#22C55E] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  শুরু করুন →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
