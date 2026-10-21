import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import StatCard from '@/components/admin/StatCard'
import { prisma } from '@/lib/prisma'

async function getStats() {
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [
    tutorials, chapters, quizzes, challenges, references, donations,
    newTutorials7d, newQuizzes7d, newChallenges7d, newDonations7d,
    recentDonations, recentReviews, pendingReviews,
  ] = await Promise.all([
    prisma.tutorial.count(),
    prisma.chapter.count(),
    prisma.quizQuestion.count(),
    prisma.codeChallenge.count(),
    prisma.reference.count(),
    prisma.donation.count(),
    prisma.tutorial.count({ where: { createdAt: { gte: since7d } } }),
    prisma.quizQuestion.count({ where: { createdAt: { gte: since7d } } }),
    prisma.codeChallenge.count({ where: { createdAt: { gte: since7d } } }),
    prisma.donation.count({ where: { createdAt: { gte: since7d } } }),
    prisma.donation.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.review.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.review.count({ where: { status: 'pending' } }),
  ])

  const pct = (n: number, total: number) =>
    total > 0 ? Math.round((n / total) * 100) : 0

  return {
    totals: { tutorials, chapters, quizzes, challenges, references, donations },
    trends: {
      tutorials: pct(newTutorials7d, tutorials),
      quizzes: pct(newQuizzes7d, quizzes),
      challenges: pct(newChallenges7d, challenges),
      donations: pct(newDonations7d, donations),
    },
    recentDonations,
    recentReviews,
    pendingReviews,
  }
}

const Icon = ({ d }: { d: string }) => (
  <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} strokeLinecap='round' strokeLinejoin='round'>
    <path d={d} />
  </svg>
)

const icons = {
  tutorials: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  chapters: 'M4 4h16v16H4zM4 9h16M9 4v16',
  quizzes: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01',
  challenges: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
  references: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M8 13h8M8 17h5',
  donations: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
}

export default async function DashboardPage() {
  const stats = await getStats()

  const cards = [
    { label: 'Tutorials', value: stats.totals.tutorials, href: '/admin/tutorials', icon: <Icon d={icons.tutorials} />, trend: stats.trends.tutorials, accent: 'emerald' as const },
    { label: 'Chapters', value: stats.totals.chapters, href: '/admin/tutorials', icon: <Icon d={icons.chapters} />, accent: 'blue' as const },
    { label: 'Quizzes', value: stats.totals.quizzes, href: '/admin/quizzes', icon: <Icon d={icons.quizzes} />, trend: stats.trends.quizzes, accent: 'violet' as const },
    { label: 'Challenges', value: stats.totals.challenges, href: '/admin/challenges', icon: <Icon d={icons.challenges} />, trend: stats.trends.challenges, accent: 'amber' as const },
    { label: 'References', value: stats.totals.references, href: '/admin/references', icon: <Icon d={icons.references} />, accent: 'cyan' as const },
    { label: 'Donations', value: stats.totals.donations, href: '/admin/donations', icon: <Icon d={icons.donations} />, trend: stats.trends.donations, accent: 'rose' as const },
  ]

  const quickActions = [
    { label: 'New Tutorial', href: '/admin/tutorials', icon: <Icon d='M12 5v14M5 12h14' /> },
    { label: 'Add Quiz', href: '/admin/quizzes', icon: <Icon d='M12 5v14M5 12h14' /> },
    { label: 'New Challenge', href: '/admin/challenges', icon: <Icon d='M12 5v14M5 12h14' /> },
    { label: 'Site Settings', href: '/admin/settings', icon: <Icon d='M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' /> },
  ]

  return (
    <div className='space-y-6'>
      <AdminHeader
        title='Dashboard'
        subtitle='Overview of your platform at a glance'
      />

      {stats.pendingReviews > 0 && (
        <Link
          href='/admin/reviews'
          className='flex items-center gap-3 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/15 transition-colors'
        >
          <Icon d='M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' />
          <span className='font-medium'>{stats.pendingReviews} review{stats.pendingReviews > 1 ? 's' : ''} awaiting approval</span>
          <span className='ml-auto text-xs font-semibold'>Review {'\u2192'}</span>
        </Link>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] overflow-hidden'>
          <div className='flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800'>
            <h2 className='font-semibold text-slate-900 dark:text-white'>Recent Donations</h2>
            <Link href='/admin/donations' className='text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline'>View all</Link>
          </div>
          {stats.recentDonations.length === 0 ? (
            <div className='px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400'>No donations yet.</div>
          ) : (
            <ul className='divide-y divide-slate-100 dark:divide-slate-800'>
              {stats.recentDonations.map((d) => (
                <li key={d.id} className='flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'>
                  <div className='min-w-0'>
                    <div className='text-sm font-medium text-slate-900 dark:text-white truncate'>{d.donorName || 'Anonymous'}</div>
                    <div className='text-xs text-slate-500 dark:text-slate-400'>
                      {new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {' · '}
                      <span className={d.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>{d.status}</span>
                    </div>
                  </div>
                  <div className='text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap'>
                    {d.amount.toLocaleString()} {d.currency}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] overflow-hidden'>
          <div className='flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800'>
            <h2 className='font-semibold text-slate-900 dark:text-white'>Recent Reviews</h2>
            <Link href='/admin/reviews' className='text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline'>View all</Link>
          </div>
          {stats.recentReviews.length === 0 ? (
            <div className='px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400'>No reviews yet.</div>
          ) : (
            <ul className='divide-y divide-slate-100 dark:divide-slate-800'>
              {stats.recentReviews.map((r) => (
                <li key={r.id} className='px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-sm font-medium text-slate-900 dark:text-white truncate'>{r.name}</span>
                    <span className='text-xs text-amber-500'>{'\u2605'.repeat(Math.max(0, Math.min(5, r.stars)))}</span>
                  </div>
                  <p className='mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1'>{r.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5'>
        <h2 className='font-semibold text-slate-900 dark:text-white mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
          {quickActions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className='flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors'
            >
              {a.icon}
              <span className='truncate'>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
