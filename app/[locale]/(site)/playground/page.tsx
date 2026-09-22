import { Metadata } from 'next'
import Link from 'next/link'
import PlaygroundClient from './PlaygroundClient'

export const metadata: Metadata = {
  title: 'কোড প্লেগ্রাউন্ড — লিখুন, চালান, শিখুন | DevSchool',
  description:
    'ব্রাউজারেই JavaScript, TypeScript, HTML, CSS কোড লিখুন, সাথে সাথেই চালান। কোনো সেটআপ নেই, কোনো ইনস্টল নেই।',
  keywords: ['playground', 'code editor', 'javascript', 'live code', 'DevSchool'],
  alternates: { canonical: '/playground' },
  openGraph: {
    title: 'কোড প্লেগ্রাউন্ড | DevSchool',
    description: 'ব্রাউজারেই কোড লিখুন ও চালান।',
    type: 'website',
    url: '/playground',
    siteName: 'DevSchool',
    locale: 'bn_BD',
  },
  twitter: { card: 'summary_large_image', title: 'কোড প্লেগ্রাউন্ড | DevSchool', description: 'ব্রাউজারেই কোড লিখুন ও চালান।' },
}

export default function PlaygroundPage() {
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

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-2">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-[#22C55E] transition">হোম</Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-slate-800 dark:text-slate-200 font-medium">প্লেগ্রাউন্ড</li>
            </ol>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
            কোড প্লেগ্রাউন্ড
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            ব্রাউজারেই কোড লিখুন, সাথে সাথে চালান। কোনো সেটআপ নেই, কোনো ইনস্টল নেই।{' '}
            <span className="text-[#22C55E] font-semibold">শুধু লিখো, রান করো, শেখো।</span>
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <PlaygroundClient />
      </div>
    </div>
  )
}
