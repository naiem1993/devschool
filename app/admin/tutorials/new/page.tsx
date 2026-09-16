import prisma from '@/lib/prisma'
import TutorialForm from '@/components/admin/TutorialForm'
import Link from 'next/link'

export default async function NewTutorialPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href="/admin/tutorials"
        className="text-sm text-[#15803d] hover:underline"
      >
        ← ফিরে যান
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-2 text-gray-900 dark:text-white">
        নতুন টিউটোরিয়াল
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        শুধু course-এর shell বানাও (title, slug, category)। Save করলে সোজা
        chapters পেজে যাবে — সেখানে একটার পর একটা lesson যোগ করতে পারবে।
      </p>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <TutorialForm
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        />
      </div>
    </div>
  )
}
