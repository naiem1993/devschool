// TEMPORARILY DISABLED FOR DEBUG — হোম ও সাইট রুটের জন্য skeleton
// ব্র্যান্ড-সামঞ্জস্যপূর্ণ লোডিং UI দেখায়।
export default function SiteLoading() {
  return (
    <div className="min-h-[80vh] bg-[#F2FBF4] dark:bg-[#050806] pt-28 pb-20 lg:pt-32 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
        {/* বাম দিক — কপি skeleton */}
        <div className="text-center lg:text-left space-y-5">
          <div className="inline-block h-7 w-44 rounded-full bg-[#22C55E]/10 animate-pulse" />
          <div className="space-y-3">
            <div className="h-12 sm:h-14 w-full max-w-xl mx-auto lg:mx-0 rounded-2xl bg-slate-200/70 dark:bg-white/[0.06] animate-pulse" />
            <div className="h-12 sm:h-14 w-4/5 max-w-md mx-auto lg:mx-0 rounded-2xl bg-slate-200/70 dark:bg-white/[0.06] animate-pulse" />
          </div>
          <div className="h-4 w-3/4 max-w-md mx-auto lg:mx-0 rounded bg-slate-200/60 dark:bg-white/[0.05] animate-pulse" />
          <div className="h-14 w-full max-w-md mx-auto lg:mx-0 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 animate-pulse" />
          <div className="flex gap-3 justify-center lg:justify-start">
            <div className="h-12 w-40 rounded-2xl bg-[#22C55E]/30 animate-pulse" />
            <div className="h-12 w-40 rounded-2xl bg-slate-200/70 dark:bg-white/[0.06] animate-pulse" />
          </div>
        </div>

        {/* ডান দিক — এডিটর skeleton */}
        <div className="space-y-4">
          <div className="h-16 rounded-2xl bg-white dark:bg-[#0b0f0d] border border-slate-200 dark:border-white/10 animate-pulse" />
          <div className="h-72 rounded-2xl bg-white dark:bg-[#0b0f0d] border border-slate-200 dark:border-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
