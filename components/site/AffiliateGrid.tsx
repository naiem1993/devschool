'use client'

import Image from 'next/image'
import type { Locale } from '@/lib/i18n/config'

export type AffiliateItem = {
  id: string
  titleBn: string
  titleEn: string | null
  descriptionBn: string | null
  descriptionEn: string | null
  imageUrl: string | null
  category: string
  priceLabel: string | null
  badge: string | null
}

export default function AffiliateGrid({
  items,
  locale,
}: {
  items: AffiliateItem[]
  locale: Locale
}) {
  const isBn = locale === 'bn'

  if (items.length === 0) {
    return (
      <p className='text-center text-sm text-slate-500 dark:text-slate-400 py-10'>
        {isBn ? 'এই ক্যাটাগরিতে এখনো কোনো product নেই।' : 'No products in this category yet.'}
      </p>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
      {items.map((item) => {
        const title = isBn ? item.titleBn : item.titleEn || item.titleBn
        const desc = isBn ? item.descriptionBn : item.descriptionEn || item.descriptionBn
        return (
          <a
            key={item.id}
            href={`/api/affiliates/${item.id}/click`}
            target='_blank'
            rel='sponsored nofollow noopener noreferrer'
            className='ds-card group relative flex flex-col p-5 hover:border-[#22C55E] dark:hover:border-[#22C55E] hover:shadow-lg hover:shadow-[#22C55E]/15 transition-all'
          >
            {item.badge && (
              <span className='absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#22C55E] text-[#04140a]'>
                {item.badge}
              </span>
            )}

            <div className='flex items-start gap-3 mb-3'>
              {item.imageUrl ? (
                <div className='w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center'>
                  <Image
                    src={item.imageUrl}
                    alt={title}
                    width={48}
                    height={48}
                    unoptimized
                    className='w-full h-full object-contain'
                  />
                </div>
              ) : (
                <div className='w-12 h-12 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400'>
                  <svg className='w-6 h-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M20.59 13.41 11 3.83V3H3v8h.83l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83zM7 7h.01' />
                  </svg>
                </div>
              )}
              <div className='min-w-0 flex-1'>
                <h3 className='font-semibold text-slate-900 dark:text-white leading-tight pr-12'>{title}</h3>
                {item.priceLabel && (
                  <p className='text-xs text-[#22C55E] font-medium mt-0.5'>{item.priceLabel}</p>
                )}
              </div>
            </div>

            {desc && (
              <p className='text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4 flex-1'>
                {desc}
              </p>
            )}

            <div className='flex items-center gap-1.5 text-sm font-semibold text-[#22C55E] group-hover:gap-2.5 transition-all mt-auto'>
              {isBn ? 'দেখুন' : 'Visit'}
              <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2.2} strokeLinecap='round' strokeLinejoin='round'>
                <path d='M5 12h14M12 5l7 7-7 7' />
              </svg>
            </div>
          </a>
        )
      })}
    </div>
  )
}
