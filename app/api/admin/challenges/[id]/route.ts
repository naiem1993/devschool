import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'
import { serverError } from '@/lib/api-error'

/** Test case shape as it arrives from the client (no id yet). */
type TestCaseInput = {
  input: unknown
  expectedOutput: unknown
  isHidden?: unknown
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const c = await prisma.codeChallenge.findUnique({
    where: { id },
    include: { testCases: { orderBy: { testCaseOrder: 'asc' } } },
  })
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(c)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const { titleBn, titleEn, descriptionBn, descriptionEn, starterCodeBn, starterCodeEn, solutionBn, solutionEn, language, difficulty, points, testCases } = await req.json()
    if (!titleBn || !titleEn || !descriptionBn || !descriptionEn) {
      return NextResponse.json({ error: 'titleBn, titleEn, descriptionBn, descriptionEn — সব দরকার' }, { status: 400 })
    }
    await prisma.testCase.deleteMany({ where: { challengeId: id } })
    const c = await prisma.codeChallenge.update({
      where: { id },
      data: {
        titleBn,
        titleEn: titleEn ? String(titleEn).trim() : null,
        descriptionBn,
        descriptionEn: descriptionEn ? String(descriptionEn).trim() : null,
        starterCodeBn: starterCodeBn || null,
        starterCodeEn: starterCodeEn || null,
        solutionBn: solutionBn || null,
        solutionEn: solutionEn || null,
        language: language || 'js',
        difficulty, points,
        testCases: Array.isArray(testCases)
          ? { create: testCases.map((tc: TestCaseInput, i: number) => ({ input: String(tc.input), expectedOutput: String(tc.expectedOutput), isHidden: !!tc.isHidden, testCaseOrder: i })) }
          : undefined,
      },
      include: { testCases: true },
    })
    return NextResponse.json(c)
  } catch (e: unknown) {
    return serverError(e, 'challenges-update')
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  const adminId = await getAdminId(req)
  if (!adminId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const token = req.headers.get('x-pin-token') || undefined
  if (!(await verifyPinToken(token, adminId))) {
    return NextResponse.json({ error: 'PIN_REQUIRED' }, { status: 403 })
  }

  const { id } = await params
  try {
    await prisma.codeChallenge.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return serverError(e, 'challenges-delete')
  }
}
