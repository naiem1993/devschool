// FAQ section-এর settings shape + default value।
// এই file-টা pure (কোনো prisma import নেই) — তাই client component-এও safely import করা যায়।

export interface FaqItem {
  q: string
  a: string
}

export interface FaqSettings {
  /** FAQ items-এর তালিকা। খালি array হলে homepage-এ FAQ সেকশন পুরো লুকাবে। */
  items: FaqItem[]
}

export const FAQ_SETTINGS_KEY = 'faq'

/** DB-তে কিছু না থাকলে এই ৩টা ডিফল্ট প্রশ্ন দেখাবে। */
export const DEFAULT_FAQ: FaqSettings = {
  items: [
    {
      q: 'DevSchool কি সত্যিই ফ্রি?',
      a: 'হ্যাঁ, ১০০% ফ্রি। কোনো কার্ড, কোনো ট্রায়াল, কোনো লুকানো চার্জ নেই।',
    },
    {
      q: 'একদম নতুন, তাও পারব?',
      a: 'অবশ্যই। কোর্স একদম শূন্য থেকে — HTML-এর নামও না জানলেও চলবে।',
    },
    {
      q: 'কিছু ইনস্টল করতে হবে?',
      a: 'না। ব্রাউজারের ভেতরেই লাইভ এডিটর আছে — লিখুন আর সাথে সাথে ফলাফল দেখুন।',
    },
  ],
}

/**
 * DB থেকে আসা partial value-কে safe ভাবে FaqSettings-এ রূপ দেয়।
 * ভুল/মিসিং হলে empty array-তে fallback করবে (তাই পুরো সেকশন লুকাবে)।
 * বিশেষভাবে: row-ই না থাকলে DEFAULT_FAQ, কিন্তু row আছে অথচ items খালি → খালিই থাকবে (ইউজার সব delete করেছেন)।
 */
export function mergeFaq(raw: unknown): FaqSettings {
  if (!raw || typeof raw !== 'object') return DEFAULT_FAQ
  const r = raw as Record<string, unknown>
  if (!Array.isArray(r.items)) return DEFAULT_FAQ
  const items: FaqItem[] = []
  for (const it of r.items) {
    if (!it || typeof it !== 'object') continue
    const o = it as Record<string, unknown>
    const q = typeof o.q === 'string' ? o.q.trim() : ''
    const a = typeof o.a === 'string' ? o.a.trim() : ''
    if (!q || !a) continue
    items.push({ q, a })
  }
  return { items }
}
