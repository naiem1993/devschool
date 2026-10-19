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

/**
 * POST /api/challenges/[id]/run
 * Runs a challenge with test cases (server-side only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  // Validate ID
  const validation = idParamSchema.safeParse({ id })
  if (!validation.success) {
    return NextResponse.json(
      { error: 'অবৈধ চ্যালেঞ্জ ID' },
      { status: 400 }
    )
  }
  
  try {
    const body = await request.json()
    
    // ─── Validate code input (basic check) ───────────────────────────────────
    if (!body.code || typeof body.code !== 'string') {
      return NextResponse.json(
        { error: 'কোড প্রদান করুন' },
        { status: 400 }
      )
    }
    
    // ─── Fetch challenge with hidden test cases ──────────────────────────────
    const challenge = await prisma.codeChallenge.findUnique({
      where: { id },
      select: {
        id: true,
        tutorialId: true,
        starterCodeBn: true,
        starterCodeEn: true,
        solutionBn: true,
        solutionEn: true,
        difficulty: true,
        testCases: {
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
    
    // ─── Execute code against test cases (simplified for example) ────────────
    // In production, use a secure code execution service
    const results = challenge.testCases.map((testCase) => ({
      testCaseId: testCase.id,
      passed: false, // Placeholder - actual execution logic goes here
      output: '',
      errorMessage: null,
    }))
    
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Challenge run error:', error)
    return NextResponse.json(
      { error: 'চ্যালেঞ্জ রান করতে সমস্যা হচ্ছে' },
      { status: 500 }
    )
  }
}
