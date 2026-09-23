import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import CopyButton from './CopyButton'
import { pickText, localizeReference } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/config'

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  try {
    const refs = await prisma.reference.findMany({
      select: { slug: true },
      take: 500,
    })
    // দুই ভাষার জন্যই একই slug pre-render হবে
    return refs.flatMap((r) => [
      { locale: 'bn', slug: r.slug },
      { locale: 'en', slug: r.slug },
    ])
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  try {
    const ref = await prisma.reference.findUnique({
      where: { slug },
      select: {
        titleBn: true,
        titleEn: true,
        descriptionBn: true,
        descriptionEn: true,
        syntaxBn: true,
        syntaxEn: true,
        exampleBn: true,
        exampleEn: true,
      },
    })

    if (!ref) {
      return { title: 'রেফারেন্স পাওয়া যায়নি | DevSchool', robots: { index: false } }
    }

    // locale-সঠিক title — না থাকলে general fallback (পেজ নিজেই notFound() দেবে)
    const localized = localizeReference(locale as Locale, ref)
    if (!localized.title) {
      return { title: 'DevSchool' }
    }

    const description =
      localized.description || `${localized.title} — syntax ও উদাহরণ।`

    return {
      title: `${localized.title} — Syntax ও উদাহরণ | DevSchool`,
      description,
      keywords: [localized.title, 'reference', 'syntax'],
      alternates: {
        canonical: `/${locale}/references/${slug}`,
        languages: {
          'bn-BD': `/bn/references/${slug}`,
          en: `/en/references/${slug}`,
        },
      },
      openGraph: {
        title: localized.title,
        description,
        type: 'article',
        url: `/${locale}/references/${slug}`,
        siteName: 'DevSchool',
        locale: locale === 'en' ? 'en_US' : 'bn_BD',
      },
      twitter: {
        card: 'summary_large_image',
        title: localized.title,
        description,
      },
    }
  } catch {
    return { title: 'DevSchool' }
  }
}

export default async function ReferenceDetailPage({ params }: PageProps) {
  const { locale, slug } = await params

  const reference = await prisma.reference
    .findUnique({
      where: { slug },
      include: {
        tutorial: {
          select: { id: true, titleBn: true, titleEn: true, slug: true },
        },
      },
    })
    .catch(() => null)

  if (!reference) notFound()

  // locale-সঠিক লেখা বেছে নাও — title না থাকলে 404
  const loc = localizeReference(locale as Locale, reference)
  if (!loc.title) notFound()

  // tutorial-এর locale-সঠিক title (breadcrumb/category pill-এ)
  // এখানে শুধু title দরকার — তাই localizeTutorial-এর বদলে pickText সরাসরি
  const tutorialTitle =
    pickText(locale as Locale, reference.tutorial.titleBn, reference.tutorial.titleEn) ||
    reference.tutorial.slug

  const related = await prisma.reference
    .findMany({
      where: {
        tutorialId: reference.tutorialId,
        id: { not: reference.id },
      },
      select: {
        id: true,
        titleBn: true,
        titleEn: true,
        slug: true,
        syntaxBn: true,
        syntaxEn: true,
        language: true,
      },
      orderBy: { titleBn: 'asc' },
      take: 6,
    })
    .catch(() => [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: loc.title,
    description: loc.description,
    inDefinedTermSet: tutorialTitle,
    inLanguage: locale === 'en' ? 'en' : 'bn-BD',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806] text-slate-900 dark:text-slate-100">
        {/* Breadcrumb */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <nav
            aria-label="Breadcrumb"
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
          >
            <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <li>
                <Link href="/" className="hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition">
                  হোম
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href="/references"
                  className="hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition"
                >
                  রেফারেন্স
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/tutorials/${reference.tutorial.slug}`}
                  className="hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition"
                >
                  {tutorialTitle}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px]">
                {loc.title}
              </li>
            </ol>
          </nav>
        </div>

        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Link
                href={`/tutorials/${reference.tutorial.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22C55E]/10 dark:bg-[#22C55E]/10 text-[#15803d] dark:text-[#4ADE80] text-xs font-semibold hover:bg-[#22C55E]/20 dark:hover:bg-[#22C55E]/20 transition"
              >
                📂 {tutorialTitle}
              </Link>
              {reference.language && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20 text-xs font-mono font-semibold uppercase tracking-wider">
                  {reference.language}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {loc.title}
            </h1>

            {loc.description && (
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {loc.description}
              </p>
            )}
          </header>

          {/* Syntax */}
          {loc.syntax && (
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">
                Syntax
              </h2>
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 dark:bg-black">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 dark:bg-slate-950 border-b border-slate-800">
                  <span className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    syntax.txt
                  </span>
                  <CopyButton text={loc.syntax} />
                </div>
                <pre className="p-5 overflow-x-auto text-sm leading-relaxed font-mono text-emerald-300">
                  <code>{loc.syntax}</code>
                </pre>
              </div>
            </section>
          )}

          {/* Example */}
          {loc.example && (
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">
                উদাহরণ
              </h2>
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 dark:bg-black">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 dark:bg-slate-950 border-b border-slate-800">
                  <span className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    example.{reference.language?.toLowerCase() || 'code'}
                  </span>
                  <CopyButton text={loc.example} />
                </div>
                <pre className="p-5 overflow-x-auto text-sm leading-relaxed font-mono text-cyan-300">
                  <code>{loc.example}</code>
                </pre>
              </div>
            </section>
          )}

          {/* Tags */}
          {reference.tags.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">
                ট্যাগ
              </h2>
              <div className="flex flex-wrap gap-2">
                {reference.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Related */}
          {related.length > 0 && (
            <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold mb-5 tracking-tight">
                🔗 একই ক্যাটাগরির আরো রেফারেন্স
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/references/${r.slug}`}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:border-[#22C55E]/60 dark:hover:border-[#22C55E]/60 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <h3 className="font-semibold text-sm group-hover:text-[#22C55E] dark:group-hover:text-[#4ADE80] transition line-clamp-1">
                        {pickText(locale as Locale, r.titleBn, r.titleEn) || r.slug}
                      </h3>
                      {r.language && (
                        <span className="text-[10px] font-mono uppercase text-cyan-600 dark:text-cyan-400">
                          {r.language}
                        </span>
                      )}
                    </div>
                    {pickText(locale as Locale, r.syntaxBn, r.syntaxEn) && (
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 line-clamp-1">
                        {pickText(locale as Locale, r.syntaxBn, r.syntaxEn)}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </>
  )
}
