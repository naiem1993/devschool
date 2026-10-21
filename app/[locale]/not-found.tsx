'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDict, useLocale } from '@/lib/i18n/I18nProvider'
import { localeHref } from '@/lib/i18n/link'

export default function NotFound() {
  const dict = useDict()
  const locale = useLocale()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
      <div className="relative">
        <h1 className="text-[120px] sm:text-[180px] font-black leading-none tracking-tighter text-slate-200 dark:text-slate-800/50 select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl sm:text-7xl">🔍</span>
        </div>
      </div>
      
      <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
        {dict.notFound?.bigTitle || 'Page not found'}
      </h2>
      <p className="mt-3 text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        {dict.notFound?.bigMessage || 'The link you opened is wrong, has been removed, or never existed. Keep learning from the options below.'}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={localeHref(locale, '/')}
          className="px-6 py-3 rounded-2xl bg-[#22C55E] hover:bg-[#4ADE80] text-[#04140a] font-bold transition shadow-lg shadow-[#22C55E]/20"
        >
          🏠 {dict.notFound?.backHome || 'Back to homepage'}
        </Link>
        <Link
          href={localeHref(locale, '/search')}
          className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:border-[#22C55E] transition"
        >
          🔍 {dict.notFound?.searchSomething || 'Search something'}
        </Link>
      </div>

      <div className="mt-14">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
          Popular sections
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { label: '📚 Tutorials', path: '/tutorials' },
            { label: '⚡ Challenges', path: '/challenges' },
            { label: '📖 References', path: '/references' },
            { label: '🔍 Search', path: '/search' },
          ].map((item) => (
            <Link
              key={item.path}
              href={localeHref(locale, item.path)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
