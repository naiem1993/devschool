import prisma from '@/lib/prisma'
import ReferenceForm from '@/components/admin/ReferenceForm'
import Link from 'next/link'

export default async function NewReferencePage() {
  const tutorials = await prisma.tutorial.findMany({ orderBy: { title: 'asc' } })

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/references" className="text-sm text-[#15803d] hover:underline">← ফিরে যান</Link>
      <h1 className="text-3xl font-bold mt-2 mb-6 text-gray-900 dark:text-white">নতুন রেফারেন্স</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <ReferenceForm tutorials={tutorials.map((t) => ({ id: t.id, title: t.title }))} />
      </div>
    </div>
  )
}
