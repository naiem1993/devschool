import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'
import { revalidateTutorialPaths } from '@/lib/revalidate-tutorial'
import { serverError } from '@/lib/api-error'
import { updateGroupSchema, validateBody } from '@/lib/validators'

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
  const titleEn = body?.titleEn === undefined ? undefined : (String(body.titleEn).trim() || null)
  if (!titleBn) return NextResponse.json({ error: 'title দরকার' }, { status: 400 })

  const { data, error } = validateBody(updateGroupSchema, { titleBn, titleEn })
  if (error || !data) {
    return NextResponse.json({ error: error || 'Invalid request body' }, { status: 400 })
  }

  try {
    const existing = await prisma.chapterGroup.findUnique({ where: { id: gid } })
    if (!existing || existing.tutorialId !== id) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }
    const updated = await prisma.chapterGroup.update({
      where: { id: gid },
      data: { titleBn: data.titleBn, ...(data.titleEn !== undefined ? { titleEn: data.titleEn } : {}) },
    })
    return NextResponse.json(updated)
  } catch (e: unknown) {
    return serverError(e, 'group-update')
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
  } catch (e: unknown) {
    return serverError(e, 'group-delete')
  }
}
