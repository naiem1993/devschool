import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { idParamSchema } from '@/lib/validators'

/**
 * GET /api/quizzes/[id]
 * Fetches quiz questions for a tutorial
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
      { error: 'অবৈধ টিউটোরিয়াল ID' },
      { status: 400 }
    )
  }
  
  try {
    // ─── Query optimization: Select only quiz-related fields ─────────────────
    const quizQuestions = await prisma.quizQuestion.findMany({
      where: { tutorialId: id },
      select: {
        id: true,
        question: true,
        explanation: true,
        options: {
          select: {
            id: true,
            text: true,
            // Don't expose isCorrect to client — simply omit it from select
          },
          orderBy: { id: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    })
    
    return NextResponse.json({
      questions: quizQuestions,
      total: quizQuestions.length,
    })
  } catch (error) {
    console.error('Quiz fetch error:', error)
    return NextResponse.json(
      { error: 'কুইজ লোড করতে সমস্যা হচ্ছে' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/quizzes/[id]/submit
 * Submits quiz answers
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
      { error: 'অবৈধ টিউটোরিয়াল ID' },
      { status: 400 }
    )
  }
  
  try {
    const body = await request.json()
    
    // ─── Validate answers format ─────────────────────────────────────────────
    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: 'উত্তর প্রদান করুন' },
        { status: 400 }
      )
    }
    
    // ─── Fetch questions with correct answers (server-side only) ─────────────
    const questions = await prisma.quizQuestion.findMany({
      where: { tutorialId: id },
      include: {
        options: {
          select: {
            id: true,
            text: true,
            isCorrect: true,
          },
        },
      },
    })
    
    // ─── Calculate score ─────────────────────────────────────────────────────
    let score = 0
    const results = questions.map((q: any) => {
      const userAnswer = body.answers.find((a: any) => a.questionId === q.id)
      const correctOption = q.options.find((o: any) => o.isCorrect)
      const isCorrect = userAnswer?.optionId === correctOption?.id
      
      if (isCorrect) score++
      
      return {
        questionId: q.id,
        isCorrect,
        correctAnswer: correctOption?.text,
      }
    })
    
    return NextResponse.json({
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      results,
    })
  } catch (error) {
    console.error('Quiz submit error:', error)
    return NextResponse.json(
      { error: 'কুইজ সাবমিট করতে সমস্যা হচ্ছে' },
      { status: 500 }
    )
  }
}
