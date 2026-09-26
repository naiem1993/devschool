/**
 * Generalized course seeder — markdown থেকে Chapter + Lesson DB-তে push করে।
 *
 * Flow:
 *   1. content/<course>/chapter-NN.md       → বাংলা (titleBn, contentBn, codeExampleBn)
 *   2. content/<course>/chapter-NN.en.md    → ইংরেজি (titleEn, contentEn, codeExampleEn) — থাকলে
 *   3. Upsert Tutorial → Chapter → Lesson (Bn + En একসাথে, একই row-তে)
 *   4. ডিফল্টে কিছু মুছবে না। --prune দিলে .md-তে নেই এমন lesson মুছবে।
 *
 * স্থায়ী নিয়ম:
 *   - Slug সবসময় ইংরেজিতে (URL-এর জন্য) — বাংলা ফাইলের slug-mapping টেবিল থেকে আসে।
 *   - ইংরেজি ফাইলের heading শুধু content-এর জন্য; slug pairing হয় বাংলা ফাইলের সাথে position-ভিত্তিক।
 *   - .en.md না থাকলে *En = null (strict no-fallback — বাংলা কপি করা হয় না)।
 *
 * Usage:
 *   npm run seed:course                → সব course, সব chapter
 *   npm run seed:course -- css         → শুধু css course
 *   npm run seed:course -- html 01     → html course-এর chapter-01
 *   npm run seed:course -- --prune     → অপ্রয়োজনীয় lesson/chapter মুছবে
 *
 * Safe to re-run — upsert by (tutorialId, chapterSlug) + (chapterId, lessonSlug)।
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// ─────────────────────────────────────────────────────────────
// Course configs
// ─────────────────────────────────────────────────────────────

type CourseConfig = {
  slug: string
  titleBn: string
  titleEn: string
  descriptionBn: string
  descriptionEn: string
  difficulty: string
  dir: string
  codeFence: string
  chapterSlugs: Record<string, string>
  lessonSlugs: Record<string, string>
}

const COURSES: Record<string, CourseConfig> = {
  html: {
    slug: 'html',
    titleBn: 'HTML Tutorial',
    titleEn: 'HTML Tutorial',
    descriptionBn:
      'HTML শিখুন একদম শুরু থেকে — বাংলায়, সহজ ভাষায়। ধাপে ধাপে chapter, প্রতিটা ছোট ছোট lesson-এ ভাগ করা।',
    descriptionEn: 'Learn HTML from scratch — step by step, easy to follow.',
    difficulty: 'Beginner',
    dir: 'html',
    codeFence: 'html',
    chapterSlugs: {
      'HTML পরিচিতি — একদম শুরু': 'introduction',
      'HTML Basic Structure': 'basic-structure',
    },
    lessonSlugs: {
      // Chapter 1
      'HTML কী?': 'what-is-html',
      'HTML দিয়ে কী কী বানানো যায়?': 'what-can-html-do',
      'প্রথম HTML ফাইল — তৈরি ও সেভ': 'first-html-file',
      // Chapter 2
      'HTML Document Structure': 'document-structure',
      'Tag, Element, Attribute': 'tag-element-attribute',
      'HTML Comment': 'html-comment',
    },
  },
  css: {
    slug: 'css',
    titleBn: 'CSS Tutorial',
    titleEn: 'CSS Tutorial',
    descriptionBn:
      'CSS শিখুন একদম শুরু থেকে — বাংলায়। HTML page-কে সুন্দর করতে যা যা লাগে, সব ধাপে ধাপে।',
    descriptionEn: 'Learn CSS from scratch — style your HTML pages step by step.',
    difficulty: 'Beginner',
    dir: 'css',
    codeFence: 'css',
    chapterSlugs: {
      'CSS পরিচিতি — সৌন্দর্যের শুরু': 'introduction',
      'CSS Selectors': 'selectors',
      'CSS Box Model': 'box-model',
      'CSS Colors ও Background': 'colors-background',
      'CSS Text ও Font': 'text-font',
    },
    lessonSlugs: {
      // Chapter 1
      'CSS কী?': 'what-is-css',
      'CSS লেখার ৩ উপায়': 'three-ways',
      'CSS Syntax ও Selector Basics': 'syntax-basics',
      // Chapter 2
      'Element Selector': 'element-selector',
      'Class ও ID Selector': 'class-id-selector',
      // Chapter 3
      'Box Model পরিচিতি': 'box-model-intro',
      'Padding, Border, Margin বিস্তারিত': 'padding-border-margin',
      // Chapter 4
      'Color লেখার উপায়': 'color-ways',
      Background: 'background',
      // Chapter 5
      'Font Properties': 'font-properties',
      'Text Alignment ও Spacing': 'text-alignment-spacing',
    },
  },
}

// ─────────────────────────────────────────────────────────────
// Parser (Bn অথবা En — একই কাঠামো, শুধু section-শব্দ আলাদা)
// ─────────────────────────────────────────────────────────────

type RawLesson = {
  title: string
  content: string
  codeExample: string | null
  sortOrder: number
}

type RawChapter = {
  number: number
  title: string
  goal: string
  lessons: RawLesson[]
}

function parseMarkdown(md: string, codeFence: string): RawChapter {
  const lines = md.split(/\r?\n/)

  const titleLine = lines.find((l) => /^#\s+Chapter\s+\d+:/.test(l))
  if (!titleLine) throw new Error('No "# Chapter N: ..." heading found.')

  const numberMatch = titleLine.match(/^#\s+Chapter\s+(\d+):/)
  const chapterNumber = numberMatch ? parseInt(numberMatch[1], 10) : 0
  const chapterTitle = titleLine.replace(/^#\s+Chapter\s+\d+:\s*/, '').trim()

  // লক্ষ্য (Bn) অথবা Goal (En)
  const goalLine = lines.find((l) => /^\*\*(লক্ষ্য|Goal):\*\*/.test(l))
  const goal = goalLine
    ? goalLine.replace(/^\*\*(লক্ষ্য|Goal):\*\*\s*/, '').trim()
    : ''

  const lessons: RawLesson[] = []
  let currentTitle: string | null = null
  let currentLines: string[] = []
  let inSummary = false

  // Code Example: Bn "৪." অথবা En "4."
  const codeRegex = new RegExp(
    '###\\s*[৪4]\\.\\s*Code Example\\s*\\n+```' +
      codeFence +
      '\\n([\\s\\S]*?)```',
  )

  const flush = () => {
    if (!currentTitle) return
    const content = currentLines.join('\n').trim()
    if (!content) return

    const codeMatch = content.match(codeRegex)
    const codeExample = codeMatch ? codeMatch[1].trim() : null

    lessons.push({
      title: currentTitle,
      content,
      codeExample,
      sortOrder: lessons.length,
    })
  }

  for (const line of lines) {
    if (/^#\s+Chapter\s+\d+:/.test(line)) continue
    if (/^\*\*(লক্ষ্য|Goal):\*\*/.test(line)) continue
    if (/^##\s+📌\s+Chapter/.test(line)) {
      inSummary = true
      continue
    }
    if (inSummary) continue

    const lessonMatch = line.match(/^##\s+\d+\.\d+\s+(.+)$/)
    if (lessonMatch) {
      flush()
      currentTitle = lessonMatch[1].trim()
      currentLines = []
      continue
    }

    if (currentTitle) currentLines.push(line)
  }
  flush()

  return {
    number: chapterNumber,
    title: chapterTitle,
    goal,
    lessons,
  }
}

// ─────────────────────────────────────────────────────────────
// Seeder — এক chapter (Bn + optional En)
// ─────────────────────────────────────────────────────────────

async function seedChapter(
  course: CourseConfig,
  filename: string,
  prune: boolean,
) {
  const contentDir = path.join(process.cwd(), 'content', course.dir)
  const bnPath = path.join(contentDir, filename)
  const enFilename = filename.replace(/\.md$/, '.en.md')
  const enPath = path.join(contentDir, enFilename)

  const bnRaw = parseMarkdown(
    fs.readFileSync(bnPath, 'utf-8'),
    course.codeFence,
  )

  // Slug সবসময় ইংরেজি — mapping table থেকে।
  const chapterSlug = course.chapterSlugs[bnRaw.title]
  if (!chapterSlug) {
    throw new Error(
      `[${course.slug}] No slug mapped for chapter: "${bnRaw.title}". Add it to COURSES['${course.slug}'].chapterSlugs.`,
    )
  }
  for (const lesson of bnRaw.lessons) {
    if (!course.lessonSlugs[lesson.title]) {
      throw new Error(
        `[${course.slug}] No slug mapped for lesson: "${lesson.title}". Add it to lessonSlugs.`,
      )
    }
  }

  const hasEn = fs.existsSync(enPath)
  const enRaw = hasEn
    ? parseMarkdown(fs.readFileSync(enPath, 'utf-8'), course.codeFence)
    : null

  if (enRaw && enRaw.lessons.length !== bnRaw.lessons.length) {
    throw new Error(
      `[${course.slug}] ${enFilename}: lesson count mismatch (bn=${bnRaw.lessons.length}, en=${enRaw.lessons.length}).`,
    )
  }

  console.log(
    `\n📖 [${course.slug}] ${filename}${hasEn ? ` + ${enFilename}` : ' (Bn only)'}`,
  )
  console.log(`   → Chapter ${bnRaw.number}: ${bnRaw.title} (${chapterSlug})`)
  console.log(`   → Lessons: ${bnRaw.lessons.length}`)
  console.log(
    `   → English source: ${hasEn ? '✅ found' : '❌ missing (*En = null)'}`,
  )

  // 1. Tutorial upsert
  const tutorial = await prisma.tutorial.upsert({
    where: { slug: course.slug },
    update: {
      titleBn: course.titleBn,
      titleEn: course.titleEn,
      descriptionBn: course.descriptionBn,
      descriptionEn: course.descriptionEn,
    },
    create: {
      titleBn: course.titleBn,
      titleEn: course.titleEn,
      slug: course.slug,
      descriptionBn: course.descriptionBn,
      descriptionEn: course.descriptionEn,
      difficulty: course.difficulty,
      isPublished: true,
    },
  })

  // 2. Chapter upsert — Bn + En (থাকলে)
  const chapter = await prisma.chapter.upsert({
    where: {
      tutorialId_slug: { tutorialId: tutorial.id, slug: chapterSlug },
    },
    update: {
      titleBn: bnRaw.title,
      titleEn: enRaw?.title ?? null,
      sortOrder: bnRaw.number,
    },
    create: {
      tutorialId: tutorial.id,
      titleBn: bnRaw.title,
      titleEn: enRaw?.title ?? null,
      slug: chapterSlug,
      sortOrder: bnRaw.number,
    },
  })

  // 3. Lessons upsert — position-ভিত্তিক pairing
  const existing = await prisma.lesson.findMany({
    where: { chapterId: chapter.id },
    select: { id: true, slug: true },
  })
  const keep = new Set<string>()

  for (let i = 0; i < bnRaw.lessons.length; i++) {
    const bnLesson = bnRaw.lessons[i]
    const enLesson = enRaw?.lessons[i] ?? null
    const slug = course.lessonSlugs[bnLesson.title]!
    keep.add(slug)

    await prisma.lesson.upsert({
      where: {
        chapterId_slug: { chapterId: chapter.id, slug },
      },
      update: {
        titleBn: bnLesson.title,
        titleEn: enLesson?.title ?? null,
        contentBn: bnLesson.content,
        contentEn: enLesson?.content ?? null,
        codeExampleBn: bnLesson.codeExample,
        codeExampleEn: enLesson?.codeExample ?? null,
        sortOrder: i,
      },
      create: {
        chapterId: chapter.id,
        titleBn: bnLesson.title,
        titleEn: enLesson?.title ?? null,
        slug,
        contentBn: bnLesson.content,
        contentEn: enLesson?.content ?? null,
        codeExampleBn: bnLesson.codeExample,
        codeExampleEn: enLesson?.codeExample ?? null,
        sortOrder: i,
      },
    })
    console.log(
      `      ✅ ${i + 1}. ${bnLesson.title} (${slug})${enLesson ? ' [Bn+En]' : ' [Bn]'}`,
    )
  }

  // 4. Prune (শুধু --prune দিলে)
  const toDelete = existing.filter((l) => !keep.has(l.slug))
  if (toDelete.length > 0) {
    if (prune) {
      await prisma.lesson.deleteMany({
        where: { id: { in: toDelete.map((l) => l.id) } },
      })
      console.log(`      🗑️  Pruned ${toDelete.length} lesson(s)`)
    } else {
      console.log(
        `      ⚠️  ${toDelete.length} lesson(s) not in .md (kept — use --prune to remove)`,
      )
    }
  }
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const prune = args.includes('--prune')
  const positionals = args.filter((a) => !a.startsWith('--'))

  const requestedCourses =
    positionals.length === 0
      ? Object.keys(COURSES)
      : positionals.filter((a) => COURSES[a])
  const requestedChapters = positionals.filter((a) => /^\d+$/.test(a))

  console.log(
    `🌱 Seeding courses from markdown...${prune ? ' (--prune ON)' : ''}`,
  )

  for (const slug of requestedCourses) {
    const course = COURSES[slug]
    const contentDir = path.join(process.cwd(), 'content', course.dir)

    if (!fs.existsSync(contentDir)) {
      console.log(`⏭️  [${slug}] content dir missing — skipping (${contentDir})`)
      continue
    }

    let files = fs
      .readdirSync(contentDir)
      .filter((f) => /^chapter-\d+\.md$/.test(f))
      .sort()

    if (requestedChapters.length > 0) {
      const wanted = new Set(requestedChapters.map((n) => n.padStart(2, '0')))
      files = files.filter((f) =>
        wanted.has(f.match(/chapter-(\d+)\.md/)?.[1] || ''),
      )
    }

    for (const file of files) {
      await seedChapter(course, file, prune)
    }
  }

  console.log('\n✨ Done.')
}

main()
  .catch((e) => {
    console.error('\n❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
