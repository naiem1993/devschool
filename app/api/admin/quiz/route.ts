import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { serverError } from '@/lib/api-error'
import { createQuizQuestionSchema, validateBody } from '@/lib/validators'

// নতুন কুইজ প্রশ্ন (অপশনসহ)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tutorialId, lessonId, chapterId, questionBn, questionEn, options } = body
    if (!tutorialId || (!lessonId && !chapterId) || !questionBn || !questionEn || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: 'tutorialId, (lessonId বা chapterId), questionBn, questionEn, এবং অন্তত ২টি option দরকার' }, { status: 400 })
    }
    if (!options.every((o: { textEn?: unknown }) => o.textEn && String(o.textEn).trim())) {
      return NextResponse.json({ error: 'প্রতিটি option-এর ইংরেজি text দরকার (জোড়া নিয়ম)' }, { status: 400 })
    }
    if (!options.some((o: { isCorrect?: unknown }) => o.isCorrect)) {
      return NextResponse.json({ error: 'অন্তত একটি সঠিক উত্তর সেট করুন' }, { status: 400 })
    }
    const { data, error } = validateBody(createQuizQuestionSchema, body)
    if (error || !data) {
      return NextResponse.json({ error: error || 'Invalid request body' }, { status: 400 })
    }
    const q = await prisma.quizQuestion.create({
      data: {
        tutorialId: data.tutorialId,
        lessonId: data.lessonId || null,
        chapterId: data.chapterId || null,
        questionBn: data.questionBn,
        questionEn: String(data.questionEn).trim(),
        explanationBn: data.explanationBn || null,
        explanationEn: data.explanationEn ? String(data.explanationEn).trim() : null,
        orderIndex: data.orderIndex ?? 0,
        options: {
          create: (data.options ?? []).map((o, i) => ({
            textBn: String(o.textBn),
            textEn: String(o.textEn).trim(),
            isCorrect: !!o.isCorrect,
            optionOrder: i,
          })),
        },
      },
      include: { options: true },
    })
    return NextResponse.json(q, { status: 201 })
  } catch (e: unknown) {
    return serverError(e, 'quiz-create')
  }
}
