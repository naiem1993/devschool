import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import TutorialsFilter, { type TutorialCard } from './TutorialsFilter'
import { absoluteUrl } from '@/lib/site-url'
import { isLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config'
import { getDictionarySync } from '@/lib/i18n/dictionaries'
import { pickText } from '@/lib/i18n/localize'

// ─────────────────────────────────────────────────────────────
//  ISR — revalidate every 5 minutes
// ─────────────────────────────────────────────────────────────
export const revalidate = 300

// ─────────────────────────────────────────────────────────────
//  METADATA (SEO)
// ─────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const isEn = locale === 'en'
  const fallback = isEn
    ? 'All Tutorials | DevSchool'
    : 'সব টিউটোরিয়াল | DevSchool'

  try {
    const [tutCount, refCount] = await Promise.all([
      prisma.tutorial.count({ where: { isPublished: true } }),
      prisma.reference.count(),
    ])

    const description = isEn
      ? `${tutCount}+ tutorials and ${refCount} programming references — learn HTML, CSS, JavaScript, Python and more, for free.`
      : `${tutCount}+ টি টিউটোরিয়াল ও ${refCount} টি প্রোগ্রামিং রেফারেন্স — HTML, CSS, JavaScript, Python সহ সব প্রোগ্রামিং ভাষা বিনামূল্যে শিখুন।`

    const pageTitle = isEn
      ? 'All Tutorials — Browse | DevSchool'
      : 'সব টিউটোরিয়াল — ব্রাউজ করুন | DevSchool'

    return {
      title: pageTitle,
      description,
      keywords: ['tutorials', 'programming', 'learn to code', 'DevSchool'],
      alternates: {
        canonical: `/${locale}/tutorials`,
        languages: {
          bn: '/bn/tutorials',
          en: '/en/tutorials',
          'x-default': '/bn/tutorials',
        },
      },
      openGraph: {
        title: fallback,
        description,
        type: 'website',
        url: '/tutorials',
        siteName: 'DevSchool',
        locale: isEn ? 'en_US' : 'bn_BD',
      },
      twitter: {
        card: 'summary_large_image',
        title: fallback,
        description,
      },
    }
  } catch {
    return { title: fallback }
  }
}

// ─────────────────────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────────────────────
export default async function TutorialsListingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const dict = getDictionarySync(locale)
  const isEn = locale === 'en'

  let tutorials: TutorialCard[] = []
  let totalChapters = 0
  let totalReferences = 0
  let dbError = false
  let errorMessage = ''

  try {
    const [raw, refCount] = await Promise.all([
      prisma.tutorial.findMany({
        where:
          locale === 'en'
            ? { isPublished: true, titleEn: { not: null } }
            : { isPublished: true },
        select: {
          id: true,
          titleBn: true,
          titleEn: true,
          slug: true,
          descriptionBn: true,
          descriptionEn: true,
          icon: true,
          difficulty: true,
          viewCount: true,
          duration: true,
          rating: true,
          createdAt: true,
          _count: { select: { chapters: true } },
        },
        orderBy:
          locale === 'en'
            ? [{ titleEn: 'asc' }]
            : [{ titleBn: 'asc' }],
      }),
      prisma.reference.count(),
    ])

    tutorials = raw
      .map((t) => ({
        id: t.id,
        title: pickText(locale, t.titleBn, t.titleEn) ?? '',
        slug: t.slug,
        description: pickText(locale, t.descriptionBn, t.descriptionEn),
        icon: t.icon,
        difficulty: t.difficulty,
        viewCount: t.viewCount,
        duration: t.duration,
        rating: t.rating,
        chapterCount: t._count.chapters,
        createdAt: t.createdAt.toISOString(),
      }))
      .filter((t) => t.title !== '')

    totalChapters = tutorials.reduce((sum, t) => sum + t.chapterCount, 0)
    totalReferences = refCount
  } catch (err: any) {
    console.error('Tutorials listing error:', err)
    dbError = true
    if (err?.code === 'P1001') {
      errorMessage = dict.listing.dbErrNoConn
    } else if (err?.code === 'P2021') {
      errorMessage = dict.listing.dbErrNoTable
    } else {
      errorMessage = dict.listing.dbErrGeneric
    }
  }

  // ─── DB ERROR STATE ───
  if (dbError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-[#050806] p-4">
        <div className="text-center max-w-md bg-slate-50 dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/5 rounded-3xl p-8">
          <div className="text-5xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {dict.listing.dbConnectError}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{errorMessage}</p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#22C55E] hover:bg-[#1faf53] text-black rounded-xl text-sm font-semibold transition"
          >
            {dict.listing.backHome}
          </Link>
        </div>
      </div>
    )
  }

  // ─── JSON-LD Structured Data ───
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isEn
      ? 'All Tutorials — DevSchool'
      : 'সব টিউটোরিয়াল — DevSchool',
    description: isEn
      ? `${tutorials.length} tutorials`
      : `${tutorials.length} টি টিউটোরিয়াল`,
    inLanguage: isEn ? 'en' : 'bn-BD',
    numberOfItems: tutorials.length,
    hasPart: tutorials.slice(0, 20).map((t) => ({
      '@type': 'Course',
      name: t.title,
      url: absoluteUrl(`/tutorials/${t.slug}`),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white dark:bg-[#050806] text-slate-900 dark:text-slate-100">
        {/* ══════════ HERO — clean black + single green glow ══════════ */}
        <section className="relative overflow-hidden bg-[#f6f8f7] dark:bg-[#050806] border-b border-slate-200 dark:border-white/5">
          {/* soft radial green glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[820px] max-w-full"
            style={{
              background:
                'radial-gradient(ellipse at center top, rgba(34,197,94,0.18), rgba(34,197,94,0.06) 45%, transparent 72%)',
            }}
          />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-2">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <li>
                  <Link href={`/${locale}`} className="hover:text-[#22C55E] transition">
                    {dict.listing.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-slate-800 dark:text-slate-200 font-medium">
                  {dict.nav.tutorials}
                </li>
              </ol>
            </nav>

            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                {dict.listing.tutorialsTitle}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {dict.listing.tutorialsSubtitle}
              </p>

              {/* Stats */}
              <div className="mt-8 flex flex-wrap gap-3">
                <StatCard value={tutorials.length} label={dict.listing.statTutorials} />
                <StatCard value={totalChapters} label={dict.listing.statChapters} />
                <StatCard value={totalReferences} label={dict.listing.statReferences} />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ LISTING + FILTERS ══════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {tutorials.length === 0 ? (
            <div className="bg-slate-50 dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/5 rounded-3xl p-12 text-center">
              <div className="text-5xl mb-4">📚</div>
              <h2 className="text-xl font-bold mb-2">এখনো কোনো টিউটোরিয়াল নেই</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                শীঘ্রই নতুন টিউটোরিয়াল যুক্ত করা হবে।
              </p>
            </div>
          ) : (
            <TutorialsFilter tutorials={tutorials} />
          )}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
//  StatCard — neutral surface, green value only
// ─────────────────────────────────────────────────────────────
function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-2 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] px-4 py-2.5">
      <span className="text-xl font-bold tabular-nums text-[#22C55E]">
        {value.toLocaleString()}
      </span>
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  )
}
