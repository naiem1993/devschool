import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devschool.com'

/**
 * Crawler নিয়ম — public সব পেজ allow, admin/api/progress বাদ।
 * /sitemap.xml-এ ইশারা করি, যাতে Google সব URL পায়।
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/progress', '/search'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
