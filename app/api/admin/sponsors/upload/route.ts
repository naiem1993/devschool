import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import {
  MAX_UPLOAD_BYTES,
  detectImageType,
  hashBuffer,
  imageUrlFor,
} from '@/lib/sponsor-image'

export const runtime = 'nodejs'

/**
 * POST /api/admin/sponsors/upload
 * multipart/form-data: { file: File }
 * → magic-byte check → hash dedup → SponsorImage row → { imageId, url }
 * (Admin auth proxy.ts দিয়ে already protected।)
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_UPLOAD_BYTES / 1024 / 1024}MB)` },
        { status: 413 }
      )
    }

    const buf = Buffer.from(await file.arrayBuffer())
    const detected = detectImageType(buf)
    if (!detected) {
      return NextResponse.json(
        { error: 'Unsupported or corrupt image (png/jpg/webp/gif/svg only)' },
        { status: 415 }
      )
    }

    const hash = hashBuffer(buf)

    // Dedup: একই ছবি আগে থাকলে reuse করি
    const existing = await prisma.sponsorImage.findUnique({ where: { hash } })
    if (existing) {
      return NextResponse.json({
        imageId: existing.id,
        url: imageUrlFor(existing.id),
        reused: true,
      })
    }

    const width = form.get('width')
    const height = form.get('height')

    const img = await prisma.sponsorImage.create({
      data: {
        hash,
        mimeType: detected.mimeType,
        sizeBytes: buf.length,
        width: width ? Number(width) || null : null,
        height: height ? Number(height) || null : null,
        data: buf,
      },
    })

    return NextResponse.json(
      { imageId: img.id, url: imageUrlFor(img.id), reused: false },
      { status: 201 }
    )
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}
