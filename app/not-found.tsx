import Link from 'next/link'

// ─────────────────────────────────────────────────────────────
//  DevSchool — Global 404 (Not Found)
//  Brand: Neon Green #22C55E / #4ADE80  •  bg #050806
//  Design language: hero-এর মতো soft radial green glow
// ─────────────────────────────────────────────────────────────

export const metadata = {
  title: '৪০৪ — পেজটি পাওয়া যায়নি | DevSchool',
  description: 'আপনি যে পেজটি খুঁজছেন সেটি নেই বা সরিয়ে ফেলা হয়েছে।',
  robots: { index: false, follow: false },
}

const QUICK_LINKS = [
  { href: '/categories', label: 'ক্যাটাগরি', icon: '📚' },
  { href: '/challenges', label: 'চ্যালেঞ্জ', icon: '⚡' },
  { href: '/references', label: 'রেফারেন্স', icon: '📖' },
  { href: '/search', label: 'সার্চ', icon: '🔍' },
]

export default function NotFound() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#f2fbf4] dark:bg-[#050806] text-slate-900 dark:text-slate-100 flex items-center justify-center px-4 py-16">
      {/* ─── soft radial green glow (hero-এর মতো) ─── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[560px] w-[900px] max-w-[140vw]"
        style={{
          background:
            'radial-gradient(ellipse at center top, rgba(34,197,94,0.20), rgba(34,197,94,0.07) 45%, transparent 72%)',
        }}
      />
      {/* ─── subtle grid texture ─── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,197,94,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 78%)',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* ─── Big mono 404 ─── */}
        <div className="relative inline-block mb-2">
          <span
            className="block font-mono text-[104px] sm:text-[148px] font-black leading-none tracking-tighter text-[#22C55E]"
            style={{ textShadow: '0 0 60px rgba(34,197,94,0.45)' }}
          >
            404
          </span>
          {/* glowing dot */}
          <span
            aria-hidden
            className="absolute -right-2 top-2 h-3 w-3 rounded-full bg-[#4ADE80] shadow-[0_0_24px_6px_rgba(74,222,128,0.65)]"
          />
        </div>

        {/* ─── status pill ─── */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#15803d] dark:text-[#4ADE80]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            Page Not Found
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          পেজটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mt-4 mx-auto max-w-lg text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
          আপনি যে লিংকটি খুলেছেন তা ভুল, মুছে ফেলা হয়েছে, অথবা কখনোই ছিল না।
          নিচের অপশন থেকে শেখা চালিয়ে যান।
        </p>

        {/* ─── CTAs ─── */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-6 py-3 text-sm font-bold text-[#050806] transition hover:bg-[#4ADE80] hover:shadow-[0_0_28px_rgba(34,197,94,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050806]"
          >
            <span aria-hidden>🏠</span> হোমপেজে ফিরে যান
          </Link>
          <Link
            href="/search"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#22C55E] hover:text-[#15803d] dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:border-[#22C55E]/60 dark:hover:text-[#4ADE80]"
          >
            <span aria-hidden>🔍</span> কিছু খুঁজুন
          </Link>
        </div>

        {/* ─── Quick links ─── */}
        <div className="mt-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            জনপ্রিয় বিভাগ
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group rounded-2xl border border-slate-200 bg-white/70 p-4 text-center backdrop-blur transition hover:-translate-y-0.5 hover:border-[#22C55E]/50 hover:shadow-[0_8px_30px_rgba(34,197,94,0.12)] dark:border-white/5 dark:bg-white/[0.02]"
              >
                <span className="block text-2xl mb-2 transition group-hover:scale-110">{l.icon}</span>
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {l.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── footer line ─── */}
        <p className="mt-12 font-mono text-[11px] text-slate-400 dark:text-slate-600">
          DevSchool · বিনামূল্যে প্রোগ্রামিং শিখুন
        </p>
      </div>
    </main>
  )
}
