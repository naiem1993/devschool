export type TryItLocale = 'bn' | 'en'

type TryItText = {
  editorTitle: string
  copy: string
  copied: string
  reset: string
  result: string
  run: string
  runArrow: string
  tip: string
  fullTip: string
  openFull: string
  back: string
  // Page-level buttons
  home: string
  homeCrumb: string
  next: string
  complete: string
  tipShort: string
  // Tutorial page strings
  tutorialsCrumb: string
  whatYouLearn: string
  noChapters: string
  lessonsCount: string
}

export const TRYIT_TEXT: Record<TryItLocale, TryItText> = {
  bn: {
    editorTitle: 'Try it Yourself — Editor',
    copy: 'কপি',
    copied: '✓ কপি হয়েছে',
    reset: 'রিসেট',
    result: 'ফলাফল',
    run: 'চালাও',
    runArrow: 'চালাও »',
    tip: 'Ctrl / ⌘ + Enter চাপলেও run হয়',
    fullTip: 'টিপ: Ctrl / Cmd + Enter চাপলে সাথে সাথে run হবে।',
    openFull: 'ফুল এডিটর খোলো',
    back: '← ফিরে যান',
    home: '❮ হোম',
    homeCrumb: 'হোম',
    next: 'পরবর্তী ❯',
    complete: 'সম্পন্ন ✓',
    tipShort: 'Ctrl / ⌘ + Enter চাপলেও run হয়',
    tutorialsCrumb: 'টিউটোরিয়াল',
    whatYouLearn: 'এই টিউটোরিয়ালে যা যা শিখবেন',
    noChapters: 'এখনো কোনো চ্যাপ্টার যোগ করা হয়নি।',
    lessonsCount: 'লেসন',
  },
  en: {
    editorTitle: 'Try it Yourself — Editor',
    copy: 'Copy',
    copied: '✓ Copied',
    reset: 'Reset',
    result: 'Result',
    run: 'Run',
    runArrow: 'Run »',
    tip: 'Press Ctrl / ⌘ + Enter to run',
    fullTip: 'Tip: Press Ctrl / Cmd + Enter to run instantly.',
    openFull: 'Open Full Editor',
    back: '← Go Back',
    home: '❮ Home',
    homeCrumb: 'Home',
    next: 'Next ❯',
    complete: 'Complete ✓',
    tipShort: 'Press Ctrl / ⌘ + Enter to run',
    tutorialsCrumb: 'Tutorials',
    whatYouLearn: 'What You Will Learn',
    noChapters: 'No chapters added yet.',
    lessonsCount: 'lessons',
  },
}