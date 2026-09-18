import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-url'

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
