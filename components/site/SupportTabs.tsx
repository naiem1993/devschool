'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/i18n/config'
import type { AffiliateItem } from './AffiliateGrid'
import ShopView, { type ShopCategory } from './ShopView'
import DonateCard from './DonateCard'
import ShopCard from './ShopCard'

export default function SupportTabs({
  locale,
  affiliates,
  categories,
  donationEnabled = true,
  shopEnabled = true,
}: {
  locale: Locale
  affiliates: AffiliateItem[]
  categories: ShopCategory[]
  donationEnabled?: boolean
  shopEnabled?: boolean
}) {
  const isBn = locale === 'bn'
  const [view, setView] = useState<'main' | 'shop'>('main')
  const bothDisabled = !donationEnabled && !shopEnabled

  // ══════════ SHOP DRILL-DOWN VIEW ══════════
  if (view === 'shop') {
    return (
      <div className='w-full max-w-6xl mx-auto'>
        {/* Back button */}
        <button
          type='button'
          onClick={() => setView('main')}
          className='inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 mb-8 transition-colors group'
        >
          <svg
            className='w-4 h-4 group-hover:-translate-x-1 transition-transform'
            fill='none'
            stroke='currentColor'
            strokeWidth={2.2}
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M19 12H5M12 19l-7-7 7-7' />
          </svg>
          {isBn ? 'ফিরে যান' : 'Back'}
        </button>

        <ShopView locale={locale} categories={categories} products={affiliates} />
      </div>
    )
  }

  // ══════════ BOTH DISABLED ══════════
  if (bothDisabled) {
    return (
      <div className='text-center py-20 max-w-md mx-auto'>
        <div className='text-6xl mb-4'>🛍️</div>
        <p className='text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2'>
          {isBn ? 'শীঘ্রই আসছে' : 'Coming soon'}
        </p>
        <p className='text-sm text-slate-500 dark:text-slate-400'>
          {isBn ? 'আমরা কিছু নতুন জিনিস নিয়ে আসছি — অপেক্ষা করুন 💚' : 'We are preparing something new — stay tuned 💚'}
        </p>
      </div>
    )
  }

  // ══════════ MAIN VIEW — SPLIT CARDS ══════════
  const cardCount = (donationEnabled ? 1 : 0) + (shopEnabled ? 1 : 0)

  return (
    <div className='w-full'>
      {/* ── Cards grid ── */}
      <div className={`grid gap-5 mb-12 ${cardCount === 2 ? 'md:grid-cols-2' : 'max-w-lg mx-auto'}`}>
        {shopEnabled && (
          <ShopCard locale={locale} products={affiliates} onBrowseAll={() => setView('shop')} />
        )}
        {donationEnabled && <DonateCard locale={locale} />}
      </div>

      {/* ── Trust strip ── */}
      <div>
        <div className='h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent mb-8' />
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-center'>
          <div>
            <div className='inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-3'>
              <svg className='w-5 h-5 text-emerald-500 dark:text-emerald-400' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
              </svg>
            </div>
            <div className='text-sm font-semibold text-slate-900 dark:text-white mb-1'>
              {isBn ? 'নিরাপদ' : 'Secure'}
            </div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>
              {isBn ? 'সরাসরি পেমেন্ট' : 'Direct payment methods'}
            </div>
          </div>
          <div>
            <div className='inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-3'>
              <svg className='w-5 h-5 text-emerald-500 dark:text-emerald-400' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
              </svg>
            </div>
            <div className='text-sm font-semibold text-slate-900 dark:text-white mb-1'>
              {isBn ? 'কোনো বাড়তি খরচ নেই' : 'No Extra Cost'}
            </div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>
              {isBn ? 'আপনার দাম একই থাকে' : 'Your price stays the same'}
            </div>
          </div>
          <div>
            <div className='inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-3'>
              <svg className='w-5 h-5 text-emerald-500 dark:text-emerald-400' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
            </div>
            <div className='text-sm font-semibold text-slate-900 dark:text-white mb-1'>
              {isBn ? 'সরাসরি প্রভাব' : 'Instant Impact'}
            </div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>
              {isBn ? 'আজকের সার্ভার খরচে' : 'Server costs today'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
