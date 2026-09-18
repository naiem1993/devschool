import { Metadata } from 'next'
import Link from 'next/link'
import Base64Tool from '@/components/tools/Base64Tool'

export const metadata: Metadata = {
  title: 'Base64 Encode / Decode — DevSchool',
  description:
    'যেকোনো টেক্সট (বাংলাসহ) Base64-এ encode বা decode করুন — সম্পূর্ণ ব্রাউজারে, কোনো ডেটা কোথাও পাঠানো হয় না।',
  keywords: ['base64', 'encode', 'decode', 'converter', 'utf-8', 'DevSchool'],
  alternates: { canonical: '/tools/base64' },
  openGraph: {
    title: 'Base64 Encode / Decode | DevSchool',
    description: 'টেক্সট থেকে Base64 — ব্রাউজারেই, নিরাপদে।',
    type: 'website',
    url: '/tools/base64',
    siteName: 'DevSchool',
    locale: 'bn_BD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 Encode / Decode | DevSchool',
    description: 'টেক্সট থেকে Base64 — ব্রাউজারেই, নিরাপদে।',
  },
}

export default function Base64Page() {
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
              <li className="text-slate-800 dark:text-slate-200 font-medium">Base64</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
              Base64 Encode / Decode
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              বাংলা, ইমোজি — যেকোনো টেক্সট নিরাপদে Base64-এ রূপান্তর করুন বা ফিরিয়ে আনুন।
              সবকিছু আপনার ব্রাউজারেই চলে, কোনো ডেটা সার্ভারে যায় না।
            </p>
          </div>
        </div>
      </section>

      {/* ══════════ TOOL ══════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <Base64Tool />
      </div>
    </div>
  )
}
