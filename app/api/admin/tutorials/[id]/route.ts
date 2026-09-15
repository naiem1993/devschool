import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { updateTutorialSchema, validateBody } from '@/lib/validators'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tut = await prisma.tutorial.findUnique({
    where: { id },
    include: { contents: { orderBy: { chapterNo: 'asc' } } },
  })
  if (!tut) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(tut)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { contents, ...rest } = body
  const { data, error } = validateBody(updateTutorialSchema, rest)
  if (error) return NextResponse.json({ error }, { status: 400 })

  try {
    if (Array.isArray(contents)) {
      await prisma.tutorialContent.deleteMany({ where: { tutorialId: id } })
    }
    const tutorial = await prisma.tutorial.update({
      where: { id },
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
    await prisma.tutorial.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
