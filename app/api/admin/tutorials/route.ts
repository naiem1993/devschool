import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createTutorialSchema, validateBody } from '@/lib/validators'

export async function GET() {
  const tutorials = await prisma.tutorial.findMany({
    include: { category: true, _count: { select: { contents: true, quizzes: true, challenges: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(tutorials)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = validateBody(createTutorialSchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })

  try {
    const { contents, ...tutorialData } = data!
    const tutorial = await prisma.tutorial.create({
      data: {
        ...tutorialData,
        contents: contents ? { create: contents } : undefined,
      },
      include: { contents: true },
    })
    return NextResponse.json(tutorial, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
