import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/attempts/[deviceId]
 *
 * Returns aggregated progress for the given anonymous device:
 *   {
 *     quiz:      { total, correct, accuracy },
 *     challenge: { attempted, passed, totalPoints },
 *     recent:    [ last 20 attempts across both types ]
 *   }
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  const { deviceId } = await params
  if (!deviceId || deviceId.length < 8) {
    return NextResponse.json({ error: 'invalid device id' }, { status: 400 })
  }

  try {
    const [quizTotal, quizCorrect, challengeAttempts, quizRecent, challengeRecent] =
      await Promise.all([
        prisma.quizAttempt.count({ where: { deviceId } }),
        prisma.quizAttempt.count({ where: { deviceId, isCorrect: true } }),
        prisma.challengeAttempt.findMany({
          where: { deviceId },
          select: { passed: true, passedCount: true, challenge: { select: { points: true } } },
        }),
        prisma.quizAttempt.findMany({
          where: { deviceId },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            question: { select: { id: true, question: true, tutorial: { select: { title: true, slug: true } } } },
          },
        }),
        prisma.challengeAttempt.findMany({
          where: { deviceId },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            challenge: { select: { id: true, title: true, points: true, difficulty: true } },
          },
        }),
      ])

    const passedChallenges = challengeAttempts.filter((c) => c.passed).length
    const totalPoints = challengeAttempts
      .filter((c) => c.passed)
      .reduce((sum, c) => sum + (c.challenge.points || 0), 0)

    const recent = [
      ...quizRecent.map((a) => ({
        kind: 'quiz' as const,
        id: a.id,
        at: a.createdAt,
        passed: a.isCorrect,
        title: a.question.question,
        href: `/tutorials/${a.question.tutorial.slug}`,
      })),
      ...challengeRecent.map((a) => ({
        kind: 'challenge' as const,
        id: a.id,
        at: a.createdAt,
        passed: a.passed,
        title: a.challenge.title,
        href: `/challenges/${a.challenge.id}`,
      })),
    ]
      .sort((a, b) => +new Date(b.at) - +new Date(a.at))
      .slice(0, 20)

    return NextResponse.json({
      deviceId,
      quiz: {
        total: quizTotal,
        correct: quizCorrect,
        accuracy: quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : 0,
      },
      challenge: {
        attempted: challengeAttempts.length,
        passed: passedChallenges,
        totalPoints,
      },
      recent,
    })
  } catch (err) {
    console.error('[api/attempts GET] error:', err)
    return NextResponse.json({ error: 'failed to load progress' }, { status: 500 })
  }
}
