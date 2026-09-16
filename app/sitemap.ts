import type { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devschool.com'

/**
 * Dynamic sitemap — static routes + DB থেকে সব category, tutorial,
 * এবং প্রতিটা chapter-এর URL বানায়। Google এই ফাইলটা /sitemap.xml-এ পাবে।
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/categories`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/tutorials`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/references`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/challenges`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/tools`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  try {
    const [categories, tutorials] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.tutorial.findMany({
        where: { isPublished: true },
        select: {
          slug: true,
          updatedAt: true,
          contents: { select: { chapterNo: true } },
        },
        take: 500,
      }),
    ])

    const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${SITE_URL}/categories/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const tutorialUrls: MetadataRoute.Sitemap = tutorials.map((t) => ({
      url: `${SITE_URL}/tutorials/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const chapterUrls: MetadataRoute.Sitemap = tutorials.flatMap((t) =>
      t.contents.map((c) => ({
        url: `${SITE_URL}/tutorials/${t.slug}/${c.chapterNo}`,
        lastModified: t.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    )

    return [...staticRoutes, ...categoryUrls, ...tutorialUrls, ...chapterUrls]
  } catch {
    // DB fail হলেও static routes অন্তত দেবে
    return staticRoutes
  }
}
