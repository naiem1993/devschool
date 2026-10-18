import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * POST /api/admin/references/bulk
 * একসাথে অনেকগুলো রেফারেন্স সেভ করার জন্য
 * SLUG ইউনিক হতে হবে — ডুপ্লিকেট হলে -1, -2 সাফিক্স যোগ হবে
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tutorialId, references } = body

    // ── Validation ──
    if (!tutorialId) {
      return NextResponse.json({ error: 'tutorialId দরকার' }, { status: 400 })
    }
    if (!Array.isArray(references) || references.length === 0) {
      return NextResponse.json(
        { error: 'কমপক্ষে ১টি রেফারেন্স দরকার' },
        { status: 400 }
      )
    }
    if (references.length > 100) {
      return NextResponse.json(
        { error: 'একবারে সর্বোচ্চ ১০০টি রেফারেন্স দেওয়া যাবে' },
        { status: 400 }
      )
    }

    for (let i = 0; i < references.length; i++) {
      const r = references[i]
      const n = i + 1
      if (!r.titleBn || !String(r.titleBn).trim()) {
        return NextResponse.json({ error: `রেফারেন্স ${n}: বাংলা title নেই` }, { status: 400 })
      }
      if (!r.titleEn || !String(r.titleEn).trim()) {
        return NextResponse.json({ error: `রেফারেন্স ${n}: ইংরেজি title নেই` }, { status: 400 })
      }
      if (!r.descriptionBn || !String(r.descriptionBn).trim()) {
        return NextResponse.json({ error: `রেফারেন্স ${n}: বাংলা description নেই` }, { status: 400 })
      }
      if (!r.descriptionEn || !String(r.descriptionEn).trim()) {
        return NextResponse.json({ error: `রেফারেন্স ${n}: ইংরেজি description নেই` }, { status: 400 })
      }
      if (!r.syntaxBn || !r.syntaxEn) {
        return NextResponse.json({ error: `রেফারেন্স ${n}: syntax BN ও EN দুটোই দরকার` }, { status: 400 })
      }
      if (!r.exampleBn || !r.exampleEn) {
        return NextResponse.json({ error: `রেফারেন্স ${n}: example BN ও EN দুটোই দরকার` }, { status: 400 })
      }
      if (!Array.isArray(r.tags) || r.tags.length < 2) {
        return NextResponse.json({ error: `রেফারেন্স ${n}: কমপক্ষে ২টি tag দরকার` }, { status: 400 })
      }
    }

    // ── ইউনিক slug জেনারেট ──
    const ensureUniqueSlug = async (baseSlug: string, usedInBatch: Set<string>): Promise<string> => {
      const slug = baseSlug || 'reference'
      let counter = 0
      while (true) {
        const candidate = counter === 0 ? slug : `${slug}-${counter}`
        if (usedInBatch.has(candidate)) {
          counter++
          continue
        }
        const existing = await prisma.reference.findUnique({ where: { slug: candidate } })
        if (!existing) {
          usedInBatch.add(candidate)
          return candidate
        }
        counter++
      }
    }

    const usedInBatch = new Set<string>()

    // ── Create all references in one transaction ──
    const created = await prisma.$transaction(async (tx) => {
      const results = []
      for (const r of references) {
        const baseSlug = r.slug
          ? String(r.slug).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
          : String(r.titleEn).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

        const slug = await ensureUniqueSlug(baseSlug, usedInBatch)

        const ref = await tx.reference.create({
          data: {
            tutorialId,
            titleBn: String(r.titleBn).trim(),
            titleEn: String(r.titleEn).trim(),
            slug,
            descriptionBn: String(r.descriptionBn).trim(),
            descriptionEn: String(r.descriptionEn).trim(),
            syntaxBn: String(r.syntaxBn).trim(),
            syntaxEn: String(r.syntaxEn).trim(),
            exampleBn: String(r.exampleBn).trim(),
            exampleEn: String(r.exampleEn).trim(),
            tags: r.tags.map((t: unknown) => String(t).trim()).filter(Boolean),
            language: r.language ? String(r.language).trim() : null,
          },
        })
        results.push(ref)
      }
      return results
    })

    return NextResponse.json(
      { success: true, created: created.length, ids: created.map((c) => c.id) },
      { status: 201 }
    )
  } catch (e) {
    console.error('Bulk reference create error:', e)
    const msg = e instanceof Error ? e.message : 'সার্ভার এরর'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
