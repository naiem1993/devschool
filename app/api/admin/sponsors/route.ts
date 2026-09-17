import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createSponsorSchema, validateBody } from '@/lib/validators'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const body = await req.json().catch(() => ({}))
  const { data, error } = validateBody(createSponsorSchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })

  try {
    const d = data!
    const sponsor = await prisma.sponsor.create({
      data: {
        name: d.name,
        logoUrl: d.logoUrl || null,
        imageId: d.imageId || null,
        websiteUrl: d.websiteUrl || null,
        description: d.description || null,
        tier: d.tier,
        priority: d.priority,
        isActive: d.isActive,
        startDate: d.startDate ? new Date(d.startDate) : null,
        endDate: d.endDate ? new Date(d.endDate) : null,
      },
    })
    return NextResponse.json(sponsor, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Create failed' }, { status: 500 })
  }
}
