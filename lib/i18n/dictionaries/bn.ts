// ==========================================
//  BENGALI DICTIONARY (bn) — সব UI লেখা বাংলায়
// ==========================================
//  এই ফাইলের key-গুলোই "আসল আকার" (source of truth)।
//  en.ts ফাইলও ঠিক এই key গুলো মানতে হবে,
//  নইলে TypeScript error দেবে — এটা ইচ্ছাকৃত।

const bn = {
  // ── হেডার নেভিগেশন (components/Header.tsx) ──
  nav: {
    tutorials: 'টিউটোরিয়াল',
    references: 'রেফারেন্স',
    playground: 'প্লেগ্রাউন্ড',
    challenges: 'চ্যালেঞ্জ',
    tools: 'টুলস',
    progress: 'প্রগ্রেস',
    search: 'সার্চ',
    about: 'সম্পর্কে',
  },

  // ── সাধারণ বাটন/লেবেল (সব জায়গায়) ──
  common: {
    home: 'হোম',
    next: 'Next',
    prev: 'Prev',
    complete: 'সম্পন্ন ✓',
    loading: 'লোড হচ্ছে...',
    notFound: 'খুঁজে পাওয়া যায়নি',
    error: 'ত্রুটি হয়েছে',
    back: 'পেছনে',
    close: 'বন্ধ করুন',
    yes: 'হ্যাঁ',
    no: 'না',
  },

  // ── টিউটোরিয়াল পেজ (LessonSidebar, LessonContent, TryIt) ──
  tutorial: {
    example: 'উদাহরণ',
    tryIt: 'Try It',
    onThisPage: 'এই পেজে',
    chapters: 'চ্যাপ্টারসমূহ',
    lessons: 'লেসনসমূহ',
    previousLesson: 'আগের লেসন',
    nextLesson: 'পরের লেসন',
  },

  // ── ফুটার (components/Footer.tsx) ──
  footer: {
    about: 'সম্পর্কে',
    contact: 'যোগাযোগ',
    privacy: 'প্রাইভেসি পলিসি',
    terms: 'শর্তাবলি',
    copyright: '© DevSchool — সর্বস্বত্ব সংরক্ষিত',
  },

  // ── 404 পেজ (app/not-found.tsx) ──
  notFound: {
    title: 'পেজটি পাওয়া যায়নি',
    message: 'দুঃখিত, আপনি যেই পেজ খুঁজছেন সেটি পাওয়া যায়নি।',
    goHome: 'হোমে ফিরে যান',
  },

  // ── Error পেজ (app/error.tsx) ──
  error: {
    title: 'কিছু ভুল হয়েছে',
    message: 'দয়া করে আবার চেষ্টা করুন। সমস্যা থেকে গেলে আমাদের জানান।',
    retry: 'আবার চেষ্টা করুন',
  },

  // ── ভাষা সিলেক্টর (components/LanguageSwitcher.tsx) ──
  language: {
    switchTo: 'ভাষা বদলান',
    bengali: 'বাংলা',
    english: 'English',
  },
};

export default bn;
export type Dictionary = typeof bn;
