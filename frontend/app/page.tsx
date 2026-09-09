import Link from 'next/link';
import prisma from '@/lib/prisma';
import HomeSearch from '@/components/HomeSearch';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let categories: any[] = [];
  let popularTutorials: any[] = [];
  let latestTutorials: any[] = [];
  let allTutorialsForSearch: any[] = [];

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

    popularTutorials = await prisma.tutorial.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { views: 'desc' },
      take: 6,
    });

    latestTutorials = await prisma.tutorial.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    allTutorialsForSearch = await prisma.tutorial.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        views: true,
        category: { select: { name: true } },
      },
      take: 50,
    });
  } catch (error) {
    console.error('Database connection failed:', error);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans">
      
      {/* === হিরো সেকশন === */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-[#0b0f19] text-white py-20 lg:py-28 text-center border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
            ✨ আপনার প্রোগ্রামিং ক্যারিয়ার গড়ার বিশ্বস্ত প্ল্যাটফর্ম
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            আধুনিক প্রযুক্তি শিখুন, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">নিজের গতিতে মাস্টার হন</span>
          </h1>
          <p className="mt-4 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal">
            ইন্টারঅ্যাকটিভ টিউটোরিয়াল, রিয়েল-ওয়ার্ল্ড প্রজেক্ট, কোড চ্যালেঞ্জ ও কুইজের মাধ্যমে হাতে-কলমে কোডিং শিখুন।
          </p>

          {/* লাইভ সার্চ উইজেট */}
          <HomeSearch tutorials={allTutorialsForSearch} />

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/categories"
              className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all duration-200"
            >
              🚀 টিউটোরিয়াল ব্রাউজ করুন
            </Link>
            <Link
              href="/challenges"
              className="px-7 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-2xl font-bold border border-slate-700 hover:scale-105 transition-all duration-200"
            >
              ⚡ কোড চ্যালেঞ্জ ট্রাই করুন
            </Link>
          </div>

          {/* স্ট্যাটস কাউন্টার */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-800/80 pt-8">
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-4">
              <div className="text-3xl font-extrabold text-indigo-400">২০+</div>
              <div className="text-xs text-slate-400 mt-1">প্রোগ্রামিং ভাষা ও টেকনোলজি</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-4">
              <div className="text-3xl font-extrabold text-purple-400">১০০+</div>
              <div className="text-xs text-slate-400 mt-1">ডিটেইলড টিউটোরিয়াল</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-4">
              <div className="text-3xl font-extrabold text-pink-400">৫০+</div>
              <div className="text-xs text-slate-400 mt-1">ইন্টারঅ্যাকটিভ কুইজ</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-4">
              <div className="text-3xl font-extrabold text-emerald-400">১০+</div>
              <div className="text-xs text-slate-400 mt-1">প্র্যাকটিস চ্যালেঞ্জ</div>
            </div>
          </div>
        </div>
      </section>

      {/* === লার্নিং ট্র্যাক / রোডম্যাপ সেকশন === */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">🗺️ ক্যারিয়ার লার্নিং ট্র্যাক</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">শূন্য থেকে প্রফেশনাল ডেভেলপার হওয়ার স্টেপ-বাই-স্টেপ রোডম্যাপ</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              🌐
            </div>
            <h3 className="text-xl font-bold">Frontend Master</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">HTML, CSS, JavaScript, React, Next.js শিখুন এবং মডার্ন ইউজার ইন্টারফেস তৈরি করুন।</p>
            <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 mt-6 group-hover:translate-x-1 transition">
              ট্র্যাক শুরু করুন →
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              ⚙️
            </div>
            <h3 className="text-xl font-bold">Backend Engineer</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Node.js, Express, Python, Databases, API Design এবং সার্ভার আর্কিটেকচার মাস্টার করুন।</p>
            <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-6 group-hover:translate-x-1 transition">
              ট্র্যাক শুরু করুন →
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              🚀
            </div>
            <h3 className="text-xl font-bold">Full Stack Developer</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">ফ্রন্টএন্ড ও ব্যাকএন্ড মিলিয়ে কমপ্লিট প্রজেক্ট ডেভেলপমেন্ট ও ডেভপস স্কিল অর্জন করুন।</p>
            <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 dark:text-purple-400 mt-6 group-hover:translate-x-1 transition">
              ট্র্যাক শুরু করুন →
            </Link>
          </div>
        </div>
      </section>

      {/* === ক্যাটাগরি সেকশন === */}
      <section className="py-16 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">📂 বিষয় অনুযায়ী শিখুন</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">আপনার পছন্দের ক্যাটাগরি বেছে নিন</p>
            </div>
            <Link href="/categories" className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline font-bold flex items-center gap-1">
              সব ক্যাটাগরি দেখুন →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(categories as any[]).map((cat: any) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">{cat.icon || '📘'}</span>
                  <span className="text-xs font-bold px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full">
                    {cat.tutorials.length} টিউটোরিয়াল
                  </span>
                </div>
                <h3 className="text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {cat.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {cat.description || `${cat.name} সম্পর্কিত বিস্তারিত টিউটোরিয়াল ও প্র্যাকটিস।`}
                </p>

                {cat.tutorials.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                    {cat.tutorials.map((t: any) => (
                      <div key={t.id} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        <span className="truncate">{t.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === জনপ্রিয় টিউটোরিয়াল === */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">🔥 জনপ্রিয় টিউটোরিয়াল</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">সবচেয়ে বেশি পঠিত টিউটোরিয়ালসমূহ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(popularTutorials as any[]).map((tutorial: any) => (
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
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    👁️ {tutorial.views} views
                  </span>
                </div>
                <h3 className="text-lg font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2">
                  {tutorial.title}
                </h3>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{tutorial.category?.name || 'DevSchool'}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-1 transition">পড়ুন →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* === সর্বশেষ টিউটোরিয়াল === */}
      <section className="py-16 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">🆕 সর্বশেষ টিউটোরিয়াল</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">সম্প্রতি প্রকাশিত নতুন লেসনসমূহ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(latestTutorials as any[]).map((tutorial: any) => (
              <Link
                key={tutorial.id}
                href={`/tutorials/${tutorial.slug}`}
                className="group bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      নতুন
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(tutorial.createdAt).toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition line-clamp-2">
                    {tutorial.title}
                  </h3>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{tutorial.category?.name || 'DevSchool'}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-1 transition">পড়ুন →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === ডোনেশন ও সাপোর্ট সেকশন === */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-3xl">❤️</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-3">সাইটটি সম্পূর্ণ বিনামূল্যে রাখতে সাহায্য করুন</h2>
          <p className="text-slate-300 mt-2 text-sm sm:text-base">
            আমাদের লক্ষ্য বাংলাদেশের প্রতিটি শিক্ষার্থীর কাছে ফ্রি প্রোগ্রামিং শিক্ষা পৌঁছে দেওয়া। আপনার ছোট্ট সহযোগিতা আমাদের সার্ভার ও কন্টেন্ট আপডেট রাখতে সাহায্য করবে।
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/donate"
              className="px-8 py-3.5 bg-white text-indigo-900 hover:bg-slate-100 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all duration-200"
            >
              সাপোর্ট করুন 💝
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
