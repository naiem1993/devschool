import Link from 'next/link'

// ─────────────────────────────────────────────────────────────
//  DevSchool — Chapter not found
//  [chapter] segment-এ notFound() এর লোকাল boundary।
//  ⚠️ এটা না থাকলে notFound() [slug] পর্যন্ত bubble করে React 19
//     dev overlay-এ "Performance.measure negative timestamp" দেখায়।
//  Brand: Neon Green #22C55E  •  bg #050806
// ─────────────────────────────────────────────────────────────

export const metadata = {
  title: 'চ্যাপ্টারটি পাওয়া যায়নি | DevSchool',
  robots: { index: false, follow: false },
}

export default function ChapterNotFound() {
  return (
    <main className="relative min-h-[70vh] overflow-hidden bg-[#f2fbf4] dark:bg-[#050806] text-slate-900 dark:text-slate-100 flex items-center justify-center px-4 py-16">
      {/* soft radial green glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[760px] max-w-[140vw]"
        style={{
          background:
            'radial-gradient(ellipse at center top, rgba(34,197,94,0.16), rgba(34,197,94,0.05) 45%, transparent 72%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md text-center">
        {/* icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#22C55E]/35 bg-[#22C55E]/10 text-3xl">
          📄
        </div>

        {/* status pill */}
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#15803d] dark:text-[#4ADE80]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            Chapter Not Found
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          এই চ্যাপ্টারটি নেই
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          আপনি যে চ্যাপ্টারটি খুঁজছেন তা নেই, নম্বরটি ভুল, অথবা এখনো প্রকাশ করা হয়নি।
        </p>

        {/* CTAs */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/tutorials"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-6 py-3 text-sm font-bold text-[#050806] transition hover:bg-[#4ADE80] hover:shadow-[0_0_28px_rgba(34,197,94,0.45)]"
          >
            <span aria-hidden>📚</span> সব টিউটোরিয়াল
          </Link>
          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#22C55E] hover:text-[#15803d] dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:border-[#22C55E]/60 dark:hover:text-[#4ADE80]"
          >
            <span aria-hidden>🏠</span> হোমপেজ
          </Link>
        </div>
      </div>
    </main>
  )
}
