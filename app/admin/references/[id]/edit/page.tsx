import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ReferenceForm from '@/components/admin/ReferenceForm'
import Link from 'next/link'

export default async function EditReferencePage({ params }: { params: { id: string } }) {
  const [r, categories] = await Promise.all([
    prisma.reference.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ])
  if (!r) return notFound()

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/references" className="text-sm text-indigo-600 hover:underline">← ফিরে যান</Link>
      <h1 className="text-3xl font-bold mt-2 mb-6 text-gray-900 dark:text-white">রেফারেন্স এডিট</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <ReferenceForm
          initial={{
            id: r.id,
            categoryId: r.categoryId,
            title: r.title,
            slug: r.slug,
            description: r.description || '',
            syntax: r.syntax || '',
            example: r.example || '',
            tags: r.tags.join(', '),
            language: r.language || 'javascript',
          }}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          mode="edit"
        />
      </div>
    </div>
  )
}
