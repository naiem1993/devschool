// Hero section-এর content shape + default values।
// এই file-টা pure (কোনো prisma import নেই) — তাই client component-এও safely import করা যায়।

export interface HeroContent {
  badge: string
  heading: string
  headingHighlight: string
  subtitle: string
  /** search box-এর ভেতরের placeholder */
  searchPlaceholder: string
  cta1Label: string
  cta1Href: string
  cta2Label: string
  cta2Href: string
  /** ঠিক ৪টা item — stats card-এর ৪টা label */
  statLabels: string[]
}

export const HERO_SETTINGS_KEY = 'hero'

/** DB-তে কিছু না থাকলে HeroSection এই default দেখাবে। */
export const DEFAULT_HERO: HeroContent = {
  badge: '✨ আপনার প্রোগ্রামিং ক্যারিয়া গড়া বিশ্বস্ত প্ল্যাটফর্ম',
  heading: 'আধুনিক প্রযুক্তি শিখুন,',
  headingHighlight: 'নিজের গতিকে মাস্টার হন',
  subtitle:
    'ইনটরঅ্যাকটিভ টিউটোরিয়াল, রিয়াল-ওয়ার্ল্ড প্রজেক্ট, কোড চ্যালেঞ্জ ও কুইজের মাধ্যমে হাতে-কলমে কোডিং শিখুন।',
  searchPlaceholder: 'কী শিখতে চান? (যেমন: JavaScript, Python, React...)',
  cta1Label: '🚀 টিউটোরিয়াল ব্রাউজ করুন',
  cta1Href: '/categories',
  cta2Label: '⚡ কোড চ্যালেঞ্জ ট্রাই করুন',
  cta2Href: '/challenges',
  statLabels: [
    'প্রোগ্রামিং ভাষা ও তেকনোলজি',
    'ডিটেইলড টিউটোরিয়াল',
    'ইনটরঅ্যাকটিভ কুইজ',
    'প্র্যাকটিস চ্যালেঞ্জ',
  ],
}

/**
 * DB থেকে আসা partial value-কে safe ভাবে পূর্ণ HeroContent-এ রূপ দেয়।
 * যেকোনো missing/invalid field default-এ fallback করবে — তাই কখনো crash হবে না।
 */
export function mergeHero(raw: unknown): HeroContent {
  if (!raw || typeof raw !== 'object') return DEFAULT_HERO
  const r = raw as Record<string, unknown>
  const str = (key: keyof HeroContent, fallback: string) =>
    typeof r[key] === 'string' && (r[key] as string).length > 0 ? (r[key] as string) : fallback

  const labels = Array.isArray(r.statLabels) ? (r.statLabels as unknown[]) : null
  const statLabels = labels
    ? [0, 1, 2, 3].map((i) =>
        typeof labels[i] === 'string' && (labels[i] as string).length > 0
          ? (labels[i] as string)
          : DEFAULT_HERO.statLabels[i]
      )
    : DEFAULT_HERO.statLabels

  return {
    badge: str('badge', DEFAULT_HERO.badge),
    heading: str('heading', DEFAULT_HERO.heading),
    headingHighlight: str('headingHighlight', DEFAULT_HERO.headingHighlight),
    subtitle: str('subtitle', DEFAULT_HERO.subtitle),
    searchPlaceholder: str('searchPlaceholder', DEFAULT_HERO.searchPlaceholder),
    cta1Label: str('cta1Label', DEFAULT_HERO.cta1Label),
    cta1Href: str('cta1Href', DEFAULT_HERO.cta1Href),
    cta2Label: str('cta2Label', DEFAULT_HERO.cta2Label),
    cta2Href: str('cta2Href', DEFAULT_HERO.cta2Href),
    statLabels,
  }
}
