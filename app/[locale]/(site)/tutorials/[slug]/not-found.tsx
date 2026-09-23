'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import bn from '@/lib/i18n/dictionaries/bn'
import en from '@/lib/i18n/dictionaries/en'

export default function TutorialNotFound() {
  const pathname = usePathname() || '/'
  const isEn = /^\/en(\/|$)/.test(pathname)
  const t = (isEn ? en : bn).slugPages
  const base = isEn ? '/en' : '/bn'
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19] px-4">
      <div className="max-w-md text-center">
        <div className="text-7xl mb-6">📭</div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
          {t.tutorialNotFoundTitle}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          {t.tutorialNotFoundMsg}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`${base}/tutorials`}
            className="px-6 py-3 bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] rounded-xl text-sm font-semibold transition"
          >
            {t.viewAllTutorials}
          </Link>
          <Link
            href={base}
            className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#22C55E] text-slate-800 dark:text-slate-200 rounded-xl text-sm font-semibold transition"
          >
            {t.goHome}
          </Link>
        </div>
      </div>
    </div>
  )
}
