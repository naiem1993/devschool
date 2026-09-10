import prisma from '@/lib/prisma'
import Link from 'next/link'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { tutorials: true, references: true } } },
  })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📂 ক্যাটাগরি</h1>
        <Link href="/admin/categories/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm">
          + নতুন ক্যাটাগরি
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">নাম</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">স্লাগ</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">টিউটোরিয়াল</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">রেফারেন্স</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">স্ট্যাটাস</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="p-4 text-sm text-gray-900 dark:text-white">{c.icon} {c.name}</td>
                <td className="p-4 text-sm text-gray-500">{c.slug}</td>
                <td className="p-4 text-sm">{c._count.tutorials}</td>
                <td className="p-4 text-sm">{c._count.references}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {c.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </span>
                </td>
                <td className="p-4 flex gap-3 text-sm">
                  <Link href={`/admin/categories/${c.id}/edit`} className="text-indigo-600 hover:underline">এডিট</Link>
                  <DeleteButton url={`/api/admin/categories/${c.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="p-8 text-center text-gray-500">কোনো ক্যাটাগরি নেই। প্রথমে যোগ করুন।</p>}
      </div>
    </div>
  )
}
