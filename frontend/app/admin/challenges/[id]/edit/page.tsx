import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ChallengeForm from '@/components/admin/ChallengeForm'
import Link from 'next/link'

export default async function EditChallengePage({ params }: { params: { id: string } }) {
  const [c, tutorials] = await Promise.all([
    prisma.codeChallenge.findUnique({
      where: { id: params.id },
      include: { testCases: { orderBy: { testCaseOrder: 'asc' } } },
    }),
    prisma.tutorial.findMany({ where: { isActive: true }, orderBy: { title: 'asc' } }),
  ])
  if (!c) return notFound()

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/challenges" className="text-sm text-indigo-600 hover:underline">← ফিরে যান</Link>
      <h1 className="text-3xl font-bold mt-2 mb-6 text-gray-900 dark:text-white">চ্যালেঞ্জ এডিট</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <ChallengeForm
          initial={{
            id: c.id,
            tutorialId: c.tutorialId,
            title: c.title,
            description: c.description,
            starterCode: c.starterCode || '',
            solution: c.solution || '',
            difficulty: c.difficulty,
            points: c.points,
            testCases: c.testCases.map((t) => ({ input: t.input, expectedOutput: t.expectedOutput, isHidden: t.isHidden })),
          }}
          tutorials={tutorials.map((t) => ({ id: t.id, title: t.title }))}
          mode="edit"
        />
      </div>
    </div>
  )
}
