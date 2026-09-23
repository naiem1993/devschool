import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ChallengeFilter, { type ChallengeCard } from './ChallengeFilter'
import { isLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config'
import { getDictionarySync } from '@/lib/i18n/dictionaries'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const dict = getDictionarySync(locale)
  const isEn = locale === 'en'
  try {
    const count = await prisma.codeChallenge.count()
    const description = dict.challenges.metaDescTpl.replace('{count}', String(count))
    return {
      title: dict.challenges.metaTitle,
      description,
      keywords: ['challenges', 'coding', 'practice', 'problems', 'DevSchool'],
      alternates: {
        canonical: `/${locale}/challenges`,
        languages: { bn: '/bn/challenges', en: '/en/challenges' },
      },
      openGraph: {
        title: dict.challenges.metaOgTitle,
        description,
        type: 'website',
        url: '/challenges',
        siteName: 'DevSchool',
        locale: isEn ? 'en_US' : 'bn_BD',
      },
      twitter: { card: 'summary_large_image', title: dict.challenges.metaOgTitle, description },
    }
  } catch {
    return { title: dict.challenges.metaFallbackTitle }
  }
}

export default async function ChallengesListingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const dict = getDictionarySync(locale)
  const isEn = locale === 'en'

  let challenges: ChallengeCard[] = []
  let dbError = false
  let errorMessage = ''

  try {
    const raw = await prisma.codeChallenge.findMany({
      include: {
        tutorial: { select: { title: true, slug: true } },
        _count: { select: { testCases: true } },
      },
      orderBy: [{ difficulty: 'asc' }, { createdAt: 'desc' }],
    })

    challenges = raw.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      difficulty: c.difficulty,
      points: c.points,
      tutorialTitle: c.tutorial.title,
      testCaseCount: c._count.testCases,
    }))
  } catch (err: any) {
    console.error('Challenges listing error:', err)
    dbError = true
    if (err?.code === 'P1001') errorMessage = dict.challenges.errNoConn
    else if (err?.code === 'P2021') errorMessage = dict.challenges.errNoTable
    else errorMessage = dict.challenges.errGeneric
  }

  if (dbError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-[#050806] p-4">
        <div className="text-center max-w-md bg-slate-50 dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/5 rounded-3xl p-8">
          <div className="text-5xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{dict.listing.dbConnectError}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{errorMessage}</p>
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#22C55E] hover:bg-[#1faf53] text-black rounded-xl text-sm font-semibold transition">{dict.listing.backHome}</Link>
        </div>
      </div>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: dict.challenges.jsonLdName,
    description: dict.challenges.jsonLdDescTpl.replace('{count}', String(challenges.length)),
    inLanguage: isEn ? 'en' : 'bn-BD',
    numberOfItems: challenges.length,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-white dark:bg-[#050806] text-slate-900 dark:text-slate-100">
        {/* ══════════ HERO — clean black + single green glow ══════════ */}
        <section className="relative overflow-hidden bg-[#f6f8f7] dark:bg-[#050806] border-b border-slate-200 dark:border-white/5">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[820px] max-w-full"
            style={{
              background:
                'radial-gradient(ellipse at center top, rgba(34,197,94,0.18), rgba(34,197,94,0.06) 45%, transparent 72%)',
            }}
          />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-2">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <li><Link href={`/${locale}`} className="hover:text-[#22C55E] transition">{dict.listing.breadcrumbHome}</Link></li>
                <li aria-hidden>/</li>
                <li className="text-slate-800 dark:text-slate-200 font-medium">{dict.nav.challenges}</li>
              </ol>
            </nav>
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">{dict.challenges.heroTitle}</h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {dict.challenges.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <StatCard value={challenges.length} label={dict.challenges.statChallenges} />
                <StatCard value={challenges.filter((c) => c.difficulty === 'Easy').length} label="Easy" />
                <StatCard value={challenges.filter((c) => c.difficulty === 'Medium').length} label="Medium" />
                <StatCard value={challenges.filter((c) => c.difficulty === 'Hard').length} label="Hard" />
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {challenges.length === 0 ? (
            <div className="bg-slate-50 dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/5 rounded-3xl p-12 text-center">
              <div className="text-5xl mb-4">⚔️</div>
              <h2 className="text-xl font-bold mb-2">{dict.challenges.emptyTitle}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{dict.challenges.emptyDesc}</p>
            </div>
          ) : (
            <ChallengeFilter challenges={challenges} />
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
      <span className="text-xl font-bold tabular-nums text-[#22C55E]">{value.toLocaleString()}</span>
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  )
}
