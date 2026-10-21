import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { updateAffiliateLinkSchema, validateBody } from '@/lib/validators'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'
import { serverError } from '@/lib/api-error'

export const runtime = 'nodejs'

/** PUT /api/admin/affiliates/[id] — update */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const { data, error } = validateBody(updateAffiliateLinkSchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })

  try {
    const d = data!
    const updated = await prisma.affiliateLink.update({
      where: { id },
      data: {
        ...(d.titleBn !== undefined && { titleBn: d.titleBn }),
        ...(d.titleEn !== undefined && { titleEn: d.titleEn || null }),
        ...(d.descriptionBn !== undefined && { descriptionBn: d.descriptionBn || null }),
        ...(d.descriptionEn !== undefined && { descriptionEn: d.descriptionEn || null }),
        ...(d.url !== undefined && { url: d.url }),
        ...(d.imageUrl !== undefined && { imageUrl: d.imageUrl || null }),
        ...(d.category !== undefined && { category: d.category }),
        ...(d.priceLabel !== undefined && { priceLabel: d.priceLabel || null }),
        ...(d.badge !== undefined && { badge: d.badge || null }),
        ...(d.isActive !== undefined && { isActive: d.isActive }),
        ...(d.priority !== undefined && { priority: d.priority }),
      },
    })
    return NextResponse.json(updated)
  } catch (e: unknown) {
    return serverError(e, 'affiliates-update')
  }
}

/** DELETE /api/admin/affiliates/[id] — PIN-protected */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  const adminId = await getAdminId(req)
  if (!adminId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const pinToken = req.headers.get('x-pin-token') || undefined
  if (!(await verifyPinToken(pinToken, adminId))) {
    return NextResponse.json({ error: 'PIN_REQUIRED' }, { status: 403 })
  }

  const { id } = await params
  try {
    await prisma.affiliateLink.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return serverError(e, 'affiliates-delete')
  }
}
