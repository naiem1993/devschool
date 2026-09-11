import prisma from '@/lib/prisma'
import ReferenceForm from '@/components/admin/ReferenceForm'
import Link from 'next/link'

export default async function NewReferencePage() {
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/references" className="text-sm text-indigo-600 hover:underline">← ফিরে যান</Link>
      <h1 className="text-3xl font-bold mt-2 mb-6 text-gray-900 dark:text-white">নতুন রেফারেন্স</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <ReferenceForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
      </div>
    </div>
  )
}
