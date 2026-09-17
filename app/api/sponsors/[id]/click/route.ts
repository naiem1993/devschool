import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * POST /api/sponsors/[id]/click — public click tracking
 * (fire-and-forget; sponsor rail click করলে call হয়।)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const isImpression = req.nextUrl.searchParams.get('impression') === '1'
  try {
    await prisma.sponsor.update({
      where: { id },
      data: isImpression ? { impressions: { increment: 1 } } : { clicks: { increment: 1 } },
    })
  } catch {
    // silent — tracking failure কখনো user experience ভাঙবে না
  }
  return NextResponse.json({ ok: true })
}
