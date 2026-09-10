import prisma from '@/lib/prisma'
import Link from 'next/link'
import LogoutButton from '@/components/admin/LogoutButton'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [tutorialCount, categoryCount, quizCount, challengeCount, referenceCount] = await Promise.all([
    prisma.tutorial.count(),
    prisma.category.count(),
    prisma.quizQuestion.count(),
    prisma.codeChallenge.count(),
    prisma.reference.count(),
  ])

  const recentTutorials = await prisma.tutorial.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })

  const cards = [
    { href: '/admin/categories', title: '📂 ক্যাটাগরি', count: categoryCount, color: 'text-blue-600' },
    { href: '/admin/tutorials', title: '📚 টিউটোরিয়াল', count: tutorialCount, color: 'text-indigo-600' },
    { href: '/admin/quizzes', title: '🧠 কুইজ প্রশ্ন', count: quizCount, color: 'text-purple-600' },
    { href: '/admin/challenges', title: '⚔️ চ্যালেঞ্জ', count: challengeCount, color: 'text-green-600' },
    { href: '/admin/references', title: '📖 রেফারেন্স', count: referenceCount, color: 'text-orange-600' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 ড্যাশবোর্ড</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">DevSchool অ্যাডমিন প্যানেল</p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-800 hover:shadow-lg transition"
          >
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{card.title}</h2>
            <p className={`text-3xl font-bold mt-2 ${card.color}`}>{card.count}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">🕒 সাম্প্রতিক টিউটোরিয়াল</h2>
          <Link href="/admin/tutorials/new" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            + নতুন
          </Link>
        </div>
        {recentTutorials.length === 0 ? (
          <p className="text-gray-500 py-4">এখনো কোনো টিউটোরিয়াল নেই।</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {recentTutorials.map((t) => (
              <li key={t.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{t.title}</p>
                  <p className="text-xs text-gray-500">{t.category?.name} • {t.difficulty}</p>
                </div>
                <Link href={`/admin/tutorials/${t.id}/edit`} className="text-indigo-600 text-sm hover:underline">
                  এডিট
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
