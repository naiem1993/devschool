// ==========================================
//  LOCALE HELPER (server-side) — "এখন কার ভাষা?"
// ==========================================
//  এই ফাইল শুধু server-side (React Server Component,
//  middleware, API route) এ ব্যবহার হবে।
//  কারণ এখানে `next/headers` এর cookies() আর headers() লাগে।

import { cookies, headers } from 'next/headers';
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from './config';

/**
 * "এখন কার ভাষা?" — এই ফাংশন বলে দেয় কোন ভাষা দরকার।
 *
 * ধাপে ধাপে (সহজ উদাহরণ: দোকানে ঢোকার আগে দারোয়ান জিজ্ঞেস করে):
 *   ১) cookie-তে পছন্দ আছে? সেটাই
 *   ২) নেই? ব্রাউজার কোন ভাষায় বলছে? সেটা
 *   ৩) কিছুই না পেলে ডিফল্ট (বাংলা)
 *
 * ব্যবহার: Server Component-এ `const locale = await getLocale();`
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieValue)) return cookieValue;

  const headerStore = await headers();
  const acceptLanguage = headerStore.get('accept-language') ?? '';
  // Accept-Language থেকে বাংলা (bn) আছে কি না দেখি
  // ইংরেজির থেকে বাংলা অগ্রাধিকার — কারণ সাইটের আসল ভাষা বাংলা
  if (/\bbn\b/i.test(acceptLanguage)) return 'bn';
  if (/\ben\b/i.test(acceptLanguage)) return 'en';

  return DEFAULT_LOCALE;
}

/**
 * URL-এর `params.locale` থেকে ভাষা যাচাই করা।
 * ব্যবহার (Page):
 *   const { locale } = await params;
 *   if (!isLocale(locale)) notFound();
 *
 * @param params - page/layout-এর params
 * @param key - কোন key থেকে locale নেওয়া হবে (default: 'locale')
 */
export function getLocaleFromParams(
  params: Record<string, string | string[] | undefined>,
  key: string = 'locale'
): Locale | null {
  const raw = params[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return isLocale(value) ? value : null;
}
