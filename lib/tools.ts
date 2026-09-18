// ─────────────────────────────────────────────────────────────
//  DevSchool Developer Tools — data-driven list
//  ডেভেলপারদের কাজে সাহায্যের জন্য বানানো টুলের তালিকা।
//  নতুন টুল বানালে শুধু এই array-তে entry যোগ করুন — /tools পেজে
//  automatic চলে আসবে।
// ─────────────────────────────────────────────────────────────

export type ToolCategory = 'text' | 'code' | 'convert' | 'design'

export type DevTool = {
  slug: string
  name: string
  description: string
  icon: string
  href: string
  category: ToolCategory
  tags: string[]
  /** true হলে টুল এখনো বানানো হয়নি — পেজে 'শীঘ্রই আসছে' badge দেখাবে */
  comingSoon?: boolean
}

export const TOOL_CATEGORY_LABELS: Record<ToolCategory, string> = {
  text: 'টেক্সট',
  code: 'কোড',
  convert: 'কনভার্ট',
  design: 'ডিজাইন',
}

// ─────────────────────────────────────────────────────────────
//  টুল তালিকা — এখানে নতুন টুল যোগ করুন
// ─────────────────────────────────────────────────────────────
export const DEV_TOOLS: DevTool[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'এলোমেলো JSON পরিষ্কারভাবে সাজিয়ে/ফরম্যাট করে দেখুন।',
    icon: '{ }',
    href: '/tools/json-formatter',
    category: 'code',
    tags: ['json', 'format', 'beautify'],
  },
  {
    slug: 'base64',
    name: 'Base64 Encode / Decode',
    description: 'যেকোনো টেক্সট Base64-এ encode বা decode করুন।',
    icon: '⇄',
    href: '/tools/base64',
    category: 'convert',
    tags: ['base64', 'encode', 'decode'],
  },
  {
    slug: 'image-base64',
    name: 'Image to Base64',
    description: 'ছবি থেকে Base64 / Data URI বানান, আর Base64 থেকে ছবি দেখুন।',
    icon: '🖼️',
    href: '/tools/image-base64',
    category: 'convert',
    tags: ['image', 'base64', 'data uri', 'png', 'jpg', 'webp'],
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    description: 'HEX, RGB, HSL মধ্যে রঙ কনভার্ট করুন ও palette বানান।',
    icon: '🎨',
    href: '/tools/color-picker',
    category: 'design',
    tags: ['color', 'hex', 'rgb', 'palette'],
  },
  {
    slug: 'uuid',
    name: 'UUID Generator',
    description: 'এক ক্লিকে random UUID v4 তৈরি করুন।',
    icon: '🆔',
    href: '/tools/uuid',
    category: 'code',
    tags: ['uuid', 'id', 'random'],
    comingSoon: true,
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum',
    description: 'ডেমো টেক্সট (placeholder paragraph) তৈরি করুন।',
    icon: '📝',
    href: '/tools/lorem-ipsum',
    category: 'text',
    tags: ['lorem', 'placeholder', 'text'],
  },
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'JPG / PNG / GIF / WEBP ছবি থেকে এক ক্লিকে PDF বানান।',
    icon: '📄',
    href: '/tools/image-to-pdf',
    category: 'convert',
    tags: ['pdf', 'image', 'jpg', 'png', 'convert', 'merge'],
  },
  {
    slug: 'url-encoder',
    name: 'URL Encode / Decode',
    description: 'URL-safe করতে টেক্সট encode বা decode করুন।',
    icon: '🔗',
    href: '/tools/url-encoder',
    category: 'convert',
    tags: ['url', 'encode', 'decode'],
    comingSoon: true,
  },
]
