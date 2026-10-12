import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { pickText } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/config'

/**
 * POST /api/quizzes/check
 *
 * Body: { questionId: string, selectedId: string }
 *
 * Returns: {
 *   isCorrect: boolean,
 *   correctOptionId: string,
 *   explanation: string | null
 * }
 *
 * ⚠️ সঠিক উত্তর কখনোই client-এ প্রি-সেন্ড হয় না — এখানে server-side verify হয়।
 * Locale `Accept-Language` header থেকে detect করা হয় (bn/en)।
 */

type Body = {
  questionId?: string
  selectedId?: string
}

export async function POST(req: NextRequest) {
  // ── Locale detect ─────────────────────────────────────────
  const accept = (req.headers.get('accept-language') || '').toLowerCase()
  const locale: Locale = accept.startsWith('en') ? 'en' : 'bn'

  // ── Parse + validate body ────────────────────────────────
  let body: Body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const { questionId, selectedId } = body
  if (!questionId || typeof questionId !== 'string') {
    return NextResponse.json({ error: 'questionId required' }, { status: 400 })
  }
  if (!selectedId || typeof selectedId !== 'string') {
    return NextResponse.json({ error: 'selectedId required' }, { status: 400 })
  }

  try {
    // ── Fetch question + options (server-side) ─────────────
    const question = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        explanationBn: true,
        explanationEn: true,
        options: {
          select: {
            id: true,
            isCorrect: true,
          },
        },
      },
    })

    if (!question) {
      return NextResponse.json({ error: 'question not found' }, { status: 404 })
    }

    // ── Verify ────────────────────────────────────────────
    const selectedOption = question.options.find((o) => o.id === selectedId)
    const correctOption = question.options.find((o) => o.isCorrect)

    if (!selectedOption) {
      return NextResponse.json({ error: 'selected option invalid' }, { status: 400 })
    }
    if (!correctOption) {
      // Defense: corrupted question (no correct option set)
      return NextResponse.json(
        { error: 'question has no correct option' },
        { status: 500 }
      )
    }

    const isCorrect = selectedOption.isCorrect
    const explanation =
      pickText(locale, question.explanationBn, question.explanationEn) || null

    // ── Attempt save (fire-and-forget) ────────────────────
    // deviceId থাকলে attempt save করি — progress tracking-এর জন্য
    const deviceId = (req.headers.get('x-device-id') || '').trim()
    if (deviceId) {
      // non-blocking — response পাঠানোর পর save
      prisma.quizAttempt
        .create({
          data: {
            deviceId,
            questionId: question.id,
            selectedId: selectedOption.id,
            isCorrect,
          },
        })
        .catch((err) => {
          console.error('[api/quizzes/check] attempt save failed:', err)
        })
    }

    return NextResponse.json({
      isCorrect,
      correctOptionId: correctOption.id,
      explanation,
    })
  } catch (err) {
    console.error('[api/quizzes/check] error:', err)
    return NextResponse.json({ error: 'check failed' }, { status: 500 })
  }
}
