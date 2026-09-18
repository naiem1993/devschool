import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { revalidateTutorialPaths } from '@/lib/revalidate-tutorial'

/**
 * Chapter collection API (nested structure v3)
 *
 *  GET    → সব chapter (group + lesson count সহ)
 *  POST   → নতুন chapter { title, slug, groupId?, content?, codeExample? }
 *  PATCH  → reorder { order: [chapterId, ...] }
 *
 * ⚠️ DELETE নেই — একটা chapter মুছতে [chId] route ব্যবহার করুন (PIN দরকার)।
 */

function normSlug(raw: unknown): string {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── GET: list ────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const chapters = await prisma.chapter.findMany({
      where: { tutorialId: id },
      orderBy: { sortOrder: 'asc' },
      include: {
        group: { select: { id: true, title: true } },
        _count: { select: { lessons: true } },
      },
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
  const slug = normSlug(body?.slug)
  const groupId = body?.groupId ? String(body.groupId) : null
  const content = body?.content != null && String(body.content).trim() !== '' ? String(body.content) : null
  const codeExample = body?.codeExample ? String(body.codeExample).trim() : null

  if (!title) return NextResponse.json({ error: 'title দরকার' }, { status: 400 })
  if (!slug) return NextResponse.json({ error: 'slug URL-safe হতে হবে (lowercase, hyphens)' }, { status: 400 })

  try {
    const tutorial = await prisma.tutorial.findUnique({ where: { id }, select: { id: true } })
    if (!tutorial) return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 })

    if (groupId) {
      const g = await prisma.chapterGroup.findFirst({ where: { id: groupId, tutorialId: id }, select: { id: true } })
      if (!g) return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    const dup = await prisma.chapter.findFirst({ where: { tutorialId: id, slug }, select: { id: true } })
    if (dup) return NextResponse.json({ error: 'এই slug আগেই ব্যবহৃত' }, { status: 409 })

    const last = await prisma.chapter.findFirst({
      where: { tutorialId: id },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    })
    const nextOrder = (last?.sortOrder ?? -1) + 1

    const created = await prisma.chapter.create({
      data: { tutorialId: id, title, slug, groupId, content, codeExample, sortOrder: nextOrder },
    })
    await revalidateTutorialPaths(id)
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
    const existing = await prisma.chapter.findMany({ where: { tutorialId: id }, select: { id: true } })
    const ids = new Set(existing.map((c) => c.id))

    if (
      order.length !== existing.length ||
      !order.every((o: string) => ids.has(o)) ||
      new Set(order).size !== order.length
    ) {
      return NextResponse.json(
        { error: 'order-এ এই tutorial-এর সব chapter (ডুপ্লিকেট ছাড়া) থাকতে হবে' },
        { status: 400 }
      )
    }

    await prisma.$transaction(
      order.map((cid: string, i: number) =>
        prisma.chapter.update({ where: { id: cid }, data: { sortOrder: i } })
      )
    )

    const fresh = await prisma.chapter.findMany({
      where: { tutorialId: id },
      orderBy: { sortOrder: 'asc' },
      include: { group: { select: { id: true, title: true } }, _count: { select: { lessons: true } } },
    })
    return NextResponse.json(fresh)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
