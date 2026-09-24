/**
 * Seed the HTML course from markdown files in content/html/.
 *
 * Flow:
 *   1. Read content/html/chapter-NN.md
 *   2. Parse into Chapter + Lesson[] (English slugs from slug maps below)
 *   3. Upsert into DB (Category → Tutorial → Chapter → Lesson)
 *   4. Auto-delete lessons that were removed from the .md file
 *
 * Usage:
 *   npm run seed:html              → seed every chapter-NN.md found
 *   npm run seed:html -- 01        → seed only chapter-01.md
 *   npm run seed:html -- 01 02     → seed chapter-01 + chapter-02
 *
 * Safe to re-run — upserts by (tutorialId, chapterSlug) and (chapterId, lessonSlug).
 * Content updates in .md files reflect into DB on the next run.
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const CONTENT_DIR = path.join(process.cwd(), 'content', 'html')
const TUTORIAL_SLUG = 'html'
const TUTORIAL_TITLE = 'HTML Tutorial'
const TUTORIAL_DESCRIPTION =
  'HTML শিখুন একদম শুরু থেকে — বাংলায়, সহজ ভাষায়। ১৫টা chapter, প্রতিটা ছোট ছোট lesson-এ ভাগ করা।'
const CATEGORY_SLUG = 'web-development'
const CATEGORY_NAME = 'Web Development'

// ─────────────────────────────────────────────────────────────
// Slug maps — Bengali titles → clean English URL slugs
// New chapters/lessons must be added here before seeding.
// ─────────────────────────────────────────────────────────────

const CHAPTER_SLUGS: Record<string, string> = {
  'HTML পরিচিতি — একদম শুরু': 'introduction',
  // 'HTML Basic Structure': 'basic-structure',     // Ch2 — add when ready
}

const LESSON_SLUGS: Record<string, string> = {
  // Chapter 1
  'HTML কী?': 'what-is-html',
  'HTML দিয়ে কী কী বানানো যায়?': 'what-can-html-do',
  'প্রথম HTML ফাইল — তৈরি ও সেভ': 'first-html-file',
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

function parseChapter(md: string): ParsedChapter {
  const lines = md.split('\n')

  const titleLine = lines.find((l) => /^# Chapter \d+:/.test(l))
  if (!titleLine) throw new Error('No "# Chapter N: ..." heading found in markdown.')

  const numberMatch = titleLine.match(/^# Chapter (\d+):/)
  const chapterNumber = numberMatch ? parseInt(numberMatch[1], 10) : 0
  const chapterTitle = titleLine.replace(/^# Chapter \d+:\s*/, '').trim()

  const chapterSlug = CHAPTER_SLUGS[chapterTitle]
  if (!chapterSlug) {
    throw new Error(
      `No English slug mapped for chapter: "${chapterTitle}".\n` +
        `  → Add it to CHAPTER_SLUGS in scripts/seed-html-course.ts`,
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

    const slug = LESSON_SLUGS[currentTitle]
    if (!slug) {
      throw new Error(
        `No English slug mapped for lesson: "${currentTitle}".\n` +
          `  → Add it to LESSON_SLUGS in scripts/seed-html-course.ts`,
      )
    }

    // Extract code from step ৪ (Code Example) — first ```html ... ``` block inside the lesson
    const codeMatch = content.match(/### ৪\.\s*Code Example\s*\n+```html\n([\s\S]*?)```/)
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
    if (/^# Chapter \d+:/.test(line)) continue // chapter title
    if (/^\*\*লক্ষ্য:\*\*/.test(line)) continue // goal line
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
// Seeder
// ─────────────────────────────────────────────────────────────

async function seedChapter(filename: string) {
  const filePath = path.join(CONTENT_DIR, filename)
  const md = fs.readFileSync(filePath, 'utf-8')
  const parsed = parseChapter(md)

  console.log(`\n📖 ${filename}`)
  console.log(`   → Chapter ${parsed.number}: ${parsed.title}`)
  console.log(`   → Slug: ${parsed.slug}`)
  console.log(`   → Lessons: ${parsed.lessons.length}`)
  if (parsed.goal) console.log(`   → লক্ষ্য: ${parsed.goal}`)

  // 1. Tutorial (find or create by slug)
  const tutorial = await prisma.tutorial.upsert({
    where: { slug: TUTORIAL_SLUG },
    update: {
      titleBn: TUTORIAL_TITLE,
      titleEn: TUTORIAL_TITLE,
      descriptionBn: TUTORIAL_DESCRIPTION,
      descriptionEn: null,
    },
    create: {
      titleBn: TUTORIAL_TITLE,
      titleEn: TUTORIAL_TITLE,
      slug: TUTORIAL_SLUG,
      descriptionBn: TUTORIAL_DESCRIPTION,
      descriptionEn: null,
      difficulty: 'Beginner',
      isPublished: true,
    },
  })

  // 3. Chapter — upsert by (tutorialId, slug)
  const chapter = await prisma.chapter.upsert({
    where: {
      tutorialId_slug: {
        tutorialId: tutorial.id,
        slug: parsed.slug,
      },
    },
    update: {
      titleBn: parsed.title,
      sortOrder: parsed.number,
    },
    create: {
      tutorialId: tutorial.id,
      titleBn: parsed.title,
      slug: parsed.slug,
      sortOrder: parsed.number,
    },
  })

  // 4. Lessons — upsert each, then delete removed ones
  const existingLessons = await prisma.lesson.findMany({
    where: { chapterId: chapter.id },
    select: { id: true, slug: true },
  })
  const keepSlugs = new Set(parsed.lessons.map((l) => l.slug))

  for (const lesson of parsed.lessons) {
    await prisma.lesson.upsert({
      where: {
        chapterId_slug: {
          chapterId: chapter.id,
          slug: lesson.slug,
        },
      },
      update: {
        titleBn: lesson.title,
        contentBn: lesson.content,
        codeExampleBn: lesson.codeExample,
        codeExampleEn: lesson.codeExample,
        sortOrder: lesson.sortOrder,
      },
      create: {
        chapterId: chapter.id,
        titleBn: lesson.title,
        slug: lesson.slug,
        contentBn: lesson.content,
        codeExampleBn: lesson.codeExample,
        codeExampleEn: lesson.codeExample,
        sortOrder: lesson.sortOrder,
      },
    })
    console.log(`      ✅ ${lesson.sortOrder + 1}. ${lesson.title} (${lesson.slug})`)
  }

  const toDelete = existingLessons.filter((l) => !keepSlugs.has(l.slug))
  if (toDelete.length > 0) {
    await prisma.lesson.deleteMany({
      where: { id: { in: toDelete.map((l) => l.id) } },
    })
    console.log(`      🗑️  Removed ${toDelete.length} lesson(s) no longer in .md`)
  }
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding HTML course from markdown files...')

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`❌ Content directory not found: ${CONTENT_DIR}`)
    process.exit(1)
  }

  // CLI args → optional chapter numbers (e.g. "01", "02")
  const requested = process.argv.slice(2)
  const allFiles = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => /^chapter-\d+\.md$/.test(f))
    .sort()

  const files =
    requested.length === 0
      ? allFiles
      : allFiles.filter((f) => requested.some((n) => f.includes(`-${n.padStart(2, '0')}.md`)))

  if (files.length === 0) {
    console.log('ℹ️  No matching chapter files found.')
    return
  }

  console.log(`📂 Found ${files.length} file(s): ${files.join(', ')}`)

  for (const file of files) {
    await seedChapter(file)
  }

  console.log('\n✅ Done.')
}

main()
  .catch((e) => {
    console.error('\n❌ Seed failed:')
    console.error(e instanceof Error ? e.message : e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
