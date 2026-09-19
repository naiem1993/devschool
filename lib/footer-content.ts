// Footer-এর content shape + default values।
// pure file (কোনো prisma import নেই) — client component-এও safely import করা যায়।

export interface FooterContent {
  /** copyright line — {year} placeholder থাকলে render-এ current year বসবে */
  copyright: string
  donatePrompt: string
  donateLinkLabel: string
  donateLinkHref: string
}

export const FOOTER_SETTINGS_KEY = 'footer'

export const DEFAULT_FOOTER: FooterContent = {
  copyright: '© {year} DevSchool — ১০০% ফ্রি লার্নিং প্ল্যাটফর্ম',
  donatePrompt: '❤️ দান করতে চান?',
  donateLinkLabel: 'এখানে ক্লিক করুন',
  donateLinkHref: '/donate',
}

/** DB থেকে আসা partial value-কে safe ভাবে পূর্ণ FooterContent-এ রূপ দেয়। */
export function mergeFooter(raw: unknown): FooterContent {
  if (!raw || typeof raw !== 'object') return DEFAULT_FOOTER
  const r = raw as Record<string, unknown>
  const str = (key: keyof FooterContent, fallback: string) =>
    typeof r[key] === 'string' && (r[key] as string).length > 0 ? (r[key] as string) : fallback

  return {
    copyright: str('copyright', DEFAULT_FOOTER.copyright),
    donatePrompt: str('donatePrompt', DEFAULT_FOOTER.donatePrompt),
    donateLinkLabel: str('donateLinkLabel', DEFAULT_FOOTER.donateLinkLabel),
    donateLinkHref: str('donateLinkHref', DEFAULT_FOOTER.donateLinkHref),
  }
}
