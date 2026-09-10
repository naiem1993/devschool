import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminDonations() {
  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const total = donations.filter((d) => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0)
  const count = donations.length
  const completedCount = donations.filter((d) => d.status === 'completed').length

  const badge = (status: string) => {
    const map: Record<string, string> = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
    }
    return map[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">💝 ডোনেশন</h1>

      {/* স্ট্যাটস কার্ড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500">মোট ডোনেশন</p>
          <p className="text-2xl font-bold text-green-600 mt-1">৳ {total.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500">সফল হয়েছে</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{completedCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500">মোট রেকর্ড</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{count}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {['তারিখ', 'দাতা', 'পরিমাণ', 'স্ট্যাটাস', 'মেসেজ'].map((h) => (
                <th key={h} className="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {donations.map((d) => (
              <tr key={d.id}>
                <td className="p-4 text-sm text-gray-500">{new Date(d.createdAt).toLocaleDateString('bn-BD')}</td>
                <td className="p-4 text-sm text-gray-900 dark:text-white">{d.donorName || 'বেনামী'}</td>
                <td className="p-4 text-sm font-medium">৳ {d.amount} {d.currency}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${badge(d.status)}`}>{d.status}</span>
                </td>
                <td className="p-4 text-sm text-gray-500 max-w-sm truncate">{d.message || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {donations.length === 0 && <p className="p-8 text-center text-gray-500">এখনো কোনো ডোনেশন আসেনি।</p>}
      </div>
    </div>
  )
}
