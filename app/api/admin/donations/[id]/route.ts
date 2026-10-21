import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { updateDonationSchema, validateBody } from '@/lib/validators'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'
import { serverError } from '@/lib/api-error'

export const runtime = 'nodejs'

/** PUT /api/admin/donations/[id] — update */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const { data, error } = validateBody(updateDonationSchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })

  try {
    const d = data!
    const updated = await prisma.donation.update({
      where: { id },
      data: {
        ...(d.donorName !== undefined && { donorName: d.donorName || null }),
        ...(d.donorEmail !== undefined && { donorEmail: d.donorEmail || null }),
        ...(d.amount !== undefined && { amount: d.amount }),
        ...(d.currency !== undefined && { currency: d.currency }),
        ...(d.transactionId !== undefined && { transactionId: d.transactionId || null }),
        ...(d.status !== undefined && { status: d.status }),
        ...(d.message !== undefined && { message: d.message || null }),
        ...(d.isPublic !== undefined && { isPublic: d.isPublic }),
      },
    })
    return NextResponse.json(updated)
  } catch (e: unknown) {
    return serverError(e, 'donations-update')
  }
}

/** DELETE /api/admin/donations/[id] — PIN-protected */
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
    await prisma.donation.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return serverError(e, 'donations-delete')
  }
}
