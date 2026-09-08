import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // ১. ক্যাটাগরি + প্রতিটি ক্যাটাগরির ৩টি টিউটোরিয়াল
  let categories: any[] = [];
  let popularTutorials: any[] = [];
  let latestTutorials: any[] = [];

  try {
    categories = await prisma.category.findMany({
      include: {
        tutorials: {
          where: { isPublished: true },
          take: 3,
          orderBy: { views: 'desc' },
        },
      },
      take: 6,
    });

    // ২. জনপ্রিয় টিউটোরিয়াল (ভিউ অনুযায়ী)
    popularTutorials = await prisma.tutorial.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { views: 'desc' },
      take: 6,
    });

    // ৩. সর্বশেষ টিউটোরিয়াল (তারিখ অনুযায়ী)
    latestTutorials = await prisma.tutorial.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
  } catch (error) {
    console.error('Database connection failed:', error);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100">
      
      {/* === হিরো সেকশন === */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-16 md:py-24 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            আধুনিক প্রযুক্তি শিখুন, <br className="sm:hidden" />
            <span className="text-yellow-300">নিজের গতিতে</span>
          </h1>
          <p className="mt-3 text-lg text-white/80 max-w-2xl mx-auto">
            HTML, CSS, JavaScript, Python — ইন্টারঅ্যাকটিভ টিউটোরিয়াল, কুইজ ও কোড চ্যালেঞ্জ
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/categories"
              className="px-6 py-2.5 bg-white text-indigo-700 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              🚀 শুরু করুন
            </Link>
            <Link
              href="/playground"
              className="px-6 py-2.5 bg-indigo-500 text-white rounded-full font-semibold border border-white/20 hover:bg-indigo-400 hover:scale-105 transition-all duration-200"
            >
              ✏️ কোড ট্রাই করুন
            </Link>
          </div>
          {/* স্ট্যাটস */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/90">
            <div><span className="font-bold text-white text-lg">২০+</span> ভাষা</div>
            <div><span className="font-bold text-white text-lg">১০০+</span> টিউটোরিয়াল</div>
            <div><span className="font-bold text-white text-lg">৫০+</span> কুইজ</div>
            <div><span className="font-bold text-white text-lg">১০+</span> চ্যালেঞ্জ</div>
          </div>
        </div>
      </section>

      {/* === ক্যাটাগরি সেকশন === */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">📂 বিষয় অনুযায়ী শিখুন</h2>
          <Link href="/categories" className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline font-medium">
            সব দেখুন →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(categories as any[]).map((cat: any) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group bg-gray-100 dark:bg-gray-800 rounded-xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-transparent hover:border-indigo-300 dark:hover:border-indigo-700"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {cat.name}
                </h3>
                <span className="text-2xl opacity-60">{cat.icon || '📘'}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {cat.tutorials.length} টি টিউটোরিয়াল
              </p>
              {cat.tutorials.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {cat.tutorials.map((t: any) => (
                    <li key={t.id}>• {t.title}</li>
                  ))}
                </ul>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* === জনপ্রিয় টিউটোরিয়াল === */}
      <section className="py-16 bg-gray-50 dark:bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">🔥 জনপ্রিয় টিউটোরিয়াল</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(popularTutorials as any[]).map((tutorial: any) => (
              <Link
                key={tutorial.id}
                href={`/tutorials/${tutorial.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 rounded-full">
                    {tutorial.difficulty}
                  </span>
                  <span className="text-xs text-gray-400">👁️ {tutorial.views}</span>
                </div>
                <h3 className="text-lg font-semibold mt-3 group-hover:text-indigo-600 transition">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {tutorial.category.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === সর্বশেষ টিউটোরিয়াল === */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8">🆕 সর্বশেষ টিউটোরিয়াল</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(latestTutorials as any[]).map((tutorial: any) => (
            <Link
              key={tutorial.id}
              href={`/tutorials/${tutorial.slug}`}
              className="block bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded-full">
                  নতুন
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(tutorial.createdAt).toLocaleDateString('bn-BD')}
                </span>
              </div>
              <h3 className="text-lg font-semibold mt-3">{tutorial.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {tutorial.category.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* === ডোনেশন / সাপোর্ট সেকশন === */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800/30 text-center border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl font-semibold">❤️ সাইটটি বিনামূল্যে রাখতে সাহায্য করুন</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            দান করুন বা আমাদের অ্যাড দেখে সাপোর্ট দিন।
          </p>
          <Link
            href="/donate"
            className="inline-block mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 hover:shadow-lg transition-all duration-200"
          >
            দান করুন 💝
          </Link>
        </div>
      </section>
    </div>
  );
}