import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/** Test case shape as it arrives from the client (no id yet). */
type TestCaseInput = {
  input: unknown
  expectedOutput: unknown
  isHidden?: unknown
}

/**
 * POST /api/admin/challenges/bulk
 * একসাথে অনেকগুলো CodeChallenge + TestCase সেভ করার জন্য
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tutorialId, challenges } = body

    // ── Validation ──
    if (!tutorialId) {
      return NextResponse.json({ error: 'tutorialId দরকার' }, { status: 400 })
    }
    if (!Array.isArray(challenges) || challenges.length === 0) {
      return NextResponse.json({ error: 'কমপক্ষে ১টি চ্যালেঞ্জ দরকার' }, { status: 400 })
    }
    if (challenges.length > 100) {
      return NextResponse.json({ error: 'একবারে সর্বোচ্চ ১০০টি চ্যালেঞ্জ দেওয়া যাবে' }, { status: 400 })
    }

    for (let i = 0; i < challenges.length; i++) {
      const c = challenges[i]
      const n = i + 1
      if (!c.titleBn || !String(c.titleBn).trim()) {
        return NextResponse.json({ error: `চ্যালেঞ্জ ${n}: বাংলা title নেই` }, { status: 400 })
      }
      if (!c.titleEn || !String(c.titleEn).trim()) {
        return NextResponse.json({ error: `চ্যালেঞ্জ ${n}: ইংরেজি title নেই` }, { status: 400 })
      }
      if (!c.descriptionBn || !String(c.descriptionBn).trim()) {
        return NextResponse.json({ error: `চ্যালেঞ্জ ${n}: বাংলা description নেই` }, { status: 400 })
      }
      if (!c.descriptionEn || !String(c.descriptionEn).trim()) {
        return NextResponse.json({ error: `চ্যালেঞ্জ ${n}: ইংরেজি description নেই` }, { status: 400 })
      }
      if (!Array.isArray(c.testCases) || c.testCases.length === 0) {
        return NextResponse.json({ error: `চ্যালেঞ্জ ${n}: অন্তত ১টি test case দরকার` }, { status: 400 })
      }
      if (!c.testCases.every((t: TestCaseInput) => t.input !== undefined && t.expectedOutput !== undefined)) {
        return NextResponse.json({ error: `চ্যালেঞ্জ ${n}: প্রতিটি test case-এ input ও expectedOutput দরকার` }, { status: 400 })
      }
    }

    // ── Create all challenges in a transaction ──
    const created = await prisma.$transaction(
      challenges.map((c) =>
        prisma.codeChallenge.create({
          data: {
            tutorialId,
            titleBn: String(c.titleBn).trim(),
            titleEn: String(c.titleEn).trim(),
            descriptionBn: String(c.descriptionBn).trim(),
            descriptionEn: String(c.descriptionEn).trim(),
            language: c.language ? String(c.language) : 'js',
            starterCodeBn: c.starterCodeBn ? String(c.starterCodeBn) : null,
            starterCodeEn: c.starterCodeEn ? String(c.starterCodeEn) : null,
            solutionBn: c.solutionBn ? String(c.solutionBn) : null,
            solutionEn: c.solutionEn ? String(c.solutionEn) : null,
            difficulty: c.difficulty || 'Easy',
            points: Number(c.points) || 0,
            testCases: {
              create: c.testCases.map((t: TestCaseInput, idx: number) => ({
                input: String(t.input),
                expectedOutput: String(t.expectedOutput),
                isHidden: !!t.isHidden,
                testCaseOrder: idx,
              })),
            },
          },
        })
      )
    )

    return NextResponse.json(
      { success: true, created: created.length, ids: created.map((c) => c.id) },
      { status: 201 }
    )
  } catch (e) {
    console.error('Bulk challenge create error:', e)
    const msg = e instanceof Error ? e.message : 'সার্ভার এরর'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
