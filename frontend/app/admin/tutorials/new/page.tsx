import TutorialForm from '@/components/admin/TutorialForm'
import Link from 'next/link'

export default function NewTutorialPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/tutorials" className="text-sm text-indigo-600 hover:underline">← ফিরে যান</Link>
      <h1 className="text-3xl font-bold mt-2 mb-6 text-gray-900 dark:text-white">নতুন টিউটোরিয়াল</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <TutorialForm />
      </div>
    </div>
  )
}
