/**
 * Single source of truth for the site's base URL.
 * Production-এ NEXT_PUBLIC_SITE_URL env var সেট করলে সেটাই ব্যবহার হবে।
 * না থাকলে fallback ডিফল্ট domain (dev/prototype-এর জন্য)।
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devschool.com'

/** Absolute URL বানানোর helper — relative path-কে full URL করে। */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
