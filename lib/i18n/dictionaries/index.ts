// ==========================================
//  DICTIONARY LOADER — "এই ভাষার ডিকশনারি দাও"
// ==========================================
//  এই ফাইলই একমাত্র জায়গা যেখান থেকে ডিকশনারি আনা হবে।
//  পেজ/কম্পোনেন্ট কখনো bn.ts বা en.ts সরাসরি import করবে না।

import type { Locale } from '../config';
import bn, { type Dictionary } from './bn';
import en from './en';

export type { Dictionary };

/**
 * ভাষা দিলে সেই ভাষার ডিকশনারি ফেরত দেয়।
 *
 * ব্যবহার (Server Component-এ):
 *   const dict = await getDictionary(locale);
 *   <h1>{dict.nav.tutorials}</h1>
 *
 * ভবিষ্যতে ভাষা বাড়লে (যেমন হিন্দি) শুধু এখানে লাইন যোগ হবে।
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  switch (locale) {
    case 'en':
      return en;
    case 'bn':
    default:
      return bn;
  }
}

/**
 * সিঙ্ক্রোনাস ভার্সন — যেখানে await ব্যবহার করা যায় না।
 * যেমন: generateMetadata-এ অনেক সময় async কাজ করে না।
 */
export function getDictionarySync(locale: Locale): Dictionary {
  return locale === 'en' ? en : bn;
}
