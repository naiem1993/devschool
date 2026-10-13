import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * POST /api/admin/quiz/bulk
 * একসাথে অনেকগুলো কুইজ সেভ করার জন্য
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tutorialId, lessonId, chapterId, quizzes, startOrderIndex } = body

    // ── Validation ──
    if (!tutorialId || (!lessonId && !chapterId)) {
      return NextResponse.json(
        { error: 'tutorialId এবং (lessonId বা chapterId) দরকার' },
        { status: 400 }
      )
    }
    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      return NextResponse.json(
        { error: 'কমপক্ষে ১টি কুইজ দরকার' },
        { status: 400 }
      )
    }
    if (quizzes.length > 100) {
      return NextResponse.json(
        { error: 'একবারে সর্বোচ্চ ১০০টি কুইজ দেওয়া যাবে' },
        { status: 400 }
      )
    }

    for (let i = 0; i < quizzes.length; i++) {
      const q = quizzes[i]
      const n = i + 1
      if (!q.questionBn || !String(q.questionBn).trim()) {
        return NextResponse.json({ error: `কুইজ ${n}: বাংলা প্রশ্ন নেই` }, { status: 400 })
      }
      if (!q.questionEn || !String(q.questionEn).trim()) {
        return NextResponse.json({ error: `কুইজ ${n}: ইংরেজি প্রশ্ন নেই` }, { status: 400 })
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        return NextResponse.json({ error: `কুইজ ${n}: অন্তত ২টি অপশন দরকার` }, { status: 400 })
      }
      if (!q.options.every((o) => o.textBn && String(o.textBn).trim())) {
        return NextResponse.json({ error: `কুইজ ${n}: প্রতিটি অপশনে বাংলা text দরকার` }, { status: 400 })
      }
      if (!q.options.every((o) => o.textEn && String(o.textEn).trim())) {
        return NextResponse.json({ error: `কুইজ ${n}: প্রতিটি অপশনে ইংরেজি text দরকার` }, { status: 400 })
      }
      if (!q.options.some((o) => o.isCorrect)) {
        return NextResponse.json({ error: `কুইজ ${n}: সঠিক উত্তর চিহ্নিত করা হয়নি` }, { status: 400 })
      }
    }

    const baseOrder = Number(startOrderIndex) || 1

    // ── Create all quizzes in one transaction ──
    const created = await prisma.$transaction(
      quizzes.map((q, i) =>
        prisma.quizQuestion.create({
          data: {
            tutorialId,
            lessonId: lessonId || null,
            chapterId: chapterId || null,
            questionBn: String(q.questionBn).trim(),
            questionEn: String(q.questionEn).trim(),
            explanationBn: q.explanationBn ? String(q.explanationBn).trim() : null,
            explanationEn: q.explanationEn ? String(q.explanationEn).trim() : null,
            orderIndex: baseOrder + i,
            options: {
              create: q.options.map((o, idx) => ({
                textBn: String(o.textBn).trim(),
                textEn: String(o.textEn).trim(),
                isCorrect: !!o.isCorrect,
                optionOrder: idx,
              })),
            },
          },
        })
      )
    )

    return NextResponse.json(
      { success: true, created: created.length, ids: created.map((c) => c.id) },
      { status: 201 }
    )
  } catch (e) {
    console.error('Bulk quiz create error:', e)
    const msg = e instanceof Error ? e.message : 'সার্ভার এরর'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
