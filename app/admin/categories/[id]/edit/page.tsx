import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CategoryForm from '@/components/admin/CategoryForm'
import Link from 'next/link'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) return notFound()

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/categories" className="text-sm text-indigo-600 hover:underline">← ফিরে যান</Link>
      <h1 className="text-3xl font-bold mt-2 mb-6 text-gray-900 dark:text-white">ক্যাটাগরি এডিট</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <CategoryForm
          mode="edit"
          initial={{
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            icon: category.icon || '',
            isActive: category.isActive,
            sortOrder: category.sortOrder,
          }}
        />
      </div>
    </div>
  )
}
