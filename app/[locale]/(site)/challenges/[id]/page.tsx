import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ChallengeWorkspace from './ChallengeWorkspace'
import { localizeChallenge, pickText } from '@/lib/i18n/localize'
import { getDictionarySync } from '@/lib/i18n/dictionaries'
import { isLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config'

type PageProps = { params: Promise<{ locale: string; id: string }> }

export async function generateStaticParams() {
  try {
    const items = await prisma.codeChallenge.findMany({ select: { id: true }, take: 300 })
    return items.flatMap((c) => [
      { locale: 'bn', id: c.id },
      { locale: 'en', id: c.id },
    ])
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, id } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const dict = getDictionarySync(locale)
  const t = dict.challengeDetail
  try {
    const c = await prisma.codeChallenge.findUnique({
      where: { id },
      select: {
        titleBn: true,
        titleEn: true,
        descriptionBn: true,
        descriptionEn: true,
        difficulty: true,
        tutorial: { select: { titleBn: true, titleEn: true } },
      },
    })
    if (!c) return { title: t.metaNotFoundTitle, robots: { index: false } }

    const loc = localizeChallenge(locale, c)
    if (!loc.title) return { title: 'DevSchool' }

    const tutTitle = pickText(locale, c.tutorial.titleBn, c.tutorial.titleEn) || ''
    const description =
      loc.description ||
      t.metaDescTpl.replace('{title}', loc.title).replace('{difficulty}', c.difficulty)

    return {
      title: t.metaTitleTpl.replace('{title}', loc.title),
      description,
      keywords: [loc.title, tutTitle, 'challenge', 'coding'],
      alternates: {
        canonical: `/${locale}/challenges/${id}`,
        languages: {
          bn: `/bn/challenges/${id}`,
          en: `/en/challenges/${id}`,
          'x-default': `/bn/challenges/${id}`,
        },
      },
      openGraph: {
        title: loc.title,
        description,
        type: 'article',
        url: `/${locale}/challenges/${id}`,
        siteName: 'DevSchool',
        locale: locale === 'en' ? 'en_US' : 'bn_BD',
      },
      twitter: { card: 'summary_large_image', title: loc.title, description },
    }
  } catch {
    return { title: 'DevSchool' }
  }
}

export default async function ChallengeDetailPage({ params }: PageProps) {
  const { locale: rawLocale, id } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const dict = getDictionarySync(locale)
  const t = dict.challengeDetail

  const challenge = await prisma.codeChallenge
    .findUnique({
      where: { id },
      include: {
        tutorial: {
          select: { id: true, titleBn: true, titleEn: true, slug: true },
        },
        testCases: { orderBy: { testCaseOrder: 'asc' } },
      },
    })
    .catch(() => null)

  if (!challenge) notFound()

  const loc = localizeChallenge(locale, challenge)
  if (!loc.title) notFound()

  const tutorialTitle =
    pickText(locale, challenge.tutorial.titleBn, challenge.tutorial.titleEn) ||
    challenge.tutorial.slug

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: loc.title,
    description: loc.description,
    educationalLevel: challenge.difficulty,
    inLanguage: locale === 'en' ? 'en' : 'bn-BD',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-white dark:bg-[#050806] text-slate-900 dark:text-slate-100">

        {/* ── Compact breadcrumb bar (full width) ── */}
        <div className="border-b border-emerald-200/70 dark:border-emerald-900/50 bg-white dark:bg-[#050806]">
          <div className="px-3 sm:px-4 lg:px-6 py-2 flex items-center justify-between gap-3 flex-wrap">
            <nav aria-label="Breadcrumb" className="flex-1 min-w-0">
              <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <li>
                  <Link href={`/${locale}`} className="hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition">
                    {t.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href={`/${locale}/challenges`} className="hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition">
                    {t.breadcrumbChallenges}
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px]">
                  {loc.title}
                </li>
              </ol>
            </nav>

            {/* Info pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/${locale}/tutorials/${challenge.tutorial.slug}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22C55E]/10 text-[#15803d] dark:text-[#4ADE80] text-[11px] font-semibold hover:bg-[#22C55E]/20 transition"
              >
                📂 {tutorialTitle}
              </Link>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold uppercase tracking-wider">
                {challenge.difficulty}
              </span>
              <span className="text-[11px] font-bold text-[#15803d] dark:text-[#4ADE80]">
                ⭐ {challenge.points} {dict.challenges.pts}
              </span>
            </div>
          </div>
        </div>

        {/* ── Title + description (compact, full width) ── */}
        <div className="border-b border-emerald-200/70 dark:border-emerald-900/50 bg-white dark:bg-[#050806]">
          <div className="px-3 sm:px-4 lg:px-6 py-3">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">
              {loc.title}
            </h1>
            {loc.description && (
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                {loc.description}
              </p>
            )}
          </div>
        </div>

        {/* ── Full-width workspace ── */}
        <div className="px-2 sm:px-3 py-3">
          <ChallengeWorkspace
            challengeId={challenge.id}
            starterCode={
              pickText(locale, challenge.starterCodeBn, challenge.starterCodeEn) ||
              t.starterCodeFallback
            }
            solution={pickText(locale, challenge.solutionBn, challenge.solutionEn)}
            testCases={challenge.testCases.map((tc) => ({
              id: tc.id,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              isHidden: tc.isHidden,
            }))}
            tutorialSlug={challenge.tutorial.slug}
            tutorialTitle={tutorialTitle}
            language={challenge.language || 'js'}
          />
        </div>

      </div>
    </>
  )
}
