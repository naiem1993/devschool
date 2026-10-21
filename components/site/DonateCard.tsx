'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n/config'
import { localeHref } from '@/lib/i18n/link'

const METHODS = [
  { id: 'bkash', name: 'bKash', number: '01700-000000', color: '#E2136E', initial: 'b' },
  { id: 'nagad', name: 'Nagad', number: '01700-000000', color: '#F58220', initial: 'N' },
  { id: 'rocket', name: 'Rocket', number: '01700-000000-1', color: '#8C3494', initial: 'R' },
]

export default function DonateCard({ locale }: { locale: Locale }) {
  const isBn = locale === 'bn'
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copy = async (id: string, num: string) => {
    try {
      await navigator.clipboard.writeText(num.replace(/-/g, ''))
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      /* clipboard denied — ignore */
    }
  }

  return (
    <div className='relative rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900/80 dark:to-slate-950/90 border border-slate-200 dark:border-white/[0.06] p-6 sm:p-7 hover:border-emerald-500/40 transition-colors'>
      {/* Top badges */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20'>
          <span className='text-xs'>💝</span>
          <span className='text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider'>
            {isBn ? 'ধরন ০২' : 'Option 02'}
          </span>
        </div>
        <span className='text-[10px] text-slate-500 font-mono uppercase tracking-wider'>
          {isBn ? 'সরাসরি' : 'Direct'}
        </span>
      </div>

      {/* Title + desc */}
      <h2 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2'>
        {isBn ? 'সরাসরি ডোনেট করুন' : 'Send a Donation'}
      </h2>
      <p className='text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6'>
        {isBn
          ? 'আপনার ১০০% contribution যায় সার্ভার খরচ, ডোমেইন ও কন্টেন্টে।'
          : '100% goes directly to server costs, domain renewal, and content production.'}
      </p>

      {/* Payment methods */}
      <div className='space-y-2.5'>
        {METHODS.map((m) => {
          const isCopied = copiedId === m.id
          return (
            <button
              key={m.id}
              type='button'
              onClick={() => copy(m.id, m.number)}
              className='w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] hover:bg-white dark:hover:bg-white/[0.04] hover:border-slate-300 dark:hover:border-white/10 transition-all group text-left'
            >
              <div className='flex items-center gap-3'>
                <div
                  className='w-9 h-9 rounded-lg flex items-center justify-center shrink-0'
                  style={{ backgroundColor: `${m.color}1a`, border: `1px solid ${m.color}33` }}
                >
                  <span className='text-sm font-black' style={{ color: m.color }}>
                    {m.initial}
                  </span>
                </div>
                <div>
                  <div className='text-sm font-semibold text-slate-900 dark:text-white'>{m.name}</div>
                  <div className='text-[10px] text-slate-500 dark:text-slate-400 font-mono'>
                    {isBn ? 'পার্সোনাল' : 'Personal Account'}
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='font-mono text-xs font-semibold whitespace-nowrap' style={{ color: m.color }}>
                  {m.number}
                </div>
                {isCopied ? (
                  <svg
                    className='w-3.5 h-3.5 text-emerald-500'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2.5'
                    viewBox='0 0 24 24'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                  </svg>
                ) : (
                  <svg
                    className='w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                    />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Note */}
      <p className='text-[11px] text-slate-500 dark:text-slate-400 mt-5 leading-relaxed'>
        {isBn
          ? '💌 পাঠানোর পর Transaction ID জানান — thank-you পেজে আপনার নাম যোগ করব।'
          : "💌 After sending, share your Transaction ID — we'll add your name to the thank-you page."}
      </p>

      {/* Supporters Link */}
      <div className='mt-6 pt-5 border-t border-slate-100 dark:border-white/[0.06]'>
        <Link
          href={localeHref(locale, '/supporters')}
          className='group inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-emerald-600 dark:hover:text-emerald-400 transition-all'
        >
          <span>💚</span>
          {isBn ? 'সাপোর্টারদের দেখুন' : 'View Supporters'}
          <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' strokeWidth={2.2} viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3' />
          </svg>
        </Link>
      </div>
    </div>
  )
}
