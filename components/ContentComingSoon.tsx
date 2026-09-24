'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDict } from '@/lib/i18n/I18nProvider'
import { localeHref, stripLocale } from '@/lib/i18n/link'

/**
 * /en পেজে দেখানো temporary placeholder।
 * কারণ: DB-তে 'hero_en' এখনো লেখা হয়নি — অর্থাৎ admin ইংরেজি
 * হিরো এখনো তৈরি করেননি। শীঘ্রই আসবে, ততক্ষণ বাংলা পেজে পাঠাই।
 */
export default function ContentComingSoon() {
  const dict = useDict()
  const pathname = usePathname()
  const { path } = stripLocale(pathname || '/')

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#F2FBF4] via-[#F2FBF4] to-[#E8F7ED] dark:from-[#050806] dark:via-[#050806] dark:to-[#050806] text-slate-900 dark:text-white border-b border-emerald-200/70 dark:border-slate-800"
    >
      {/* green glow */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[820px] max-w-[110vw] h-[260px] rounded-full bg-[#22C55E]/10 dark:bg-[#22C55E]/18 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 min-h-[60vh] flex flex-col items-center justify-center text-center">
        {/* badge */}
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#15803D] dark:text-[#4ADE80] text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          {dict.home.comingSoonBadge}
        </span>

        {/* title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
          {dict.home.comingSoonTitle}
        </h1>

        {/* message */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mb-8">
          {dict.home.comingSoonMessage}
        </p>

        {/* CTA — back to Bengali version */}
        <Link
          href={localeHref('bn', path)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#22C55E] text-[#050806] text-sm font-bold transition hover:bg-[#4ADE80] hover:shadow-[0_0_24px_rgba(34,197,94,0.35)]"
        >
          {dict.home.comingSoonCta} →
        </Link>
      </div>
    </section>
  )
}
