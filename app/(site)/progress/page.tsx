import { Metadata } from 'next'
import ProgressClient from './ProgressClient'

export const metadata: Metadata = {
  title: 'আমার অগ্রগতি — DevSchool',
  description: 'আপনার কুইজ ও চ্যালেঞ্জ অগ্রগতি দেখুন। সব ডেটা আপনার ডিভাইসে সংরক্ষিত।',
  alternates: { canonical: '/progress' },
  robots: { index: false, follow: false },
}

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050806] text-slate-900 dark:text-slate-100">
      {/* ══════════ HERO — clean black + single green glow ══════════ */}
      <section className="relative overflow-hidden bg-[#f6f8f7] dark:bg-[#050806] border-b border-slate-200 dark:border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[820px] max-w-full"
          style={{
            background:
              'radial-gradient(ellipse at center top, rgba(34,197,94,0.18), rgba(34,197,94,0.06) 45%, transparent 72%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-2">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="text-slate-800 dark:text-slate-200 font-medium">ড্যাশবোর্ড</li>
            </ol>
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">আমার অগ্রগতি</h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            আপনার কুইজ ও চ্যালেঞ্জের অগ্রগতি দেখুন। সব ডেটা আপনার ব্রাউজারে securely সংরক্ষিত —
            কোনো লগইন লাগে না। ব্রাউজার ক্লিয়ার করলে ডেটা রিসেট হবে।
          </p>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProgressClient />
      </div>
    </div>
  )
}
