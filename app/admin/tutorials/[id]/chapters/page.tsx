import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ChaptersManager from '@/components/admin/ChaptersManager'

/**
 * Chapters management page (Option A)
 * tutorial-এর info আলাদা (/edit), chapter গুলো আলাদা (এই পেজ)।
 * এক chapter সেভ করলে বাকিগুলোর ID অটুট থাকে।
 */
export default async function ChaptersPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const tutorial = await prisma.tutorial.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } },
      contents: { orderBy: { chapterNo: 'asc' } },
    },
  })
  if (!tutorial) return notFound()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/tutorials" className="text-sm text-[#15803d] hover:underline">
        ← ফিরে যান
      </Link>

      <div className="mt-2 mb-1 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Chapters — {tutorial.title}
        </h1>
        {!tutorial.isPublished && (
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border border-amber-500/40 text-amber-600 dark:text-amber-400">
            unpublished
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {tutorial.category.name} · {tutorial.contents.length} টি chapter
      </p>

      <ChaptersManager
        tutorialId={tutorial.id}
        chapters={tutorial.contents.map((c) => ({
          id: c.id,
          chapterNo: c.chapterNo,
          title: c.title,
          content: c.content,
          codeExample: c.codeExample,
        }))}
      />
    </div>
  )
}
