import { Metadata } from 'next'
import Link from 'next/link'
import ColorPickerTool from '@/components/tools/ColorPickerTool'

export const metadata: Metadata = {
  title: 'Color Picker — DevSchool',
  description:
    'HEX, RGB ও HSL-এর মধ্যে রঙ কনভার্ট করুন, শেড ও হারমোনি palette বানান, WCAG কনট্রাস্ট দেখুন — সম্পূর্ণ ব্রাউজারে।',
  keywords: ['color picker', 'hex to rgb', 'rgb to hex', 'hsl', 'palette', 'contrast', 'DevSchool'],
  alternates: { canonical: '/tools/color-picker' },
  openGraph: {
    title: 'Color Picker | DevSchool',
    description: 'রঙ কনভার্ট, palette ও কনট্রাস্ট — ব্রাউজারেই।',
    type: 'website',
    url: '/tools/color-picker',
    siteName: 'DevSchool',
    locale: 'bn_BD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color Picker | DevSchool',
    description: 'রঙ কনভার্ট, palette ও কনট্রাস্ট — ব্রাউজারেই।',
  },
}

export default function ColorPickerPage() {
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
              <li className="text-slate-800 dark:text-slate-200 font-medium">Color Picker</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
              Color Picker
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              রঙ বেছে নিন, HEX · RGB · HSL-এ রূপান্তর করুন, শেড ও হারমোনি palette বানান,
              আর WCAG কনট্রাস্ট যাচাই করুন — সবকিছু আপনার ব্রাউজারেই চলে।
            </p>
          </div>
        </div>
      </section>

      {/* ══════════ TOOL ══════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <ColorPickerTool />
      </div>
    </div>
  )
}
