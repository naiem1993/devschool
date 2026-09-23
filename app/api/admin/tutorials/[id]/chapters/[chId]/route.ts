import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'
import { revalidateTutorialPaths } from '@/lib/revalidate-tutorial'

/**
 * একটা chapter-এর উপর operation (nested structure v3)
 *
 *  PATCH  → title / slug / groupId / content / codeExample আপডেট
 *  DELETE → chapter মুছে ফেলে (lessons cascade) — PIN দরকার
 */

function normSlug(raw: unknown): string {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── PATCH ────────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; chId: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id, chId } = await params
  const body = await req.json().catch(() => ({}))

  const data: {
    titleBn?: string
    slug?: string
    groupId?: string | null
    contentBn?: string | null
    codeExampleBn?: string | null
  } = {}

  if (typeof body?.titleBn === 'string') {
    const t = body.titleBn.trim()
    if (!t) return NextResponse.json({ error: 'title খালি রাখা যাবে না' }, { status: 400 })
    data.titleBn = t
  }
  if (typeof body?.slug === 'string') {
    const s = normSlug(body.slug)
    if (!s) return NextResponse.json({ error: 'slug URL-safe নয়' }, { status: 400 })
    data.slug = s
  }
  if ('groupId' in (body ?? {})) {
    data.groupId = body.groupId ? String(body.groupId) : null
  }
  if ('contentBn' in (body ?? {})) {
    data.contentBn = body.contentBn != null && String(body.contentBn).trim() !== '' ? String(body.contentBn) : null
  }
  if ('codeExampleBn' in (body ?? {})) {
    data.codeExampleBn = body.codeExampleBn ? String(body.codeExampleBn).trim() : null
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'কিছুই বদলানোর নেই' }, { status: 400 })
  }

  try {
    const existing = await prisma.chapter.findUnique({ where: { id: chId } })
    if (!existing || existing.tutorialId !== id) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    if (data.groupId) {
      const g = await prisma.chapterGroup.findFirst({
        where: { id: data.groupId, tutorialId: id },
        select: { id: true },
      })
      if (!g) return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (data.slug && data.slug !== existing.slug) {
      const dup = await prisma.chapter.findFirst({
        where: { tutorialId: id, slug: data.slug, NOT: { id: chId } },
        select: { id: true },
      })
      if (dup) return NextResponse.json({ error: 'এই slug আগেই ব্যবহৃত' }, { status: 409 })
    }

    const updated = await prisma.chapter.update({ where: { id: chId }, data })
    return NextResponse.json(updated)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// ─── DELETE (PIN) ─────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; chId: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const adminId = await getAdminId(req)
  if (!adminId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const token = req.headers.get('x-pin-token') || undefined
  if (!(await verifyPinToken(token, adminId))) {
    return NextResponse.json({ error: 'PIN_REQUIRED' }, { status: 403 })
  }

  const { id, chId } = await params

  try {
    const existing = await prisma.chapter.findUnique({ where: { id: chId } })
    if (!existing || existing.tutorialId !== id) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }
    await prisma.chapter.delete({ where: { id: chId } })
    await revalidateTutorialPaths(id)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
