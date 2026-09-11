import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ChallengeFilter, { type ChallengeCard } from './ChallengeFilter'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  try {
    const count = await prisma.codeChallenge.count()
    const description = `${count}+ টি হ্যান্ডস-অন কোডিং চ্যালেঞ্জ — বাস্তব সমস্যা সমাধান করে প্রোগ্রামিং শিখুন।`
    return {
      title: 'কোড চ্যালেঞ্জ — প্র্যাকটিস করুন | DevSchool',
      description,
      keywords: ['challenges', 'coding', 'practice', 'problems', 'DevSchool'],
      alternates: { canonical: '/challenges' },
      openGraph: {
        title: 'কোড চ্যালেঞ্জ | DevSchool',
        description,
        type: 'website',
        url: '/challenges',
        siteName: 'DevSchool',
        locale: 'bn_BD',
      },
      twitter: { card: 'summary_large_image', title: 'কোড চ্যালেঞ্জ | DevSchool', description },
    }
  } catch {
    return { title: 'চ্যালেঞ্জ | DevSchool' }
  }
}

export default async function ChallengesListingPage() {
  let challenges: ChallengeCard[] = []
  let dbError = false
  let errorMessage = ''

  try {
    const raw = await prisma.codeChallenge.findMany({
      include: {
        tutorial: { select: { title: true, slug: true, category: { select: { name: true } } } },
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
      categoryName: c.tutorial.category.name,
      testCaseCount: c._count.testCases,
    }))
  } catch (err: any) {
    console.error('Challenges listing error:', err)
    dbError = true
    if (err?.code === 'P1001') errorMessage = 'ডেটাবেজে সংযোগ করা যাচ্ছে না।'
    else if (err?.code === 'P2021') errorMessage = 'ডেটাবেজ টেবিল পাওয়া যাচ্ছে না।'
    else errorMessage = 'চ্যালেঞ্জ লোড করতে সমস্যা হয়েছে।'
  }

  if (dbError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19] p-4">
        <div className="text-center max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="text-6xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">সংযোগ সমস্যা</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">{errorMessage}</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition">হোমপেজে ফিরে যান</Link>
        </div>
      </div>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'কোড চ্যালেঞ্জ — DevSchool',
    description: `${challenges.length} টি কোডিং চ্যালেঞ্জ`,
    inLanguage: 'bn-BD',
    numberOfItems: challenges.length,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50 via-white to-indigo-50 dark:from-slate-950 dark:via-[#0b0f19] dark:to-emerald-950/30">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" aria-hidden style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <li><Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">হোম</Link></li>
                <li aria-hidden>/</li>
                <li className="text-slate-800 dark:text-slate-200 font-medium">চ্যালেঞ্জ</li>
              </ol>
            </nav>
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">⚔️ কোড চ্যালেঞ্জ</h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">বাস্তব কোডিং সমস্যা সমাধান করুন, টেস্ট কেস পাস করে নিজের দক্ষতা প্রমাণ করুন। প্রতিটা চ্যালেঞ্জে আছে ইন্টারঅ্যাকটিভ এডিটর, লাইভ রান ও অটো-টেস্ট।</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <StatCard value={challenges.length} label="চ্যালেঞ্জ" color="emerald" />
                <StatCard value={challenges.filter(c => c.difficulty === 'Easy').length} label="Easy" color="emerald" />
                <StatCard value={challenges.filter(c => c.difficulty === 'Medium').length} label="Medium" color="amber" />
                <StatCard value={challenges.filter(c => c.difficulty === 'Hard').length} label="Hard" color="red" />
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {challenges.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">⚔️</div>
              <h2 className="text-xl font-bold mb-2">এখনো কোনো চ্যালেঞ্জ নেই</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">শীঘ্রই নতুন চ্যালেঞ্জ যুক্ত করা হবে।</p>
            </div>
          ) : (
            <ChallengeFilter challenges={challenges} />
          )}
        </div>
      </div>
    </>
  )
}

function StatCard({ value, label, color }: { value: number; label: string; color: 'emerald' | 'amber' | 'red' }) {
  const colorMap = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-600 dark:text-amber-400',
    red: 'text-red-600 dark:text-red-400',
  } as const
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3">
      <div className={`text-2xl font-extrabold ${colorMap[color]}`}>{value.toLocaleString()}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{label}</div>
    </div>
  )
}
