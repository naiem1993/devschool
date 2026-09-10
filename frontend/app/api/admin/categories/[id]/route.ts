import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { updateCategorySchema, validateBody } from '@/lib/validators'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const cat = await prisma.category.findUnique({ where: { id: params.id } })
  if (!cat) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(cat)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { data, error } = validateBody(updateCategorySchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })
  try {
    const cat = await prisma.category.update({ where: { id: params.id }, data: data! })
    return NextResponse.json(cat)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.category.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
