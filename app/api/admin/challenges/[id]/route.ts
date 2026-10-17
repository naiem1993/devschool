import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'
import { serverError } from '@/lib/api-error'
import { createChallengeSchema, validateBody } from '@/lib/validators'

const updateChallengeSchema = createChallengeSchema.partial().omit({ tutorialId: true })

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
    const body = await req.json()
    const { titleBn, titleEn, descriptionBn, descriptionEn } = body
    if (!titleBn || !titleEn || !descriptionBn || !descriptionEn) {
      return NextResponse.json({ error: 'titleBn, titleEn, descriptionBn, descriptionEn — সব দরকার' }, { status: 400 })
    }
    const { data, error } = validateBody(updateChallengeSchema, body)
    if (error || !data) {
      return NextResponse.json({ error: error || 'Invalid request body' }, { status: 400 })
    }
    await prisma.testCase.deleteMany({ where: { challengeId: id } })
    const c = await prisma.codeChallenge.update({
      where: { id },
      data: {
        titleBn: data.titleBn,
        titleEn: data.titleEn ? String(data.titleEn).trim() : null,
        descriptionBn: data.descriptionBn,
        descriptionEn: data.descriptionEn ? String(data.descriptionEn).trim() : null,
        starterCodeBn: data.starterCodeBn || null,
        starterCodeEn: data.starterCodeEn || null,
        solutionBn: data.solutionBn || null,
        solutionEn: data.solutionEn || null,
        language: data.language || 'js',
        difficulty: data.difficulty,
        points: data.points,
        testCases: Array.isArray(data.testCases)
          ? { create: data.testCases.map((tc, i) => ({ input: String(tc.input), expectedOutput: String(tc.expectedOutput), isHidden: !!tc.isHidden, testCaseOrder: i })) }
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
