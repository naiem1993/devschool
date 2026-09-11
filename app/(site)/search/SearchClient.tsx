'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { debounce } from 'lodash'

type TutorialHit = {
  id: string
  title: string
  slug: string
  description: string | null
  difficulty: string
  categoryName: string | null
  categorySlug: string | null
  rank?: number
}

type ReferenceHit = {
  id: string
  title: string
  slug: string
  syntax: string | null
  language: string | null
  categoryName: string | null
  categorySlug: string | null
  rank?: number
}

type SearchResult = {
  query: string
  type: string
  tutorials: TutorialHit[]
  references: ReferenceHit[]
  total: number
  tookMs: number
  fallback?: boolean
}

type TabKey = 'all' | 'tutorials' | 'references'

export type CategoryOption = { id: string; name: string; slug: string }

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

const POPULAR = [
  { label: 'JavaScript', q: 'javascript' },
  { label: 'Python', q: 'python' },
  { label: 'React', q: 'react' },
  { label: 'Array map', q: 'map' },
  { label: 'async/await', q: 'async' },
  { label: 'SQL', q: 'sql' },
]

export default function SearchClient({
  categories,
  languages,
}: {
  categories: CategoryOption[]
  languages: string[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialQuery = searchParams.get('q') || ''
  const initialType = (searchParams.get('type') as TabKey) || 'all'

  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState<TabKey>(initialType)
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '')
  const [language, setLanguage] = useState(searchParams.get('language') || '')

  const [result, setResult] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // ─── Persist filters in URL (shareable links, back/forward support) ───
  const syncUrl = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams()
      Object.entries(params).forEach(([k, v]) => {
        if (v) sp.set(k, v)
      })
      const qs = sp.toString()
      router.replace(qs ? `/search?${qs}` : '/search', { scroll: false })
    },
    [router]
  )

  // ─── Debounced server-side FTS ───
  const runSearch = useMemo(
    () =>
      debounce(async (opts: {
        q: string
        type: TabKey
        category: string
        difficulty: string
        language: string
      }) => {
        if (opts.q.trim().length < 2) {
          setResult(null)
          setIsLoading(false)
          return
        }
        try {
          const params = new URLSearchParams({
            q: opts.q,
            type: opts.type,
            limit: '24',
          })
          if (opts.category) params.set('category', opts.category)
          if (opts.difficulty) params.set('difficulty', opts.difficulty)
          if (opts.language) params.set('language', opts.language)

          const res = await fetch(`/api/search?${params.toString()}`)
          if (res.ok) {
            setResult(await res.json())
            setError(false)
          } else {
            setError(true)
            setResult(null)
          }
        } catch {
          setError(true)
          setResult(null)
        } finally {
          setIsLoading(false)
        }
      }, 300),
    []
  )

  useEffect(() => {
    setIsLoading(query.trim().length >= 2)
    runSearch({ q: query, type, category, difficulty, language })
    return () => runSearch.cancel()
  }, [query, type, category, difficulty, language, runSearch])

  // ─── Sync URL whenever query/filters change ───
  useEffect(() => {
    syncUrl({
      q: query.trim(),
      type: type !== 'all' ? type : '',
      category,
      difficulty,
      language,
    })
  }, [query, type, category, difficulty, language, syncUrl])

  // ─── Keyboard: "/" focuses the search box ───
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const activeFilters = Boolean(category || difficulty || language)
  const hasQuery = query.trim().length >= 2
  const hasHits = result && (result.tutorials.length > 0 || result.references.length > 0)

  const resetFilters = () => {
    setCategory('')
    setDifficulty('')
    setLanguage('')
  }

  const showTutorials = type === 'all' || type === 'tutorials'
  const showReferences = type === 'all' || type === 'references'

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'all', label: 'সব', icon: '🔍' },
    { key: 'tutorials', label: 'টিউটোরিয়াল', icon: '📚' },
    { key: 'references', label: 'রেফারেন্স', icon: '📖' },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* ─── Search Box ─── */}
      <div className="relative">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
          🔍
        </span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="কী শিখতে চান? (যেমন: JavaScript, Python, React...)"
          aria-label="সার্চ"
          autoFocus
          className="w-full pl-14 pr-24 py-4 sm:py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-base sm:text-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            /
          </kbd>
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="ক্লিয়ার"
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ─── Popular suggestions (empty state) ─── */}
      {!hasQuery && (
        <div className="mt-6 flex flex-wrap items-center gap-2 justify-center">
          <span className="text-xs text-slate-400 mr-1">জনপ্রিয়:</span>
          {POPULAR.map((p) => (
            <button
              key={p.q}
              onClick={() => setQuery(p.q)}
              className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* ─── Tabs + Filters ─── */}
      {hasQuery && (
        <div className="mt-8 space-y-4">
          {/* Type tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setType(t.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  type === t.key
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span className="mr-1">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="ক্যাটাগরি ফিল্টার"
              className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
            >
              <option value="">সব ক্যাটাগরি</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {showTutorials && (
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                aria-label="লেভেল ফিল্টার"
                className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
              >
                <option value="">সব লেভেল</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            )}

            {showReferences && (
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="ভাষা ফিল্টার"
                className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
              >
                <option value="">সব ভাষা</option>
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            )}
          </div>

          {activeFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              সব ফিল্টার মুছুন ✕
            </button>
          )}
        </div>
      )}

      {/* ─── Loading ─── */}
      {isLoading && (
        <div className="mt-10 space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
            >
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-3" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* ─── Error ─── */}
      {!isLoading && error && (
        <div className="mt-10 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-3xl p-8 text-center">
          <div className="text-5xl mb-3">⚠️</div>
          <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-1">
            সার্চে সমস্যা হয়েছে
          </h3>
          <p className="text-sm text-red-600/80 dark:text-red-400/70">
            আবার চেষ্টা করুন বা পেজ রিফ্রেশ করুন।
          </p>
        </div>
      )}

      {/* ─── Results meta ─── */}
      {!isLoading && !error && result && hasQuery && (
        <div className="mt-8 flex items-center justify-between text-sm">
          <p className="text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {result.total}
            </span>{' '}
            টি ফলাফল
            {result.fallback && (
              <span className="ml-2 text-[10px] text-amber-600 dark:text-amber-400">
                (fallback mode)
              </span>
            )}
          </p>
          <span className="text-xs text-slate-400 font-mono">{result.tookMs}ms</span>
        </div>
      )}

      {/* ─── Empty ─── */}
      {!isLoading && !error && result && hasQuery && !hasHits && (
        <div className="mt-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">কিছু পাওয়া যায়নি</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            <span className="font-mono text-indigo-600 dark:text-indigo-400">
              “{result.query}”
            </span>{' '}
            এর জন্য কোনো ফলাফল নেই। অন্য কীওয়ার্ড চেষ্টা করুন।
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {POPULAR.slice(0, 4).map((p) => (
              <button
                key={p.q}
                onClick={() => setQuery(p.q)}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-950 transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Results ─── */}
      {!isLoading && !error && result && hasHits && (
        <div className="mt-6 space-y-8">
          {/* Tutorials */}
          {showTutorials && result.tutorials.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                <span>📚</span> টিউটোরিয়াল
                <span className="text-slate-300 dark:text-slate-700">
                  ({result.tutorials.length})
                </span>
              </h2>
              <div className="space-y-3">
                {result.tutorials.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tutorials/${t.slug}`}
                    className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {t.title}
                      </h3>
                      <span className="flex-shrink-0 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
                        {t.difficulty}
                      </span>
                    </div>
                    {t.description && (
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {t.description}
                      </p>
                    )}
                    {t.categoryName && (
                      <div className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        {t.categoryName}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {showReferences && result.references.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                <span>📖</span> রেফারেন্স
                <span className="text-slate-300 dark:text-slate-700">
                  ({result.references.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.references.map((r) => (
                  <Link
                    key={r.id}
                    href={`/references/${r.slug}`}
                    className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition">
                        {r.title}
                      </span>
                      {r.language && (
                        <span className="flex-shrink-0 text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                          {r.language}
                        </span>
                      )}
                    </div>
                    {r.syntax && (
                      <pre className="bg-slate-900 dark:bg-black border border-slate-800 rounded-lg px-3 py-2 text-[11px] text-emerald-300 font-mono overflow-x-auto line-clamp-2 whitespace-pre-wrap">
                        {r.syntax}
                      </pre>
                    )}
                    {r.categoryName && (
                      <div className="mt-2 text-[11px] text-slate-400">{r.categoryName}</div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
