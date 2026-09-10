import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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
    const { question, explanation, orderIndex, options } = await req.json()
    await prisma.quizOption.deleteMany({ where: { questionId: id } })
    const q = await prisma.quizQuestion.update({
      where: { id },
      data: {
        question,
        explanation,
        orderIndex,
        options: {
          create: options.map((o: any, i: number) => ({
            text: o.text,
            isCorrect: !!o.isCorrect,
            optionOrder: i,
          })),
        },
      },
      include: { options: true },
    })
    return NextResponse.json(q)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await prisma.quizQuestion.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
