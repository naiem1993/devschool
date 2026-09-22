// ==========================================
//  i18n CONFIG — কোন কোন ভাষা, ডিফল্ট কী
// ==========================================
//  এই ফাইলে শুধু "ভাষার তালিকা" রাখা হয় — কোনো লজিক নেই।
//  অন্য সব ফাইল এখান থেকে ভাষার নাম নেবে।

export const LOCALES = ['bn', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'bn';

/**
 * cookie-র নাম। ইউজার ভাষা বদলালে এই cookie-তে সেভ হবে।
 * middleware (proxy.ts), LanguageSwitcher — সবাই এই নামই ব্যবহার করবে।
 */
export const LOCALE_COOKIE = 'ds_locale';

/** cookie কতক্ষণ থাকবে — ১ বছর (সেকেন্ডে) */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * হেডার বাটনে দেখানোর জন্য ভাষার Display নাম।
 * bn → 'বাংলা', en → 'English'
 */
export const LOCALE_DISPLAY_NAMES: Record<Locale, string> = {
  bn: 'বাংলা',
  en: 'English',
};

/**
 * `<html lang="...">` আর `hreflang`-এ ব্যবহারের জন্য ট্যাগ।
 * Part 8 (SEO) এ দরকার হবে।
 */
export const LOCALE_TAGS: Record<Locale, string> = {
  bn: 'bn-BD',
  en: 'en',
};

/**
 * ভ্যালু বৈধ locale কি না — TypeScript-কে বোঝানোর জন্য।
 * ব্যবহার: `if (!isLocale(x)) notFound();`
 */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * অন্য ভাষাটা কী — LanguageSwitcher-এ দরকার হবে।
 * getOtherLocale('bn') → 'en'
 */
export function getOtherLocale(locale: Locale): Locale {
  return locale === 'bn' ? 'en' : 'bn';
}
