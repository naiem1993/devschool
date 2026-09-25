import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import HomeSearch from '@/components/HomeSearch';
import LoadMoreTutorials from '@/components/LoadMoreTutorials';
import HeroSection from '@/components/HeroSection';
import ContentComingSoon from '@/components/ContentComingSoon';
import HomeExtras from '@/components/HomeExtras';
import HomeErrorPanel from '@/components/HomeErrorPanel';
import { getHeroSettings, getReviewsSettings, getFaqSettings } from '@/lib/site-settings';
import { isLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { getDictionarySync } from '@/lib/i18n/dictionaries';
import { pickText } from '@/lib/i18n/localize';

// ISR: ৫ মিনিট cache। Home-এ কোনো user-specific data নেই (শুধু public published tutorials),
// তাই static-safe। প্রতিটা request-এ DB hit হবে না → multi-x fast।
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const dict = getDictionarySync(locale)

  const tutorialCount = await prisma.tutorial.count({
    where:
      locale === 'en'
        ? { isPublished: true, titleEn: { not: null } }
        : { isPublished: true },
  });

  const title = dict.home.metaTitleTpl.replace('{count}', String(tutorialCount))
  const description = dict.home.metaDescTpl.replace('{count}', String(tutorialCount))
  const ogDesc = dict.home.metaOgDesc.replace('{count}', String(tutorialCount))

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { bn: '/bn', en: '/en', 'x-default': '/bn' },
    },
    openGraph: {
      title: dict.home.metaTitleStatic,
      description: ogDesc,
      url: '/',
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const dict = getDictionarySync(locale)

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
    const popularRaw = await prisma.tutorial.findMany({
      where:
        locale === 'en'
          ? { isPublished: true, titleEn: { not: null } }
          : { isPublished: true },
      select: {
        id: true,
        titleBn: true,
        titleEn: true,
        slug: true,
        difficulty: true,
        viewCount: true,
        duration: true,
        rating: true,
      },
      orderBy: { viewCount: 'desc' },
      take: 6,
    });

    popularTutorials = popularRaw.map((t) => ({
      id: t.id,
      title: pickText(locale, t.titleBn, t.titleEn) ?? '',
      slug: t.slug,
      difficulty: t.difficulty,
      views: t.viewCount,
      duration: t.duration,
      rating: t.rating,
    }));

    const latestRaw = await prisma.tutorial.findMany({
      where:
        locale === 'en'
          ? { isPublished: true, titleEn: { not: null } }
          : { isPublished: true },
      select: {
        id: true,
        titleBn: true,
        titleEn: true,
        slug: true,
        difficulty: true,
        viewCount: true,
        duration: true,
        rating: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    latestTutorials = latestRaw.map((t) => ({
      id: t.id,
      title: pickText(locale, t.titleBn, t.titleEn) ?? '',
      slug: t.slug,
      difficulty: t.difficulty,
      views: t.viewCount,
      duration: t.duration,
      rating: t.rating,
    }));

    const allTutorialsRaw = await prisma.tutorial.findMany({
      where:
        locale === 'en'
          ? { isPublished: true, titleEn: { not: null } }
          : { isPublished: true },
      select: {
        id: true,
        titleBn: true,
        titleEn: true,
        slug: true,
        difficulty: true,
        viewCount: true,
        chapters: { select: { id: true, slug: true, titleBn: true, titleEn: true } },
      },
      take: 50,
    });

    allTutorialsForSearch = allTutorialsRaw.map((t) => ({
      id: t.id,
      title: pickText(locale, t.titleBn, t.titleEn) ?? '',
      slug: t.slug,
      difficulty: t.difficulty,
      viewCount: t.viewCount,
      chapters: t.chapters.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: pickText(locale, c.titleBn, c.titleEn) ?? '',
      })),
    }));

    [tutorialCount, quizCount, challengeCount] = await Promise.all([
      prisma.tutorial.count({ where: { isPublished: true } }),
      prisma.quizQuestion.count(),
      prisma.codeChallenge.count(),
    ]);
    languageCount = tutorialCount;

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

    // Marquee-র tech list: সব tutorial-এর নাম
    const allTuts = await prisma.tutorial.findMany({
      where:
        locale === 'en'
          ? { isPublished: true, titleEn: { not: null } }
          : { isPublished: true },
      select: { titleBn: true, titleEn: true },
      orderBy: { viewCount: 'desc' },
      take: 12,
    });
    allCategoryNames = allTuts
      .map((t) => pickText(locale, t.titleBn, t.titleEn))
      .filter((v): v is string => v !== null);
  } catch (error: any) {
    console.error('Database error:', error);
    dbError = true;

    if (error.code === 'P1001') {
      errorMessage = dict.home.errNoConn;
    } else if (error.code === 'P2021') {
      errorMessage = dict.home.errNoTable;
    } else {
      errorMessage = dict.home.errUnknown;
    }
  }

  if (dbError) {
    return <HomeErrorPanel message={errorMessage} />;
  }

  const hero = await getHeroSettings(locale)
  const reviewsSettings = await getReviewsSettings()
  const faqSettings = await getFaqSettings(locale)

  return (
    <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806] text-slate-900 dark:text-slate-100 font-sans">
      {/* === হিরো সেকশন === */}
      {hero ? (
        <HeroSection
          hero={hero}
          tutorials={allTutorialsForSearch}
          stats={{ languageCount, tutorialCount, quizCount, challengeCount }}
        />
      ) : (
        /* locale='en' কিন্তু DB-তে 'hero_en' এখনো লেখা হয়নি → ComingSoon */
        <ContentComingSoon />
      )}

      {/* === নতুন সেকশনগুলো (marquee / bento / timeline / reviews / FAQ / CTA) === */}
      <HomeExtras
        dict={dict}
        locale={locale}
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
          <h2 className="text-3xl font-extrabold tracking-tight">{dict.home.trackTitle}</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {dict.home.trackSubtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              🌐
            </div>
            <h3 className="text-xl font-bold">{dict.home.frontendTitle}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {dict.home.frontendDesc}
            </p>
            <Link
              href="/tutorials"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 mt-6 group-hover:translate-x-1 transition"
            >
              {dict.home.startTrack}
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              ⚙️
            </div>
            <h3 className="text-xl font-bold">{dict.home.backendTitle}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {dict.home.backendDesc}
            </p>
            <Link
              href="/tutorials"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-6 group-hover:translate-x-1 transition"
            >
              {dict.home.startTrack}
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/10 text-[#15803d] dark:text-[#4ADE80] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              🧠
            </div>
            <h3 className="text-xl font-bold">{dict.home.fullstackTitle}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {dict.home.fullstackDesc}
            </p>
            <Link
              href="/tutorials"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#15803d] dark:text-[#4ADE80] mt-6 group-hover:translate-x-1 transition"
            >
              {dict.home.startTrack}
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
