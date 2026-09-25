import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { tutorialId, titleBn, titleEn, descriptionBn, descriptionEn, starterCode, solution, difficulty, points, testCases } = await req.json()
    if (!tutorialId || !titleBn || !descriptionBn) {
      return NextResponse.json({ error: 'tutorialId, titleBn, descriptionBn দরকার' }, { status: 400 })
    }
    const c = await prisma.codeChallenge.create({
      data: {
        tutorialId,
        titleBn,
        titleEn: titleEn ? String(titleEn).trim() : null,
        descriptionBn,
        descriptionEn: descriptionEn ? String(descriptionEn).trim() : null,
        starterCode,
        solution,
        difficulty: difficulty || 'Easy',
        points: points || 0,
        testCases: Array.isArray(testCases)
          ? { create: testCases.map((tc: any, i: number) => ({ input: tc.input, expectedOutput: tc.expectedOutput, isHidden: !!tc.isHidden, testCaseOrder: i })) }
          : undefined,
      },
      include: { testCases: true },
    })
    return NextResponse.json(c, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
