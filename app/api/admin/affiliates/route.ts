import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createAffiliateLinkSchema, validateBody } from '@/lib/validators'
import { requireAdmin } from '@/lib/auth'
import { serverError } from '@/lib/api-error'

export const runtime = 'nodejs'

/** GET /api/admin/affiliates — full list (admin) */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  try {
    const links = await prisma.affiliateLink.findMany({
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(links)
  } catch (e: unknown) {
    return serverError(e, 'affiliates-list')
  }
}

/** POST /api/admin/affiliates — create */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const body = await req.json().catch(() => ({}))
  const { data, error } = validateBody(createAffiliateLinkSchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })

  try {
    const d = data!
    const link = await prisma.affiliateLink.create({
      data: {
        titleBn: d.titleBn,
        titleEn: d.titleEn || null,
        descriptionBn: d.descriptionBn || null,
        descriptionEn: d.descriptionEn || null,
        url: d.url,
        imageUrl: d.imageUrl || null,
        category: d.category,
        priceLabel: d.priceLabel || null,
        badge: d.badge || null,
        isActive: d.isActive,
        priority: d.priority,
      },
    })
    return NextResponse.json(link, { status: 201 })
  } catch (e: unknown) {
    return serverError(e, 'affiliates-create')
  }
}
