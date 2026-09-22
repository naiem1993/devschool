'use client'

import Link from 'next/link'

export default function HomeErrorPanel({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2FBF4] dark:bg-[#050806] p-4">
      <div className="text-center max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="text-6xl mb-4">🔌</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">সংযোগ সমস্যা</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">{message}</p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#22C55E] text-[#050806] rounded-xl hover:bg-[#4ADE80] transition font-semibold"
          >
            আবার চেষ্টা করুন 🔄
          </button>
          <Link
            href="/tutorials"
            className="text-sm text-[#15803d] dark:text-[#4ADE80] hover:underline"
          >
            ব্রাউজিং চালিয়ে যান →
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          সমস্যা থাকলে আমাদের <a href="mailto:support@devschool.com" className="underline">সাপোর্টে</a> জানান
        </p>
      </div>
    </div>
  )
}