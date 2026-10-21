import type { Metadata } from 'next'
import Link from 'next/link'
import { isLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config'
import { localeHref } from '@/lib/i18n/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  return {
    title: locale === 'bn' ? 'সাপোর্টাররা - DevSchool' : 'Supporters - DevSchool',
    description:
      locale === 'bn'
        ? 'DevSchool-কে যারা সাপোর্ট করেছেন তাদের তালিকা।'
        : 'Our amazing supporters who keep DevSchool free.',
  }
}

export default async function SupportersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const isBn = locale === 'bn'

  // শুধু completed এবং public donations
  const donations = await prisma.donation.findMany({
    where: { status: 'completed', isPublic: true },
    orderBy: { amount: 'desc' },
    take: 100,
  })

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0)
  const totalSupporters = donations.length

  return (
    <div className='relative min-h-[75vh] bg-slate-50/50 dark:bg-slate-950 overflow-hidden'>
      {/* Ambient glow */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-60 dark:opacity-40 blur-3xl'
        style={{
          background:
            'radial-gradient(circle, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0.08) 35%, transparent 70%)',
        }}
      />

      <div className='relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24'>
        
        {/* Hero */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-6'>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse' />
            {isBn ? 'আমাদের সাপোর্টাররা' : 'Our Supporters'}
          </div>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6'>
            {isBn ? 'আপনাদের জন্যই' : 'Powered by'} <br />
            <span className='bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent'>
              {isBn ? 'DevSchool সচল' : 'You'}
            </span>
          </h1>
          <p className='text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed'>
            {isBn
              ? 'যারা আর্থিকভাবে সহায়তা করেছেন, তাদের প্রত্যেককে আন্তরিক ধন্যবাদ।'
              : 'A heartfelt thank you to everyone who has contributed financially.'}
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-12'>
          <div className='rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/[0.06] p-6 text-center'>
            <div className='text-3xl font-black text-emerald-500 dark:text-emerald-400 mb-1'>
              {totalSupporters}
            </div>
            <div className='text-sm font-medium text-slate-500 dark:text-slate-400'>
              {isBn ? 'জন সাপোর্টার' : 'Supporters'}
            </div>
          </div>
          <div className='rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/[0.06] p-6 text-center'>
            <div className='text-3xl font-black text-emerald-500 dark:text-emerald-400 mb-1'>
              ৳{totalAmount.toLocaleString()}
            </div>
            <div className='text-sm font-medium text-slate-500 dark:text-slate-400'>
              {isBn ? 'মোট সংগ্রহ' : 'Total Raised'}
            </div>
          </div>
        </div>

        {/* Supporters List */}
        {donations.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {donations.map((donor) => {
              const name = donor.donorName || (isBn ? 'শুভানুধ্যায়ী' : 'Anonymous')
              const initial = name.charAt(0).toUpperCase()
              return (
                <div
                  key={donor.id}
                  className='group relative flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all'
                >
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold'>
                      {initial}
                    </div>
                    <div>
                      <div className='font-bold text-slate-900 dark:text-white'>
                        {name}
                      </div>
                      <div className='text-xs font-semibold text-emerald-600 dark:text-emerald-500'>
                        ৳{donor.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {donor.message && (
                    <p className='text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic'>
                      &quot;{donor.message}&quot;
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className='text-center py-20 bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-white/[0.06]'>
            <div className='text-5xl mb-4'>🌱</div>
            <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>
              {isBn ? 'এখনো কোনো সাপোর্টার নেই' : 'No supporters yet'}
            </h3>
            <p className='text-sm text-slate-500 dark:text-slate-400 mb-6'>
              {isBn ? 'আপনি প্রথম হতে পারেন!' : 'You can be the first!'}
            </p>
            <Link
              href={localeHref(locale, '/donate')}
              className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-[#04140a] font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20'
            >
              {isBn ? 'ডোনেট করুন' : 'Donate Now'}
            </Link>
          </div>
        )}

        {/* Back to donate */}
        <div className='text-center mt-16'>
          <Link
            href={localeHref(locale, '/donate')}
            className='inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors group'
          >
            <svg className='w-4 h-4 group-hover:-translate-x-1 transition-transform' fill='none' stroke='currentColor' strokeWidth={2.2} viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M19 12H5M12 19l-7-7 7-7' />
            </svg>
            {isBn ? 'ডোনেট পেজে ফিরে যান' : 'Back to donate page'}
          </Link>
        </div>

      </div>
    </div>
  )
}
