import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/affiliates/[id]/click
 * Public click tracker — click বাড়িয়ে original affiliate URL-এ 302 redirect।
 * Counter fail হলেও redirect কাজ করবে (fire-and-forget)।
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const link = await prisma.affiliateLink.findUnique({
    where: { id },
    select: { url: true, isActive: true },
  })

  if (!link || !link.isActive) {
    return NextResponse.redirect(new URL('/', _req.url), 302)
  }

  // Click counter — failure redirect আটকাবে না
  prisma.affiliateLink
    .update({ where: { id }, data: { clicks: { increment: 1 } } })
    .catch(() => {})

  return NextResponse.redirect(link.url, 302)
}
