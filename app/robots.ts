import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-url'

/**
 * Crawler নিয়ম — public সব পেজ allow; admin/api/progress/search বাদ।
 * /sitemap.xml-এ ইশারা করি, যাতে Google সব URL পায়।
 *
 * locale-সচেতন (PART 8e):
 *  - সব public রুট এখন /[locale]/... তাই disallow-এও locale-প্রিফিক্স দেওয়া হলো।
 *  - tools/* sub-pages এখনো locale-aware নয় (canonical, hero বাংলা)।
 *    তাই robots-এ disallow দিয়ে সাময়িকভাবে আটকানো হলো।
 *    tools listing (/bn/tools, /en/tools) allow-এ থাকবে (sitemap-এ আছে)।
 *
 * prefix-matching (robots.txt):
 *  - '/bn/tools/' pattern listing (/bn/tools) কে disallow করে না,
 *    কিন্তু /bn/tools/base64 ইত্যাদি sub-path সব ধরবে।
 *
 * ⚠️ Tools/* sub-pages disallow — temporary।
 *  PART 9-এ admin dual-input শেষে tools localized হবে →
 *  তখন disallow সরিয়ে sitemap-এ যোগ করা হবে।
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/bn/progress',
          '/en/progress',
          '/bn/search',
          '/en/search',
          '/bn/tools/',
          '/en/tools/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
