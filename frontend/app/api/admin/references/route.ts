import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createReferenceSchema, validateBody } from '@/lib/validators'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = validateBody(createReferenceSchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })
  try {
    const ref = await prisma.reference.create({ data: data! })
    return NextResponse.json(ref, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
