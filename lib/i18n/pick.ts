// ==========================================
//  PICK — fallback নিয়ম (সবচেয়ে গুরুত্বপূর্ণ)
// ==========================================
//  ডেটাবেসে বাংলা + ইংরেজি দুটোই আছে, কিন্তু সব সময়
//  দুটোই ভরা নাও থাকতে পারে। এই ফাংশন সেটা ঠিক করে।
//
//  সহজ উদাহরণ (রেস্টুরেন্ট):
//    আপনি পিজা চাইলেন → আছে? দিলাম।
//    নেই? → বার্গার দিলাম (fallback, জিজ্ঞেস না করে)।
//    বার্গারও নেই? → খালি হাত (null)।

import type { Locale } from './config';

/**
 * locale অনুযায়ী সঠিক মান বেছে নেয়, fallback সহ।
 *
 * নিয়ম:
 *   locale === 'en' এবং en ভরা? → en
 *   নাহলে → bn
 *   দুটোই খালি? → null
 *
 * ব্যবহার:
 *   const title = pick(locale, tutorial.titleBn, tutorial.titleEn);
 */
export function pick<T>(
  locale: Locale,
  bn: T | null | undefined,
  en: T | null | undefined
): T | null {
  if (locale === 'en') {
    if (en !== null && en !== undefined && en !== '') return en as T;
  }
  if (bn !== null && bn !== undefined && bn !== '') return bn as T;
  return null;
}

/**
 * pick() এর কড়া ভার্সন — null হলে একটা ডিফল্ট মান দেয়।
 *
 * ব্যবহার:
 *   const title = pickOr(locale, tut.titleBn, tut.titleEn, 'Untitled');
 */
export function pickOr<T>(
  locale: Locale,
  bn: T | null | undefined,
  en: T | null | undefined,
  fallback: T
): T {
  return pick(locale, bn, en) ?? fallback;
}
