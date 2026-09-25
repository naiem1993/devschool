import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'
import { revalidateTutorialPaths } from '@/lib/revalidate-tutorial'

/**
 * একটা Lesson-এর operation
 *
 *  PATCH  → title / slug / content / codeExample আপডেট
 *  DELETE → lesson মুছে বাকিগুলো re-number — PIN দরকার
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
  { params }: { params: Promise<{ id: string; chId: string; lid: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id, chId, lid } = await params
  const body = await req.json().catch(() => ({}))

  const data: {
    titleBn?: string
    titleEn?: string | null
    slug?: string
    contentBn?: string
    contentEn?: string | null
    codeExampleBn?: string | null
    codeExampleEn?: string | null
  } = {}

  if (typeof body?.titleBn === 'string') {
    const t = body.titleBn.trim()
    if (!t) return NextResponse.json({ error: 'title খালি রাখা যাবে না' }, { status: 400 })
    data.titleBn = t
  }
  if (typeof body?.titleEn === 'string') {
    const t = body.titleEn.trim()
    if (!t) return NextResponse.json({ error: 'ইংরেজি title খালি রাখা যাবে না (জোড়া নিয়ম)' }, { status: 400 })
    data.titleEn = t
  }
  if (typeof body?.slug === 'string') {
    const s = normSlug(body.slug)
    if (!s) return NextResponse.json({ error: 'slug URL-safe নয়' }, { status: 400 })
    data.slug = s
  }
  if (typeof body?.contentBn === 'string') {
    const c = body.contentBn.trim()
    if (!c) return NextResponse.json({ error: 'content খালি রাখা যাবে না' }, { status: 400 })
    data.contentBn = c
  }
  if ('codeExampleBn' in (body ?? {})) {
    data.codeExampleBn = body.codeExampleBn ? String(body.codeExampleBn).trim() : null
  }
  // PART 9e — ইংরেজি ভার্সন (optional; undefined = ছোঁব না)
  if ('titleEn' in (body ?? {})) {
    data.titleEn = body.titleEn ? String(body.titleEn).trim() : null
  }
  if ('contentEn' in (body ?? {})) {
    const c = body.contentEn != null ? String(body.contentEn).trim() : ''
    if (!c) return NextResponse.json({ error: 'ইংরেজি content খালি রাখা যাবে না (জোড়া নিয়ম)' }, { status: 400 })
    data.contentEn = c
  }
  if ('codeExampleEn' in (body ?? {})) {
    data.codeExampleEn = body.codeExampleEn ? String(body.codeExampleEn).trim() : null
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'কিছুই বদলানোর নেই' }, { status: 400 })
  }

  try {
    const chapter = await prisma.chapter.findUnique({ where: { id: chId }, select: { tutorialId: true } })
    if (!chapter || chapter.tutorialId !== id) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    const existing = await prisma.lesson.findUnique({ where: { id: lid } })
    if (!existing || existing.chapterId !== chId) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    if (data.slug && data.slug !== existing.slug) {
      const dup = await prisma.lesson.findFirst({
        where: { chapterId: chId, slug: data.slug, NOT: { id: lid } },
        select: { id: true },
      })
      if (dup) return NextResponse.json({ error: 'এই slug আগেই ব্যবহৃত' }, { status: 409 })
    }

    const updated = await prisma.lesson.update({ where: { id: lid }, data })

    // D6a — first lesson হলে chapter slug sync
    if (existing.sortOrder === 0 && data.slug) {
      const clash = await prisma.chapter.findFirst({
        where: { tutorialId: id, slug: data.slug, NOT: { id: chId } },
        select: { id: true },
      })
      if (!clash) {
        await prisma.chapter.update({ where: { id: chId }, data: { slug: data.slug } })
      }
    }

    return NextResponse.json(updated)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// ─── DELETE (PIN) ─────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; chId: string; lid: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const adminId = await getAdminId(req)
  if (!adminId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const token = req.headers.get('x-pin-token') || undefined
  if (!(await verifyPinToken(token, adminId))) {
    return NextResponse.json({ error: 'PIN_REQUIRED' }, { status: 403 })
  }

  const { id, chId, lid } = await params

  try {
    const chapter = await prisma.chapter.findUnique({ where: { id: chId }, select: { tutorialId: true } })
    if (!chapter || chapter.tutorialId !== id) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }
    const existing = await prisma.lesson.findUnique({ where: { id: lid } })
    if (!existing || existing.chapterId !== chId) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const removedNo = existing.sortOrder

    await prisma.$transaction(async (tx) => {
      await tx.lesson.delete({ where: { id: lid } })
      const rest = await tx.lesson.findMany({
        where: { chapterId: chId, sortOrder: { gt: removedNo } },
        orderBy: { sortOrder: 'asc' },
        select: { id: true },
      })
      for (const r of rest) {
        await tx.lesson.update({ where: { id: r.id }, data: { sortOrder: { decrement: 1 } } })
      }
    })

    await revalidateTutorialPaths(id)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
