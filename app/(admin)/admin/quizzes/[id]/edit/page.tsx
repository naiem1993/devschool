import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import QuizForm from '@/components/admin/QuizForm'
import Link from 'next/link'

export default async function EditQuizPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [q, tutorials, lessons, chapters] = await Promise.all([
    prisma.quizQuestion.findUnique({
      where: { id },
      include: { options: { orderBy: { optionOrder: 'asc' } } },
    }),
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

  if (!q) return notFound()

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/quizzes" className="text-sm text-[#15803d] hover:underline">
        ← ফিরে যান
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6 text-gray-900 dark:text-white">
        কুইজ এডিট
      </h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <QuizForm
          initial={{
            id: q.id,
            tutorialId: q.tutorialId,
            lessonId: q.lessonId || '',
            chapterId: q.chapterId || '',
            questionBn: q.questionBn,
            questionEn: q.questionEn || '',
            explanationBn: q.explanationBn || '',
            explanationEn: q.explanationEn || '',
            orderIndex: q.orderIndex,
            options: q.options.map((o) => ({
              textBn: o.textBn,
              textEn: o.textEn || '',
              isCorrect: o.isCorrect,
            })),
          }}
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
          mode="edit"
        />
      </div>
    </div>
  )
}
