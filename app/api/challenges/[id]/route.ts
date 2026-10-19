import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { idParamSchema } from '@/lib/validators'

/**
 * GET /api/challenges/[id]
 * Fetches a code challenge with test cases
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  // ─── Validate ID format ────────────────────────────────────────────────────
  const validation = idParamSchema.safeParse({ id })
  if (!validation.success) {
    return NextResponse.json(
      { error: 'অবৈধ চ্যালেঞ্জ ID' },
      { status: 400 }
    )
  }
  
  try {
    // ─── Query optimization: Select only needed fields, hide test case outputs ─
    const challenge = await prisma.codeChallenge.findUnique({
      where: { id },
      select: {
        id: true,
        tutorialId: true,
        titleBn: true,
        titleEn: true,
        descriptionBn: true,
        descriptionEn: true,
        starterCodeBn: true,
        starterCodeEn: true,
        language: true,
        difficulty: true,
        createdAt: true,
        // ─── Exclude solution from client-side response ──────────────────────
        // solution field is intentionally not selected for security
        testCases: {
          // Hidden test cases must never reach the client — even their input
          // can be used to reverse-engineer the expected output.
          where: { isHidden: false },
          select: {
            id: true,
            input: true,
            // expectedOutput / isHidden intentionally not selected.
          },
          orderBy: { id: 'asc' },
        },
      },
    })
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'চ্যালেঞ্জ পাওয়া যায়নি' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Challenge fetch error:', error)
    return NextResponse.json(
      { error: 'চ্যালেঞ্জ লোড করতে সমস্যা হচ্ছে' },
      { status: 500 }
    )
  }
}
