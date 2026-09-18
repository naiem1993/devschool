import { Metadata } from 'next'
import Link from 'next/link'
import LoremIpsumTool from '@/components/tools/LoremIpsumTool'

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator — DevSchool',
  description:
    'ডেমো টেক্সট (placeholder) তৈরি করুন — প্যারা, বাক্য বা শব্দ অনুযায়ী, HTML ট্যাগ সহ। সম্পূর্ণ ব্রাউজারে।',
  keywords: ['lorem ipsum', 'placeholder', 'dummy text', 'generator', 'DevSchool'],
  alternates: { canonical: '/tools/lorem-ipsum' },
  openGraph: {
    title: 'Lorem Ipsum Generator | DevSchool',
    description: 'ডেমো টেক্সট তৈরি — প্যারা, বাক্য বা শব্দ। ব্রাউজারেই।',
    type: 'website',
    url: '/tools/lorem-ipsum',
    siteName: 'DevSchool',
    locale: 'bn_BD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lorem Ipsum Generator | DevSchool',
    description: 'ডেমো টেক্সট তৈরি — প্যারা, বাক্য বা শব্দ। ব্রাউজারেই।',
  },
}

export default function LoremIpsumPage() {
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
              <li className="text-slate-800 dark:text-slate-200 font-medium">Lorem Ipsum</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
              Lorem Ipsum
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              ডিজাইন বা লেআউট টেস্ট করার জন্য ডেমো টেক্সট তৈরি করুন — প্যারা, বাক্য বা
              শব্দ অনুযায়ী, ইচ্ছে হলে HTML ট্যাগ সহ। সবকিছু আপনার ব্রাউজারেই চলে।
            </p>
          </div>
        </div>
      </section>

      {/* ══════════ TOOL ══════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <LoremIpsumTool />
      </div>
    </div>
  )
}
