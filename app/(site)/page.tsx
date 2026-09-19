import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import HomeSearch from '@/components/HomeSearch';
import LoadMoreTutorials from '@/components/LoadMoreTutorials';
import HeroSection from '@/components/HeroSection';
import HomeExtras from '@/components/HomeExtras';
import { getHeroSettings, getReviewsSettings, getFaqSettings } from '@/lib/site-settings';

// ISR: ৫ মিনিট cache। Home-এ কোনো user-specific data নেই (শুধু public published tutorials),
// তাই static-safe। প্রতিটা request-এ DB hit হবে না → multi-x fast।
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const tutorialCount = await prisma.tutorial.count({ where: { isPublished: true } });
  const categoryCount = await prisma.category.count();

  return {
    title: `DevSchool — ${tutorialCount}+ টি টিউটোরিয়াল, ${categoryCount} টি ভাষা`,
    description: `বিনামূল্যে প্রোগ্রামিং শিখুন। ${tutorialCount} টি টিউটোরিয়াল, ইন্টারঅ্যাকটিভ কুইজ ও প্র্যাকটিস চ্যালেঞ্জ।`,
    alternates: {
      canonical: 'https://devschool.com',
    },
    openGraph: {
      title: 'DevSchool — বিনামূল্যে প্রোগ্রামিং শিখুন',
      description: `${tutorialCount} টি টিউটোরিয়াল সহ সম্পূর্ণ ফ্রি লার্নিং প্ল্যাটফর্ম`,
      url: '/',
    },
  };
}

export default async function HomePage() {
  let categories: any[] = [];
  let popularTutorials: any[] = [];
  let latestTutorials: any[] = [];
  let allTutorialsForSearch: any[] = [];
  let reviews: any[] = [];
  let allCategoryNames: string[] = [];
  let reviewsCount = 0;
  let reviewsAvg = 0;
  let languageCount = 0;
  let tutorialCount = 0;
  let quizCount = 0;
  let challengeCount = 0;
  let dbError = false;
  let errorMessage = '';

  try {
    categories = await prisma.category.findMany({
      include: {
        tutorials: {
          where: { isPublished: true },
          take: 3,
          orderBy: { viewCount: 'desc' },
        },
      },
      take: 6,
    });

    popularTutorials = await prisma.tutorial.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        viewCount: true,
        duration: true,
        rating: true,
        category: { select: { name: true } },
      },
      orderBy: { viewCount: 'desc' },
      take: 6,
    });

    latestTutorials = await prisma.tutorial.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        viewCount: true,
        duration: true,
        rating: true,
        category: { select: { name: true } },
      },
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
        viewCount: true,
        chapters: { select: { id: true, slug: true, title: true } },
        category: { select: { name: true } },
      },
      take: 50,
    });

    [languageCount, tutorialCount, quizCount, challengeCount] = await Promise.all([
      prisma.category.count(),
      prisma.tutorial.count({ where: { isPublished: true } }),
      prisma.quizQuestion.count(),
      prisma.codeChallenge.count(),
    ]);

    reviews = await prisma.review.findMany({
      where: { status: 'approved' },
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: { id: true, name: true, role: true, stars: true, text: true },
    });

    const reviewAgg = await prisma.review.aggregate({
      where: { status: 'approved' },
      _count: { _all: true },
      _avg: { stars: true },
    });
    reviewsCount = reviewAgg._count._all;
    reviewsAvg = reviewAgg._avg.stars ?? 0;

    // Marquee-র tech list: সব active category-র নাম sortOrder অনুযায়ী
    const allCats = await prisma.category.findMany({
      where: { isActive: true },
      select: { name: true },
      orderBy: { sortOrder: 'asc' },
    });
    allCategoryNames = allCats.map((c) => c.name);
  } catch (error: any) {
    console.error('Database error:', error);
    dbError = true;

    if (error.code === 'P1001') {
      errorMessage = 'ডেটাবেজ সার্ভারে সংযোগ করা যাচ্ছে না। নেটওয়ার্ক চেক করুন।';
    } else if (error.code === 'P2021') {
      errorMessage = 'ডেটাবেজ টেবিল পাওয়া যাচ্ছে না। মাইগ্রেশন চালান।';
    } else {
      errorMessage = 'অজানা সমস্যা হয়েছে। আমরা সমাধানে কাজ করছি।';
    }
  }

  if (dbError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2FBF4] dark:bg-[#050806] p-4">
        <div className="text-center max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="text-6xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">সংযোগ সমস্যা</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">{errorMessage}</p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#22C55E] text-[#050806] rounded-xl hover:bg-[#4ADE80] transition font-semibold"
            >
              আবার চেষ্টা করুন 🔄
            </button>
            <Link
              href="/categories"
              className="text-sm text-[#15803d] dark:text-[#4ADE80] hover:underline"
            >
              ব্রাউজিং চালিয়ে যান →
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            সমস্যা থাকলে আমাদের <a href="mailto:support@devschool.com" className="underline">সাপোর্টে</a> জানান
          </p>
        </div>
      </div>
    );
  }

  const hero = await getHeroSettings()
  const reviewsSettings = await getReviewsSettings()
  const faqSettings = await getFaqSettings()

  return (
    <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806] text-slate-900 dark:text-slate-100 font-sans">
      {/* === হিরো সেকশন === */}
      <HeroSection
        hero={hero}
        tutorials={allTutorialsForSearch}
        stats={{ languageCount, tutorialCount, quizCount, challengeCount }}
      />

      {/* === নতুন সেকশনগুলো (marquee / bento / timeline / reviews / FAQ / CTA) === */}
      <HomeExtras
        reviews={reviews}
        reviewsCount={reviewsCount}
        reviewsAvg={reviewsAvg}
        reviewsEnabled={reviewsSettings.enabled}
        faqItems={faqSettings.items}
        techItems={allCategoryNames}
      />

      {/* === লার্নিং ট্র্যাক / রোডম্যাপ সেকশন === */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">🗺️ ক্যারিয়ার লার্নিং ট্র্যাক</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            শূন্য থেকে প্রফেশনাল ডেভেলপার হওয়ার স্টেপ-বাই-স্টেপ রোডম্যাপ
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              🌐
            </div>
            <h3 className="text-xl font-bold">Frontend Master</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              HTML, CSS, JavaScript, React, Next.js শিখুন এবং মডার্ন ইউজার ইন্টারফেস তৈরি করুন।
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 mt-6 group-hover:translate-x-1 transition"
            >
              ট্র্যাক শুরু করুন →
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              ⚙️
            </div>
            <h3 className="text-xl font-bold">Backend Engineer</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Node.js, Express, Python, Databases, API Design এবং সার্ভার আর্কিটেকচার মাস্টার করুন।
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-6 group-hover:translate-x-1 transition"
            >
              ট্র্যাক শুরু করুন →
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/10 text-[#15803d] dark:text-[#4ADE80] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              🧠
            </div>
            <h3 className="text-xl font-bold">Full Stack Developer</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              ফ্রন্টএন্ড ও ব্যাকএন্ড দুই দিকেই দক্ষ হন। ডাটাবেস, ডিপ্লয়মেন্ট, অথেন্টিকেশন সব শিখুন।
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#15803d] dark:text-[#4ADE80] mt-6 group-hover:translate-x-1 transition"
            >
              ট্র্যাক শুরু করুন →
            </Link>
          </div>
        </div>
      </section>

      {/* === জনপ্রিয় টিউটোরিয়াল === */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">🔥 জনপ্রিয় টিউটোরিয়াল</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">আমাদের কমিউনিটিতে সবচেয়ে বেশি পঠিত টিউটোরিয়ালগুলো</p>
        </div>
        <LoadMoreTutorials initialTutorials={popularTutorials} />
      </section>

      {/* === নতুন টিউটোরিয়াল === */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">✨ নতুন টিউটোরিয়াল</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">সবচেয়ে সাম্প্রতিক কন্টেন্ট দিয়ে আপডেট থাকুন</p>
        </div>
        <LoadMoreTutorials initialTutorials={latestTutorials} />
      </section>
    </div>
  );
}
