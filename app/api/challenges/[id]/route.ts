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
        title: true,
        description: true,
        starterCode: true,
        difficulty: true,
        createdAt: true,
        // ─── Exclude solution from client-side response ──────────────────────
        // solution field is intentionally not selected for security
        testCases: {
          select: {
            id: true,
            input: true,
            // isHidden test cases don't expose expectedOutput to client
            // Omitting expectedOutput — not selected = not sent to client
            isHidden: true,
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
      include: {
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
    const results = challenge.testCases.map((testCase: any) => ({
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
