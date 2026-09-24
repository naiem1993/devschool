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

  const tutorial = await prisma.tutorial.findUnique({
    where: { id },
    include: {
      _count: { select: { chapters: true, groups: true } },
    },
  })
  if (!tutorial) return notFound()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/tutorials" className="text-sm text-[#15803d] hover:underline">
        ← ফিরে যান
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-1 text-gray-900 dark:text-white">
        টিউটোরিয়াল এডিট
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {tutorial._count.chapters} chapter · {tutorial._count.groups} group ·{' '}
        <Link href={`/admin/tutorials/${tutorial.id}/chapters`} className="text-[#15803d] hover:underline">
          chapter/lesson manage করো →
        </Link>
      </p>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <TutorialForm
          initial={{
            id: tutorial.id,
            titleBn: tutorial.titleBn,
            slug: tutorial.slug,
            descriptionBn: tutorial.descriptionBn || '',
            difficulty: tutorial.difficulty,
            duration: tutorial.duration,
            isActive: tutorial.isActive,
            isPublished: tutorial.isPublished,
          }}
          mode="edit"
        />
      </div>
    </div>
  )
}
