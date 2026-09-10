import prisma from '@/lib/prisma'
import Link from 'next/link'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminReferences() {
  const refs = await prisma.reference.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📖 রেফারেন্স</h1>
        <Link href="/admin/references/new" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">
          + নতুন রেফারেন্স
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {['শিরোনাম', 'ক্যাটাগরি', 'স্লাগ', 'ট্যাগ', 'অ্যাকশন'].map((h) => (
                <th key={h} className="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {refs.map((r) => (
              <tr key={r.id}>
                <td className="p-4 text-sm text-gray-900 dark:text-white">{r.title}</td>
                <td className="p-4 text-sm text-gray-500">{r.category?.name}</td>
                <td className="p-4 text-sm text-gray-500">{r.slug}</td>
                <td className="p-4 text-sm text-gray-500">{r.tags.slice(0, 3).join(', ')}</td>
                <td className="p-4 flex gap-3 text-sm">
                  <Link href={`/admin/references/${r.id}/edit`} className="text-indigo-600 hover:underline">এডিট</Link>
                  <DeleteButton url={`/api/admin/references/${r.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {refs.length === 0 && <p className="p-8 text-center text-gray-500">কোনো রেফারেন্স নেই।</p>}
      </div>
    </div>
  )
}
