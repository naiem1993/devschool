export type SidebarLocale = 'bn' | 'en'

type SidebarText = {
  proTitle: string
  proDesc: string
  proBtn: string
  progressTitle: string
  chapterLabel: string
  adSpace: string
}

export const SIDEBAR_TEXT: Record<SidebarLocale, SidebarText> = {
  bn: {
    proTitle: 'DevSchool Pro',
    proDesc: 'সব কোর্স, সার্টিফিকেট ও প্র্যাকটিস — এক জায়গায়',
    proBtn: 'শুরু করুন',
    progressTitle: 'আপনার অগ্রগতি',
    chapterLabel: 'চ্যাপ্টার',
    adSpace: 'বিজ্ঞাপনের জায়গা',
  },
  en: {
    proTitle: 'DevSchool Pro',
    proDesc: 'All courses, certificates & practice — in one place',
    proBtn: 'Get Started',
    progressTitle: 'Your Progress',
    chapterLabel: 'chapters',
    adSpace: 'AD SPACE',
  },
}