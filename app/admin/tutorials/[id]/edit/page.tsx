import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import TutorialForm from '@/components/admin/TutorialForm'
import Link from 'next/link'

export default async function EditTutorialPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [tutorial, categories] = await Promise.all([
    prisma.tutorial.findUnique({
      where: { id },
      include: { contents: { orderBy: { chapterNo: 'asc' } } },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ])
  if (!tutorial) return notFound()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/tutorials" className="text-sm text-indigo-600 hover:underline">← ফিরে যান</Link>
      <h1 className="text-3xl font-bold mt-2 mb-6 text-gray-900 dark:text-white">টিউটোরিয়াল এডিট</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <TutorialForm
          initial={{
            id: tutorial.id,
            title: tutorial.title,
            slug: tutorial.slug,
            description: tutorial.description || '',
            difficulty: tutorial.difficulty,
            categoryId: tutorial.categoryId,
            isActive: tutorial.isActive,
            isPublished: tutorial.isPublished,
            contents: tutorial.contents.map((c) => ({
              chapterNo: c.chapterNo,
              title: c.title,
              content: c.content,
              codeExample: c.codeExample || '',
            })),
          }}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          mode="edit"
        />
      </div>
    </div>
  )
}
