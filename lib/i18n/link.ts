// ============================================================
//  LOCALE LINK HELPER — ভাষা-সহ লিংক বানানোর ছোট হাতিয়ার
// ============================================================
//  Part 4-এর পর প্রতিটি পাবলিক URL শুরু হয় /bn বা /en দিয়ে।
//  তাই সব Link-কে localeHref() দিয়ে বানাতে হবে।
//
//  সহজ উদাহরণ:
//    localeHref('bn', '/tutorials') → '/bn/tutorials'
//    localeHref('en', '/')         → '/en'
//    localeHref('bn', '#top')      → '#top'    (anchor, prefix লাগে না)
//    localeHref('bn', 'https://x') → 'https://x' (external, prefix লাগে না)

import { LOCALES, type Locale } from './config';

// ----------------------------------------
//  মূল helper — path-এর আগে locale বসায়
// ----------------------------------------
export function localeHref(locale: Locale, path: string): string {
  // খালি string হলে শুধু locale
  if (!path) return `/${locale}`;

  // external link (http/https/mailto/tel) হলে ছুঁয়ে যাব না
  if (/^[a-z]+:\/\//i.test(path) || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }

  // hash-only (#top) বা query-only (?x=1) হলে ছুঁয়ে যাব না
  if (path.startsWith('#') || path.startsWith('?')) return path;

  // path আগে থেকেই /bn বা /en দিয়ে শুরু? আবার বসাব না
  if (hasLocalePrefix(path)) return path;

  // সাধারণ ক্ষেত্রে: /bn + /tutorials
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${withSlash}`;
}

// ----------------------------------------
//  কোনো path-এ ইতিমধ্যে locale prefix আছে কি না
// ----------------------------------------
function hasLocalePrefix(path: string): boolean {
  for (const loc of LOCALES) {
    if (path === `/${loc}` || path.startsWith(`/${loc}/`)) return true;
  }
  return false;
}

export { hasLocalePrefix };

// ----------------------------------------
//  উল্টো কাজ — path থেকে locale + বাকি path আলাদা করা
// ----------------------------------------
//  ব্যবহার: LanguageSwitcher-এ ভাষা বদলানোর সময় দরকার হবে
//    stripLocale('/bn/tutorials') → { locale: 'bn', path: '/tutorials' }
//    stripLocale('/tutorials')    → { locale: null, path: '/tutorials' }

export function stripLocale(path: string): { locale: Locale | null; path: string } {
  for (const loc of LOCALES) {
    if (path === `/${loc}`) return { locale: loc, path: '/' };
    if (path.startsWith(`/${loc}/`)) {
      return { locale: loc, path: path.slice(loc.length + 1) };
    }
  }
  return { locale: null, path };
}
