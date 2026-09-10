import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true }
  })

  return {
    title: category ? `${category.name} — DevSchool` : 'ক্যাটাগরি পাওয়া যায়নি',
    description: category?.description || `${category?.name ?? ''} সম্পর্কে বিস্তারিত টিউটোরিয়াল ও গাইড`,
    openGraph: {
      title: category?.name,
      description: category?.description ?? undefined,
    }
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      tutorials: {
        where: { isPublished: true },
        orderBy: { viewCount: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          viewCount: true,
          duration: true,
        },
      },
    },
  })

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19]">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">📂</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">ক্যাটাগরি পাওয়া যায়নি</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">আপনি যে ক্যাটাগরি খুঁজছেন তা পাওয়া যায়নি।</p>
          <Link href="/" className="mt-6 inline-block px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500">
            হোম পেজে যান
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/categories" className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline">
            ← সকল ক্যাটাগরি
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{category.icon || '📘'}</span>
            <div>
              <h1 className="text-3xl font-extrabold">{category.name}</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">{category.description}</p>
            </div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            মোট {category.tutorials.length} টি টিউটোরিয়াল
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.tutorials.map((tutorial: any) => (
            <Link
              key={tutorial.id}
              href={`/tutorials/${tutorial.slug}`}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {tutorial.difficulty}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>👁️ {tutorial.viewCount}</span>
                    {tutorial.duration && <span>⏱️ {tutorial.duration} min</span>}
                  </div>
                </div>
                <h3 className="text-lg font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2">
                  {tutorial.title}
                </h3>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-1 transition">
                পড়ুন →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
