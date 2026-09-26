'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useDict } from '@/lib/i18n/I18nProvider'

interface Tutorial {
  id: string
  title: string
  slug: string
  difficulty: string
  views: number
  duration?: number
  rating?: number
  category?: { name: string }
}

export default function LoadMoreTutorials({ initialTutorials }: { initialTutorials: Tutorial[] }) {
  const dict = useDict()
  const [tutorials, setTutorials] = useState(initialTutorials)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    setLoading(true)
    const nextPage = page + 1
    const res = await fetch(`/api/tutorials?page=${nextPage}&limit=6`)
    const data = await res.json()

    if (data.tutorials.length > 0) {
      setTutorials([...tutorials, ...data.tutorials])
      setPage(nextPage)
      setHasMore(nextPage < data.pagination.totalPages)
    } else {
      setHasMore(false)
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <Link
            key={tutorial.id}
            href={`/tutorials/${tutorial.slug}`}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-xl transition group"
          >
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-[#22C55E] dark:group-hover:text-[#4ADE80]">
              {tutorial.title}
            </h3>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-3">
              <span className="bg-[#22C55E]/15 dark:bg-[#22C55E]/15 px-2 py-0.5 rounded-full">
                {tutorial.category?.name || dict.home.genericCategory}
              </span>
              <span>⭐ {tutorial.rating || 0}</span>
              <span>👁️ {tutorial.views}</span>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] rounded-2xl font-bold shadow-lg shadow-[#22C55E]/30 disabled:opacity-50 transition"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {dict.home.loading}
              </span>
            ) : (
              dict.home.loadMoreTutorials
            )}
          </button>
        </div>
      )}
    </div>
  )
}
