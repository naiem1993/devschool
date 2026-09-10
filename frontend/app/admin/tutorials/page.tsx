import prisma from '@/lib/prisma'
import Link from 'next/link'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminTutorials() {
  const tutorials = await prisma.tutorial.findMany({
    include: {
      category: true,
      _count: { select: { contents: true, quizzes: true, challenges: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📚 টিউটোরিয়াল</h1>
        <Link href="/admin/tutorials/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm">
          + নতুন টিউটোরিয়াল
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {['শিরোনাম', 'ক্যাটাগরি', 'চ্যাপ্টার', 'কুইজ', 'চ্যালেঞ্জ', 'ভিউ', 'স্ট্যাটাস', 'অ্যাকশন'].map((h) => (
                <th key={h} className="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {tutorials.map((t) => (
              <tr key={t.id}>
                <td className="p-4 text-sm text-gray-900 dark:text-white font-medium">{t.title}</td>
                <td className="p-4 text-sm text-gray-500">{t.category?.name}</td>
                <td className="p-4 text-sm">{t._count.contents}</td>
                <td className="p-4 text-sm">{t._count.quizzes}</td>
                <td className="p-4 text-sm">{t._count.challenges}</td>
                <td className="p-4 text-sm">{t.viewCount}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${t.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {t.isPublished ? 'প্রকাশিত' : 'ড্রাফট'}
                  </span>
                </td>
                <td className="p-4 flex gap-3 text-sm">
                  <Link href={`/admin/tutorials/${t.id}/edit`} className="text-indigo-600 hover:underline">এডিট</Link>
                  <DeleteButton url={`/api/admin/tutorials/${t.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tutorials.length === 0 && <p className="p-8 text-center text-gray-500">কোনো টিউটোরিয়াল নেই।</p>}
      </div>
    </div>
  )
}
