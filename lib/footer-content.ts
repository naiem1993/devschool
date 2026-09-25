// Footer-এর content shape + default values।
// pure file (কোনো prisma import নেই) — client component-এও safely import করা যায়।

export type SocialPlatform =
  | 'github'
  | 'twitter'
  | 'x'
  | 'youtube'
  | 'discord'
  | 'linkedin'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'telegram'

export interface SocialLink {
  platform: SocialPlatform
  url: string
}

export interface FooterContent {
  /** copyright line — {year} placeholder থাকলে render-এ current year বসবে */
  copyright: string
  donatePrompt: string
  donateLinkLabel: string
  donateLinkHref: string
  /** social icon list — admin panel থেকে manage করা যায়। empty হলে icon block hide হবে। */
  socialLinks: SocialLink[]
  /** bottom credit-এ দেখানো হবে — যেমন "Black_Zone"। empty হলে পুরো credit hide। */
  creditText: string
}

export const FOOTER_SETTINGS_KEY = 'footer'

/** ইংরেজি footer-এর DB key (নতুন, PART 9j)। socialLinks bn-এর সাথে share হবে। */
export const FOOTER_EN_SETTINGS_KEY = 'footer_en'

export const DEFAULT_FOOTER: FooterContent = {
  copyright: '© {year} DevSchool — ১০০% ফ্রি লার্নিং প্ল্যাটফর্ম',
  donatePrompt: '❤️ দান করতে চান?',
  donateLinkLabel: 'এখানে ক্লিক করুন',
  donateLinkHref: '/donate',
  socialLinks: [
    { platform: 'github', url: 'https://github.com' },
    { platform: 'twitter', url: 'https://twitter.com' },
    { platform: 'youtube', url: 'https://youtube.com' },
    { platform: 'discord', url: 'https://discord.com' },
    { platform: 'facebook', url: 'https://facebook.com' },
  ],
  creditText: 'Black_Zone',
}

/**
 * ইংরেজি ডিফল্ট footer — DB-তে 'footer_en' না থাকলে /en পেজে এটাই দেখাবে।
 * socialLinks এখানে placeholder; আসলে getFooterSettings('en') bn-এর socialLinks ব্যবহার করে।
 */
export const DEFAULT_FOOTER_EN: FooterContent = {
  copyright: '© {year} DevSchool — 100% free learning platform',
  donatePrompt: '❤️ Want to donate?',
  donateLinkLabel: 'Click here',
  donateLinkHref: '/donate',
  socialLinks: DEFAULT_FOOTER.socialLinks,
  creditText: 'Black_Zone',
}

/** valid platform কিনা যাচাই */
const VALID_PLATFORMS: SocialPlatform[] = [
  'github',
  'twitter',
  'x',
  'youtube',
  'discord',
  'linkedin',
  'facebook',
  'instagram',
  'tiktok',
  'telegram',
]

function parseSocialLinks(raw: unknown): SocialLink[] {
  if (!Array.isArray(raw)) return DEFAULT_FOOTER.socialLinks
  const parsed: SocialLink[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const r = item as Record<string, unknown>
    const platform = r.platform as SocialPlatform
    const url = typeof r.url === 'string' ? r.url.trim() : ''
    if (!VALID_PLATFORMS.includes(platform)) continue
    if (!url) continue
    parsed.push({ platform, url })
  }
  return parsed
}

/**
 * DB থেকে আসা partial value-কে safe ভাবে পূর্ণ FooterContent-এ রূপ দেয়।
 * fallback দিয়ে bn/en কোন ডিফল্টে যাবে ঠিক হয় (PART 9j)।
 */
export function mergeFooter(
  raw: unknown,
  fallback: FooterContent = DEFAULT_FOOTER
): FooterContent {
  if (!raw || typeof raw !== 'object') return fallback
  const r = raw as Record<string, unknown>
  const str = (key: keyof FooterContent, fb: string) =>
    typeof r[key] === 'string' && (r[key] as string).length > 0
      ? (r[key] as string)
      : fb

  return {
    copyright: str('copyright', fallback.copyright),
    donatePrompt: str('donatePrompt', fallback.donatePrompt),
    donateLinkLabel: str('donateLinkLabel', fallback.donateLinkLabel),
    donateLinkHref: str('donateLinkHref', fallback.donateLinkHref),
    // socialLinks: missing হলে fallback-এর socialLinks
    socialLinks: Array.isArray(r.socialLinks)
      ? parseSocialLinks(r.socialLinks)
      : fallback.socialLinks,
    // creditText: missing হলে fallback
    creditText: typeof r.creditText === 'string' ? r.creditText : fallback.creditText,
  }
}
