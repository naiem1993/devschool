import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { updateCategorySchema, validateBody } from '@/lib/validators'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cat = await prisma.category.findUnique({ where: { id } })
  if (!cat) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(cat)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { data, error } = validateBody(updateCategorySchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })
  try {
    const cat = await prisma.category.update({ where: { id }, data: data! })
    return NextResponse.json(cat)
  } catch (e: any) {
    // Friendly handling for duplicate name/slug (Prisma P2002 unique constraint)
    if (e?.code === 'P2002') {
      const field = Array.isArray(e?.meta?.target) ? e.meta.target.join(', ') : 'name/slug'
      return NextResponse.json(
        { error: `এই ${field} আগেই ব্যবহৃত হয়েছে — অন্য মান দিন।` },
        { status: 409 }
      )
    }
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
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
