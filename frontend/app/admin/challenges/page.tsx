import prisma from '@/lib/prisma'
import Link from 'next/link'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminChallenges() {
  const challenges = await prisma.codeChallenge.findMany({
    include: {
      tutorial: { select: { title: true } },
      _count: { select: { testCases: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">⚔️ চ্যালেঞ্জ</h1>
        <Link href="/admin/challenges/new" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
          + নতুন চ্যালেঞ্জ
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {['শিরোনাম', 'টিউটোরিয়াল', 'কঠিনতা', 'টেস্ট', 'পয়েন্ট', 'অ্যাকশন'].map((h) => (
                <th key={h} className="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {challenges.map((c) => (
              <tr key={c.id}>
                <td className="p-4 text-sm text-gray-900 dark:text-white">{c.title}</td>
                <td className="p-4 text-sm text-gray-500">{c.tutorial?.title}</td>
                <td className="p-4 text-sm">{c.difficulty}</td>
                <td className="p-4 text-sm">{c._count.testCases}</td>
                <td className="p-4 text-sm">{c.points}</td>
                <td className="p-4 flex gap-3 text-sm">
                  <Link href={`/admin/challenges/${c.id}/edit`} className="text-indigo-600 hover:underline">এডিট</Link>
                  <DeleteButton url={`/api/admin/challenges/${c.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {challenges.length === 0 && <p className="p-8 text-center text-gray-500">কোনো চ্যালেঞ্জ নেই।</p>}
      </div>
    </div>
  )
}
