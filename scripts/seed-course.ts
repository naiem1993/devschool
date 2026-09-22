/**
 * Generalized course seeder — markdown থেকে Chapter + Lesson DB-তে push করে।
 *
 * Flow:
 *   1. content/<course>/chapter-NN.md পড়ে
 *   2. Parse → Chapter + Lesson[] (Bengali title → English slug)
 *   3. Upsert Tutorial → Chapter → Lesson
 *   4. পুরোনো lesson (যা .md থেকে সরানো) auto-delete
 *
 * Usage:
 *   npm run seed:course              → সব course, সব chapter
 *   npm run seed:course -- css       → শুধু css course
 *   npm run seed:course -- html 01   → html course-এর chapter-01
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
  title: string
  description: string
  difficulty: string
  dir: string
  codeFence: string
  chapterSlugs: Record<string, string>
  lessonSlugs: Record<string, string>
}

const COURSES: Record<string, CourseConfig> = {
  html: {
    slug: 'html',
    title: 'HTML Tutorial',
    description:
      'HTML শিখুন একদম শুরু থেকে — বাংলায়, সহজ ভাষায়। ধাপে ধাপে chapter, প্রতিটা ছোট ছোট lesson-এ ভাগ করা।',
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
    title: 'CSS Tutorial',
    description:
      'CSS শিখুন একদম শুরু থেকে — বাংলায়। HTML page-কে সুন্দর করতে যা যা লাগে, সব ধাপে ধাপে।',
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
      'Background': 'background',
      // Chapter 5
      'Font Properties': 'font-properties',
      'Text Alignment ও Spacing': 'text-alignment-spacing',
    },
  },
}

// ─────────────────────────────────────────────────────────────
// Parser
// ─────────────────────────────────────────────────────────────

type ParsedLesson = {
  title: string
  slug: string
  content: string
  codeExample: string | null
  sortOrder: number
}

type ParsedChapter = {
  number: number
  title: string
  slug: string
  goal: string
  lessons: ParsedLesson[]
}

function parseChapter(md: string, course: CourseConfig): ParsedChapter {
  const lines = md.split('\n')

  const titleLine = lines.find((l) => /^# Chapter \d+:/.test(l))
  if (!titleLine) throw new Error('No "# Chapter N: ..." heading found.')

  const numberMatch = titleLine.match(/^# Chapter (\d+):/)
  const chapterNumber = numberMatch ? parseInt(numberMatch[1], 10) : 0
  const chapterTitle = titleLine.replace(/^# Chapter \d+:\s*/, '').trim()

  const chapterSlug = course.chapterSlugs[chapterTitle]
  if (!chapterSlug) {
    throw new Error(
      `[${course.slug}] No slug mapped for chapter: "${chapterTitle}". Add it to COURSES['${course.slug}'].chapterSlugs.`,
    )
  }

  const goalLine = lines.find((l) => /^\*\*লক্ষ্য:\*\*/.test(l))
  const goal = goalLine ? goalLine.replace(/^\*\*লক্ষ্য:\*\*\s*/, '').trim() : ''

  const lessons: ParsedLesson[] = []
  let currentTitle: string | null = null
  let currentLines: string[] = []
  let inSummary = false

  const flush = () => {
    if (!currentTitle) return
    const content = currentLines.join('\n').trim()
    if (!content) return

    const slug = course.lessonSlugs[currentTitle]
    if (!slug) {
      throw new Error(
        `[${course.slug}] No slug mapped for lesson: "${currentTitle}". Add it to lessonSlugs.`,
      )
    }

    // step ৪ (Code Example) → first fenced code block
    const fence = course.codeFence
    const re = new RegExp(`### ৪\\.\\s*Code Example\\s*\\n+\x60\x60\x60${fence}\\n([\\s\\S]*?)\x60\x60\x60`)
    const codeMatch = content.match(re)
    const codeExample = codeMatch ? codeMatch[1].trim() : null

    lessons.push({
      title: currentTitle,
      slug,
      content,
      codeExample,
      sortOrder: lessons.length,
    })
  }

  for (const line of lines) {
    if (/^# Chapter \d+:/.test(line)) continue
    if (/^\*\*লক্ষ্য:\*\*/.test(line)) continue
    if (/^## 📌 Chapter/.test(line)) {
      inSummary = true
      continue
    }
    if (inSummary) continue

    const lessonMatch = line.match(/^## \d+\.\d+\s+(.+)$/)
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
    slug: chapterSlug,
    goal,
    lessons,
  }
}

// ─────────────────────────────────────────────────────────────
// Seeder — এক chapter
// ─────────────────────────────────────────────────────────────

async function seedChapter(course: CourseConfig, filename: string) {
  const contentDir = path.join(process.cwd(), 'content', course.dir)
  const filePath = path.join(contentDir, filename)
  const md = fs.readFileSync(filePath, 'utf-8')
  const parsed = parseChapter(md, course)

  console.log(`\n📖 [${course.slug}] ${filename}`)
  console.log(`   → Chapter ${parsed.number}: ${parsed.title} (${parsed.slug})`)
  console.log(`   → Lessons: ${parsed.lessons.length}`)
  if (parsed.goal) console.log(`   → লক্ষ্য: ${parsed.goal}`)

  // 1. Tutorial upsert
  const tutorial = await prisma.tutorial.upsert({
    where: { slug: course.slug },
    update: { title: course.title, description: course.description },
    create: {
      title: course.title,
      slug: course.slug,
      description: course.description,
      difficulty: course.difficulty,
      isPublished: true,
    },
  })

  // 2. Chapter upsert
  const chapter = await prisma.chapter.upsert({
    where: {
      tutorialId_slug: { tutorialId: tutorial.id, slug: parsed.slug },
    },
    update: { title: parsed.title, sortOrder: parsed.number },
    create: {
      tutorialId: tutorial.id,
      title: parsed.title,
      slug: parsed.slug,
      sortOrder: parsed.number,
    },
  })

  // 3. Lessons upsert + cleanup
  const existing = await prisma.lesson.findMany({
    where: { chapterId: chapter.id },
    select: { id: true, slug: true },
  })
  const keep = new Set(parsed.lessons.map((l) => l.slug))

  for (const lesson of parsed.lessons) {
    await prisma.lesson.upsert({
      where: {
        chapterId_slug: { chapterId: chapter.id, slug: lesson.slug },
      },
      update: {
        title: lesson.title,
        content: lesson.content,
        codeExample: lesson.codeExample,
        sortOrder: lesson.sortOrder,
      },
      create: {
        chapterId: chapter.id,
        title: lesson.title,
        slug: lesson.slug,
        content: lesson.content,
        codeExample: lesson.codeExample,
        sortOrder: lesson.sortOrder,
      },
    })
    console.log(`      ✅ ${lesson.sortOrder + 1}. ${lesson.title} (${lesson.slug})`)
  }

  const toDelete = existing.filter((l) => !keep.has(l.slug))
  if (toDelete.length > 0) {
    await prisma.lesson.deleteMany({ where: { id: { in: toDelete.map((l) => l.id) } } })
    console.log(`      🗑️  Removed ${toDelete.length} lesson(s)`)
  }
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding courses from markdown...')

  const args = process.argv.slice(2)
  const requestedCourses =
    args.length === 0 ? Object.keys(COURSES) : args.filter((a) => COURSES[a])
  const requestedChapters = args.filter((a) => /^\d+$/.test(a))

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
      files = files.filter((f) => wanted.has(f.match(/chapter-(\d+)\.md/)?.[1] || ''))
    }

    for (const file of files) {
      await seedChapter(course, file)
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
