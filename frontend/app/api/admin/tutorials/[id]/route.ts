import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { updateTutorialSchema, validateBody } from '@/lib/validators'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const tut = await prisma.tutorial.findUnique({
    where: { id: params.id },
    include: { contents: { orderBy: { chapterNo: 'asc' } } },
  })
  if (!tut) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(tut)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { contents, ...rest } = body
  const { data, error } = validateBody(updateTutorialSchema, rest)
  if (error) return NextResponse.json({ error }, { status: 400 })

  try {
    // Contents replace strategy: delete all and recreate
    if (Array.isArray(contents)) {
      await prisma.tutorialContent.deleteMany({ where: { tutorialId: params.id } })
    }
    const tutorial = await prisma.tutorial.update({
      where: { id: params.id },
      data: {
        ...data!,
        contents: Array.isArray(contents) ? { create: contents } : undefined,
      },
      include: { contents: true },
    })
    return NextResponse.json(tutorial)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.tutorial.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
