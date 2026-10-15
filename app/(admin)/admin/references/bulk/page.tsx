import prisma from '@/lib/prisma'
import BulkReferenceImport from '@/components/admin/BulkReferenceImport'
import Link from 'next/link'

export default async function BulkReferencePage() {
  const tutorials = await prisma.tutorial.findMany({
    where: { isActive: true },
    orderBy: { titleBn: 'asc' },
    select: { id: true, titleBn: true },
  })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/references" className="text-sm text-[#15803d] hover:underline">
        ← ফিরে যান
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-2 text-gray-900 dark:text-white">
        বাল্ক রেফারেন্স ইমপোর্ট
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        একবারে অনেকগুলো কুইক-রেফারেন্স পেস্ট করে সেভ করুন। AI থেকে কপি করে সরাসরি পেস্ট করা যাবে।
      </p>

      <BulkReferenceImport
        tutorials={tutorials.map((t) => ({ id: t.id, title: t.titleBn }))}
      />
    </div>
  )
}
