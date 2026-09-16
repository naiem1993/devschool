import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'

/**
 * একটা chapter-এর উপর operation (Option A)
 *
 *  PATCH  → title / content / codeExample আপডেট (auth only)
 *  DELETE → chapter মুছে বাকিগুলো re-number (PIN দরকার — memory #49)
 */

// ─── PATCH: একটা chapter আপডেট ───────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; chId: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id, chId } = await params
  const body = await req.json().catch(() => ({}))

  const data: { title?: string; content?: string; codeExample?: string | null } = {}

  if (typeof body?.title === 'string') {
    const t = body.title.trim()
    if (!t) return NextResponse.json({ error: 'title খালি রাখা যাবে না' }, { status: 400 })
    data.title = t
  }
  if (typeof body?.content === 'string') {
    const c = body.content.trim()
    if (!c) return NextResponse.json({ error: 'content খালি রাখা যাবে না' }, { status: 400 })
    data.content = c
  }
  if ('codeExample' in (body ?? {})) {
    data.codeExample = body.codeExample ? String(body.codeExample).trim() : null
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'কিছুই বদলানোর নেই' }, { status: 400 })
  }

  try {
    const existing = await prisma.tutorialContent.findUnique({ where: { id: chId } })
    if (!existing || existing.tutorialId !== id) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    const updated = await prisma.tutorialContent.update({ where: { id: chId }, data })
    return NextResponse.json(updated)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// ─── DELETE: একটা chapter মুছে re-number (PIN) ────────────────
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
    const existing = await prisma.tutorialContent.findUnique({ where: { id: chId } })
    if (!existing || existing.tutorialId !== id) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    const removedNo = existing.chapterNo

    // মুছে ফেলি, তারপর বাকিগুলো 1..N-এ renumber করি (দুটো pass — unique constraint)
    await prisma.$transaction(async (tx) => {
      await tx.tutorialContent.delete({ where: { id: chId } })

      const rest = await tx.tutorialContent.findMany({
        where: { tutorialId: id, chapterNo: { gt: removedNo } },
        orderBy: { chapterNo: 'asc' },
        select: { id: true },
      })

      // pass 1: negative temp
      for (let i = 0; i < rest.length; i++) {
        await tx.tutorialContent.update({
          where: { id: rest[i].id },
          data: { chapterNo: -(removedNo + i + 1) },
        })
      }
      // pass 2: চূড়ান্ত
      for (let i = 0; i < rest.length; i++) {
        await tx.tutorialContent.update({
          where: { id: rest[i].id },
          data: { chapterNo: removedNo + i },
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
