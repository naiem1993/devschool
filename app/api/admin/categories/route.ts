import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createCategorySchema, validateBody } from '@/lib/validators'

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = validateBody(createCategorySchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })
  try {
    const cat = await prisma.category.create({ data: data! })
    return NextResponse.json(cat, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
