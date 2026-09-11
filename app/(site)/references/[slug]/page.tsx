import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import CopyButton from './CopyButton'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const refs = await prisma.reference.findMany({
      select: { slug: true },
      take: 500,
    })
    return refs.map((r) => ({ slug: r.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const ref = await prisma.reference.findUnique({
      where: { slug },
      select: {
        title: true,
        description: true,
        syntax: true,
        category: { select: { name: true } },
      },
    })

    if (!ref) {
      return { title: 'রেফারেন্স পাওয়া যায়নি | DevSchool', robots: { index: false } }
    }

    const description =
      ref.description || `${ref.title} — ${ref.category.name} এর syntax ও উদাহরণ।`

    return {
      title: `${ref.title} — Syntax ও উদাহরণ | DevSchool`,
      description,
      keywords: [ref.title, ref.category.name, 'reference', 'syntax'],
      alternates: { canonical: `/references/${slug}` },
      openGraph: {
        title: ref.title,
        description,
        type: 'article',
        url: `/references/${slug}`,
        siteName: 'DevSchool',
        locale: 'bn_BD',
      },
      twitter: {
        card: 'summary_large_image',
        title: ref.title,
        description,
      },
    }
  } catch {
    return { title: 'DevSchool' }
  }
}

export default async function ReferenceDetailPage({ params }: PageProps) {
  const { slug } = await params

  const reference = await prisma.reference
    .findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    })
    .catch(() => null)

  if (!reference) notFound()

  const related = await prisma.reference
    .findMany({
      where: {
        categoryId: reference.categoryId,
        id: { not: reference.id },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        syntax: true,
        language: true,
      },
      orderBy: { title: 'asc' },
      take: 6,
    })
    .catch(() => [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: reference.title,
    description: reference.description,
    inDefinedTermSet: reference.category.name,
    inLanguage: 'bn-BD',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
        {/* Breadcrumb */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <nav
            aria-label="Breadcrumb"
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
          >
            <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <li>
                <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  হোম
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href="/references"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  রেফারেন্স
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/categories/${reference.category.slug}`}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  {reference.category.name}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px]">
                {reference.title}
              </li>
            </ol>
          </nav>
        </div>

        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Link
                href={`/categories/${reference.category.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-950 transition"
              >
                📂 {reference.category.name}
              </Link>
              {reference.language && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20 text-xs font-mono font-semibold uppercase tracking-wider">
                  {reference.language}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {reference.title}
            </h1>

            {reference.description && (
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {reference.description}
              </p>
            )}
          </header>

          {/* Syntax */}
          {reference.syntax && (
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
                  <CopyButton text={reference.syntax} />
                </div>
                <pre className="p-5 overflow-x-auto text-sm leading-relaxed font-mono text-emerald-300">
                  <code>{reference.syntax}</code>
                </pre>
              </div>
            </section>
          )}

          {/* Example */}
          {reference.example && (
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
                  <CopyButton text={reference.example} />
                </div>
                <pre className="p-5 overflow-x-auto text-sm leading-relaxed font-mono text-cyan-300">
                  <code>{reference.example}</code>
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
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <h3 className="font-semibold text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-1">
                        {r.title}
                      </h3>
                      {r.language && (
                        <span className="text-[10px] font-mono uppercase text-cyan-600 dark:text-cyan-400">
                          {r.language}
                        </span>
                      )}
                    </div>
                    {r.syntax && (
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 line-clamp-1">
                        {r.syntax}
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
