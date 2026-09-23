import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ChallengeWorkspace from './ChallengeWorkspace'
import { localizeChallenge, pickText } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/config'

type PageProps = { params: Promise<{ locale: string; id: string }> }

export async function generateStaticParams() {
  try {
    const items = await prisma.codeChallenge.findMany({ select: { id: true }, take: 300 })
    // দুই ভাষার জন্যই একই id pre-render হবে
    return items.flatMap((c) => [
      { locale: 'bn', id: c.id },
      { locale: 'en', id: c.id },
    ])
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params
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
    if (!c) return { title: 'চ্যালেঞ্জ পাওয়া যায়নি | DevSchool', robots: { index: false } }

    // locale-সঠিক title — না থাকলে general fallback (পেজ নিজেই notFound() দেবে)
    const loc = localizeChallenge(locale as Locale, c)
    if (!loc.title) return { title: 'DevSchool' }

    const tutTitle = pickText(locale as Locale, c.tutorial.titleBn, c.tutorial.titleEn) || ''
    const description =
      loc.description || `${loc.title} — ${c.difficulty} লেভেলের কোডিং চ্যালেঞ্জ।`

    return {
      title: `${loc.title} — কোড চ্যালেঞ্জ | DevSchool`,
      description,
      keywords: [loc.title, tutTitle, 'challenge', 'coding'],
      alternates: {
        canonical: `/${locale}/challenges/${id}`,
        languages: {
          'bn-BD': `/bn/challenges/${id}`,
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
  const { locale, id } = await params

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

  // locale-সঠিক লেখা — title না থাকলে 404
  const loc = localizeChallenge(locale as Locale, challenge)
  if (!loc.title) notFound()

  // tutorial-এর locale-সঠিক title (breadcrumb/category pill-এ)
  // slug fallback ঠিক আছে — slug ভাষা-নিরপেক্ষ (যেমন "html")
  const tutorialTitle =
    pickText(locale as Locale, challenge.tutorial.titleBn, challenge.tutorial.titleEn) ||
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
      <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806] text-slate-900 dark:text-slate-100">
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <li><Link href="/" className="hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition">হোম</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/challenges" className="hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition">চ্যালেঞ্জ</Link></li>
              <li aria-hidden>/</li>
              <li className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[240px]">{loc.title}</li>
            </ol>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-6">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <Link href={`/tutorials/${challenge.tutorial.slug}`} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22C55E]/10 dark:bg-[#22C55E]/10 text-[#15803d] dark:text-[#4ADE80] text-xs font-semibold hover:bg-[#22C55E]/20 dark:hover:bg-[#22C55E]/20 transition">📂 {tutorialTitle}</Link>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">{challenge.difficulty}</span>
              <span className="text-xs font-bold text-[#15803d] dark:text-[#4ADE80]">⭐ {challenge.points} pts</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">{loc.title}</h1>
            {loc.description && (
              <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{loc.description}</p>
            )}
          </header>

          <ChallengeWorkspace
            challengeId={challenge.id}
            starterCode={challenge.starterCode || '// তোমার কোড এখানে লেখো\n'}
            solution={challenge.solution}
            testCases={challenge.testCases.map((t) => ({
              id: t.id,
              input: t.input,
              expectedOutput: t.expectedOutput,
              isHidden: t.isHidden,
            }))}
            tutorialSlug={challenge.tutorial.slug}
            tutorialTitle={tutorialTitle}
          />
        </div>
      </div>
    </>
  )
}
