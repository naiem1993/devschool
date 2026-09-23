// ==========================================
//  ENGLISH DICTIONARY (en) — English UI strings
// ==========================================
//  এই ফাইল bn.ts-এর হুবহু একই আকার (একই key) হতে হবে।
//  কোনো key বাদ পড়লে TypeScript সাথে সাথে ধরে ফেলবে।

import type { Dictionary } from './bn';

const en: Dictionary = {
  // ── Header navigation ──
  nav: {
    tutorials: 'Tutorials',
    references: 'References',
    playground: 'Playground',
    challenges: 'Challenges',
    tools: 'Tools',
    progress: 'Progress',
    search: 'Search',
    about: 'About',
  },

  // ── Common buttons/labels ──
  common: {
    home: 'Home',
    next: 'Next',
    prev: 'Prev',
    complete: 'Complete ✓',
    loading: 'Loading...',
    notFound: 'Not found',
    error: 'Error',
    back: 'Back',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
  },

  // ── Tutorial page ──
  tutorial: {
    example: 'Example',
    tryIt: 'Try It',
    onThisPage: 'On this page',
    chapters: 'Chapters',
    lessons: 'Lessons',
    previousLesson: 'Previous lesson',
    nextLesson: 'Next lesson',

    // ── LessonSidebar (components/LessonSidebar.tsx) ──
    navLabel: 'Tutorial navigation',
    emptyChapters: 'This tutorial has no chapters yet.',
    collapse: 'Collapse',
    expand: 'Expand',

    // ── TryIt editor (components/TryIt.tsx) ──
    run: 'Run',
    editor: 'Editor',
    editorTitle: 'Try it Yourself — Editor',
    close: 'Close',
  },

  // ── Footer ──
  footer: {
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms',
    copyright: '© DevSchool — All rights reserved',

    tagline:
      'Practical, hands-on coding lessons. From beginner to job-ready — step by step.',

    colLearn: 'Learn',
    colTools: 'Tools',
    colSite: 'Site',

    linkTutorials: 'Tutorials',
    linkChallenges: 'Challenges',
    linkReferences: 'References',
    linkSearch: 'Search',

    linkAllTools: 'All Tools',
    linkPlayground: 'Playground',
    linkProgress: 'Progress',
    linkJsonFormatter: 'JSON Formatter',

    linkAbout: 'About',
    linkSitemap: 'Sitemap',
    linkRobots: 'Robots',

    madeWith: 'Made with 💚',
  },

  // ── 404 page ──
  notFound: {
    title: 'Page not found',
    message: 'Sorry, the page you are looking for does not exist.',
    goHome: 'Go home',

    // ── app/not-found.tsx — full 404 page (client-side locale) ──
    metaTitle: '404 — Page not found | DevSchool',
    metaDescription: 'The page you are looking for does not exist or has been removed.',
    statusPill: 'Page Not Found',
    bigTitle: 'Page not found',
    bigMessage:
      'The link you opened is wrong, has been removed, or never existed. Keep learning from the options below.',
    backHome: 'Back to homepage',
    searchSomething: 'Search something',
    popularLabel: 'Popular sections',
    linkTutorials: 'Tutorials',
    linkChallenges: 'Challenges',
    linkReferences: 'References',
    linkSearch: 'Search',
    footerText: 'DevSchool · Learn programming for free',
  },

  // ── Error page ──
  error: {
    title: 'Something went wrong',
    message: 'Please try again. If the problem persists, let us know.',
    retry: 'Try again',

    // ── (site)/error.tsx — site-level error boundary ──
    statusPill: 'Something went wrong',
    bigTitle: 'Something went wrong',
    bigMessage:
      'An error occurred while loading this page. Please try again — if it persists, go back to the homepage.',
    tryAgain: 'Try again 🔄',
    homePage: '🏠 Homepage',
    footerText: 'DevSchool · Learn programming for free',
  },

  // ── Root layout SEO (app/[locale]/layout.tsx) ──
  meta: {
    siteTitle: 'DevSchool — Learn programming for free',
    siteDescription:
      'Tutorials, quizzes and coding challenges in 20+ languages including HTML, CSS, JavaScript and Python',
  },

  // ── Listing pages (tutorials, challenges, references, tools...) ──
  listing: {
    breadcrumbHome: 'Home',
    tutorialsTitle: 'All Tutorials',
    tutorialsSubtitle:
      'Pick your favourite programming language and start learning with structured tutorials. All content is 100% free.',
    statTutorials: 'Tutorials',
    statChapters: 'Chapters',
    statReferences: 'References',
    dbConnectError: 'Connection problem',
    backHome: 'Back to homepage',
    dbErrNoConn: 'Cannot connect to the database server.',
    dbErrNoTable: 'Database table not found. Please run migrations.',
    dbErrGeneric: 'Could not load tutorials.',
    emptyTutorials: 'No tutorials yet.',
  },

  // ── Home page (app/[locale]/(site)/page.tsx) ──
  home: {
    metaTitleTpl: 'DevSchool — {count}+ tutorials',
    metaTitleStatic: 'DevSchool — Learn programming for free',
    metaDescTpl:
      'Learn programming for free. {count} tutorials, interactive quizzes and practice challenges.',
    metaOgDesc: 'A completely free learning platform with {count} tutorials',
    trackTitle: '🗺️ Career Learning Track',
    trackSubtitle:
      'A step-by-step roadmap from zero to professional developer',
    frontendTitle: 'Frontend Master',
    frontendDesc:
      'Learn HTML, CSS, JavaScript, React and Next.js, and build modern user interfaces.',
    backendTitle: 'Backend Engineer',
    backendDesc:
      'Master Node.js, Express, Python, Databases, API design and server architecture.',
    fullstackTitle: 'Full Stack Developer',
    fullstackDesc:
      'Become skilled on both frontend and backend. Learn databases, deployment and authentication.',
    startTrack: 'Start this track →',
    errNoConn: 'Cannot connect to the database server. Please check your network.',
    errNoTable: 'Database table not found. Please run migrations.',
    errUnknown: 'An unknown problem occurred. We are working on a fix.',
  },

  // ── Challenges page (app/[locale]/(site)/challenges/*) ──
  challenges: {
    metaTitle: 'Code Challenges — Practice | DevSchool',
    metaOgTitle: 'Code Challenges | DevSchool',
    metaDescTpl:
      '{count}+ hands-on coding challenges — learn programming by solving real problems.',
    metaFallbackTitle: 'Challenges | DevSchool',
    heroTitle: 'Code Challenges',
    heroSubtitle:
      'Solve real coding problems, pass test cases and prove your skill. Every challenge has an interactive editor, live run and auto-tests.',
    statChallenges: 'Challenges',
    jsonLdName: 'Code Challenges — DevSchool',
    jsonLdDescTpl: '{count} coding challenges',
    errNoConn: 'Cannot connect to the database.',
    errNoTable: 'Database table not found.',
    errGeneric: 'Could not load challenges.',
    emptyTitle: 'No challenges yet',
    emptyDesc: 'New challenges will be added soon.',
    searchPlaceholder: 'Search challenges...',
    allDifficulty: 'All levels',
    viewAll: 'View all challenges',
    noResultsTitle: 'Nothing found',
    noResultsDesc: 'Try another keyword or reset the filters.',
    clearFilters: 'Clear all filters ✕',
    filteredLabel: '(filtered)',
    countTpl: '{count} challenges',
    searchAria: 'Search challenges',
    allOption: 'All',
    filterClear: 'Clear filters ✕',
    noResultsDiffDesc: 'Try another keyword or difficulty.',
    solve: 'Solve →',
    pts: 'pts',
    errLoadTitle: 'Something went wrong',
    errLoadMsg: 'An error occurred while loading challenges.',
  },

  // ── References page (app/[locale]/(site)/references/*) ──
  references: {
    metaTitle: 'Programming References — Full Dictionary | DevSchool',
    metaOgTitle: 'Programming References | DevSchool',
    metaDescTpl:
      '{refCount}+ programming references — full dictionary of syntax, examples and tags across {langCount} languages.',
    metaFallbackTitle: 'References | DevSchool',
    heroTitle: 'Programming References',
    heroSubtitle:
      'The complete dictionary of every function, method and syntax — find them by code examples, tags and language. Your pocket developer.',
    statReferences: 'References',
    statLanguages: 'Languages',
    jsonLdName: 'Programming References — DevSchool',
    jsonLdDescTpl: '{count} references',
    errNoConn: 'Cannot connect to the database.',
    errNoTable: 'Database table not found.',
    errGeneric: 'Could not load references.',
    emptyTitle: 'No references yet',
    emptyDesc: 'New references will be added soon.',
    searchPlaceholder: 'Search references... (e.g. map, forEach, fetch)',
    searchAria: 'Search references',
    countTpl: '{count} references',
    viewAll: 'View all references',
    filterLanguage: 'Language filter',
    allLanguages: 'All languages',
    sortAria: 'Sort by',
    sortTitle: 'Name (A-Z)',
    sortLanguage: 'Language',
    filteredLabel: '(filtered)',
    clearFilters: 'Clear all filters ✕',
    noResultsTitle: 'Nothing found',
    noResultsDesc: 'Try another keyword or reset the filters.',
    detailsSoon: 'Details coming soon',
    errorTitle: 'Could not load references',
    errorMessage: 'An error occurred while loading references.',
  },

  // ── HomeErrorPanel (components/HomeErrorPanel.tsx) ──
  homeError: {
    title: 'Connection problem',
    retry: 'Try again 🔄',
    continueBrowsing: 'Continue browsing →',
    supportPre: 'If the problem persists, contact our',
    supportLink: 'support',
    supportPost: '',
  },

  // ── LanguageTabs ──
  tabs: {
    tutorialMenu: 'Tutorial menu',
    prevTab: 'Previous tab',
    nextTab: 'Next tab',
  },

  // ── Hero demo code ও typing ──
  heroDemo: {
    html: '<h1>Hello, DevSchool! 👋</h1>\\n<p>I am learning to code.</p>',
    js: 'console.log("Hello, DevSchool!");',
    typing1: 'npm create devschool@latest',
    typing2: 'Let the learning begin 🚀',
  },

  // ── Language switcher ──
  language: {
    switchTo: 'Switch language',
    bengali: 'বাংলা',
    english: 'English',
  },
};

export default en;
