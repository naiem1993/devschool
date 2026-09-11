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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
      <section className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50 via-white to-indigo-50 dark:from-slate-950 dark:via-[#0b0f19] dark:to-emerald-950/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-extrabold tracking-tight">📊 আমার অগ্রগতি</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
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
