'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useDict, useLocale } from '@/lib/i18n/I18nProvider'

export default function TutorialError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useDict().slugPages
  const locale = useLocale()
  const base = locale === 'en' ? '/en' : '/bn'

  useEffect(() => {
    console.error('[tutorial] Error:', error)
  }, [error])

  return (
    <main className="relative min-h-[70vh] overflow-hidden bg-[#f2fbf4] dark:bg-[#050806] text-slate-900 dark:text-slate-100 flex items-center justify-center px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[760px] max-w-[140vw]"
        style={{
          background:
            'radial-gradient(ellipse at center top, rgba(34,197,94,0.16), rgba(34,197,94,0.05) 45%, transparent 72%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-xl backdrop-blur-sm dark:border-white/[0.07] dark:bg-white/[0.03] dark:shadow-none">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#22C55E]/35 bg-[#22C55E]/10 text-3xl">
            ⚠️
          </div>

          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#15803d] dark:text-[#4ADE80]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              Tutorial Error
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.tutorialErrorTitle}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {t.tutorialErrorMsg}
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-6 py-3 text-sm font-bold text-[#050806] transition hover:bg-[#4ADE80] hover:shadow-[0_0_28px_rgba(34,197,94,0.45)]"
            >
              {t.retry}
            </button>
            <Link
              href={`${base}/tutorials`}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#22C55E] hover:text-[#15803d] dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:border-[#22C55E]/60 dark:hover:text-[#4ADE80]"
            >
              📚 {t.viewAllTutorials}
            </Link>
          </div>

          {error?.digest && (
            <p className="mt-6 font-mono text-[10px] text-slate-400 dark:text-slate-600">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
