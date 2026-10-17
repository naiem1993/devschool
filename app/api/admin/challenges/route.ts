import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { serverError } from '@/lib/api-error'
import { createChallengeSchema, validateBody } from '@/lib/validators'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tutorialId, titleBn, titleEn, descriptionBn, descriptionEn } = body
    if (!tutorialId || !titleBn || !titleEn || !descriptionBn || !descriptionEn) {
      return NextResponse.json({ error: 'tutorialId, titleBn, titleEn, descriptionBn, descriptionEn — সব দরকার' }, { status: 400 })
    }
    const { data, error } = validateBody(createChallengeSchema, body)
    if (error || !data) {
      return NextResponse.json({ error: error || 'Invalid request body' }, { status: 400 })
    }
    const c = await prisma.codeChallenge.create({
      data: {
        tutorialId: data.tutorialId,
        titleBn: data.titleBn,
        titleEn: data.titleEn ? String(data.titleEn).trim() : null,
        descriptionBn: data.descriptionBn,
        descriptionEn: data.descriptionEn ? String(data.descriptionEn).trim() : null,
        starterCodeBn: data.starterCodeBn || null,
        starterCodeEn: data.starterCodeEn || null,
        solutionBn: data.solutionBn || null,
        solutionEn: data.solutionEn || null,
        language: data.language || 'js',
        difficulty: data.difficulty || 'Easy',
        points: data.points || 0,
        testCases: Array.isArray(data.testCases)
          ? { create: data.testCases.map((tc, i) => ({ input: String(tc.input), expectedOutput: String(tc.expectedOutput), isHidden: !!tc.isHidden, testCaseOrder: i })) }
          : undefined,
      },
      include: { testCases: true },
    })
    return NextResponse.json(c, { status: 201 })
  } catch (e: unknown) {
    return serverError(e, 'challenges-create')
  }
}
