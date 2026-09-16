import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

/**
 * Chapter collection API (Option A — আলাদা chapter management)
 *
 *  GET    /api/admin/tutorials/[id]/chapters  → সব chapter (ক্রম অনুযায়ী)
 *  POST   /api/admin/tutorials/[id]/chapters  → নতুন chapter (chapterNo auto)
 *  PATCH  /api/admin/tutorials/[id]/chapters  → reorder { order: [id, id, ...] }
 *
 * ⚠️ DELETE এখানে নেই — একটা chapter মুছতে
 *    /api/admin/tutorials/[id]/chapters/[chId] ব্যবহার করুন (PIN দরকার)।
 */

// ─── GET: list ────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const chapters = await prisma.tutorialContent.findMany({
      where: { tutorialId: id },
      orderBy: { chapterNo: 'asc' },
    })
    return NextResponse.json(chapters)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// ─── POST: নতুন chapter ───────────────────────────────────────
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id } = await params
  const body = await req.json().catch(() => ({}))

  const title = String(body?.title ?? '').trim()
  const content = String(body?.content ?? '').trim()
  const codeExample = body?.codeExample ? String(body.codeExample).trim() : null

  if (!title || !content) {
    return NextResponse.json({ error: 'title ও content দুটোই দরকার' }, { status: 400 })
  }

  try {
    const tutorial = await prisma.tutorial.findUnique({ where: { id }, select: { id: true } })
    if (!tutorial) return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 })

    const last = await prisma.tutorialContent.findFirst({
      where: { tutorialId: id },
      orderBy: { chapterNo: 'desc' },
      select: { chapterNo: true },
    })
    const nextNo = (last?.chapterNo ?? 0) + 1

    const created = await prisma.tutorialContent.create({
      data: { tutorialId: id, chapterNo: nextNo, title, content, codeExample },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// ─── PATCH: reorder ──────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const order = body?.order

  if (!Array.isArray(order) || order.some((x) => typeof x !== 'string')) {
    return NextResponse.json({ error: 'order[] (chapter ids) দরকার' }, { status: 400 })
  }

  try {
    const existing = await prisma.tutorialContent.findMany({
      where: { tutorialId: id },
      select: { id: true },
    })
    const ids = new Set(existing.map((c) => c.id))

    if (
      order.length !== existing.length ||
      !order.every((oid) => ids.has(oid as string)) ||
      new Set(order).size !== order.length
    ) {
      return NextResponse.json(
        { error: 'order-এ এই tutorial-এর সব chapter (ডুপ্লিকেট ছাড়া) থাকতে হবে' },
        { status: 400 }
      )
    }

    // দুটো pass — নাহলে @@unique([tutorialId, chapterNo]) ভেঙে যাবে।
    // pass 1: সবাইকে negative temp-এ সরাই
    // pass 2: চূড়ান্ত 1..N বসাই
    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < order.length; i++) {
        await tx.tutorialContent.update({
          where: { id: order[i] as string },
          data: { chapterNo: -(i + 1) },
        })
      }
      for (let i = 0; i < order.length; i++) {
        await tx.tutorialContent.update({
          where: { id: order[i] as string },
          data: { chapterNo: i + 1 },
        })
      }
    })

    const fresh = await prisma.tutorialContent.findMany({
      where: { tutorialId: id },
      orderBy: { chapterNo: 'asc' },
    })
    return NextResponse.json(fresh)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
