import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { revalidateTutorialPaths } from '@/lib/revalidate-tutorial'

/**
 * ChapterGroup collection API (nested structure v3)
 *
 *  GET    → সব group
 *  POST   → নতুন group { title }
 *  PATCH  → reorder { order: [groupId, ...] }
 */

// ─── GET ──────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const groups = await prisma.chapterGroup.findMany({
      where: { tutorialId: id },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { chapters: true } } },
    })
    return NextResponse.json(groups)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// ─── POST ─────────────────────────────────────────────────────
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const titleBn = String(body?.titleBn ?? '').trim()
  const titleEn = String(body?.titleEn ?? '').trim() || null
  if (!titleBn) return NextResponse.json({ error: 'title দরকার' }, { status: 400 })

  try {
    const tutorial = await prisma.tutorial.findUnique({ where: { id }, select: { id: true } })
    if (!tutorial) return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 })

    const last = await prisma.chapterGroup.findFirst({
      where: { tutorialId: id },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    })
    const nextOrder = (last?.sortOrder ?? -1) + 1

    const created = await prisma.chapterGroup.create({
      data: { tutorialId: id, titleBn, titleEn, sortOrder: nextOrder },
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
    return NextResponse.json({ error: 'order[] (group ids) দরকার' }, { status: 400 })
  }

  try {
    const existing = await prisma.chapterGroup.findMany({ where: { tutorialId: id }, select: { id: true } })
    const ids = new Set(existing.map((g) => g.id))

    if (
      order.length !== existing.length ||
      !order.every((o: string) => ids.has(o)) ||
      new Set(order).size !== order.length
    ) {
      return NextResponse.json(
        { error: 'order-এ এই tutorial-এর সব group (ডুপ্লিকেট ছাড়া) থাকতে হবে' },
        { status: 400 }
      )
    }

    await prisma.$transaction(
      order.map((gid: string, i: number) =>
        prisma.chapterGroup.update({ where: { id: gid }, data: { sortOrder: i } })
      )
    )

    const fresh = await prisma.chapterGroup.findMany({
      where: { tutorialId: id },
      orderBy: { sortOrder: 'asc' },
    })
    await revalidateTutorialPaths(id)
    return NextResponse.json(fresh)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
