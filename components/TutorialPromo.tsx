import Link from 'next/link'
import { SIDEBAR_TEXT } from '@/lib/i18n/sidebar-text'

export default function TutorialPromo({
  chapterCount,
  currentChapter,
  locale = 'bn',
}: {
  chapterCount: number
  currentChapter?: number
  locale?: 'bn' | 'en'
}) {
  const t = SIDEBAR_TEXT[locale]
  const progress = chapterCount
    ? Math.round(((currentChapter || 0) / chapterCount) * 100)
    : 0

  return (
    <aside className="hidden lg:block w-[260px] flex-shrink-0">
      <div className="sticky top-[128px] space-y-4">
        {/* DevSchool Pro */}
        <div className="rounded-xl border border-emerald-200/70 dark:border-emerald-900/40 bg-gradient-to-br from-[#22C55E]/10 to-[#10B981]/5 dark:from-[#22C55E]/10 dark:to-[#10B981]/5 p-5 text-center">
          <div className="text-3xl mb-2">🚀</div>
          <h3 className="font-bold text-[#15803d] dark:text-[#4ADE80] mb-1">
            {t.proTitle}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
            {t.proDesc}
          </p>
          <Link
            href="/about"
            className="block w-full py-2 rounded-lg bg-[#22C55E] text-[#050806] text-sm font-semibold hover:bg-[#4ADE80] transition-colors"
          >
            {t.proBtn}
          </Link>
        </div>

        {/* Progress */}
        {chapterCount > 0 && (
          <div className="rounded-xl border border-emerald-200/70 dark:border-emerald-900/40 bg-white dark:bg-[#0a0f0c] p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📊</span>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                {t.progressTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              {currentChapter || 0} / {chapterCount} {t.chapterLabel}
            </p>
            <div className="w-full h-2 rounded-full bg-emerald-100 dark:bg-emerald-950/40 overflow-hidden">
              <div
                className="h-full bg-[#22C55E] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Ad slot placeholder */}
        <div className="rounded-xl border border-dashed border-emerald-200/60 dark:border-emerald-900/40 bg-[#E8F7ED]/40 dark:bg-[#080c0a] p-6 text-center">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
            {t.adSpace}
          </p>
        </div>
      </div>
    </aside>
  )
}