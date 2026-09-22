'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ChallengesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('[challenges] Error:', error) }, [error])
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19] px-4">
      <div className="text-center max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">কিছু একটা ভুল হয়েছে</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">চ্যালেঞ্জ লোড করার সময় একটি ত্রুটি ঘটেছে।</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="px-6 py-2.5 bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] rounded-xl text-sm font-semibold transition">আবার চেষ্টা করুন 🔄</button>
          <Link href="/" className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-semibold transition">হোমপেজ</Link>
        </div>
        {error.digest && <p className="mt-6 text-[10px] font-mono text-slate-400">Error ID: {error.digest}</p>}
      </div>
    </div>
  )
}
