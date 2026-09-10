import ChallengeForm from '@/components/admin/ChallengeForm'
import Link from 'next/link'

export default function NewChallengePage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/challenges" className="text-sm text-indigo-600 hover:underline">← ফিরে যান</Link>
      <h1 className="text-3xl font-bold mt-2 mb-6 text-gray-900 dark:text-white">নতুন চ্যালেঞ্জ</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <ChallengeForm />
      </div>
    </div>
  )
}
