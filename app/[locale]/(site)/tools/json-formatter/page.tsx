import { Metadata } from 'next'
import Link from 'next/link'
import JsonFormatter from '@/components/tools/JsonFormatter'

export const metadata: Metadata = {
  title: 'JSON Formatter — DevSchool',
  description:
    'এলোমেলো JSON পরিষ্কারভাবে ফরম্যাট, মিনিফাই ও ভ্যালিডেট করুন — সম্পূর্ণ ব্রাউজারে, কোনো ডেটা কোথাও পাঠানো হয় না।',
  keywords: ['json formatter', 'json beautifier', 'json validator', 'minify json', 'DevSchool'],
  alternates: { canonical: '/tools/json-formatter' },
  openGraph: {
    title: 'JSON Formatter | DevSchool',
    description: 'JSON ফরম্যাট, মিনিফাই ও ভ্যালিডেট — ব্রাউজারেই।',
    type: 'website',
    url: '/tools/json-formatter',
    siteName: 'DevSchool',
    locale: 'bn_BD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Formatter | DevSchool',
    description: 'JSON ফরম্যাট, মিনিফাই ও ভ্যালিডেট — ব্রাউজারেই।',
  },
}

export default function JsonFormatterPage() {
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

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-[#22C55E] transition">
                  হোম
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/tools" className="hover:text-[#22C55E] transition">
                  টুলস
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-slate-800 dark:text-slate-200 font-medium">JSON Formatter</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
              JSON Formatter
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              এলোমেলো JSON পরিষ্কারভাবে সাজান, মিনিফাই করুন, ভুল থাকলে লাইন-কলাম ধরে ধরিয়ে
              দিন। সবকিছু আপনার ব্রাউজারেই চলে — কোনো ডেটা সার্ভারে যায় না।
            </p>
          </div>
        </div>
      </section>

      {/* ══════════ TOOL ══════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <JsonFormatter />
      </div>
    </div>
  )
}
