import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createTutorialSchema, validateBody } from '@/lib/validators'
import { revalidateTutorialListPaths } from '@/lib/revalidate-tutorial'

export async function GET() {
  const tutorials = await prisma.tutorial.findMany({
    include: {
      category: true,
      _count: { select: { chapters: true, quizzes: true, challenges: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(tutorials)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = validateBody(createTutorialSchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })

  try {
    // Nested structure (v3): chapters/lessons আলাদা API থেকে যোগ হয়।
    const { contents: _contents, ...tutorialData } = data!
    void _contents
    const tutorial = await prisma.tutorial.create({
      data: tutorialData,
    })
    revalidateTutorialListPaths()
    return NextResponse.json(tutorial, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
