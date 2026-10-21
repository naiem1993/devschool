'use client'

import type { Locale } from '@/lib/i18n/config'
import type { AffiliateItem } from './AffiliateGrid'

export default function ShopCard({
  locale,
  products,
  onBrowseAll,
}: {
  locale: Locale
  products: AffiliateItem[]
  onBrowseAll: () => void
}) {
  const isBn = locale === 'bn'
  const preview = products.slice(0, 3)

  return (
    <div className='relative rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900/80 dark:to-slate-950/90 border border-slate-200 dark:border-white/[0.06] p-6 sm:p-7 hover:border-emerald-500/40 transition-colors flex flex-col'>
      {/* Top badges */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20'>
          <span className='text-xs'>🛒</span>
          <span className='text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider'>
            {isBn ? 'ধরন ০১' : 'Option 01'}
          </span>
        </div>
        <span className='text-[10px] text-slate-500 font-mono uppercase tracking-wider'>Affiliate</span>
      </div>

      {/* Title + desc */}
      <h2 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2'>
        {isBn ? 'রেকমেন্ডেড প্রোডাক্ট' : 'Recommended Products'}
      </h2>
      <p className='text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6'>
        {isBn
          ? 'আপনার শেখার যাত্রায় সহায়ক কিছু বাছাই করা প্রোডাক্ট ও রিসোর্স।'
          : 'Handpicked products and resources to support your learning journey.'}
      </p>

      {/* Product preview */}
      {preview.length > 0 ? (
        <div className='space-y-2.5 mb-4'>
          {preview.map((p) => {
            const title = isBn ? p.titleBn : p.titleEn || p.titleBn
            return (
              <a
                key={p.id}
                href={`/api/affiliates/${p.id}/click`}
                target='_blank'
                rel='sponsored nofollow noopener noreferrer'
                className='w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] hover:bg-white dark:hover:bg-white/[0.04] hover:border-slate-300 dark:hover:border-white/10 transition-all group'
              >
                <div className='w-9 h-9 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] flex items-center justify-center text-base shrink-0'>
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={title} className='w-full h-full object-contain rounded-lg' />
                  ) : (
                    '🛍️'
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-sm font-semibold text-slate-900 dark:text-white truncate'>{title}</div>
                  {(isBn ? p.descriptionBn : p.descriptionEn || p.descriptionBn) && (
                    <div className='text-[10px] text-slate-500 dark:text-slate-400 truncate'>
                      {isBn ? p.descriptionBn : p.descriptionEn || p.descriptionBn}
                    </div>
                  )}
                </div>
                <div className='text-right shrink-0'>
                  {p.priceLabel && (
                    <div className='text-xs font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap'>
                      {p.priceLabel}
                    </div>
                  )}
                  <div className='text-[10px] text-slate-500 group-hover:text-emerald-500 transition-colors'>
                    {isBn ? 'দেখুন →' : 'Visit →'}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      ) : (
        <div className='flex-1 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400 py-8'>
          {isBn ? 'শীঘ্রই আসছে...' : 'Coming soon...'}
        </div>
      )}

      {/* Browse all button */}
      <button
        type='button'
        onClick={onBrowseAll}
        className='mt-auto flex items-center justify-center gap-1.5 w-full py-3 rounded-xl bg-emerald-500 text-[#04140a] text-sm font-bold hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all'
      >
        {isBn ? 'সব product দেখুন' : 'Browse All Picks'}
        <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth={2.5} viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3' />
        </svg>
      </button>
    </div>
  )
}
