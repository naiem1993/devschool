import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'
import { revalidateTutorialPaths } from '@/lib/revalidate-tutorial'

/**
 * একটা ChapterGroup-এর operation
 *
 *  PATCH  → title আপডেট
 *  DELETE → group মুছে ফেলে (chapters-এর groupId null হয়ে যায়) — PIN দরকার
 */

// ─── PATCH ────────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; gid: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id, gid } = await params
  const body = await req.json().catch(() => ({}))
  const titleBn = String(body?.titleBn ?? '').trim()
  if (!titleBn) return NextResponse.json({ error: 'title দরকার' }, { status: 400 })

  try {
    const existing = await prisma.chapterGroup.findUnique({ where: { id: gid } })
    if (!existing || existing.tutorialId !== id) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }
    const updated = await prisma.chapterGroup.update({ where: { id: gid }, data: { titleBn } })
    return NextResponse.json(updated)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// ─── DELETE (PIN) ─────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; gid: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const adminId = await getAdminId(req)
  if (!adminId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const token = req.headers.get('x-pin-token') || undefined
  if (!(await verifyPinToken(token, adminId))) {
    return NextResponse.json({ error: 'PIN_REQUIRED' }, { status: 403 })
  }

  const { id, gid } = await params

  try {
    const existing = await prisma.chapterGroup.findUnique({ where: { id: gid } })
    if (!existing || existing.tutorialId !== id) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }
    await prisma.chapterGroup.delete({ where: { id: gid } })
    await revalidateTutorialPaths(id)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
