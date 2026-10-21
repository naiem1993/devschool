import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createDonationSchema, validateBody } from '@/lib/validators'
import { requireAdmin } from '@/lib/auth'
import { serverError } from '@/lib/api-error'

export const runtime = 'nodejs'

/** GET /api/admin/donations — full list (admin) */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  try {
    const items = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    })
    return NextResponse.json(items)
  } catch (e: unknown) {
    return serverError(e, 'donations-list')
  }
}

/** POST /api/admin/donations — create */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const body = await req.json().catch(() => ({}))
  const { data, error } = validateBody(createDonationSchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })

  try {
    const d = data!
    const donation = await prisma.donation.create({
      data: {
        donorName: d.donorName || null,
        donorEmail: d.donorEmail || null,
        amount: d.amount,
        currency: d.currency,
        transactionId: d.transactionId || null,
        status: d.status,
        message: d.message || null,
        isPublic: d.isPublic,
      },
    })
    return NextResponse.json(donation, { status: 201 })
  } catch (e: unknown) {
    return serverError(e, 'donations-create')
  }
}
