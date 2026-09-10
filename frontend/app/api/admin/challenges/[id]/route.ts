import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const c = await prisma.codeChallenge.findUnique({
    where: { id: params.id },
    include: { testCases: { orderBy: { testCaseOrder: 'asc' } } },
  })
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(c)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { title, description, starterCode, solution, difficulty, points, testCases } = await req.json()
    await prisma.testCase.deleteMany({ where: { challengeId: params.id } })
    const c = await prisma.codeChallenge.update({
      where: { id: params.id },
      data: {
        title, description, starterCode, solution, difficulty, points,
        testCases: Array.isArray(testCases)
          ? { create: testCases.map((tc: any, i: number) => ({ input: tc.input, expectedOutput: tc.expectedOutput, isHidden: !!tc.isHidden, testCaseOrder: i })) }
          : undefined,
      },
      include: { testCases: true },
    })
    return NextResponse.json(c)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.codeChallenge.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
