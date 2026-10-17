import { NextRequest, NextResponse } from 'next/server'
import { generateText } from '@/lib/ai/gemini'
import { getErrorMessage, serverError } from '@/lib/api-error'
import {
  CHALLENGE_SYSTEM_PROMPT,
  buildChallengeUserPrompt,
} from '@/lib/ai/prompts/challenge'
import { parseChallenges, looksLikeValidFormat } from '@/lib/ai/validators'

/**
 * POST /api/admin/ai/generate-challenge
 * Gemini API-কে কল দিয়ে চ্যালেঞ্জ জেনারেট করে
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
      language = 'js',
      scope = 'Intermediate',
      count = 3,
      difficulty = 'Mixed',
      visibleTests = 2,
      hiddenTests = 1,
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
    const userPrompt = buildChallengeUserPrompt({
      topic: String(topic).trim(),
      tutorialTitle: String(tutorialTitle).trim(),
      language: String(language).trim(),
      scope: String(scope).trim(),
      count: numCount,
      difficulty: String(difficulty).trim(),
      visibleTests: Number(visibleTests) || 2,
      hiddenTests: Number(hiddenTests) || 1,
      extraInstructions: extraInstructions ? String(extraInstructions).trim() : undefined,
    })

    // ── First attempt ──
    let rawOutput = ''
    let parsed = { challenges: [], errors: [] as any[] }
    let attempts = 0
    const maxAttempts = 2

    while (attempts < maxAttempts) {
      attempts++
      try {
        rawOutput = await generateText({
          systemPrompt: CHALLENGE_SYSTEM_PROMPT,
          userPrompt,
          temperature: 0.4,
          maxOutputTokens: 8192,
        })

        if (!looksLikeValidFormat(rawOutput)) {
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

        parsed = parseChallenges(rawOutput) as any

        // যদি সব চ্যালেঞ্জ সফলভাবে পার্স হয়, তাহলে লুপ ভাঙব
        if (parsed.challenges.length === numCount && parsed.errors.length === 0) {
          break
        }

        // কিছু এরর থাকলে আবার চেষ্টা করব
        if (attempts === maxAttempts) {
          // শেষ চেষ্টাতেও সমস্যা থাকলে আংশিক সফল রেসপন্স
          if (parsed.challenges.length > 0) {
            return NextResponse.json({
              success: true,
              challenges: parsed.challenges,
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
      } catch (geminiError: unknown) {
        // Gemini API এরর
        const msg = getErrorMessage(geminiError)
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
      challenges: parsed.challenges,
      warnings: parsed.errors,
      raw: rawOutput,
      attempts,
    })
  } catch (e: unknown) {
    return serverError(e, 'ai-generate-challenge')
  }
}
