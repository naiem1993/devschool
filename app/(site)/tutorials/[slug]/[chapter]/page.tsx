import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import TutorialShell from '@/components/TutorialShell'

type PageProps = {
  params: Promise<{ slug: string; chapter: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, chapter } = await params
  const chapterNo = parseInt(chapter, 10)
  if (isNaN(chapterNo)) return { title: 'পাওয়া যায়নি | DevSchool' }

  try {
    const tutorial = await prisma.tutorial.findUnique({
      where: { slug },
      select: { title: true, contents: { where: { chapterNo }, select: { title: true } } },
    })
    if (!tutorial || !tutorial.contents[0]) {
      return { title: 'পাওয়া যায়নি | DevSchool', robots: { index: false, follow: false } }
    }
    const ch = tutorial.contents[0]
    return {
      title: `${ch.title} — ${tutorial.title} | DevSchool`,
      alternates: { canonical: `/tutorials/${slug}/${chapter}` },
    }
  } catch {
    return { title: 'DevSchool' }
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug, chapter } = await params
  const chapterNo = parseInt(chapter, 10)
  if (isNaN(chapterNo) || chapterNo < 1) notFound()

  const tutorial = await prisma.tutorial
    .findUnique({
      where: { slug, isPublished: true },
      include: {
        category: { select: { name: true, slug: true } },
        contents: { orderBy: { chapterNo: 'asc' } },
      },
    })
    .catch(() => null)

  if (!tutorial) notFound()

  const current = tutorial.contents.find((c) => c.chapterNo === chapterNo)
  if (!current) notFound()

  const chapters = tutorial.contents.map((c) => ({
    chapterNo: c.chapterNo,
    title: c.title,
  }))

  const prevChapter = tutorial.contents.find((c) => c.chapterNo === chapterNo - 1)
  const nextChapter = tutorial.contents.find((c) => c.chapterNo === chapterNo + 1)

  return (
    <TutorialShell
      tutorialSlug={tutorial.slug}
      tutorialTitle={tutorial.title}
      chapters={chapters}
      currentChapter={chapterNo}
    >
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#22C55E]">হোম</Link>
        <span>/</span>
        <Link href={`/tutorials/${tutorial.slug}`} className="hover:text-[#22C55E]">
          {tutorial.title}
        </Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300">{current.title}</span>
      </nav>

      {/* H1 */}
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">{current.title}</h1>

      {/* Content — paragraphs */}
      <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
        {current.content}
      </div>

      {/* Code example */}
      {current.codeExample && (
        <div className="mt-6 rounded-lg overflow-hidden border border-emerald-200/60 dark:border-emerald-900/40">
          <div className="px-3 py-2 bg-[#0a0f0c] text-[11px] text-slate-500 font-mono border-b border-emerald-900/30">
            example-{chapterNo}.html
          </div>
          <pre className="bg-[#050806] text-[#4ADE80] p-4 overflow-x-auto text-sm font-mono">
            <code>{current.codeExample}</code>
          </pre>
        </div>
      )}

      {/* Prev / Next */}
      <div className="flex justify-between items-center gap-3 mt-10 pt-6 border-t border-emerald-200/60 dark:border-emerald-900/40">
        {prevChapter ? (
          <Link
            href={`/tutorials/${tutorial.slug}/${prevChapter.chapterNo}`}
            className="px-5 py-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-[#22C55E]/10 hover:border-[#22C55E] transition-colors"
          >
            ❮ Previous
          </Link>
        ) : (
          <Link
            href={`/tutorials/${tutorial.slug}`}
            className="px-5 py-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-[#22C55E]/10 hover:border-[#22C55E] transition-colors"
          >
            ❮ Home
          </Link>
        )}

        {nextChapter ? (
          <Link
            href={`/tutorials/${tutorial.slug}/${nextChapter.chapterNo}`}
            className="px-5 py-2.5 rounded-lg bg-[#22C55E] text-[#050806] text-sm font-bold hover:bg-[#4ADE80] transition-colors"
          >
            Next ❯
          </Link>
        ) : (
          <Link
            href={`/tutorials/${tutorial.slug}`}
            className="px-5 py-2.5 rounded-lg bg-[#22C55E] text-[#050806] text-sm font-bold hover:bg-[#4ADE80] transition-colors"
          >
            সম্পন্ন ✓
          </Link>
        )}
      </div>
    </TutorialShell>
  )
}
