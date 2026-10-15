import { NextRequest, NextResponse } from 'next/server'
import { generateText } from '@/lib/ai/gemini'
import { QUIZ_SYSTEM_PROMPT, buildQuizUserPrompt } from '@/lib/ai/prompts/quiz'
import { parseQuizzes, looksLikeValidQuizFormat } from '@/lib/ai/validators-quiz'

/**
 * POST /api/admin/ai/generate-quiz
 * Gemini API-কে কল দিয়ে কুইজ জেনারেট করে
 */
export async function POST(req: NextRequest) {
  try {
    // ── API Key চেক ──
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY সেট করা নেই। .env ফাইলে যোগ করুন।' },
        { status: 500 }
      )
    }

    // ── Input পার্স ──
    const body = await req.json()
    const {
      topic,
      tutorialTitle,
      scope = 'Intermediate',
      count = 3,
      difficulty = 'Mixed',
      extraInstructions = '',
    } = body

    // ── Validation ──
    if (!topic || !String(topic).trim()) {
      return NextResponse.json({ error: 'Topic দরকার' }, { status: 400 })
    }
    if (!tutorialTitle || !String(tutorialTitle).trim()) {
      return NextResponse.json({ error: 'Tutorial দরকার' }, { status: 400 })
    }
    const numCount = Number(count)
    if (isNaN(numCount) || numCount < 1 || numCount > 10) {
      return NextResponse.json(
        { error: 'Count ১ থেকে ১০ এর মধ্যে হতে হবে' },
        { status: 400 }
      )
    }

    // ── User Prompt তৈরি ──
    const userPrompt = buildQuizUserPrompt({
      topic: String(topic).trim(),
      tutorialTitle: String(tutorialTitle).trim(),
      scope: String(scope).trim(),
      count: numCount,
      difficulty: String(difficulty).trim(),
      extraInstructions: extraInstructions ? String(extraInstructions).trim() : undefined,
    })

    // ── Attempt loop ──
    let rawOutput = ''
    let parsed = { quizzes: [], errors: [] as any[] }
    let attempts = 0
    const maxAttempts = 2

    while (attempts < maxAttempts) {
      attempts++
      try {
        rawOutput = await generateText({
          systemPrompt: QUIZ_SYSTEM_PROMPT,
          userPrompt,
          temperature: 0.4,
          maxOutputTokens: 8192,
        })

        if (!looksLikeValidQuizFormat(rawOutput)) {
          if (attempts === maxAttempts) {
            return NextResponse.json(
              {
                error:
                  'AI সঠিক ফরম্যাটে লিখতে পারেনি। টপিক আরও নির্দিষ্ট করে আবার চেষ্টা করুন।',
                raw: rawOutput.slice(0, 500),
              },
              { status: 422 }
            )
          }
          continue
        }

        parsed = parseQuizzes(rawOutput) as any

        if (parsed.quizzes.length === numCount && parsed.errors.length === 0) {
          break
        }

        if (attempts === maxAttempts) {
          if (parsed.quizzes.length > 0) {
            return NextResponse.json({
              success: true,
              quizzes: parsed.quizzes,
              warnings: parsed.errors,
              raw: rawOutput,
              attempts,
            })
          }
          return NextResponse.json(
            {
              error: 'AI-এর আউটপুট ভ্যালিডেট করা যায়নি',
              details: parsed.errors,
              raw: rawOutput.slice(0, 500),
            },
            { status: 422 }
          )
        }
      } catch (geminiError: any) {
        const msg = geminiError?.message || ''
        if (msg.includes('API_KEY') || msg.includes('API key')) {
          return NextResponse.json(
            { error: 'Gemini API Key সঠিক নয়। .env চেক করুন।' },
            { status: 401 }
          )
        }
        if (msg.includes('quota') || msg.includes('RATE') || msg.includes('429')) {
          return NextResponse.json(
            { error: 'Rate limit শেষ। ১ মিনিট পর আবার চেষ্টা করুন।' },
            { status: 429 }
          )
        }
        if (attempts === maxAttempts) {
          return NextResponse.json(
            { error: `Gemini API সমস্যা: ${msg}` },
            { status: 500 }
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      quizzes: parsed.quizzes,
      warnings: parsed.errors,
      raw: rawOutput,
      attempts,
    })
  } catch (e: any) {
    console.error('AI quiz generate error:', e)
    return NextResponse.json(
      { error: e?.message || 'সার্ভার সমস্যা' },
      { status: 500 }
    )
  }
}
