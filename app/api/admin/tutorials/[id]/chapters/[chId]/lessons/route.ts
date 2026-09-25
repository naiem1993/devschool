import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { revalidateTutorialPaths } from '@/lib/revalidate-tutorial'

/**
 * Lesson collection API (nested structure v3)
 *
 *  GET    → chapter-এর সব lesson
 *  POST   → নতুন lesson { title, slug, content, codeExample? }
 *  PATCH  → reorder { order: [lessonId, ...] }
 *
 * First lesson-এর slug chapter-এর slug-এর সাথে sync হয় (D6a)।
 */

function normSlug(raw: unknown): string {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── GET ──────────────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; chId: string }> }
) {
  const { id, chId } = await params
  try {
    const chapter = await prisma.chapter.findUnique({ where: { id: chId }, select: { tutorialId: true } })
    if (!chapter || chapter.tutorialId !== id) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }
    const lessons = await prisma.lesson.findMany({
      where: { chapterId: chId },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(lessons)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// ─── POST ─────────────────────────────────────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; chId: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id, chId } = await params
  const body = await req.json().catch(() => ({}))

  const titleBn = String(body?.titleBn ?? '').trim()
  const slug = normSlug(body?.slug)
  const contentBn = String(body?.contentBn ?? '').trim()
  const codeExampleBn = body?.codeExampleBn ? String(body.codeExampleBn).trim() : null

  // PART 9e — ইংরেজি ভার্সন (optional, না দিলে null)
  const titleEn = body?.titleEn ? String(body.titleEn).trim() : null
  const contentEn = body?.contentEn != null && String(body.contentEn).trim() !== '' ? String(body.contentEn) : null
  const codeExampleEn = body?.codeExampleEn ? String(body.codeExampleEn).trim() : null

  if (!titleBn) return NextResponse.json({ error: 'title দরকার' }, { status: 400 })
  if (!titleEn) return NextResponse.json({ error: 'ইংরেজি title দরকার (জোড়া নিয়ম)' }, { status: 400 })
  if (!slug) return NextResponse.json({ error: 'slug URL-safe নয়' }, { status: 400 })
  if (!contentBn) return NextResponse.json({ error: 'content দরকার' }, { status: 400 })
  if (!contentEn) return NextResponse.json({ error: 'ইংরেজি content দরকার (জোড়া নিয়ম)' }, { status: 400 })

  try {
    const chapter = await prisma.chapter.findUnique({ where: { id: chId }, select: { id: true, tutorialId: true } })
    if (!chapter || chapter.tutorialId !== id) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    const dup = await prisma.lesson.findFirst({ where: { chapterId: chId, slug }, select: { id: true } })
    if (dup) return NextResponse.json({ error: 'এই slug আগেই ব্যবহৃত' }, { status: 409 })

    const last = await prisma.lesson.findFirst({
      where: { chapterId: chId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    })
    const nextOrder = (last?.sortOrder ?? -1) + 1

    const created = await prisma.lesson.create({
      data: {
        chapterId: chId,
        titleBn,
        titleEn,
        slug,
        contentBn,
        contentEn,
        codeExampleBn,
        codeExampleEn,
        sortOrder: nextOrder,
      },
    })

    // D6a — first lesson হলে chapter-এর slug sync করি
    if (nextOrder === 0) {
      const clash = await prisma.chapter.findFirst({
        where: { tutorialId: id, slug, NOT: { id: chId } },
        select: { id: true },
      })
      if (!clash) {
        await prisma.chapter.update({ where: { id: chId }, data: { slug } })
      }
    }

    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// ─── PATCH: reorder ──────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; chId: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id, chId } = await params
  const body = await req.json().catch(() => ({}))
  const order = body?.order

  if (!Array.isArray(order) || order.some((x) => typeof x !== 'string')) {
    return NextResponse.json({ error: 'order[] (lesson ids) দরকার' }, { status: 400 })
  }

  try {
    const chapter = await prisma.chapter.findUnique({ where: { id: chId }, select: { tutorialId: true } })
    if (!chapter || chapter.tutorialId !== id) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    const existing = await prisma.lesson.findMany({ where: { chapterId: chId }, select: { id: true } })
    const ids = new Set(existing.map((l) => l.id))

    if (
      order.length !== existing.length ||
      !order.every((o: string) => ids.has(o)) ||
      new Set(order).size !== order.length
    ) {
      return NextResponse.json(
        { error: 'order-এ এই chapter-এর সব lesson (ডুপ্লিকেট ছাড়া) থাকতে হবে' },
        { status: 400 }
      )
    }

    await prisma.$transaction(
      order.map((lid: string, i: number) =>
        prisma.lesson.update({ where: { id: lid }, data: { sortOrder: i } })
      )
    )

    const fresh = await prisma.lesson.findMany({ where: { chapterId: chId }, orderBy: { sortOrder: 'asc' } })
    await revalidateTutorialPaths(id)
    return NextResponse.json(fresh)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
