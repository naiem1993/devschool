'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useDict, useLocale } from '@/lib/i18n/I18nProvider'

export default function SearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useDict().searchUi
  const locale = useLocale()

  useEffect(() => {
    console.error('Search page error:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19] p-4">
      <div className="text-center max-w-md ds-card p-8 shadow-xl">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          {t.errorTitle}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          {t.errorPageDesc}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] rounded-xl text-sm font-semibold transition"
          >
            {t.errorRetryBtn}
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition"
          >
            {t.errorHomeBtn}
          </Link>
        </div>
      </div>
    </div>
  )
}
