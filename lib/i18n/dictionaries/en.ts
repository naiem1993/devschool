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
    emptyTutorialsDesc: 'New tutorials will be added soon.',
    filterSearchPlaceholder: 'Search tutorials... (e.g. HTML, JavaScript, Python)',
    filterSearchAria: 'Search tutorials',
    filterLevelAll: 'All levels',
    filterLevelBeginner: 'Beginner',
    filterLevelIntermediate: 'Intermediate',
    filterLevelAdvanced: 'Advanced',
    filterSortLabel: 'Sort:',
    filterSortLatest: 'Latest',
    filterSortPopular: 'Popular',
    filterSortTitle: 'Name (A-Z)',
    filterCountSuffix: 'tutorials',
    filterApplied: '(filtered)',
    filterClear: 'Clear all filters ✕',
    filterNoResultsTitle: 'Nothing found',
    filterNoResultsDesc: 'Try a different keyword or reset the filters.',
    filterShowAll: 'Show all tutorials',
    cardDescriptionSoon: 'Details coming soon',
    cardChaptersSuffix: 'chapters',
    cardMinutesSuffix: 'min',
    cardStart: 'Start',
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

    // ── /en placeholder (components/ContentComingSoon.tsx) ──
    comingSoonBadge: 'Coming soon',
    comingSoonTitle: 'English content is on the way',
    comingSoonMessage:
      "We're working on the English version — launching soon. Meanwhile, you can read in Bengali.",
    comingSoonCta: 'View in Bengali',

    // ── Home — Popular / Latest tutorial sections (app/[locale]/(site)/page.tsx) ──
    popularTitle: '🔥 Popular Tutorials',
    popularSubtitle: 'Most-read tutorials in our community',
    latestTitle: '✨ Latest Tutorials',
    latestSubtitle: 'Stay updated with the freshest content',

    // ── Home — Tutorial cards (components/LoadMoreTutorials.tsx) ──
    genericCategory: 'Generic',
    loading: 'Loading...',
    loadMoreTutorials: 'Load more tutorials ↓',
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

  // ── Search page (app/[locale]/(site)/search/*) ──
  search: {
    metaTitle: 'Search — Find Tutorials & References | DevSchool',
    metaDesc:
      'Search all DevSchool content — tutorials, references, syntax and code examples, all in one place.',
    metaOgTitle: 'Search | DevSchool',
    metaOgDesc: 'Find tutorials and references',
    jsonLdName: 'DevSchool Search',
    heroTitle: 'Search',
    heroSubtitle:
      'Search across all of DevSchool — tutorials, references and syntax — in seconds.',
  },

  // ── Playground page (app/[locale]/(site)/playground/*) ──
  playground: {
    metaTitle: 'Code Playground — Write, Run, Learn | DevSchool',
    metaDesc:
      'Write and run JavaScript, TypeScript, HTML and CSS right in your browser. No setup, no install.',
    metaOgTitle: 'Code Playground | DevSchool',
    metaOgDesc: 'Write and run code right in your browser.',
    heroTitle: 'Code Playground',
    heroSubtitlePre: 'Write and run code right in your browser. No setup, no install.',
    heroSubtitleHighlight: 'Just write, run, learn.',
  },

  // ── Progress page (app/[locale]/(site)/progress/*) ──
  progress: {
    metaTitle: 'My Progress — DevSchool',
    metaDesc: 'See your quiz and challenge progress. All data is stored on your device.',
    breadcrumbDashboard: 'Dashboard',
    heroTitle: 'My Progress',
    heroSubtitle:
      'See your quiz and challenge progress. All data is stored safely in your browser — no login required. Clearing your browser resets the data.',
  },

  // ── Tools page (app/[locale]/(site)/tools/*) ──
  tools: {
    metaTitle: 'Developer Tools — DevSchool',
    metaDesc:
      'Handy little tools for developers — JSON formatter, Base64, color picker, UUID generator and more.',
    metaOgTitle: 'Developer Tools | DevSchool',
    metaOgDesc: 'Handy little tools for developers.',
    heroTitle: 'Developer Tools',
    heroSubtitle:
      'Handy little tools for developers — all in one place. New tools will be added over time.',
    searchPlaceholder: 'Search tools... (e.g. json, base64, color)',
    searchAria: 'Search tools',
    allCategory: 'All',
    countTpl: '{count} tools',
    clearFilters: 'Clear filters ✕',
    noResultsTitle: 'No tools found',
    noResultsDesc: 'Try another keyword or reset the filters.',
    viewAll: 'View all tools',
    comingSoon: 'Soon',
    comingSoonArrow: 'Soon →',
    open: 'Open →',
  },

  // ── Tools section sub-page & tool-card text (PART A1) ──
  toolPages: {
    breadcrumbTools: 'Tools',

    catText: 'Text',
    catCode: 'Code',
    catConvert: 'Convert',
    catDesign: 'Design',

    jsonFormatterDesc: 'Clean up and format messy JSON so you can read it easily.',
    base64Desc: 'Encode or decode any text to and from Base64.',
    imageBase64Desc: 'Turn an image into Base64 / Data URI, or preview an image from Base64.',
    colorPickerDesc: 'Convert colors between HEX, RGB and HSL, and build a palette.',
    uuidDesc: 'Generate a random UUID v4 in one click.',
    loremIpsumDesc: 'Generate placeholder demo text.',
    imageToPdfDesc: 'Turn JPG / PNG / GIF / WEBP images into a single PDF in one click.',
    urlEncoderDesc: 'Encode or decode text to make it URL-safe.',

    pageBase64: {
      title: 'Base64 Encode / Decode',
      subtitle: 'Safely convert any text — including Bengali and emoji — to and from Base64. Everything runs in your browser; no data is sent to a server.',
    },
    pageColorPicker: {
      title: 'Color Picker',
      subtitle: 'Pick a color, convert it between HEX · RGB · HSL, build shades and harmony palettes, and check WCAG contrast — all in your browser.',
    },
    pageImageBase64: {
      title: 'Image to Base64',
      subtitle: 'Convert an image to Base64 or a Data URI — ready to paste into CSS/HTML. You can also paste Base64 to preview and download an image. Your image never leaves your browser.',
    },
    pageImageToPdf: {
      title: 'Image to PDF',
      subtitle: 'Turn JPG, PNG, GIF or WEBP images into a single PDF in one click — as an A4 page or at image size. Fully in your browser; no image is ever uploaded.',
    },
    pageJsonFormatter: {
      title: 'JSON Formatter',
      subtitle: 'Format messy JSON neatly, minify it, and pinpoint errors by line and column. Everything runs in your browser — no data is sent to a server.',
    },
    pageLoremIpsum: {
      title: 'Lorem Ipsum',
      subtitle: 'Generate placeholder text for testing a design or layout — by paragraphs, sentences or words, optionally wrapped in HTML tags. Everything runs in your browser.',
    },
  },

  // ── Tools UI text (PART A4) ──
  toolUi: {
    common: {
      copy: 'Copy',
      copied: '✓ Copied',
      clear: 'Clear',
      sample: 'Sample',
    },

    base64: {
      sampleText: 'DevSchool — learn, build, move forward 🚀',
      modeAria: 'Mode',
      encode: 'Encode',
      decode: 'Decode',
      inputAria: 'Input',
      placeholderEncode: 'Type any text...',
      placeholderDecode: 'Paste Base64 here...',
      resultHere: 'Result will appear here...',
      statusErr: '✕ Error',
      statusOk: '✓ Converted',
      statusIdle: 'Waiting',
      labelInput: 'Input',
      labelOutput: 'Output',
      labelMode: 'Mode',
      ctrlHint: 'Ctrl / ⌘ + Enter = Convert',
      errTooBigTpl: 'Input is {n} characters — max {max} allowed.',
      errBigInput: 'Large input — press the "Convert" button.',
      errClipboard: "Couldn't copy to clipboard — browser denied permission.",
      errBadLength: 'Invalid Base64 length (must be a multiple of 4)',
      errBadChars: 'Not valid Base64 — contains invalid characters',
    },

    json: {
      statusIdle: 'Waiting',
      statusTooBig: '✕ Input too large',
      statusMinified: '✓ Minified',
      statusValid: '✓ Valid JSON',
      statusFormatted: '✓ Formatted',
      statusBad: '✕ Invalid JSON',
      errTooBigTpl: 'Input is {n} characters — max {max} allowed.',
      errPositionTpl: '{msg} — line {line}, column {col}',
      bigInputHint: 'Large input — press Format',
      btnFormat: '✦ Format',
      btnMinify: '⇥ Minify',
      btnValidate: '✓ Validate',
      btnSort: '⇅ Sort keys',
      indentLabel: 'Indent',
      inputAria: 'JSON input',
      labelInput: 'Input',
      labelOutput: 'Output',
      labelLines: 'Lines',
      labelKeys: 'Keys',
      ctrlHint: 'Ctrl / ⌘ + Enter = Format',
      errClipboard: "Couldn't copy to clipboard — browser denied permission.",
      resultHere: 'Result will appear here...',
    },

    lorem: {
      unitsAria: 'Unit',
      unitParagraphs: 'Paragraphs',
      unitSentences: 'Sentences',
      unitWords: 'Words',
      wrappersAria: 'HTML wrapper',
      wrapperNone: 'Plain',
      countLabel: 'Count',
      countAria: 'How many',
      startClassicBtn: 'Start with Lorem ipsum',
      generateBtn: '✦ Generate',
      outputAria: 'Generated Lorem Ipsum',
      outputPlaceholder: 'Press Generate...',
      statusOk: '✓ Generated',
      statusIdle: 'Waiting',
      statWords: 'Words',
      statChars: 'Characters',
      statBlocksPara: 'Paragraphs',
      statBlocksUnit: 'Units',
      readMinTpl: '~{n} min read',
      privacyNote: '🔒 Runs fully in your browser — no network calls',
    },

    color: {
      pickerAria: 'Pick a color',
      randomBtn: '🎲 Random',
      resetBtn: '↺ Reset',
      validBadge: '✓ Valid',
      invalidBadge: '✕ Invalid HEX',
      copyAriaTpl: 'Copy {label}',
      formatLabel: 'Format',
      contrastLabel: 'Contrast (WCAG)',
      contrastOnWhite: 'On white',
      contrastOnBlack: 'On black',
      shadesLabel: 'Shades (light → dark)',
      harmonyLabel: 'Harmony',
      harmonyComp: 'Complementary',
      harmonyA1: 'Analogous −30°',
      harmonyA2: 'Analogous +30°',
      selectAriaTpl: 'Select {v}',
    },
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
    communityLabel: 'DevSchool Community',
  },

  // ── Language switcher ──
  language: {
    switchTo: 'Switch language',
    bengali: 'বাংলা',
    english: 'English',
  },

  // ─────────────────────────────────────────
  //  New sections — Part 5e-3 (Client UI + About)
  // ─────────────────────────────────────────

  // ── Search UI (SearchClient.tsx — client component) ──
  searchUi: {
    placeholder: 'What do you want to learn? (e.g. JavaScript, Python, React...)',
    ariaLabel: 'Search',
    clearLabel: 'Clear',
    popularLabel: 'Popular:',
    tabAll: 'All',
    tabTutorials: 'Tutorials',
    tabReferences: 'References',
    resultCount: 'results',
    noResults: 'No results found. Try another keyword.',
    tryHint: 'Type at least 2 characters',
    searching: 'Searching...',
    errorTitle: 'Search is not working',
    errorDesc: 'Please try again in a moment.',
  },

  // ── Playground UI (PlaygroundClient.tsx — client) ──
  playgroundUi: {
    editorLoading: 'Loading editor...',
    running: '⌛ Running...',
    run: '▶ Run',
    copy: 'Copy',
    copied: 'Copied ✓',
    outputTitle: 'Output',
    previewTitle: 'Preview',
    cssPreview: 'CSS preview — your styles will appear here',
    noOutput: '(no output)',
  },

  // ── Progress UI (ProgressClient.tsx — client) ──
  progressUi: {
    loadError: 'Cannot load',
    retry: 'Try again',
    emptyTitle: 'No progress yet',
    emptyDesc:
      'Start with a quiz or solve a coding challenge — your data will appear here right away.',
    viewChallenges: '⚔️ View challenges',
    viewTutorials: '📚 View tutorials',
    quizAccuracy: 'Quiz accuracy',
    quizAccuracySubTpl: '{correct}/{total} correct',
    challengePassed: 'Challenges passed',
    challengePassedSubTpl: 'out of {attempted} attempts',
    totalPoints: 'Total points',
    totalPointsSub: 'from passed challenges',
    quizPerformance: 'Quiz performance',
    recentActivity: 'Recent activity',
    passed: '✓ Passed',
    failed: '✗ Failed',
    refresh: '↻ Refresh',
  },

  // ── About page (app/[locale]/about/page.tsx) ──
  about: {
    metaTitle: 'About | DevSchool',
    metaDesc: 'What DevSchool is, why it was built and who is behind it.',
    heroTitle: 'About DevSchool',
    heroSubtitle: 'A platform for learning programming for free, in Bengali, by doing.',
    missionTitle: 'Our mission',
    missionDesc:
      'To bring quality, completely free programming education in the Bengali language within everyone\u2019s reach.',
    visionTitle: 'Our vision',
    visionDesc:
      'Any Bengali learner, in their own language, with just an internet connection, can go from zero to professional developer.',
    valuesTitle: 'Our values',
    valuesFree: 'Always free',
    valuesFreeDesc: 'No paid courses, no hidden charges.',
    valuesPractical: 'Hands-on learning',
    valuesPracticalDesc: 'Not just reading — write, run, make mistakes, learn.',
    valuesBengali: 'Bengali first',
    valuesBengaliDesc: 'Everything is built with Bengali-speaking learners in mind.',
    contactTitle: 'Contact',
    contactDesc: 'If you have any question, feedback or problem, let us know.',
  },

  // ── slug-level not-found / error pages ──
  slugPages: {
    tutorialNotFoundTitle: 'Tutorial not found',
    tutorialNotFoundMsg:
      'The tutorial you are looking for does not exist, has been removed, or is not published yet.',
    tutorialErrorTitle: 'Could not load tutorial',
    tutorialErrorMsg:
      'An error occurred while loading this tutorial. Please try again.',

    referenceNotFoundTitle: 'Reference not found',
    referenceNotFoundMsg: 'No reference with this name exists, or it has been removed.',
    referenceErrorTitle: 'Could not load reference',
    referenceErrorMsg:
      'An error occurred while loading this reference. Please try again.',

    challengeNotFoundTitle: 'Challenge not found',
    challengeNotFoundMsg: 'This challenge does not exist, or it has been removed.',
    challengeErrorTitle: 'Could not load challenge',
    challengeErrorMsg:
      'An error occurred while loading this challenge. Please try again.',

    chapterNotFoundTitle: 'This chapter does not exist',
    chapterNotFoundMsg:
      'The chapter you are looking for does not exist, the number is wrong, or it is not published yet.',
    chapterErrorTitle: 'Could not load chapter',
    chapterErrorMsg:
      'An error occurred while loading this chapter. Please try again.',

    viewAllTutorials: 'View all tutorials',
    viewAllReferences: 'View all references',
    viewAllChallenges: 'View all challenges',
    goHome: 'Back to homepage',
    retry: 'Try again 🔄',
  },

  // ── HomeExtras (components/HomeExtras.tsx) — Part 9k ──
  homeExtras: {
    marqueeLabel: "What you'll learn",
    bentoBadge: 'Why DevSchool',
    bentoTitle: 'The whole learning experience is different',
    bentoSubtitle: 'Not just videos — write, run, make mistakes, learn.',
    bento1Title: 'Run code right in your browser',
    bento1Desc:
      'No install needed. Click Try It Yourself and run HTML, CSS and JS instantly to see the result.',
    bento2Title: 'A quiz after every lesson',
    bento2Desc: 'A short quiz after reading — what you learned will stick.',
    bento3Title: 'A step-by-step track',
    bento3Desc: 'From zero to job-ready — follow a structured roadmap.',
    bento4Title: 'Progress tracking',
    bento4Desc: 'See how far you have come and where you are stuck — all in one place.',
    timelineBadge: 'Roadmap',
    timelineTitle: 'Job-ready in 4 steps',
    roadmapNums: ['1', '2', '3', '4'],
    roadmap1Title: 'Build the foundation',
    roadmap1Desc: 'HTML, CSS, JavaScript — from the very beginning.',
    roadmap2Title: 'Learn a framework',
    roadmap2Desc: 'Build modern apps with React and Next.js.',
    roadmap3Title: 'Backend and databases',
    roadmap3Desc: 'APIs, Node.js, SQL — full-stack skills.',
    roadmap4Title: 'Portfolio + interviews',
    roadmap4Desc: 'Build projects and put together a job-ready portfolio.',
    reviewsTitle: 'What learners are saying',
    reviewsCountTpl: 'Experiences from {count} students',
    reviewsCountShortTpl: '{count} reviews',
    reviewsEmpty: 'No approved reviews yet — be the first to leave one! ✍️',
    reviewsVerifiedLabel: '🛡️ All reviews are verified',
    reviewsPrevAria: 'Previous review',
    reviewsNextAria: 'Next review',
    reviewsPageAriaTpl: 'Page {n}',
    reviewsCtaPrompt: "Haven't shared your opinion yet?",
    faqTitle: 'Frequently asked questions',
    ctaTitle: 'Start today — completely free',
    ctaSubtitle: 'No card needed, no trial. Just learning.',
    ctaButton: '🚀 Start now',
  },

  // ── ReviewForm (components/ReviewForm.tsx) — Part 9k ──
  reviewForm: {
    submitOk: '✅ Thanks! Your review has been sent for approval.',
    errGeneric: 'Something went wrong — please try again.',
    errNetwork: 'Network problem — please try again.',
    openButton: '✍️ Leave your review',
    formTitle: 'Share your experience',
    closeBtn: 'Close',
    nameLabel: 'Your name *',
    namePlaceholder: 'e.g. Rafi Ahmed',
    roleLabel: 'Role (optional)',
    rolePlaceholder: 'e.g. Student',
    starsLabel: 'Rating',
    textLabel: 'Your review *',
    textPlaceholder: 'Write about your experience with DevSchool...',
    submitBtn: 'Submit review',
    submittingBtn: 'Sending...',
    footerNote: 'After submission, the review appears once an admin approves it.',
  },
};

export default en;
