import prisma from '@/lib/prisma'
import Link from 'next/link'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminQuizzes() {
  const quizzes = await prisma.quizQuestion.findMany({
    include: {
      tutorial: { select: { id: true, title: true } },
      _count: { select: { options: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🧠 কুইজ প্রশ্ন</h1>
        <Link href="/admin/quizzes/new" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm">
          + নতুন প্রশ্ন
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {['প্রশ্ন', 'টিউটোরিয়াল', 'অপশন', 'ক্রম', 'অ্যাকশন'].map((h) => (
                <th key={h} className="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {quizzes.map((q) => (
              <tr key={q.id}>
                <td className="p-4 text-sm text-gray-900 dark:text-white max-w-md">{q.question}</td>
                <td className="p-4 text-sm text-gray-500">{q.tutorial?.title || '—'}</td>
                <td className="p-4 text-sm">{q._count.options}</td>
                <td className="p-4 text-sm">{q.orderIndex}</td>
                <td className="p-4 flex gap-3 text-sm">
                  <Link href={`/admin/quizzes/${q.id}/edit`} className="text-indigo-600 hover:underline">এডিট</Link>
                  <DeleteButton url={`/api/admin/quiz/${q.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {quizzes.length === 0 && <p className="p-8 text-center text-gray-500">কোনো কুইজ প্রশ্ন নেই।</p>}
      </div>
    </div>
  )
}
