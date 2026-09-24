import prisma from '@/lib/prisma'
import QuizForm from '@/components/admin/QuizForm'
import Link from 'next/link'

export default async function NewQuizPage() {
  const tutorials = await prisma.tutorial.findMany({ where: { isActive: true }, orderBy: { titleBn: 'asc' } })

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/quizzes" className="text-sm text-[#15803d] hover:underline">← ফিরে যান</Link>
      <h1 className="text-3xl font-bold mt-2 mb-6 text-gray-900 dark:text-white">নতুন কুইজ প্রশ্ন</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <QuizForm tutorials={tutorials.map((t) => ({ id: t.id, title: t.titleBn }))} />
      </div>
    </div>
  )
}
