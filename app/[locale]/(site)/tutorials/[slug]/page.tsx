import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import TutorialShell from '@/components/TutorialShell'
import { getTutorialNav } from '@/lib/tutorial-data'
import type { Locale } from '@/lib/i18n/config'
import { localizeTutorial } from '@/lib/i18n/localize'
import { TRYIT_TEXT } from '@/lib/i18n/tryit-text'
import { localeHref } from '@/lib/i18n/link'

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

// Pure static — admin save করলে `revalidateTutorialPaths()` দিয়ে on-demand refresh হয়।
// ১ দিনের safety net: কোনো mutation route revalidate করতে ভুলে গেলে এই auto-refresh ধরবে।
export const revalidate = 86400

// একই request-এ generateMetadata ও TutorialPage — দুটো থেকেই ডাকা হয়।
// React cache() থাকায় Prisma কোয়েরি একবারই চলে (double-fetch বন্ধ)।
const getTutorial = cache(async (slug: string) => {
  return prisma.tutorial.findUnique({
    where: { slug, isPublished: true },
    select: {
      id: true,
      slug: true,
      titleBn: true,
      titleEn: true,
      descriptionBn: true,
      descriptionEn: true,
      difficulty: true,
    },
  })
})

export async function generateStaticParams() {
  try {
    const tutorials = await prisma.tutorial.findMany({
      where: { isPublished: true },
      select: { slug: true },
      take: 500,
    })
    return tutorials.map((t) => ({ slug: t.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  try {
    const tutorial = await getTutorial(slug)
    if (!tutorial) {
      return {
        title: 'টিউটোরিয়াল পাওয়া যায়নি | DevSchool',
        robots: { index: false, follow: false },
      }
    }
    const localized = localizeTutorial(locale as Locale, tutorial)
    // locale-সঠিক title না থাকলে metadata fallback — main component notFound() দেবে
    if (!localized.title) {
      return { title: 'DevSchool' }
    }
    const description =
      localized.description ||
      `${localized.title} — ${tutorial.difficulty}`
    return {
      title: `${localized.title} | DevSchool`,
      description,
      alternates: {
        canonical: `/${locale}/tutorials/${slug}`,
        languages: {
          bn: `/bn/tutorials/${slug}`,
          en: `/en/tutorials/${slug}`,
          'x-default': `/bn/tutorials/${slug}`,
        },
      },
      openGraph: {
        title: localized.title,
        description,
        type: 'article',
        url: `/${locale}/tutorials/${slug}`,
        siteName: 'DevSchool',
        locale: locale === 'en' ? 'en_US' : 'bn_BD',
      },
    }
  } catch {
    return { title: 'DevSchool' }
  }
}

export default async function TutorialPage({ params }: PageProps) {
  const { locale, slug } = await params
  const t = TRYIT_TEXT[locale === 'bn' ? 'bn' : 'en']

  // DB error হলে আগের মতোই 404 (metadata তার fallback নেবে), কিন্তু আর double-fetch হবে না।
  const tutorial = await getTutorial(slug).catch(() => null)

  if (!tutorial) notFound()

  // locale-সঠিক title বেছে নাও — না থাকলে 404
  const localized = localizeTutorial(locale as Locale, tutorial)
  if (!localized.title) notFound()

  const nav = await getTutorialNav(tutorial.id, locale as Locale)
  const sortedChapters = [...nav.chapters].sort((a, b) => a.sortOrder - b.sortOrder)
  const firstChapterUrl = sortedChapters[0]
    ? localeHref(locale as Locale, `/tutorials/${tutorial.slug}/${sortedChapters[0].slug}`)
    : null

  return (
    <TutorialShell
      tutorialSlug={tutorial.slug}
      tutorialTitle={localized.title}
      nav={nav}
      active={{ chapterSlug: null, lessonSlug: null }}
      locale={locale === 'bn' ? 'bn' : 'en'}
    >
      <nav className="mb-6 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
        <Link href={localeHref(locale as Locale, "/")} className="hover:text-[#22C55E]">
          {t.homeCrumb}
        </Link>
        <span>/</span>
        <Link href={localeHref(locale as Locale, "/tutorials")} className="hover:text-[#22C55E]">
          {t.tutorialsCrumb}
        </Link>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{localized.title}</h1>

      {localized.description && (
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          {localized.description}
        </p>
      )}

      <h2 className="text-xl font-bold mb-4">{t.whatYouLearn}</h2>

      {sortedChapters.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">{t.noChapters}</p>
      ) : (
        <ol className="space-y-2 mb-8">
          {sortedChapters.map((c, i) => (
            <li key={c.id}>
              <Link
                href={localeHref(locale as Locale, `/tutorials/${tutorial.slug}/${c.slug}`)}
                className="flex items-center gap-3 p-3 rounded-lg border border-emerald-200/60 dark:border-emerald-900/40 bg-white dark:bg-[#0a0f0c] hover:border-[#22C55E] hover:bg-[#22C55E]/5 transition-all"
              >
                <span className="w-7 h-7 rounded-full bg-[#22C55E]/15 text-[#15803d] dark:text-[#4ADE80] flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium">{c.title}</span>
                {c.lessons.length > 0 && (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {c.lessons.length} {t.lessonsCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ol>
      )}

      <div className="flex justify-between items-center gap-3 mt-10 pt-6 border-t border-emerald-200/60 dark:border-emerald-900/40">
        <span className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 text-sm cursor-not-allowed">
          {t.home}
        </span>
        {firstChapterUrl ? (
          <Link
            href={firstChapterUrl}
            className="px-5 py-2.5 rounded-lg bg-[#22C55E] text-[#050806] text-sm font-bold hover:bg-[#4ADE80] transition-colors"
          >
            {t.next}
          </Link>
        ) : (
          <span className="px-5 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-400 text-sm cursor-not-allowed">
            {t.next}
          </span>
        )}
      </div>
    </TutorialShell>
  )
}
