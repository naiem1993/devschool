import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * POST /api/attempts
 *
 * Body:
 *   { type: 'quiz',      questionId, selectedId?, isCorrect, timeTakenSec? }
 *   { type: 'challenge', challengeId, passed, passedCount, totalCount, codeSubmitted?, timeTakenSec? }
 *
 * The device id is read from the `x-device-id` header (set client-side
 * from localStorage). No auth required — this is intentionally anonymous.
 */
export async function POST(request: NextRequest) {
  const deviceId = request.headers.get('x-device-id')
  if (!deviceId || deviceId.length < 8) {
    return NextResponse.json({ error: 'missing device id' }, { status: 400 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  try {
    if (body.type === 'quiz') {
      const { questionId, selectedId, isCorrect, timeTakenSec } = body
      if (!questionId || typeof isCorrect !== 'boolean') {
        return NextResponse.json({ error: 'questionId & isCorrect required' }, { status: 400 })
      }
      const attempt = await prisma.quizAttempt.create({
        data: {
          deviceId,
          questionId: String(questionId),
          selectedId: selectedId ? String(selectedId) : null,
          isCorrect,
          timeTakenSec: Number.isFinite(timeTakenSec) ? Number(timeTakenSec) : null,
        },
      })
      return NextResponse.json({ ok: true, attemptId: attempt.id })
    }

    if (body.type === 'challenge') {
      const { challengeId, passed, passedCount, totalCount, codeSubmitted, timeTakenSec } = body
      if (!challengeId || typeof passed !== 'boolean') {
        return NextResponse.json({ error: 'challengeId & passed required' }, { status: 400 })
      }
      const attempt = await prisma.challengeAttempt.create({
        data: {
          deviceId,
          challengeId: String(challengeId),
          passed,
          passedCount: Number.isFinite(passedCount) ? Number(passedCount) : 0,
          totalCount: Number.isFinite(totalCount) ? Number(totalCount) : 0,
          codeSubmitted: codeSubmitted ? String(codeSubmitted).slice(0, 20000) : null,
          timeTakenSec: Number.isFinite(timeTakenSec) ? Number(timeTakenSec) : null,
        },
      })
      return NextResponse.json({ ok: true, attemptId: attempt.id })
    }

    return NextResponse.json({ error: 'unknown type' }, { status: 400 })
  } catch (err) {
    console.error('[api/attempts POST] error:', err)
    return NextResponse.json({ error: 'failed to save attempt' }, { status: 500 })
  }
}
