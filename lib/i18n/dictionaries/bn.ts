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
    emptyTutorialsDesc: 'শীঘ্রই নতুন টিউটোরিয়াল যুক্ত করা হবে।',
    filterSearchPlaceholder: 'টিউটোরিয়াল খুঁজুন... (যেমন: HTML, JavaScript, Python)',
    filterSearchAria: 'টিউটোরিয়াল সার্চ',
    filterLevelAll: 'সব লেভেল',
    filterLevelBeginner: 'বিগিনার',
    filterLevelIntermediate: 'ইন্টারমিডিয়েট',
    filterLevelAdvanced: 'অ্যাডভান্সড',
    filterSortLabel: 'সাজান:',
    filterSortLatest: 'সর্বশেষ',
    filterSortPopular: 'জনপ্রিয়',
    filterSortTitle: 'নাম (A-Z)',
    filterCountSuffix: 'টি টিউটোরিয়াল',
    filterApplied: '(ফিল্টার করা)',
    filterClear: 'সব ফিল্টার মুছুন ✕',
    filterNoResultsTitle: 'কিছু পাওয়া যায়নি',
    filterNoResultsDesc: 'অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন অথবা ফিল্টার রিসেট করুন।',
    filterShowAll: 'সব টিউটোরিয়াল দেখুন',
    cardDescriptionSoon: 'বিস্তারিত শীঘ্রই যুক্ত হবে',
    cardChaptersSuffix: 'চ্যাপ্টার',
    cardMinutesSuffix: 'মিনিট',
    cardStart: 'শুরু করুন',
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

    // ── /en পেজের ComingSoon placeholder (components/ContentComingSoon.tsx) ──
    comingSoonBadge: 'শীঘ্রই আসছে',
    comingSoonTitle: 'ইংরেজি কনটেন্ট এখনো তৈরি হচ্ছে',
    comingSoonMessage:
      'আমরা ইংরেজি ভার্সনের কাজ করছি — শীঘ্রই চালু হবে। ততক্ষণ বাংলায় পড়তে পারেন।',
    comingSoonCta: 'বাংলায় দেখুন',

    // ── Home — জনপ্রিয় / নতুন টিউটোরিয়াল সেকশন (app/[locale]/(site)/page.tsx) ──
    popularTitle: '🔥 জনপ্রিয় টিউটোরিয়াল',
    popularSubtitle: 'আমাদের কমিউনিটিতে সবচেয়ে বেশি পঠিত টিউটোরিয়ালগুলো',
    latestTitle: '✨ নতুন টিউটোরিয়াল',
    latestSubtitle: 'সবচেয়ে সাম্প্রতিক কন্টেন্ট দিয়ে আপডেট থাকুন',

    // ── Home — টিউটোরিয়াল কার্ড (components/LoadMoreTutorials.tsx) ──
    genericCategory: 'জেনেরিক',
    loading: 'লোড হচ্ছে...',
    loadMoreTutorials: 'আরও টিউটোরিয়াল লোড করুন ↓',
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

  // ── Tools সেকশনের sub-page ও tool-card লেখা (PART A1) ──
  toolPages: {
    breadcrumbTools: 'টুলস',

    // ৪টা category লেবেল (ToolsGrid-এ filter button)
    catText: 'টেক্সট',
    catCode: 'কোড',
    catConvert: 'কনভার্ট',
    catDesign: 'ডিজাইন',

    // main /tools পেজে কার্ডের description (৮টা টুল)
    jsonFormatterDesc: 'এলোমেলো JSON পরিষ্কারভাবে সাজিয়ে/ফরম্যাট করে দেখুন।',
    base64Desc: 'যেকোনো টেক্সট Base64-এ encode বা decode করুন।',
    imageBase64Desc: 'ছবি থেকে Base64 / Data URI বানান, আর Base64 থেকে ছবি দেখুন।',
    colorPickerDesc: 'HEX, RGB, HSL মধ্যে রঙ কনভার্ট করুন ও palette বানান।',
    uuidDesc: 'এক ক্লিকে random UUID v4 তৈরি করুন।',
    loremIpsumDesc: 'ডেমো টেক্সট (placeholder paragraph) তৈরি করুন।',
    imageToPdfDesc: 'JPG / PNG / GIF / WEBP ছবি থেকে এক ক্লিকে PDF বানান।',
    urlEncoderDesc: 'URL-safe করতে টেক্সট encode বা decode করুন।',

    // ৬টা sub-page-এর হিরো সেকশন
    pageBase64: {
      title: 'Base64 Encode / Decode',
      subtitle: 'বাংলা, ইমোজি — যেকোনো টেক্সট নিরাপদে Base64-এ রূপান্তর করুন বা ফিরিয়ে আনুন। সবকিছু আপনার ব্রাউজারেই চলে, কোনো ডেটা সার্ভারে যায় না।',
    },
    pageColorPicker: {
      title: 'Color Picker',
      subtitle: 'রঙ বেছে নিন, HEX · RGB · HSL-এ রূপান্তর করুন, শেড ও হারমোনি palette বানান, আর WCAG কনট্রাস্ট যাচাই করুন — সবকিছু আপনার ব্রাউজারেই চলে।',
    },
    pageImageBase64: {
      title: 'Image to Base64',
      subtitle: 'ছবিকে Base64 বা Data URI-তে বদলান — CSS/HTML-এ সরাসরি বসানোর জন্য। উল্টোটাও করা যায়: Base64 পেস্ট করে ছবি দেখুন ও ডাউনলোড করুন। ছবি কখনো আপনার ব্রাউজার ছাড়ে না।',
    },
    pageImageToPdf: {
      title: 'Image to PDF',
      subtitle: 'JPG, PNG, GIF বা WEBP ছবি থেকে এক ক্লিকে PDF বানান — A4 বা ছবির মাপে। সম্পূর্ণ ব্রাউজারে, কোনো ছবি কোথাও আপলোড হয় না।',
    },
    pageJsonFormatter: {
      title: 'JSON Formatter',
      subtitle: 'এলোমেলো JSON পরিষ্কারভাবে সাজান, মিনিফাই করুন, ভুল থাকলে লাইন-কলাম ধরে ধরিয়ে দিন। সবকিছু আপনার ব্রাউজারেই চলে — কোনো ডেটা সার্ভারে যায় না।',
    },
    pageLoremIpsum: {
      title: 'Lorem Ipsum',
      subtitle: 'ডিজাইন বা লেআউট টেস্ট করার জন্য ডেমো টেক্সট তৈরি করুন — প্যারা, বাক্য বা শব্দ অনুযায়ী, ইচ্ছে হলে HTML ট্যাগ সহ। সবকিছু আপনার ব্রাউজারেই চলে।',
    },
  },

  // ── Tools-এর ভেতরের UI লেখা (PART A4) ──
  toolUi: {
    common: {
      copy: 'কপি',
      copied: '✓ কপি হয়েছে',
      clear: 'মুছুন',
      sample: 'নমুনা',
    },

    base64: {
      sampleText: 'DevSchool — শেখো, বানাও, এগিয়ে যাও 🚀',
      modeAria: 'মোড',
      encode: 'এনকোড',
      decode: 'ডিকোড',
      inputAria: 'ইনপুট',
      placeholderEncode: 'যেকোনো লেখা লিখুন...',
      placeholderDecode: 'Base64 এখানে পেস্ট করুন...',
      resultHere: 'ফলাফল এখানে দেখাবে...',
      statusErr: '✕ সমস্যা',
      statusOk: '✓ রূপান্তর হয়েছে',
      statusIdle: 'অপেক্ষায়',
      labelInput: 'Input',
      labelOutput: 'Output',
      labelMode: 'মোড',
      ctrlHint: 'Ctrl / ⌘ + Enter = রূপান্তর',
      errTooBigTpl: 'ইনপুট {n} অক্ষর — সর্বোচ্চ {max} অনুমোদিত।',
      errBigInput: 'ইনপুট বড় — «রূপান্তর» বাটনে চাপুন।',
      errClipboard: 'ক্লিপবোর্ডে কপি করা যায়নি — ব্রাউজার অনুমতি দেয়নি।',
      errBadLength: 'Base64 দৈর্ঘ্য ভুল (৪-এর গুণিতক হতে হবে)',
      errBadChars: 'এটি ভ্যালিড Base64 নয় — অননুমোদিত অক্ষর আছে',
    },

    json: {
      statusIdle: 'অপেক্ষায়',
      statusTooBig: '✕ ইনপুট অনেক বড়',
      statusMinified: '✓ মিনিফাই হয়েছে',
      statusValid: '✓ ভ্যালিড JSON',
      statusFormatted: '✓ ফরম্যাট হয়েছে',
      statusBad: '✕ ভুল JSON',
      errTooBigTpl: 'ইনপুট {n} অক্ষর — সর্বোচ্চ {max} অনুমোদিত।',
      errPositionTpl: '{msg} — লাইন {line}, কলাম {col}',
      bigInputHint: 'বড় ইনপুট — Format চাপুন',
      btnFormat: '✦ Format',
      btnMinify: '⇥ Minify',
      btnValidate: '✓ Validate',
      btnSort: '⇅ Sort keys',
      indentLabel: 'ইনডেন্ট',
      inputAria: 'JSON ইনপুট',
      labelInput: 'Input',
      labelOutput: 'Output',
      labelLines: 'Lines',
      labelKeys: 'Keys',
      ctrlHint: 'Ctrl / ⌘ + Enter = Format',
      errClipboard: 'ক্লিপবোর্ডে কপি করা যায়নি — ব্রাউজার অনুমতি দেয়নি।',
      resultHere: 'ফলাফল এখানে দেখাবে...',
    },

    lorem: {
      unitsAria: 'একক',
      unitParagraphs: 'প্যারা',
      unitSentences: 'বাক্য',
      unitWords: 'শব্দ',
      wrappersAria: 'HTML র‍্যাপার',
      wrapperNone: 'প্লেইন',
      countLabel: 'সংখ্যা',
      countAria: 'কতটি',
      startClassicBtn: 'Lorem ipsum দিয়ে শুরু',
      generateBtn: '✦ তৈরি করুন',
      outputAria: 'তৈরি করা Lorem Ipsum',
      outputPlaceholder: 'তৈরি করুন চাপুন...',
      statusOk: '✓ তৈরি হয়েছে',
      statusIdle: 'অপেক্ষায়',
      statWords: 'শব্দ',
      statChars: 'অক্ষর',
      statBlocksPara: 'প্যারা',
      statBlocksUnit: 'একক',
      readMinTpl: 'পড়তে ~{n} মিনিট',
      privacyNote: '🔒 সব ব্রাউজারেই, কোনো নেটওয়ার্ক কল নেই',
    },

    color: {
      pickerAria: 'রঙ বাছাই করুন',
      randomBtn: '🎲 র‍্যান্ডম',
      resetBtn: '↺ রিসেট',
      validBadge: '✓ ভ্যালিড',
      invalidBadge: '✕ ভুল HEX',
      copyAriaTpl: 'কপি {label}',
      formatLabel: 'ফরম্যাট',
      contrastLabel: 'কনট্রাস্ট (WCAG)',
      contrastOnWhite: 'সাদার উপর',
      contrastOnBlack: 'কালোর উপর',
      shadesLabel: 'শেড (উজ্জ্বল → গাঢ়)',
      harmonyLabel: 'হারমোনি',
      harmonyComp: 'কমপ্লিমেন্টারি',
      harmonyA1: 'অ্যানালগাস −30°',
      harmonyA2: 'অ্যানালগাস +30°',
      selectAriaTpl: 'নির্বাচন {v}',
    },

    imageBase64: {
      modeAria: 'মোড',
      tabToBase64: 'ছবি → Base64',
      tabToImage: 'Base64 → ছবি',
      outputAria: 'আউটপুট ফরম্যাট',
      pickBtn: '📁 ছবি বাছুন',
      copyDataUri: '⧉ Copy Data URI',
      copiedDataUri: '✓ কপি হয়েছে',
      clearBtn: '✕ মুছুন',
      dragTitle: 'এখানে ছবি টেনে ছাড়ুন',
      dragOrClick: 'অথবা এই বক্সে ক্লিক করে',
      pickLink: 'ছবি বাছুন',
      formatsHintTpl: 'PNG · JPEG · GIF · WEBP — সর্বোচ্চ {max}',
      previewAlt: 'নির্বাচিত ছবির প্রিভিউ',
      outPlaceholder: 'Base64 এখানে দেখাবে...',
      decodeInputAria: 'Base64 ইনপুট',
      decodePlaceholder: 'data:image/png;base64,... অথবা শুধু Base64 পেস্ট করুন',
      decodedAlt: 'ডিকোড করা ছবির প্রিভিউ',
      downloadBtn: '⬇ ডাউনলোড',
      decodedPlaceholder: 'Base64 পেস্ট করলে ছবি এখানে দেখাবে',
      statusError: '✕ সমস্যা',
      statusConverted: '✓ রূপান্তর হয়েছে',
      statusImageFound: '✓ ছবি পাওয়া গেছে',
      statusWaiting: 'অপেক্ষায়',
      labelOriginal: 'আসল',
      labelBase64: 'Base64',
      labelOverhead: 'বাড়তি',
      privacyNote: '🔒 ফাইল আপনার ব্রাউজার ছাড়ে না',
      errEmptyFile: 'ফাইলটি খালি (0 byte)।',
      errTooBigTpl: 'ফাইল অনেক বড় ({size})। সর্বোচ্চ {max} অনুমোদিত।',
      errBadType: 'এটি অনুমোদিত ছবি নয়। শুধু PNG, JPEG, GIF বা WEBP গ্রহণ করা হয় (SVG নিরাপত্তার কারণে বাদ)।',
      errReadFail: 'ফাইল পড়া যায়নি।',
      errInputTooBigTpl: 'ইনপুট অনেক বড় ({size})।',
      errNotImageBase64: 'এটি অনুমোদিত ছবির Base64 নয় (PNG / JPEG / GIF / WEBP হতে হবে)।',
      errImageTooBigTpl: 'ছবিটি অনেক বড় ({size})।',
      errClipboard: 'ক্লিপবোর্ডে কপি করা যায়নি — ব্রাউজার অনুমতি দেয়নি।',
      errBadLength: 'Base64 দৈর্ঘ্য ভুল (৪-এর গুণিতক হতে হবে)',
      errBadChars: 'এটি ভ্যালিড Base64 নয় — অননুমোদিত অক্ষর আছে',
    },
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
    html: `<h1>হ্যালো, DevSchool! 👋</h1>
<p>আমি কোডিং শিখছি।</p>`,
    js: 'console.log("হ্যালো, DevSchool!");',
    typing1: 'npm create devschool@latest',
    typing2: 'শেখা শুরু হোক 🚀',
    communityLabel: 'DevSchool কমিউনিটি',
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

  // ── HomeExtras (components/HomeExtras.tsx) — Part 9k ──
  homeExtras: {
    marqueeLabel: 'যা শিখতে পারবেন',
    bentoBadge: 'কেন DevSchool',
    bentoTitle: 'শেখার পুরো অভিজ্ঞতাটাই আলাদা',
    bentoSubtitle: 'শুধু ভিডিও না — লিখুন, চালান, ভুল করুন, শিখুন।',
    bento1Title: 'ব্রাউজারেই কোড চালান',
    bento1Desc:
      'কিছু ইনস্টল করার দরকার নেই। Try It Yourself-এ ক্লিক করে সাথে সাথে HTML, CSS, JS চালিয়ে ফলাফল দেখুন।',
    bento2Title: 'প্রতিটা লেসনের কুইজ',
    bento2Desc: 'পড়া শেষে ছোট কুইজ — যা শিখেছেন তা মাথায় গেঁথে যাবে।',
    bento3Title: 'স্টেপ-বাই-স্টেপ ট্র্যাক',
    bento3Desc: 'শূন্য থেকে জব-রেডি — সাজানো রোডম্যাপ ফলো করুন।',
    bento4Title: 'প্রগ্রেস ট্র্যাকিং',
    bento4Desc: 'কতদূর এগোলেন, কোথায় আটকে আছেন — সব এক জায়গায়।',
    timelineBadge: 'রোডম্যাপ',
    timelineTitle: '৪ ধাপে জব-রেডি',
    roadmapNums: ['১', '২', '৩', '৪'],
    roadmap1Title: 'ভিত্তি গড়ুন',
    roadmap1Desc: 'HTML, CSS, JavaScript — একদম শুরু থেকে।',
    roadmap2Title: 'ফ্রেমওয়ার্ক শিখুন',
    roadmap2Desc: 'React ও Next.js দিয়ে মডার্ন অ্যাপ বানান।',
    roadmap3Title: 'ব্যাকএন্ড ও ডেটাবেজ',
    roadmap3Desc: 'API, Node.js, SQL — পূর্ণ স্ট্যাক দক্ষতা।',
    roadmap4Title: 'পোর্টফোলিও + ইন্টারভিউ',
    roadmap4Desc: 'প্রজেক্ট বানিয়ে জব-রেডি পোর্টফোলিও সাজান।',
    reviewsTitle: 'লার্নাররা যা বলছেন',
    reviewsCountTpl: '{count} জন শিক্ষার্থীর অভিজ্ঞতা',
    reviewsCountShortTpl: '{count} জনের রিভিউ',
    reviewsEmpty: 'এখনো কোনো অনুমোদিত রিভিউ নেই — প্রথম রিভিউটি আপনিই দিন! ✍️',
    reviewsVerifiedLabel: '🛡️ সব রিভিউ যাচাই করা হয়েছে',
    reviewsPrevAria: 'আগের রিভিউ',
    reviewsNextAria: 'পরের রিভিউ',
    reviewsPageAriaTpl: 'পেজ {n}',
    reviewsCtaPrompt: 'এখনো আপনার মতামত দেননি?',
    faqTitle: 'সাধারণ প্রশ্ন',
    ctaTitle: 'আজই শুরু করুন — একদম ফ্রি',
    ctaSubtitle: 'কোনো কার্ড লাগবে না, কোনো ট্রায়াল নেই। শুধু শেখা।',
    ctaButton: '🚀 এখনই শুরু করুন',
  },

  // ── ReviewForm (components/ReviewForm.tsx) — Part 9k ──
  reviewForm: {
    submitOk: '✅ ধন্যবাদ! আপনার রিভিউ অনুমোদনের জন্য পাঠানো হয়েছে।',
    errGeneric: 'কিছু ভুল হয়েছে — আবার চেষ্টা করুন।',
    errNetwork: 'নেটওয়ার্ক সমস্যা — আবার চেষ্টা করুন।',
    openButton: '✍️ আপনার রিভিউ দিন',
    formTitle: 'আপনার অভিজ্ঞতা শেয়ার করুন',
    closeBtn: 'বন্ধ',
    nameLabel: 'আপনার নাম *',
    namePlaceholder: 'যেমন: রাফি আহমেদ',
    roleLabel: 'পরিচয় (ঐচ্ছিক)',
    rolePlaceholder: 'যেমন: স্টুডেন্ট',
    starsLabel: 'রেটিং',
    textLabel: 'আপনার মতামত *',
    textPlaceholder: 'DevSchool সম্পর্কে আপনার অভিজ্ঞতা লিখুন...',
    submitBtn: 'রিভিউ জমা দিন',
    submittingBtn: 'পাঠানো হচ্ছে...',
    footerNote: 'জমা দেওয়ার পর অ্যাডমিন অনুমোদন করলে রিভিউটি দেখানো হবে।',
  },
};

export default bn;
export type Dictionary = typeof bn;
