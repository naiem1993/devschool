import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createAffiliateCategorySchema, validateBody } from '@/lib/validators'
import { requireAdmin } from '@/lib/auth'
import { serverError } from '@/lib/api-error'

export const runtime = 'nodejs'

/** GET /api/admin/affiliate-categories */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  try {
    const cats = await prisma.affiliateCategory.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    return NextResponse.json(cats)
  } catch (e: unknown) {
    return serverError(e, 'affiliate-categories-list')
  }
}

/** POST /api/admin/affiliate-categories */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const body = await req.json().catch(() => ({}))
  const { data, error } = validateBody(createAffiliateCategorySchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })

  try {
    const d = data!
    const cat = await prisma.affiliateCategory.create({
      data: {
        slug: d.slug,
        nameBn: d.nameBn,
        nameEn: d.nameEn || null,
        icon: d.icon || '📦',
        description: d.description || null,
        sortOrder: d.sortOrder,
        isActive: d.isActive,
      },
    })
    return NextResponse.json(cat, { status: 201 })
  } catch (e: unknown) {
    return serverError(e, 'affiliate-categories-create')
  }
}
