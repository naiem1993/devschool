import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { updateSponsorSchema, validateBody } from '@/lib/validators'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'

export const runtime = 'nodejs'

/** PUT /api/admin/sponsors/[id] — sponsor update */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const { data, error } = validateBody(updateSponsorSchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })

  try {
    const d = data!
    const updated = await prisma.sponsor.update({
      where: { id },
      data: {
        ...(d.name !== undefined && { name: d.name }),
        ...(d.logoUrl !== undefined && { logoUrl: d.logoUrl || null }),
        ...(d.imageId !== undefined && { imageId: d.imageId || null }),
        ...(d.websiteUrl !== undefined && { websiteUrl: d.websiteUrl || null }),
        ...(d.description !== undefined && { description: d.description || null }),
        ...(d.tier !== undefined && { tier: d.tier }),
        ...(d.priority !== undefined && { priority: d.priority }),
        ...(d.isActive !== undefined && { isActive: d.isActive }),
        ...(d.startDate !== undefined && { startDate: d.startDate ? new Date(d.startDate) : null }),
        ...(d.endDate !== undefined && { endDate: d.endDate ? new Date(d.endDate) : null }),
      },
    })
    return NextResponse.json(updated)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Update failed' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/sponsors/[id] — PIN-protected
 * orphan SponsorImage (কেউ reference না করলে) auto-clean।
 */
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
    const sponsor = await prisma.sponsor.findUnique({
      where: { id },
      select: { imageId: true },
    })
    await prisma.sponsor.delete({ where: { id } })

    // Orphan image cleanup — শুধু কেউ আর ব্যবহার না করলে
    if (sponsor?.imageId) {
      const stillUsed = await prisma.sponsor.count({ where: { imageId: sponsor.imageId } })
      if (stillUsed === 0) {
        await prisma.sponsorImage.delete({ where: { id: sponsor.imageId } }).catch(() => {})
      }
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Delete failed' }, { status: 500 })
  }
}
