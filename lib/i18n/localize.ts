// ==========================================
//  LOCALIZE — ডেটাবেসের দুই ভাষার ঘর থেকে সঠিক ভাষার লেখা বেছে নেওয়ার যন্ত্র
// ==========================================
//  এই ফাইলটা কী করে (সহজ ভাষায়):
//  ডেটাবেসে প্রতিটা লেখা দুইবার রাখা আছে — বাংলা (titleBn) আর ইংরেজি (titleEn)।
//  পেজ দেখানোর সময় URL-এ কোন ভাষা আছে (bn বা en) — সেটা বলে দেয় কোনটা দেখাবে।
//  এই ফাইলটা সেই বেছে নেওয়ার কাজটা একজায়গায় করে রাখে,
//  যাতে প্রতিটা পেজে বারবার একই নিয়ম লিখতে না হয়।
//
//  উদাহরণ (real-life):
//  ভাবুন একটা ওয়েটার — আপনি বললেন "ইংরেজি মেনু"।
//  সে ইংরেজি মেনু আছে কি না দেখে দেবেন; না থাকলে বলবেন "নেই" —
//  জোর করে বাংলা মেনু ধরিয়ে দেবেন না। এই ফাইলও ঠিক তা-ই করে।
// ==========================================

import type { Locale } from './config';

// ------------------------------------------
// ১) মূল যন্ত্র — pickText
// ------------------------------------------
//  locale অনুযায়ী বাংলা বা ইংরেজি লেখা বেছে দেয়।
//
//  নিয়ম (strict — কোনো fallback নেই):
//   • locale = 'bn' → শুধু বাংলা ফেরত দেবে (খালি হলে null)
//   • locale = 'en' → শুধু ইংরেজি ফেরত দেবে; ইংরেজি খালি/null হলে null
//     (এমনকি বাংলা থাকলেও দেখাবে না — এটাই ইউজারের কঠিন নিয়ম)
//
//  খালি মানে: null, undefined, বা শুধু ফাঁকা স্পেস ("   ")।
//  খালি হলে null ফেরত আসে — পেজ তখন ওই লেখাটা একেবারে বাদ দেবে।
//
export function pickText(
  locale: Locale,
  bn: string | null | undefined,
  en: string | null | undefined
): string | null {
  // কোন ভাষার লেখা নিতে হবে সেটা বেছে নেওয়া
  const raw = locale === 'en' ? en : bn;

  // না থাকলে বা খালি হলে null ফেরত
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;

  // ঠিক আছে — আসল লেখা ফেরত দিই
  return raw;
}

// ==========================================
// ২) প্রতিটা Prisma মডেলের জন্য ছোট wrapper
// ==========================================
//  প্রতিটা wrapper একটা মডেলের সাথে ১:১ মেলে (Tutorial ↔ localizeTutorial,
//  Chapter ↔ localizeChapter — এভাবে)।
//  wrapper গুলো ভেতরে pickText-ই ডাকে — তাই নিয়ম সবখানে একই থাকে।
//  পেজে এভাবে লিখব:
//     const { title, content } = localizeChapter(locale, ch);
//  এতে DB-র কলামের নাম (titleBn/titleEn) পেজের কোডে ছড়াবে না —
//  ভবিষ্যতে কলামের নাম বদলালেও পেজ বদলাতে হবে না।
// ==========================================

// Tutorial — title, description
export type TutorialLike = {
  titleBn: string;
  titleEn: string | null;
  descriptionBn: string | null;
  descriptionEn: string | null;
};

export function localizeTutorial(
  locale: Locale,
  t: TutorialLike
): { title: string | null; description: string | null } {
  return {
    title: pickText(locale, t.titleBn, t.titleEn),
    description: pickText(locale, t.descriptionBn, t.descriptionEn),
  };
}

// ChapterGroup — শুধু title
export type ChapterGroupLike = {
  titleBn: string;
  titleEn: string | null;
};

export function localizeGroup(
  locale: Locale,
  g: ChapterGroupLike
): { title: string | null } {
  return {
    title: pickText(locale, g.titleBn, g.titleEn),
  };
}

// Chapter — title, content, codeExample
export type ChapterLike = {
  titleBn: string;
  titleEn: string | null;
  contentBn: string | null;
  contentEn: string | null;
  codeExampleBn: string | null;
  codeExampleEn: string | null;
};

export function localizeChapter(
  locale: Locale,
  c: ChapterLike
): { title: string | null; content: string | null; codeExample: string | null } {
  return {
    title: pickText(locale, c.titleBn, c.titleEn),
    content: pickText(locale, c.contentBn, c.contentEn),
    codeExample: pickText(locale, c.codeExampleBn, c.codeExampleEn),
  };
}

// Lesson — title, content, codeExample
export type LessonLike = {
  titleBn: string;
  titleEn: string | null;
  contentBn: string;
  contentEn: string | null;
  codeExampleBn: string | null;
  codeExampleEn: string | null;
};

export function localizeLesson(
  locale: Locale,
  l: LessonLike
): { title: string | null; content: string | null; codeExample: string | null } {
  return {
    title: pickText(locale, l.titleBn, l.titleEn),
    content: pickText(locale, l.contentBn, l.contentEn),
    codeExample: pickText(locale, l.codeExampleBn, l.codeExampleEn),
  };
}

// Reference — title, description, syntax, example
export type ReferenceLike = {
  titleBn: string;
  titleEn: string | null;
  descriptionBn: string | null;
  descriptionEn: string | null;
  syntaxBn: string | null;
  syntaxEn: string | null;
  exampleBn: string | null;
  exampleEn: string | null;
};

export function localizeReference(
  locale: Locale,
  r: ReferenceLike
): {
  title: string | null;
  description: string | null;
  syntax: string | null;
  example: string | null;
} {
  return {
    title: pickText(locale, r.titleBn, r.titleEn),
    description: pickText(locale, r.descriptionBn, r.descriptionEn),
    syntax: pickText(locale, r.syntaxBn, r.syntaxEn),
    example: pickText(locale, r.exampleBn, r.exampleEn),
  };
}

// QuizQuestion — question, explanation
export type QuizQuestionLike = {
  questionBn: string;
  questionEn: string | null;
  explanationBn: string | null;
  explanationEn: string | null;
};

export function localizeQuizQuestion(
  locale: Locale,
  q: QuizQuestionLike
): { question: string | null; explanation: string | null } {
  return {
    question: pickText(locale, q.questionBn, q.questionEn),
    explanation: pickText(locale, q.explanationBn, q.explanationEn),
  };
}

// QuizOption — শুধু text
export type QuizOptionLike = {
  textBn: string;
  textEn: string | null;
};

export function localizeQuizOption(
  locale: Locale,
  o: QuizOptionLike
): { text: string | null } {
  return {
    text: pickText(locale, o.textBn, o.textEn),
  };
}

// CodeChallenge — title, description
export type ChallengeLike = {
  titleBn: string;
  titleEn: string | null;
  descriptionBn: string;
  descriptionEn: string | null;
};

export function localizeChallenge(
  locale: Locale,
  ch: ChallengeLike
): { title: string | null; description: string | null } {
  return {
    title: pickText(locale, ch.titleBn, ch.titleEn),
    description: pickText(locale, ch.descriptionBn, ch.descriptionEn),
  };
}
