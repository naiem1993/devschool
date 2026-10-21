import prisma from '@/lib/prisma'
import BulkQuizImport from '@/components/admin/BulkQuizImport'
import Link from 'next/link'

export default async function BulkQuizPage() {
  const [tutorials, lessons, chapters] = await Promise.all([
    prisma.tutorial.findMany({
      where: { isActive: true },
      orderBy: { titleBn: 'asc' },
      select: { id: true, titleBn: true },
    }),
    prisma.lesson.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        titleBn: true,
        chapter: {
          select: {
            tutorialId: true,
            tutorial: { select: { titleBn: true } },
          },
        },
      },
    }),
    prisma.chapter.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        titleBn: true,
        tutorialId: true,
        tutorial: { select: { titleBn: true } },
        _count: { select: { lessons: true } },
      },
    }),
  ])

  return (
    <div className='w-full max-w-5xl mx-auto'>
      <Link href="/admin/quizzes" className="text-sm text-[#15803d] hover:underline">
        ← ফিরে যান
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-2 text-gray-900 dark:text-white">
        বাল্ক কুইজ ইমপোর্ট
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        একবারে অনেকগুলো কুইজ পেস্ট করে সেভ করুন। AI থেকে কপি করে সরাসরি পেস্ট করা যাবে।
      </p>

      <BulkQuizImport
        tutorials={tutorials.map((t) => ({ id: t.id, title: t.titleBn }))}
        lessons={lessons.map((l) => ({
          id: l.id,
          title: `${l.chapter.tutorial.titleBn} → ${l.titleBn}`,
          tutorialId: l.chapter.tutorialId,
        }))}
        chapters={chapters.map((c) => ({
          id: c.id,
          title: `${c.tutorial.titleBn} → ${c.titleBn}`,
          tutorialId: c.tutorialId,
          hasLessons: c._count.lessons > 0,
        }))}
      />
    </div>
  )
}
