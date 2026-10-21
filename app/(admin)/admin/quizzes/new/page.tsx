import prisma from '@/lib/prisma'
import QuizForm from '@/components/admin/QuizForm'
import Link from 'next/link'

export default async function NewQuizPage() {
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
      <h1 className="text-3xl font-bold mt-2 mb-6 text-gray-900 dark:text-white">
        নতুন কুইজ প্রশ্ন
      </h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <QuizForm
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
    </div>
  )
}
