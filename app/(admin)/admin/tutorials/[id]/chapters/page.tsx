import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ChaptersManager, { type ChapterRow } from '@/components/admin/ChaptersManager'
import GroupsManager, { type GroupRow } from '@/components/admin/GroupsManager'

export const dynamic = 'force-dynamic'

/**
 * Chapters + Groups management page (nested v3)
 * tutorial-এর info আলাদা (/edit), chapter/group/lesson এখানে।
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
      groups: {
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { chapters: true } } },
      },
      chapters: {
        orderBy: { sortOrder: 'asc' },
        include: {
          group: { select: { id: true, titleBn: true } },
          lessons: { orderBy: { sortOrder: 'asc' } },
        },
      },
    },
  })
  if (!tutorial) return notFound()

  const groupRows: GroupRow[] = tutorial.groups.map((g) => ({
    id: g.id,
    title: g.titleBn,
    titleEn: g.titleEn,
    sortOrder: g.sortOrder,
    chapterCount: g._count.chapters,
  }))

  const chapterRows: ChapterRow[] = tutorial.chapters.map((c) => ({
    id: c.id,
    title: c.titleBn,
    titleEn: c.titleEn,
    slug: c.slug,
    groupId: c.groupId,
    groupTitle: c.group?.titleBn ?? null,
    content: c.contentBn,
    contentEn: c.contentEn,
    codeExample: c.codeExampleBn,
    codeExampleEn: c.codeExampleEn,
    sortOrder: c.sortOrder,
    lessons: c.lessons.map((l) => ({
      id: l.id,
      title: l.titleBn,
      slug: l.slug,
      content: l.contentBn,
      codeExample: l.codeExampleBn,
      sortOrder: l.sortOrder,
    })),
  }))

  const totalLessons = chapterRows.reduce((n, c) => n + c.lessons.length, 0)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/tutorials" className="text-sm text-[#15803d] hover:underline">
        ← ফিরে যান
      </Link>

      <div className="mt-2 mb-1 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Chapters — {tutorial.titleBn}
        </h1>
        {!tutorial.isPublished && (
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border border-amber-500/40 text-amber-600 dark:text-amber-400">
            unpublished
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {chapterRows.length} chapter · {totalLessons} lesson ·{' '}
        {groupRows.length} group
      </p>

      <div className="space-y-6">
        <GroupsManager tutorialId={tutorial.id} groups={groupRows} />
        <ChaptersManager
          tutorialId={tutorial.id}
          chapters={chapterRows}
          groups={groupRows.map((g) => ({ id: g.id, title: g.title }))}
        />
      </div>
    </div>
  )
}
