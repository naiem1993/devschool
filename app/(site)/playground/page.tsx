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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
      <section className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-[#0b0f19] dark:to-indigo-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">হোম</Link></li>
              <li aria-hidden>/</li>
              <li className="text-slate-800 dark:text-slate-200 font-medium">প্লেগ্রাউন্ড</li>
            </ol>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">🎮 কোড প্লেগ্রাউন্ড</h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            ব্রাউজারেই কোড লিখুন, সাথে সাথে চালান। কোনো সেটআপ নেই, কোনো ইনস্টল নেই।
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold"> শুধু লিখো, রান করো, শেখো।</span>
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <PlaygroundClient />
      </div>
    </div>
  )
}
