import 'server-only'
import prisma from '@/lib/prisma'
import { pickText } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/config'
import type { QuizQuestionData, QuizOptionData } from '@/components/QuizWidget'

/**
 * একটা quiz group — content-এর একটা [[quiz]] marker-এর সাথে match করে।
 * orderIndex দিয়ে admin control করে কোন marker-এ কোন group বসবে।
 */
export type QuizGroupData = {
  orderIndex: number
  questions: QuizQuestionData[]
}

// ──────────────────────────────────────────────────────────
//  Internal: common fetcher + localizer
// ──────────────────────────────────────────────────────────
type QuizRow = {
  id: string
  questionBn: string
  questionEn: string | null
  orderIndex: number
  options: Array<{ id: string; textBn: string; textEn: string | null }>
}

function localizeAndGroup(rows: QuizRow[], locale: Locale): QuizGroupData[] {
  type Validated = QuizQuestionData & { _orderIndex: number }
  const validated: Validated[] = []

  for (const q of rows) {
    const questionText = pickText(locale, q.questionBn, q.questionEn)
    if (!questionText) continue

    const options: QuizOptionData[] = q.options
      .map((o) => {
        const text = pickText(locale, o.textBn, o.textEn)
        if (!text) return null
        return { id: o.id, text }
      })
      .filter((x): x is QuizOptionData => x !== null)

    if (options.length < 2) continue

    validated.push({
      id: q.id,
      question: questionText,
      options,
      _orderIndex: q.orderIndex,
    })
  }

  const groups = new Map<number, QuizQuestionData[]>()
  for (const v of validated) {
    const { _orderIndex, ...question } = v
    if (!groups.has(_orderIndex)) groups.set(_orderIndex, [])
    groups.get(_orderIndex)!.push(question)
  }

  return [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([orderIndex, questions]) => ({ orderIndex, questions }))
}

const QUESTION_SELECT = {
  id: true,
  questionBn: true,
  questionEn: true,
  orderIndex: true,
  options: {
    orderBy: { optionOrder: 'asc' as const },
    select: { id: true, textBn: true, textEn: true },
  },
}

// ──────────────────────────────────────────────────────────
//  Lesson-level quiz (nested chapter)
// ──────────────────────────────────────────────────────────
export async function getLessonQuiz(
  lessonId: string,
  locale: Locale
): Promise<QuizGroupData[]> {
  try {
    const rows = await prisma.quizQuestion.findMany({
      where: { lessonId },
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
      select: QUESTION_SELECT,
    })
    return localizeAndGroup(rows, locale)
  } catch (err) {
    console.error('[getLessonQuiz] error:', err)
    return []
  }
}

// ──────────────────────────────────────────────────────────
//  Chapter-level quiz (single-page chapter)
// ──────────────────────────────────────────────────────────
export async function getChapterQuiz(
  chapterId: string,
  locale: Locale
): Promise<QuizGroupData[]> {
  try {
    const rows = await prisma.quizQuestion.findMany({
      where: { chapterId },
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
      select: QUESTION_SELECT,
    })
    return localizeAndGroup(rows, locale)
  } catch (err) {
    console.error('[getChapterQuiz] error:', err)
    return []
  }
}
