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

    // ── LessonSidebar (components/LessonSidebar.tsx) ──
    navLabel: 'টিউটোরিয়াল নেভিগেশন',
    emptyChapters: 'এই টিউটোরিয়ালে এখনো কোনো চ্যাপ্টার নেই।',
    collapse: 'ছোট করুন',
    expand: 'বড় করুন',

    // ── TryIt editor (components/TryIt.tsx) ──
    run: 'রান করুন',
    editor: 'এডিটর',
    editorTitle: 'Try it Yourself — Editor',
    close: 'বন্ধ করুন',
  },

  // ── ফুটার (components/Footer.tsx) ──
  footer: {
    about: 'সম্পর্কে',
    contact: 'যোগাযোগ',
    privacy: 'প্রাইভেসি পলিসি',
    terms: 'শর্তাবলি',
    copyright: '© DevSchool — সর্বস্বত্ব সংরক্ষিত',

    // ব্র্যান্ড ট্যাগলাইন
    tagline:
      'হাতে-কলমে ব্যবহারিক কোডিং শেখা। একদম শুরু থেকে চাকরির উপযোগী — ধাপে ধাপে।',

    // কলামের নাম
    colLearn: 'শেখা',
    colTools: 'টুলস',
    colSite: 'সাইট',

    // শেখার কলামের লিংক
    linkTutorials: 'টিউটোরিয়াল',
    linkChallenges: 'চ্যালেঞ্জ',
    linkReferences: 'রেফারেন্স',
    linkSearch: 'সার্চ',

    // টুলস কলামের লিংক
    linkAllTools: 'সব টুলস',
    linkPlayground: 'প্লেগ্রাউন্ড',
    linkProgress: 'প্রগ্রেস',
    linkJsonFormatter: 'JSON ফরম্যাটার',

    // সাইট কলামের লিংক
    linkAbout: 'সম্পর্কে',
    linkSitemap: 'সাইটম্যাপ',
    linkRobots: 'Robots',

    // নিচের স্ট্রিপ
    madeWith: 'তৈরি 💚 দিয়ে',
  },

  // ── 404 পেজ (app/not-found.tsx) ──
  notFound: {
    title: 'পেজটি পাওয়া যায়নি',
    message: 'দুঃখিত, আপনি যেই পেজ খুঁজছেন সেটি পাওয়া যায়নি।',
    goHome: 'হোমে ফিরে যান',

    // ── app/not-found.tsx — পূর্ণ 404 পেজ (client-side locale) ──
    metaTitle: '৪০৪ — পেজটি পাওয়া যায়নি | DevSchool',
    metaDescription: 'আপনি যে পেজটি খুঁজছেন সেটি নেই বা সরিয়ে ফেলা হয়েছে।',
    statusPill: 'Page Not Found',
    bigTitle: 'পেজটি খুঁজে পাওয়া যায়নি',
    bigMessage:
      'আপনি যে লিংকটি খুলেছেন তা ভুল, মুছে ফেলা হয়েছে, অথবা কখনোই ছিল না। নিচের অপশন থেকে শেখা চালিয়ে যান।',
    backHome: 'হোমপেজে ফিরে যান',
    searchSomething: 'কিছু খুঁজুন',
    popularLabel: 'জনপ্রিয় বিভাগ',
    linkTutorials: 'টিউটোরিয়াল',
    linkChallenges: 'চ্যালেঞ্জ',
    linkReferences: 'রেফারেন্স',
    linkSearch: 'সার্চ',
    footerText: 'DevSchool · বিনামূল্যে প্রোগ্রামিং শিখুন',
  },

  // ── Error পেজ (app/error.tsx) ──
  error: {
    title: 'কিছু ভুল হয়েছে',
    message: 'দয়া করে আবার চেষ্টা করুন। সমস্যা থেকে গেলে আমাদের জানান।',
    retry: 'আবার চেষ্টা করুন',

    // ── (site)/error.tsx — site-level error boundary ──
    statusPill: 'Something went wrong',
    bigTitle: 'কিছু একটা ভুল হয়েছে',
    bigMessage:
      'পেজটি লোড করার সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন — সমস্যা থেকে গেলে হোমপেজে ফিরে যান।',
    tryAgain: 'আবার চেষ্টা করুন 🔄',
    homePage: '🏠 হোমপেজ',
    footerText: 'DevSchool · বিনামূল্যে প্রোগ্রামিং শিখুন',
  },

  // ── Root layout SEO (app/[locale]/layout.tsx) ──
  meta: {
    siteTitle: 'DevSchool — বিনামূল্যে প্রোগ্রামিং শিখুন',
    siteDescription:
      'HTML, CSS, JavaScript, Python সহ ২০+ টি ভাষায় টিউটোরিয়াল, কুইজ ও কোড চ্যালেঞ্জ',
  },

  // ── Listing পেজ (tutorials, challenges, references, tools...) ──
  listing: {
    breadcrumbHome: 'হোম',
    tutorialsTitle: 'সব টিউটোরিয়াল',
    tutorialsSubtitle:
      'আপনার পছন্দের প্রোগ্রামিং ভাষা বেছে নিন এবং স্ট্রাকচার্ড টিউটোরিয়াল দিয়ে শেখা শুরু করুন। সব কন্টেন্ট ১০০% বিনামূল্যে।',
    statTutorials: 'টিউটোরিয়াল',
    statChapters: 'চ্যাপ্টার',
    statReferences: 'রেফারেন্স',
    dbConnectError: 'সংযোগ সমস্যা',
    backHome: 'হোমপেজে ফিরে যান',
    dbErrNoConn: 'ডেটাবেজ সার্ভারে সংযোগ করা যাচ্ছে না।',
    dbErrNoTable: 'ডেটাবেজ টেবিল পাওয়া যাচ্ছে না। মাইগ্রেশন চালান।',
    dbErrGeneric: 'টিউটোরিয়াল লোড করতে সমস্যা হয়েছে।',
    emptyTutorials: 'এখনো কোনো টিউটোরিয়াল নেই।',
  },

  // ── Home page (app/[locale]/(site)/page.tsx) ──
  home: {
    metaTitleTpl: 'DevSchool — {count}+ টি টিউটোরিয়াল',
    metaTitleStatic: 'DevSchool — বিনামূল্যে প্রোগ্রামিং শিখুন',
    metaDescTpl:
      'বিনামূল্যে প্রোগ্রামিং শিখুন। {count} টি টিউটোরিয়াল, ইন্টারঅ্যাকটিভ কুইজ ও প্র্যাকটিস চ্যালেঞ্জ।',
    metaOgDesc: '{count} টি টিউটোরিয়াল সহ সম্পূর্ণ ফ্রি লার্নিং প্ল্যাটফর্ম',
    trackTitle: '🗺️ ক্যারিয়ার লার্নিং ট্র্যাক',
    trackSubtitle:
      'শূন্য থেকে প্রফেশনাল ডেভেলপার হওয়ার স্টেপ-বাই-স্টেপ রোডম্যাপ',
    frontendTitle: 'Frontend Master',
    frontendDesc:
      'HTML, CSS, JavaScript, React, Next.js শিখুন এবং মডার্ন ইউজার ইন্টারফেস তৈরি করুন।',
    backendTitle: 'Backend Engineer',
    backendDesc:
      'Node.js, Express, Python, Databases, API Design এবং সার্ভার আর্কিটেকচার মাস্টার করুন।',
    fullstackTitle: 'Full Stack Developer',
    fullstackDesc:
      'ফ্রন্টএন্ড ও ব্যাকএন্ড দুই দিকেই দক্ষ হন। ডাটাবেস, ডিপ্লয়মেন্ট, অথেন্টিকেশন সব শিখুন।',
    startTrack: 'ট্র্যাক শুরু করুন →',
    errNoConn: 'ডেটাবেজ সার্ভারে সংযোগ করা যাচ্ছে না। নেটওয়ার্ক চেক করুন।',
    errNoTable: 'ডেটাবেজ টেবিল পাওয়া যাচ্ছে না। মাইগ্রেশন চালান।',
    errUnknown: 'অজানা সমস্যা হয়েছে। আমরা সমাধানে কাজ করছি।',
  },

  // ── Challenges পেজ (app/[locale]/(site)/challenges/*) ──
  challenges: {
    metaTitle: 'কোড চ্যালেঞ্জ — প্র্যাকটিস করুন | DevSchool',
    metaOgTitle: 'কোড চ্যালেঞ্জ | DevSchool',
    metaDescTpl:
      '{count}+ টি হ্যান্ডস-অন কোডিং চ্যালেঞ্জ — বাস্তব সমস্যা সমাধান করে প্রোগ্রামিং শিখুন।',
    metaFallbackTitle: 'চ্যালেঞ্জ | DevSchool',
    heroTitle: 'কোড চ্যালেঞ্জ',
    heroSubtitle:
      'বাস্তব কোডিং সমস্যা সমাধান করুন, টেস্ট কেস পাস করে নিজের দক্ষতা প্রমাণ করুন। প্রতিটা চ্যালেঞ্জে আছে ইন্টারঅ্যাকটিভ এডিটর, লাইভ রান ও অটো-টেস্ট।',
    statChallenges: 'চ্যালেঞ্জ',
    jsonLdName: 'কোড চ্যালেঞ্জ — DevSchool',
    jsonLdDescTpl: '{count} টি কোডিং চ্যালেঞ্জ',
    errNoConn: 'ডেটাবেজে সংযোগ করা যাচ্ছে না।',
    errNoTable: 'ডেটাবেজ টেবিল পাওয়া যাচ্ছে না।',
    errGeneric: 'চ্যালেঞ্জ লোড করতে সমস্যা হয়েছে।',
    emptyTitle: 'এখনো কোনো চ্যালেঞ্জ নেই',
    emptyDesc: 'শীঘ্রই নতুন চ্যালেঞ্জ যুক্ত করা হবে।',
    searchPlaceholder: 'চ্যালেঞ্জ খুঁজুন...',
    allDifficulty: 'সব লেভেল',
    viewAll: 'সব চ্যালেঞ্জ দেখুন',
    noResultsTitle: 'কিছু পাওয়া যায়নি',
    noResultsDesc: 'অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন অথবা ফিল্টার রিসেট করুন।',
    clearFilters: 'সব ফিল্টার মুছুন ✕',
    filteredLabel: '(ফিল্টার করা)',
    countTpl: '{count} টি চ্যালেঞ্জ',
    searchAria: 'চ্যালেঞ্জ সার্চ',
    allOption: 'সব',
    filterClear: 'ফিল্টার মুছুন ✕',
    noResultsDiffDesc: 'অন্য কীওয়ার্ড বা difficulty দিয়ে চেষ্টা করুন।',
    solve: 'সমাধান →',
    pts: 'pts',
    errLoadTitle: 'কিছু একটা ভুল হয়েছে',
    errLoadMsg: 'চ্যালেঞ্জ লোড করার সময় একটি ত্রুটি ঘটেছে।',
  },

  // ── Search পেজ (app/[locale]/(site)/search/*) ──
  search: {
    metaTitle: 'সার্চ — টিউটোরিয়াল ও রেফারেন্স খুঁজুন | DevSchool',
    metaDesc:
      'DevSchool-এর সম্পূর্ণ কনটেন্ট সার্চ করুন — টিউটোরিয়াল, রেফারেন্স, সিনট্যাক্স ও কোড উদাহরণ, সব এক জায়গায়।',
    metaOgTitle: 'সার্চ | DevSchool',
    metaOgDesc: 'টিউটোরিয়াল ও রেফারেন্স খুঁজুন',
    jsonLdName: 'DevSchool Search',
    heroTitle: 'সার্চ',
    heroSubtitle:
      'পুরো DevSchool-এর টিউটোরিয়াল, রেফারেন্স ও সিনট্যাক্স — সেকেন্ডেই খুঁজে নিন।',
  },

  // ── Playground পেজ (app/[locale]/(site)/playground/*) ──
  playground: {
    metaTitle: 'কোড প্লেগ্রাউন্ড — লিখুন, চালান, শিখুন | DevSchool',
    metaDesc:
      'ব্রাউজারেই JavaScript, TypeScript, HTML, CSS কোড লিখুন, সাথে সাথেই চালান। কোনো সেটআপ নেই, কোনো ইনস্টল নেই।',
    metaOgTitle: 'কোড প্লেগ্রাউন্ড | DevSchool',
    metaOgDesc: 'ব্রাউজারেই কোড লিখুন ও চালান।',
    heroTitle: 'কোড প্লেগ্রাউন্ড',
    heroSubtitlePre: 'ব্রাউজারেই কোড লিখুন, সাথে সাথে চালান। কোনো সেটআপ নেই, কোনো ইনস্টল নেই।',
    heroSubtitleHighlight: 'শুধু লিখো, রান করো, শেখো।',
  },

  // ── Progress পেজ (app/[locale]/(site)/progress/*) ──
  progress: {
    metaTitle: 'আমার অগ্রগতি — DevSchool',
    metaDesc: 'আপনার কুইজ ও চ্যালেঞ্জ অগ্রগতি দেখুন। সব ডেটা আপনার ডিভাইসে সংরক্ষিত।',
    breadcrumbDashboard: 'ড্যাশবোর্ড',
    heroTitle: 'আমার অগ্রগতি',
    heroSubtitle:
      'আপনার কুইজ ও চ্যালেঞ্জের অগ্রগতি দেখুন। সব ডেটা আপনার ব্রাউজারে নিরাপদে সংরক্ষিত — কোনো লগইন লাগে না। ব্রাউজার ক্লিয়ার করলে ডেটা রিসেট হবে।',
  },

  // ── Tools পেজ (app/[locale]/(site)/tools/*) ──
  tools: {
    metaTitle: 'ডেভেলপার টুলস — DevSchool',
    metaDesc:
      'ডেভেলপারদের কাজের জন্য দরকারি ছোট ছোট টুল — JSON formatter, Base64, color picker, UUID generator আরও অনেক কিছু।',
    metaOgTitle: 'ডেভেলপার টুলস | DevSchool',
    metaOgDesc: 'ডেভেলপারদের কাজের জন্য দরকারি ছোট ছোট টুল।',
    heroTitle: 'ডেভেলপার টুলস',
    heroSubtitle:
      'ডেভেলপারদের কাজের জন্য দরকারি ছোট ছোট টুল — এক জায়গায়। নতুন টুল ধীরে ধীরে যুক্ত হবে।',
    searchPlaceholder: 'টুল খুঁজুন... (যেমন: json, base64, color)',
    searchAria: 'টুল সার্চ',
    allCategory: 'সব',
    countTpl: '{count} টি টুল',
    clearFilters: 'ফিল্টার মুছুন ✕',
    noResultsTitle: 'কোনো টুল পাওয়া যায়নি',
    noResultsDesc: 'অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন অথবা ফিল্টার রিসেট করুন।',
    viewAll: 'সব টুল দেখুন',
    comingSoon: 'শীঘ্রই',
    comingSoonArrow: 'শীঘ্রই →',
    open: 'খুলুন →',
  },

  // ── References পেজ (app/[locale]/(site)/references/*) ──
  references: {
    metaTitle: 'প্রোগ্রামিং রেফারেন্স — সম্পূর্ণ ডিকশনারি | DevSchool',
    metaOgTitle: 'প্রোগ্রামিং রেফারেন্স | DevSchool',
    metaDescTpl:
      '{refCount}+ টি প্রোগ্রামিং রেফারেন্স — syntax, উদাহরণ ও ট্যাগ সহ {langCount} টি ভাষার সম্পূর্ণ ডিকশনারি।',
    metaFallbackTitle: 'রেফারেন্স | DevSchool',
    heroTitle: 'প্রোগ্রামিং রেফারেন্স',
    heroSubtitle:
      'প্রতিটা ফাংশন, মেথড ও সিনট্যাক্সের সম্পূর্ণ ডিকশনারি — কোড উদাহরণ, ট্যাগ ও ভাষা অনুযায়ী খুঁজে নিন। আপনার পকেট ডেভেলপার।',
    statReferences: 'রেফারেন্স',
    statLanguages: 'ভাষা',
    jsonLdName: 'প্রোগ্রামিং রেফারেন্স — DevSchool',
    jsonLdDescTpl: '{count} টি রেফারেন্স',
    errNoConn: 'ডেটাবেজে সংযোগ করা যাচ্ছে না।',
    errNoTable: 'ডেটাবেজ টেবিল পাওয়া যাচ্ছে না।',
    errGeneric: 'রেফারেন্স লোড করতে সমস্যা হয়েছে।',
    emptyTitle: 'এখনো কোনো রেফারেন্স নেই',
    emptyDesc: 'শীঘ্রই নতুন রেফারেন্স যুক্ত করা হবে।',
    searchPlaceholder: 'রেফারেন্স খুঁজুন... (যেমন: map, forEach, fetch)',
    searchAria: 'রেফারেন্স সার্চ',
    countTpl: '{count} টি রেফারেন্স',
    viewAll: 'সব রেফারেন্স দেখুন',
    filterLanguage: 'ভাষা ফিল্টার',
    allLanguages: 'সব ভাষা',
    sortAria: 'সাজানোর ধরন',
    sortTitle: 'নাম (A-Z)',
    sortLanguage: 'ভাষা',
    filteredLabel: '(ফিল্টার করা)',
    clearFilters: 'সব ফিল্টার মুছুন ✕',
    noResultsTitle: 'কিছু পাওয়া যায়নি',
    noResultsDesc: 'অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন অথবা ফিল্টার রিসেট করুন।',
    detailsSoon: 'বিস্তারিত শীঘ্রই যুক্ত হবে',
    errorTitle: 'রেফারেন্স লোড করতে সমস্যা হয়েছে',
    errorMessage: 'রেফারেন্স লোড করার সময় একটি ত্রুটি ঘটেছে।',
  },

  // ── HomeErrorPanel (components/HomeErrorPanel.tsx) ──
  homeError: {
    title: 'সংযোগ সমস্যা',
    retry: 'আবার চেষ্টা করুন 🔄',
    continueBrowsing: 'ব্রাউজিং চালিয়ে যান →',
    supportPre: 'সমস্যা থাকলে আমাদের',
    supportLink: 'সাপোর্টে',
    supportPost: 'জানান',
  },

  // ── LanguageTabs (components/LanguageTabs.tsx) ──
  tabs: {
    tutorialMenu: 'টিউটোরিয়াল মেনু',
    prevTab: 'আগের tab',
    nextTab: 'পরের tab',
  },

  // ── Hero demo code ও typing (components/HeroSection.tsx) ──
  heroDemo: {
    html: '<h1>হ্যালো, DevSchool! 👋</h1>\\n<p>আমি কোডিং শিখছি।</p>',
    js: 'console.log("হ্যালো, DevSchool!");',
    typing1: 'npm create devschool@latest',
    typing2: 'শেখা শুরু হোক 🚀',
  },

  // ── ভাষা সিলেক্টর (components/LanguageSwitcher.tsx) ──
  language: {
    switchTo: 'ভাষা বদলান',
    bengali: 'বাংলা',
    english: 'English',
  },

  // ─────────────────────────────────────────
  //  নতুন সেকশনসমূহ — Part 5e-3 (Client UI + About)
  // ─────────────────────────────────────────

  // ── Search UI (SearchClient.tsx — ক্লায়েন্ট কম্পোনেন্ট) ──
  searchUi: {
    placeholder: 'কী শিখতে চান? (যেমন: JavaScript, Python, React...)',
    ariaLabel: 'সার্চ',
    clearLabel: 'ক্লিয়ার',
    popularLabel: 'জনপ্রিয়:',
    tabAll: 'সব',
    tabTutorials: 'টিউটোরিয়াল',
    tabReferences: 'রেফারেন্স',
    resultCount: 'টি ফলাফল',
    noResults: 'এর জন্য কোনো ফলাফল নেই। অন্য কীওয়ার্ড চেষ্টা করুন।',
    tryHint: 'কমপক্ষে ২টি অক্ষর লিখুন',
    searching: 'খোঁজা হচ্ছে...',
    errorTitle: 'খোঁজা যাচ্ছে না',
    errorDesc: 'একটু পরে আবার চেষ্টা করুন।',
  },

  // ── Playground UI (PlaygroundClient.tsx — ক্লায়েন্ট) ──
  playgroundUi: {
    editorLoading: 'এডিটর লোড হচ্ছে...',
    running: '⌛ চলছে...',
    run: '▶ রান',
    copy: 'কপি',
    copied: 'কপি হয়েছে ✓',
    outputTitle: 'আউটপুট',
    previewTitle: 'প্রিভিউ',
    cssPreview: 'CSS প্রিভিউ — এখানে তোমার স্টাইল দেখাবে',
    noOutput: '(কোনো আউটপুট নেই)',
  },

  // ── Progress UI (ProgressClient.tsx — ক্লায়েন্ট) ──
  progressUi: {
    loadError: 'লোড করা যাচ্ছে না',
    retry: 'আবার চেষ্টা করুন',
    emptyTitle: 'এখনো কোনো অগ্রগতি নেই',
    emptyDesc:
      'একটা কুইজ দিয়ে শুরু করুন অথবা একটা কোডিং চ্যালেঞ্জ সমাধান করুন — তখনই এখানে ডেটা দেখা যাবে।',
    viewChallenges: '⚔️ চ্যালেঞ্জ দেখুন',
    viewTutorials: '📚 টিউটোরিয়াল দেখুন',
    quizAccuracy: 'কুইজ নির্ভুলতা',
    quizAccuracySubTpl: '{correct}/{total} সঠিক',
    challengePassed: 'চ্যালেঞ্জ পাস',
    challengePassedSubTpl: '{attempted} টি চেষ্টার মধ্যে',
    totalPoints: 'মোট পয়েন্ট',
    totalPointsSub: 'পাস করা চ্যালেঞ্জ থেকে',
    quizPerformance: 'কুইজ পারফরম্যান্স',
    recentActivity: 'সাম্প্রতিক অ্যাক্টিভিটি',
    passed: '✓ পাস',
    failed: '✗ ফেইল',
    refresh: '↻ রিফ্রেশ',
  },

  // ── About পেজ (app/[locale]/about/page.tsx) ──
  about: {
    metaTitle: 'সম্পর্কে | DevSchool',
    metaDesc: 'DevSchool কী, কেন বানানো, কারা এর পেছনে — সব জানুন।',
    heroTitle: 'DevSchool সম্পর্কে',
    heroSubtitle: 'বিনামূল্যে, বাংলায়, হাতে-কলমে প্রোগ্রামিং শেখার একটি প্ল্যাটফর্ম।',
    missionTitle: 'আমাদের লক্ষ্য',
    missionDesc:
      'বাংলা ভাষায় গুণগত মানের, সম্পূর্ণ বিনামূল্যের প্রোগ্রামিং শিক্ষা সবার হাতের নাগালে পৌঁছে দেওয়া।',
    visionTitle: 'আমাদের ভিশন',
    visionDesc:
      'যেকোনো বাঙালি শিক্ষার্থী, নিজের ভাষায়, ইন্টারনেট সংযোগ থাকলেই যেন শূন্য থেকে প্রফেশনাল ডেভেলপার হতে পারে।',
    valuesTitle: 'আমাদের মূল্যবোধ',
    valuesFree: 'সবসময় বিনামূল্যে',
    valuesFreeDesc: 'কোনো পেইড কোর্স নেই, কোনো লুকানো চার্জ নেই।',
    valuesPractical: 'হাতে-কলমে শেখা',
    valuesPracticalDesc: 'শুধু পড়া নয় — লিখুন, রান করুন, ভুল করুন, শিখুন।',
    valuesBengali: 'বাংলায় আগে',
    valuesBengaliDesc: 'বাংলা ভাষী শিক্ষার্থীদের কথা ভেবেই সবকিছু তৈরি।',
    contactTitle: 'যোগাযোগ',
    contactDesc: 'কোনো প্রশ্ন, মতামত বা সমস্যা থাকলে জানান।',
  },

  // ── slug-লেভেল not-found / error পেজ (tutorials/[slug], references/[slug], challenges/[id]) ──
  slugPages: {
    tutorialNotFoundTitle: 'টিউটোরিয়াল পাওয়া যায়নি',
    tutorialNotFoundMsg:
      'আপনি যে টিউটোরিয়ালটি খুঁজছেন তা নেই, মুছে ফেলা হয়েছে, অথবা এখনো প্রকাশ করা হয়নি।',
    tutorialErrorTitle: 'টিউটোরিয়াল লোড করতে সমস্যা',
    tutorialErrorMsg:
      'এই টিউটোরিয়ালটি লোড করার সময় একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।',

    referenceNotFoundTitle: 'রেফারেন্স পাওয়া যায়নি',
    referenceNotFoundMsg: 'এই নামের কোনো রেফারেন্স নেই অথবা মুছে ফেলা হয়েছে।',
    referenceErrorTitle: 'রেফারেন্স লোড করতে সমস্যা',
    referenceErrorMsg:
      'এই রেফারেন্সটি লোড করার সময় একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।',

    challengeNotFoundTitle: 'চ্যালেঞ্জ পাওয়া যায়নি',
    challengeNotFoundMsg: 'এই চ্যালেঞ্জটি নেই অথবা মুছে ফেলা হয়েছে।',
    challengeErrorTitle: 'চ্যালেঞ্জ লোড করতে সমস্যা',
    challengeErrorMsg:
      'এই চ্যালেঞ্জটি লোড করার সময় একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।',

    chapterNotFoundTitle: 'এই চ্যাপ্টারটি নেই',
    chapterNotFoundMsg:
      'আপনি যে চ্যাপ্টারটি খুঁজছেন তা নেই, নম্বরটি ভুল, অথবা এখনো প্রকাশ করা হয়নি।',
    chapterErrorTitle: 'চ্যাপ্টার লোড করতে সমস্যা',
    chapterErrorMsg:
      'এই চ্যাপ্টারটি লোড করার সময় একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।',

    viewAllTutorials: 'সব টিউটোরিয়াল দেখুন',
    viewAllReferences: 'সব রেফারেন্স দেখুন',
    viewAllChallenges: 'সব চ্যালেঞ্জ দেখুন',
    goHome: 'হোমপেজে ফিরে যান',
    retry: 'আবার চেষ্টা করুন 🔄',
  },
};

export default bn;
export type Dictionary = typeof bn;
