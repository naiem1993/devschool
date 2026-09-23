'use client'

import Link from 'next/link'
import { useDict } from '@/lib/i18n/I18nProvider'
import { useLocale } from '@/lib/i18n/I18nProvider'

export default function HomeErrorPanel({ message }: { message: string }) {
  const dict = useDict()
  const locale = useLocale()
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2FBF4] dark:bg-[#050806] p-4">
      <div className="text-center max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="text-6xl mb-4">🔌</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{dict.homeError.title}</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">{message}</p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#22C55E] text-[#050806] rounded-xl hover:bg-[#4ADE80] transition font-semibold"
          >
            {dict.homeError.retry}
          </button>
          <Link
            href={`/${locale}/tutorials`}
            className="text-sm text-[#15803d] dark:text-[#4ADE80] hover:underline"
          >
            {dict.homeError.continueBrowsing}
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          {dict.homeError.supportPre}{' '}
          <a href="mailto:support@devschool.com" className="underline">
            {dict.homeError.supportLink}
          </a>{' '}
          {dict.homeError.supportPost}
        </p>
      </div>
    </div>
  )
}