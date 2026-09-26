// ─────────────────────────────────────────────────────────────
//  DevSchool Developer Tools — data-driven list
//  ডেভেলপারদের কাজে সাহায্যের জন্য বানানো টুলের তালিকা।
//  নতুন টুল বানালে শুধু এই array-তে entry যোগ করুন — /tools পেজে
//  automatic চলে আসবে।
// ─────────────────────────────────────────────────────────────

export type ToolCategory = 'text' | 'code' | 'convert' | 'design'

// toolPages-এর description কী-নাম (dictionary-তে আছে — PART A1)
export type ToolDescKey =
  | 'jsonFormatterDesc'
  | 'base64Desc'
  | 'imageBase64Desc'
  | 'colorPickerDesc'
  | 'uuidDesc'
  | 'loremIpsumDesc'
  | 'imageToPdfDesc'
  | 'urlEncoderDesc'

// toolPages-এর category লেবেল কী-নাম
export type ToolCatKey = 'catText' | 'catCode' | 'catConvert' | 'catDesign'

export type DevTool = {
  slug: string
  name: string
  /** dictionary-র toolPages ঘর থেকে locale-সাপেক্ষে আসবে */
  descKey: ToolDescKey
  icon: string
  href: string
  category: ToolCategory
  tags: string[]
  /** true হলে টুল এখনো বানানো হয়নি — পেজে 'শীঘ্রই আসছে' badge দেখাবে */
  comingSoon?: boolean
}

// category → dictionary কী-নাম ম্যাপিং (ToolsGrid locale দেখে সঠিক লেখা আনে)
export const TOOL_CATEGORY_KEYS: Record<ToolCategory, ToolCatKey> = {
  text: 'catText',
  code: 'catCode',
  convert: 'catConvert',
  design: 'catDesign',
}

// ─────────────────────────────────────────────────────────────
//  টুল তালিকা — এখানে নতুন টুল যোগ করুন
// ─────────────────────────────────────────────────────────────
export const DEV_TOOLS: DevTool[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    descKey: 'jsonFormatterDesc',
    icon: '{ }',
    href: '/tools/json-formatter',
    category: 'code',
    tags: ['json', 'format', 'beautify'],
  },
  {
    slug: 'base64',
    name: 'Base64 Encode / Decode',
    descKey: 'base64Desc',
    icon: '⇄',
    href: '/tools/base64',
    category: 'convert',
    tags: ['base64', 'encode', 'decode'],
  },
  {
    slug: 'image-base64',
    name: 'Image to Base64',
    descKey: 'imageBase64Desc',
    icon: '🖼️',
    href: '/tools/image-base64',
    category: 'convert',
    tags: ['image', 'base64', 'data uri', 'png', 'jpg', 'webp'],
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    descKey: 'colorPickerDesc',
    icon: '🎨',
    href: '/tools/color-picker',
    category: 'design',
    tags: ['color', 'hex', 'rgb', 'palette'],
  },
  {
    slug: 'uuid',
    name: 'UUID Generator',
    descKey: 'uuidDesc',
    icon: '🆔',
    href: '/tools/uuid',
    category: 'code',
    tags: ['uuid', 'id', 'random'],
    comingSoon: true,
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum',
    descKey: 'loremIpsumDesc',
    icon: '📝',
    href: '/tools/lorem-ipsum',
    category: 'text',
    tags: ['lorem', 'placeholder', 'text'],
  },
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    descKey: 'imageToPdfDesc',
    icon: '📄',
    href: '/tools/image-to-pdf',
    category: 'convert',
    tags: ['pdf', 'image', 'jpg', 'png', 'convert', 'merge'],
  },
  {
    slug: 'url-encoder',
    name: 'URL Encode / Decode',
    descKey: 'urlEncoderDesc',
    icon: '🔗',
    href: '/tools/url-encoder',
    category: 'convert',
    tags: ['url', 'encode', 'decode'],
    comingSoon: true,
  },
]
