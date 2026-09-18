import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { updateTutorialSchema, validateBody } from '@/lib/validators'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'
import { revalidateTutorialPaths, revalidateTutorialListPaths } from '@/lib/revalidate-tutorial'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Defense-in-depth: proxy.ts ছাড়াও নিজে admin check করি
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id } = await params
  const tut = await prisma.tutorial.findUnique({
    where: { id },
    include: {
      groups: { orderBy: { sortOrder: 'asc' } },
      chapters: {
        orderBy: { sortOrder: 'asc' },
        include: { lessons: { orderBy: { sortOrder: 'asc' } } },
      },
    },
  })
  if (!tut) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(tut)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Defense-in-depth: proxy.ts ছাড়াও নিজে admin check করি
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id } = await params
  const body = await req.json()
  // Nested structure (v3): contents আর inline আপডেট হয় না।
  // Chapter/Lesson আলাদা admin API route থেকে ম্যানেজ হয়।
  const { contents: _contents, ...rest } = body
  void _contents
  const { data, error } = validateBody(updateTutorialSchema, rest)
  if (error) return NextResponse.json({ error }, { status: 400 })

  try {
    const tutorial = await prisma.tutorial.update({
      where: { id },
      data: data!,
      include: {
        groups: { orderBy: { sortOrder: 'asc' } },
        chapters: {
          orderBy: { sortOrder: 'asc' },
          include: { lessons: { orderBy: { sortOrder: 'asc' } } },
        },
      },
    })
    await revalidateTutorialPaths(id)
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
    revalidateTutorialListPaths()
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
