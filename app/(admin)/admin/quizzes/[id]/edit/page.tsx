import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import QuizForm from '@/components/admin/QuizForm'
import Link from 'next/link'

export default async function EditQuizPage({ params }: { params: { id: string } }) {
  const [q, tutorials] = await Promise.all([
    prisma.quizQuestion.findUnique({
      where: { id: params.id },
      include: { options: { orderBy: { optionOrder: 'asc' } } },
    }),
    prisma.tutorial.findMany({ where: { isActive: true }, orderBy: { titleBn: 'asc' } }),
  ])
  if (!q) return notFound()

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/quizzes" className="text-sm text-[#15803d] hover:underline">← ফিরে যান</Link>
      <h1 className="text-3xl font-bold mt-2 mb-6 text-gray-900 dark:text-white">কুইজ এডিট</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <QuizForm
          initial={{
            id: q.id,
            tutorialId: q.tutorialId,
            questionBn: q.questionBn,
            questionEn: q.questionEn || '',
            explanationBn: q.explanationBn || '',
            explanationEn: q.explanationEn || '',
            orderIndex: q.orderIndex,
            options: q.options.map((o) => ({ textBn: o.textBn, textEn: o.textEn || '', isCorrect: o.isCorrect })),
          }}
          tutorials={tutorials.map((t) => ({ id: t.id, title: t.titleBn }))}
          mode="edit"
        />
      </div>
    </div>
  )
}
