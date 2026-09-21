import type { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'
import { SITE_URL } from '@/lib/site-url'



/**
 * Dynamic sitemap — static routes + DB থেকে সব category, tutorial,
 * এবং প্রতিটা chapter-এর URL বানায়। Google এই ফাইলটা /sitemap.xml-এ পাবে।
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/tutorials`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/references`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/challenges`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/tools`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  try {
    const tutorials = await prisma.tutorial.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        updatedAt: true,
        chapters: {
          select: {
            slug: true,
            lessons: { orderBy: { sortOrder: 'asc' }, select: { slug: true } },
          },
        },
      },
      take: 500,
    })

    const tutorialUrls: MetadataRoute.Sitemap = tutorials.map((t) => ({
      url: `${SITE_URL}/tutorials/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    // প্রতিটা chapter → ১টা URL; nested chapter-এর প্রতি lesson → আলাদা URL (first lesson বাদ, কারণ সেটার URL = chapter URL)
    const chapterUrls: MetadataRoute.Sitemap = tutorials.flatMap((t) => [
      ...t.chapters.map((c) => ({
        url: `${SITE_URL}/tutorials/${t.slug}/${c.slug}`,
        lastModified: t.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...t.chapters.flatMap((c) =>
        c.lessons.slice(1).map((l) => ({
          url: `${SITE_URL}/tutorials/${t.slug}/${c.slug}/${l.slug}`,
          lastModified: t.updatedAt,
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
      ),
    ])

    return [...staticRoutes, ...tutorialUrls, ...chapterUrls]
  } catch {
    // DB fail হলেও static routes অন্তত দেবে
    return staticRoutes
  }
}
