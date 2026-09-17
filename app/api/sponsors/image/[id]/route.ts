import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'

/**
 * GET /api/sponsors/image/[id]
 * DB-blob ছবি serve করে — strong ETag + long cache।
 * (Public — sponsor rail সবাই দেখতে পারে।)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const img = await prisma.sponsorImage.findUnique({
    where: { id },
    select: { data: true, mimeType: true, hash: true, sizeBytes: true },
  })
  if (!img) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const etag = `"${img.hash}"`
  if (req.headers.get('if-none-match') === etag) {
    return new NextResponse(null, { status: 304 })
  }

  const body = Buffer.from(img.data)
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': img.mimeType,
      'Content-Length': String(img.sizeBytes),
      'Cache-Control': 'public, max-age=31536000, immutable',
      ETag: etag,
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
