'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/i18n/config'
import AffiliateGrid, { type AffiliateItem } from './AffiliateGrid'

export type ShopCategory = {
  id: string
  slug: string
  nameBn: string
  nameEn: string | null
  icon: string | null
  description: string | null
  count: number
}

export default function ShopView({
  locale,
  categories,
  products,
}: {
  locale: Locale
  categories: ShopCategory[]
  products: AffiliateItem[]
}) {
  const isBn = locale === 'bn'
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  const activeCategory = activeSlug ? categories.find((c) => c.slug === activeSlug) : null

  // ── Product view (category selected) ──
  if (activeCategory) {
    const items = products.filter((p) => p.category === activeCategory.slug)
    const catName = isBn ? activeCategory.nameBn : activeCategory.nameEn || activeCategory.nameBn

    return (
      <div className='max-w-6xl mx-auto'>
        {/* Back button */}
        <button
          type='button'
          onClick={() => setActiveSlug(null)}
          className='inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#22C55E] dark:hover:text-[#22C55E] mb-6 transition-colors'
        >
          <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2.2} strokeLinecap='round' strokeLinejoin='round'>
            <path d='M19 12H5M12 19l-7-7 7-7' />
          </svg>
          {isBn ? 'সব ক্যাটাগরি' : 'All categories'}
        </button>

        <div className='text-center mb-8'>
          <div className='text-5xl mb-3'>{activeCategory.icon || '📦'}</div>
          <h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-1'>{catName}</h2>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            {items.length} {isBn ? 'টি product' : 'products'}
          </p>
        </div>

        <AffiliateGrid items={items} locale={locale} />
      </div>
    )
  }

  // ── Category grid view (default) ──
  if (categories.length === 0) {
    return (
      <div className='text-center py-16 max-w-md mx-auto'>
        <div className='text-6xl mb-4'>🛍️</div>
        <p className='text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2'>
          {isBn ? 'শীঘ্রই আসছে' : 'Coming soon'}
        </p>
        <p className='text-sm text-slate-500 dark:text-slate-400'>
          {isBn ? 'আমি এখনো কিছু recommend করিনি — শীঘ্রই আসবে 💚' : 'I have not recommended anything yet — coming soon 💚'}
        </p>
      </div>
    )
  }

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='text-center mb-10 max-w-3xl mx-auto'>
        <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3'>
          🛒 Shop
        </h2>
        <p className='text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed'>
          {isBn
            ? 'আপনার শেখার জন্য বাছাই করা প্রোডাক্ট ও রিসোর্স, ক্যাটাগরি অনুযায়ী সাজানো। এখান থেকে কিনলে আপনার দাম একই থাকে, DevSchool ছোট commission পায়। 💚'
            : 'Recommended products and resources to support your learning, organized by category. Your price stays the same, DevSchool gets a small commission. 💚'}
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
        {categories.map((c) => {
          const name = isBn ? c.nameBn : c.nameEn || c.nameBn
          return (
            <button
              key={c.id}
              type='button'
              onClick={() => setActiveSlug(c.slug)}
              disabled={c.count === 0}
              className={
                'group relative flex flex-col items-center justify-center text-center gap-3 rounded-3xl border p-6 sm:p-8 transition-all duration-300 ' +
                (c.count === 0
                  ? 'border-slate-200 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.02] opacity-60 cursor-not-allowed'
                  : 'border-slate-200 dark:border-white/[0.08] bg-gradient-to-b from-white to-slate-50 dark:from-slate-900/80 dark:to-slate-950/90 hover:border-[#22C55E]/40 dark:hover:border-[#22C55E]/40 hover:shadow-xl hover:shadow-[#22C55E]/10 hover:-translate-y-1')
              }
            >
              <span className='text-4xl sm:text-5xl leading-none'>{c.icon || '📦'}</span>
              <span className='font-semibold text-slate-900 dark:text-white text-sm sm:text-base leading-tight'>
                {name}
              </span>
              <span className='text-xs text-slate-500 dark:text-slate-400'>
                {c.count > 0
                  ? `${c.count} ${isBn ? 'টি product' : 'products'}`
                  : isBn
                    ? 'শীঘ্রই আসছে'
                    : 'Coming soon'}
              </span>
              {c.count > 0 && (
                <span className='mt-1 text-[#22C55E] opacity-0 group-hover:opacity-100 transition-opacity'>
                  <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2.2} strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M5 12h14M12 5l7 7-7 7' />
                  </svg>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
