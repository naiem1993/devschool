import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { updateReferenceSchema, validateBody } from '@/lib/validators'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ref = await prisma.reference.findUnique({ where: { id } })
  if (!ref) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(ref)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { data, error } = validateBody(updateReferenceSchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })
  try {
    const ref = await prisma.reference.update({ where: { id }, data: data! })
    return NextResponse.json(ref)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await prisma.reference.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
