import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'
import { serverError } from '@/lib/api-error'
import { updateQuizQuestionSchema, validateBody } from '@/lib/validators'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const q = await prisma.quizQuestion.findUnique({
    where: { id },
    include: { options: { orderBy: { optionOrder: 'asc' } } },
  })
  if (!q) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(q)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    const { questionBn, questionEn, options } = body
    if (!questionBn || !questionEn || !Array.isArray(options)) {
      return NextResponse.json({ error: 'questionBn, questionEn, options — সব দরকার' }, { status: 400 })
    }
    if (!options.every((o: { textEn?: unknown }) => o.textEn && String(o.textEn).trim())) {
      return NextResponse.json({ error: 'প্রতিটি option-এর ইংরেজি text দরকার (জোড়া নিয়ম)' }, { status: 400 })
    }
    const { data, error } = validateBody(updateQuizQuestionSchema, body)
    if (error || !data) {
      return NextResponse.json({ error: error || 'Invalid request body' }, { status: 400 })
    }
    await prisma.quizOption.deleteMany({ where: { questionId: id } })
    const q = await prisma.quizQuestion.update({
      where: { id },
      data: {
        ...(data.tutorialId ? { tutorialId: data.tutorialId } : {}),
        ...(data.lessonId !== undefined ? { lessonId: data.lessonId || null } : {}),
        ...(data.chapterId !== undefined ? { chapterId: data.chapterId || null } : {}),
        questionBn: data.questionBn,
        questionEn: String(data.questionEn).trim(),
        explanationBn: data.explanationBn,
        explanationEn: data.explanationEn ? String(data.explanationEn).trim() : null,
        orderIndex: data.orderIndex,
        options: {
          create: data.options.map((o, i) => ({
            textBn: String(o.textBn),
            textEn: String(o.textEn).trim(),
            isCorrect: !!o.isCorrect,
            optionOrder: i,
          })),
        },
      },
      include: { options: true },
    })
    return NextResponse.json(q)
  } catch (e: unknown) {
    return serverError(e, 'quiz-update')
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
    await prisma.quizQuestion.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return serverError(e, 'quiz-delete')
  }
}
