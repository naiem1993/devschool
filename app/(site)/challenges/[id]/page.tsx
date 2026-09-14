import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ChallengeWorkspace from './ChallengeWorkspace'

type PageProps = { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  try {
    const items = await prisma.codeChallenge.findMany({ select: { id: true }, take: 300 })
    return items.map((c) => ({ id: c.id }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const c = await prisma.codeChallenge.findUnique({
      where: { id },
      select: { title: true, description: true, difficulty: true, tutorial: { select: { title: true } } },
    })
    if (!c) return { title: 'চ্যালেঞ্জ পাওয়া যায়নি | DevSchool', robots: { index: false } }
    const description = c.description || `${c.title} — ${c.difficulty} লেভেলের কোডিং চ্যালেঞ্জ।`
    return {
      title: `${c.title} — কোড চ্যালেঞ্জ | DevSchool`,
      description,
      keywords: [c.title, c.tutorial.title, 'challenge', 'coding'],
      alternates: { canonical: `/challenges/${id}` },
      openGraph: { title: c.title, description, type: 'article', url: `/challenges/${id}`, siteName: 'DevSchool', locale: 'bn_BD' },
      twitter: { card: 'summary_large_image', title: c.title, description },
    }
  } catch {
    return { title: 'DevSchool' }
  }
}

export default async function ChallengeDetailPage({ params }: PageProps) {
  const { id } = await params

  const challenge = await prisma.codeChallenge
    .findUnique({
      where: { id },
      include: {
        tutorial: { select: { id: true, title: true, slug: true, category: { select: { name: true, slug: true } } } },
        testCases: { orderBy: { testCaseOrder: 'asc' } },
      },
    })
    .catch(() => null)

  if (!challenge) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: challenge.title,
    description: challenge.description,
    educationalLevel: challenge.difficulty,
    inLanguage: 'bn-BD',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806] text-slate-900 dark:text-slate-100">
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <li><Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">হোম</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/challenges" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">চ্যালেঞ্জ</Link></li>
              <li aria-hidden>/</li>
              <li className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[240px]">{challenge.title}</li>
            </ol>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-6">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <Link href={`/categories/${challenge.tutorial.category.slug}`} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-950 transition">📂 {challenge.tutorial.category.name}</Link>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">{challenge.difficulty}</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">⭐ {challenge.points} pts</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">{challenge.title}</h1>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{challenge.description}</p>
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
            tutorialTitle={challenge.tutorial.title}
          />
        </div>
      </div>
    </>
  )
}
