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

/** বাংলা hero-র DB key (পুরনো, অপরিবর্তিত)। */
export const HERO_SETTINGS_KEY = 'hero'

/** ইংরেজি hero-র DB key (নতুন, PART 7.5b)। */
export const HERO_EN_SETTINGS_KEY = 'hero_en'

/** বাংলা ডিফল্ট hero — DB-তে কিছু না থাকলে bn পেজে এটাই দেখাবে। */
export const DEFAULT_HERO_BN: HeroContent = {
  badge: '✨ আপনার প্রোগ্রামিং ক্যারিয়া গড়া বিশ্বস্ত প্ল্যাটফর্ম',
  heading: 'আধুনিক প্রযুক্তি শিখুন,',
  headingHighlight: 'নিজের গতিকে মাস্টার হন',
  subtitle:
    'ইনটরঅ্যাকটিভ টিউটোরিয়াল, রিয়াল-ওয়ার্ল্ড প্রজেক্ট, কোড চ্যালেঞ্জ ও কুইজের মাধ্যমে হাতে-কলমে কোডিং শিখুন।',
  searchPlaceholder: 'কী শিখতে চান? (যেমন: JavaScript, Python, React...)',
  cta1Label: '🚀 টিউটোরিয়াল ব্রাউজ করুন',
  cta1Href: '/tutorials',
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
 * ইংরেজি ডিফল্ট hero — admin থেকে 'hero_en' লেখা না হওয়া পর্যন্ত
 * /en পেজে এটা placeholder হিসেবে ব্যবহার হবে (PHASE C-তে যা
 * ContentComingSoon-এ replace হতে পারে)।
 */
export const DEFAULT_HERO_EN: HeroContent = {
  badge: '✨ Your trusted platform for building a programming career',
  heading: 'Learn modern technologies,',
  headingHighlight: 'master at your own pace',
  subtitle:
    'Learn coding hands-on through interactive tutorials, real-world projects, coding challenges and quizzes.',
  searchPlaceholder:
    'What do you want to learn? (e.g. JavaScript, Python, React...)',
  cta1Label: '🚀 Browse tutorials',
  cta1Href: '/tutorials',
  cta2Label: '⚡ Try code challenges',
  cta2Href: '/challenges',
  statLabels: [
    'Programming languages & technologies',
    'Detailed tutorials',
    'Interactive quizzes',
    'Practice challenges',
  ],
}

/**
 * backward-compat alias — পুরনো code যেখানে `DEFAULT_HERO` import করে,
 * সেটা যাতে না ভাঙে। এখন থেকে bn-এর ডিফল্ট = DEFAULT_HERO_BN।
 */
export const DEFAULT_HERO = DEFAULT_HERO_BN

/**
 * DB থেকে আসা partial value-কে safe ভাবে পূর্ণ HeroContent-এ রূপ দেয়।
 * যেকোনো missing/invalid field দিলে `fallback`-এ যাবে — তাই কখনো crash হবে না।
 *
 * @param raw — DB থেকে আসা কাঁচা value (unknown)
 * @param fallback — কোন ভাষার ডিফল্ট (DEFAULT_HERO_BN বা DEFAULT_HERO_EN)
 */
export function mergeHero(
  raw: unknown,
  fallback: HeroContent = DEFAULT_HERO_BN
): HeroContent {
  if (!raw || typeof raw !== 'object') return fallback
  const r = raw as Record<string, unknown>
  const str = (key: keyof HeroContent, fb: string) =>
    typeof r[key] === 'string' && (r[key] as string).length > 0
      ? (r[key] as string)
      : fb

  const labels = Array.isArray(r.statLabels) ? (r.statLabels as unknown[]) : null
  const statLabels = labels
    ? [0, 1, 2, 3].map((i) =>
        typeof labels[i] === 'string' && (labels[i] as string).length > 0
          ? (labels[i] as string)
          : fallback.statLabels[i]
      )
    : fallback.statLabels

  return {
    badge: str('badge', fallback.badge),
    heading: str('heading', fallback.heading),
    headingHighlight: str('headingHighlight', fallback.headingHighlight),
    subtitle: str('subtitle', fallback.subtitle),
    searchPlaceholder: str('searchPlaceholder', fallback.searchPlaceholder),
    cta1Label: str('cta1Label', fallback.cta1Label),
    cta1Href: str('cta1Href', fallback.cta1Href),
    cta2Label: str('cta2Label', fallback.cta2Label),
    cta2Href: str('cta2Href', fallback.cta2Href),
    statLabels,
  }
}
