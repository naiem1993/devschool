import type { Metadata } from 'next'
import Link from 'next/link'
import { isLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config'
import { localeHref } from '@/lib/i18n/link'
import { prisma } from '@/lib/prisma'
import { getDonationSettings, getShopSettings } from '@/lib/site-settings'
import SupportTabs from '@/components/site/SupportTabs'
import type { AffiliateItem } from '@/components/site/AffiliateGrid'
import type { ShopCategory } from '@/components/site/ShopView'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  return {
    title: locale === 'bn' ? 'সাপোর্ট করুন - DevSchool' : 'Support - DevSchool',
    description:
      locale === 'bn'
        ? 'DevSchool-কে সাপোর্ট করুন এবং আমাদের ব্যবহৃত tools দেখুন।'
        : 'Support DevSchool and explore the tools we use.',
  }
}

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const isBn = locale === 'bn'

  // Active affiliate links + categories + per-category counts + donation toggle
  const [links, catRows, counts, donationSettings, shopSettings] = await Promise.all([
    prisma.affiliateLink.findMany({
      where: { isActive: true },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        titleBn: true,
        titleEn: true,
        descriptionBn: true,
        descriptionEn: true,
        imageUrl: true,
        category: true,
        priceLabel: true,
        badge: true,
      },
    }),
    prisma.affiliateCategory.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: { id: true, slug: true, nameBn: true, nameEn: true, icon: true, description: true },
    }),
    prisma.affiliateLink.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { _all: true },
    }),
    getDonationSettings(),
    getShopSettings(),
  ])

  const items: AffiliateItem[] = links

  const countMap = new Map(counts.map((c) => [c.category, c._count._all]))
  const categories: ShopCategory[] = catRows.map((c) => ({
    id: c.id,
    slug: c.slug,
    nameBn: c.nameBn,
    nameEn: c.nameEn,
    icon: c.icon,
    description: c.description,
    count: countMap.get(c.slug) ?? 0,
  }))

  return (
    <div className='relative bg-slate-50/50 dark:bg-slate-950 min-h-[75vh] overflow-hidden'>
      {/* Subtle green radial glow */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-60 dark:opacity-40 blur-3xl'
        style={{
          background:
            'radial-gradient(circle, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0.08) 35%, transparent 70%)',
        }}
      />

      <div className='relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20'>

        {/* ══════════ HERO ══════════ */}
        <section className='text-center max-w-3xl mx-auto mb-14'>
          {/* Live badge */}
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-8'>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse' />
            {donationSettings.enabled
              ? isBn ? 'সম্পূর্ণ ফ্রি · কোনো পেওয়াল নেই · ওপেন সোর্স' : '100% Free · No Paywalls · Open Source'
              : isBn ? 'রেকমেন্ডেড · সহায়ক · ফ্রি' : 'Recommended · Helpful · Free'}
          </div>

          {/* Title */}
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-slate-900 dark:text-white mb-6'>
            {donationSettings.enabled ? (
              isBn ? (
                <>
                  DevSchool কে চালু রাখুন
                  <br />
                  <span className='bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent'>
                    ফ্রি ও সচল
                  </span>
                </>
              ) : (
                <>
                  Keep DevSchool<br />
                  <span className='bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent'>
                    alive &amp; free
                  </span>
                </>
              )
            ) : (
              isBn ? (
                <>
                  আমার যাচাই করা
                  <br />
                  <span className='bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent'>
                    রেকমেন্ডেড জিনিস
                  </span>
                </>
              ) : (
                <>
                  My<br />
                  <span className='bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent'>
                    recommended picks
                  </span>
                </>
              )
            )}
          </h1>

          {/* Subtitle */}
          <p className='text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed'>
            {donationSettings.enabled
              ? isBn
                ? 'প্রতিটি লেসন, চ্যালেঞ্জ ও রিসোর্স — চিরকাল ফ্রি। আপনার ছোট একটি সহায়তা এটাকে সচল রাখে।'
                : 'Every lesson, challenge, and resource — free forever. Your small support keeps it running.'
              : isBn
                ? 'আপনার ডেভেলপমেন্ট যাত্রায় সহায়ক কিছু বাছাই করা প্রোডাক্ট — এখান থেকে কিনলে আপনার দাম একই থাকে।'
                : 'Handpicked products to support your development journey — your price stays the same when you buy through these links.'}
          </p>
        </section>

        {/* ══════════ TABS: Donate / Shop Tools ══════════ */}
        <SupportTabs
          locale={locale}
          affiliates={items}
          categories={categories}
          donationEnabled={donationSettings.enabled}
          shopEnabled={shopSettings.enabled}
        />

        {/* Affiliate transparency note */}
        {(donationSettings.enabled || shopSettings.enabled) && (
          <div className='text-center mt-16 max-w-md mx-auto'>
            <p className='text-xs text-slate-500 dark:text-slate-500 leading-relaxed'>
              💚{' '}
              {isBn
                ? 'Shop-এর লিংকগুলো affiliate — DevSchool ছোট commission পায়, আপনার দাম একই থাকে।'
                : 'Shop links are affiliate — DevSchool earns a small commission at no extra cost to you.'}
              <br />
              <span className='text-slate-400 dark:text-slate-600'>
                {isBn
                  ? 'প্রতিটি অবদান, ছোট বা বড়, হাজারো লার্নারের জন্য এটা ফ্রি রাখে।'
                  : 'Every contribution, big or small, keeps this free for thousands of learners.'}
              </span>
            </p>
          </div>
        )}

        {/* ── Back home ── */}
        <div className='text-center pt-14'>
          <Link
            href={localeHref(locale, '/')}
            className='inline-block px-8 py-3.5 rounded-2xl bg-[#22C55E] text-[#04140a] font-bold hover:bg-[#4ADE80] transition shadow-lg shadow-[#22C55E]/20'
          >
            {isBn ? 'হোমপেজে ফিরে যান' : 'Back to Home'}
          </Link>
        </div>

      </div>
    </div>
  )
}
