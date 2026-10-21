import prisma from '@/lib/prisma'
import BulkChallengeImport from '@/components/admin/BulkChallengeImport'
import Link from 'next/link'

export default async function BulkChallengePage() {
  const tutorials = await prisma.tutorial.findMany({
    where: { isActive: true },
    orderBy: { titleBn: 'asc' },
    select: { id: true, titleBn: true },
  })

  return (
    <div className='w-full max-w-5xl mx-auto'>
      <Link href="/admin/challenges" className="text-sm text-[#15803d] hover:underline">
        ← ফিরে যান
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-2 text-gray-900 dark:text-white">
        বাল্ক চ্যালেঞ্জ ইমপোর্ট
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        একবারে অনেকগুলো কোড চ্যালেঞ্জ ও টেস্ট কেস পেস্ট করে সেভ করুন। AI থেকে কপি করে সরাসরি পেস্ট করা যাবে।
      </p>

      <BulkChallengeImport
        tutorials={tutorials.map((t) => ({ id: t.id, title: t.titleBn }))}
      />
    </div>
  )
}
