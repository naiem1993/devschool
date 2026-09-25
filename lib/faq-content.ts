// FAQ section-এর settings shape + default value।
// এই file-টা pure (কোনো prisma import নেই) — তাই client component-এও safely import করা যায়।

export interface FaqItem {
  /** বাংলা প্রশ্ন (required) */
  q: string
  /** বাংলা উত্তর (required) */
  a: string
  /** ইংরেজি প্রশ্ন (PART 9j — admin থেকে required, তবে টাইপে optional) */
  qEn?: string
  /** ইংরেজি উত্তর (PART 9j) */
  aEn?: string
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
      qEn: 'Is DevSchool really free?',
      aEn: 'Yes, 100% free. No card, no trial, no hidden charges.',
    },
    {
      q: 'একদম নতুন, তাও পারব?',
      a: 'অবশ্যই। কোর্স একদম শূন্য থেকে — HTML-এর নামও না জানলেও চলবে।',
      qEn: "I'm a complete beginner — can I still do it?",
      aEn:
        "Absolutely. The course starts from scratch — you don't even need to know what HTML stands for.",
    },
    {
      q: 'কিছু ইনস্টল করতে হবে?',
      a: 'না। ব্রাউজারের ভেতরেই লাইভ এডিটর আছে — লিখুন আর সাথে সাথে ফলাফল দেখুন।',
      qEn: 'Do I need to install anything?',
      aEn:
        "No. There's a live editor right in your browser — type and see the result instantly.",
    },
  ],
}

/** DB-তে 'faq' row না থাকলে /en পেজে এটাই দেখাবে (ইংরেজি প্রশ্ন-উত্তর)। */
export const DEFAULT_FAQ_EN: FaqSettings = {
  items: [
    {
      q: 'Is DevSchool really free?',
      a: 'Yes, 100% free. No card, no trial, no hidden charges.',
    },
    {
      q: "I'm a complete beginner — can I still do it?",
      a: "Absolutely. The course starts from scratch — you don't even need to know what HTML stands for.",
    },
    {
      q: 'Do I need to install anything?',
      a: "No. There's a live editor right in your browser — type and see the result instantly.",
    },
  ],
}

/**
 * DB থেকে আসা partial value-কে safe ভাবে FaqSettings-এ রূপ দেয়।
 * ভুল/মিসিং হলে empty array-তে fallback করবে (তাই পুরো সেকশন লুকাবে)।
 * বিশেষভাবে: row-ই না থাকলে DEFAULT_FAQ, কিন্তু row আছে অথচ items খালি → খালিই থাকবে (ইউজার সব delete করেছেন)।
 */
export function mergeFaq(
  raw: unknown,
  fallback: FaqSettings = DEFAULT_FAQ
): FaqSettings {
  if (!raw || typeof raw !== 'object') return fallback
  const r = raw as Record<string, unknown>
  if (!Array.isArray(r.items)) return fallback
  const items: FaqItem[] = []
  for (const it of r.items) {
    if (!it || typeof it !== 'object') continue
    const o = it as Record<string, unknown>
    const q = typeof o.q === 'string' ? o.q.trim() : ''
    const a = typeof o.a === 'string' ? o.a.trim() : ''
    // বাংলা required — যেকোনো একটা খালি হলে item বাদ
    if (!q || !a) continue
    const item: FaqItem = { q, a }
    const qEn = typeof o.qEn === 'string' ? o.qEn.trim() : ''
    const aEn = typeof o.aEn === 'string' ? o.aEn.trim() : ''
    if (qEn) item.qEn = qEn
    if (aEn) item.aEn = aEn
    items.push(item)
  }
  return { items }
}
