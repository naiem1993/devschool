import type { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'
import { SITE_URL } from '@/lib/site-url'

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

type ChangeFreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

/**
 * এক route-এর দুই ভাষার sitemap entry বানায়।
 * প্রতি entry-তে hreflang alternates (bn + en)।
 *
 * ⚠️ x-default বাদ — MetadataRoute.Sitemap-এ x-default সাপোর্ট
 * ১০০% যাচাই করা হয়নি, তাই নিরাপদ পথে বাদ দিলাম।
 * (Metadata.alternates.languages-এ x-default কাজ করে — যেমন
 * challenges/[id]/page.tsx-এ ব্যবহৃত — কিন্তু MetadataRoute.Sitemap
 * আলাদা API surface।)
 */
function withAlternates(
  bnPath: string,
  enPath: string,
  rest: {
    lastModified?: Date
    changeFrequency?: ChangeFreq
    priority?: number
  }
): MetadataRoute.Sitemap {
  const languages = {
    bn: `${SITE_URL}${bnPath}`,
    en: `${SITE_URL}${enPath}`,
  }
  return [
    { url: `${SITE_URL}${bnPath}`, ...rest, alternates: { languages } },
    { url: `${SITE_URL}${enPath}`, ...rest, alternates: { languages } },
  ]
}

// ─────────────────────────────────────────────────────────────
//  SITEMAP — locale-aware, hreflang সহ
//
//  প্রতিটা route-এর দুই ভাষার entry (bn + en), সাথে reciprocating
//  hreflang alternates। Google এই দুটোকে এক জোড়া হিসেবে পড়বে।
// ─────────────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ─── 1. Static routes (প্রতি route × ২ ভাষা) ───
  const staticRoutes: MetadataRoute.Sitemap = [
    ...withAlternates('/bn', '/en', {
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    }),
    ...withAlternates('/bn/tutorials', '/en/tutorials', {
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    }),
    ...withAlternates('/bn/references', '/en/references', {
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }),
    ...withAlternates('/bn/challenges', '/en/challenges', {
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }),
    ...withAlternates('/bn/tools', '/en/tools', {
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }),
    ...withAlternates('/bn/playground', '/en/playground', {
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }),
    ...withAlternates('/bn/about', '/en/about', {
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    }),
  ]

  try {
    const [tutorials, references, challenges] = await Promise.all([
      prisma.tutorial.findMany({
        where: { isPublished: true },
        select: {
          slug: true,
          updatedAt: true,
          chapters: {
            select: {
              slug: true,
              lessons: {
                orderBy: { sortOrder: 'asc' },
                select: { slug: true },
              },
            },
          },
        },
        take: 500,
      }),
      prisma.reference.findMany({
        select: { slug: true, updatedAt: true },
        take: 500,
      }),
      prisma.codeChallenge.findMany({
        select: { id: true, updatedAt: true },
        take: 500,
      }),
    ])

    // ─── 2. Tutorial detail URLs ───
    const tutorialUrls: MetadataRoute.Sitemap = tutorials.flatMap((t) =>
      withAlternates(`/bn/tutorials/${t.slug}`, `/en/tutorials/${t.slug}`, {
        lastModified: t.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    )

    // ─── 3. Chapter + lesson URLs ───
    // প্রথম lesson বাদ — কারণ তার URL = chapter URL
    const chapterUrls: MetadataRoute.Sitemap = tutorials.flatMap((t) => [
      ...t.chapters.flatMap((c) =>
        withAlternates(
          `/bn/tutorials/${t.slug}/${c.slug}`,
          `/en/tutorials/${t.slug}/${c.slug}`,
          {
            lastModified: t.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.7,
          }
        )
      ),
      ...t.chapters.flatMap((c) =>
        c.lessons.slice(1).flatMap((l) =>
          withAlternates(
            `/bn/tutorials/${t.slug}/${c.slug}/${l.slug}`,
            `/en/tutorials/${t.slug}/${c.slug}/${l.slug}`,
            {
              lastModified: t.updatedAt,
              changeFrequency: 'weekly',
              priority: 0.6,
            }
          )
        )
      ),
    ])

    // ─── 4. Reference detail URLs ───
    const referenceUrls: MetadataRoute.Sitemap = references.flatMap((r) =>
      withAlternates(
        `/bn/references/${r.slug}`,
        `/en/references/${r.slug}`,
        {
          lastModified: r.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.6,
        }
      )
    )

    // ─── 5. Challenge detail URLs ───
    // CodeChallenge-এ slug নেই — URL-এ id ব্যবহৃত
    const challengeUrls: MetadataRoute.Sitemap = challenges.flatMap((c) =>
      withAlternates(
        `/bn/challenges/${c.id}`,
        `/en/challenges/${c.id}`,
        {
          lastModified: c.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.5,
        }
      )
    )

    return [
      ...staticRoutes,
      ...tutorialUrls,
      ...chapterUrls,
      ...referenceUrls,
      ...challengeUrls,
    ]
  } catch {
    // DB fail হলেও static routes অন্তত দেবে
    return staticRoutes
  }
}
