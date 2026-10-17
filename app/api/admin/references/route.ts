import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createReferenceSchema, validateBody } from '@/lib/validators'
import { serverError } from '@/lib/api-error'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = validateBody(createReferenceSchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })
  try {
    const ref = await prisma.reference.create({ data: data! })
    return NextResponse.json(ref, { status: 201 })
  } catch (e: unknown) {
    return serverError(e, 'references-create')
  }
}
