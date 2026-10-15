import { NextRequest, NextResponse } from 'next/server'
import { generateText } from '@/lib/ai/gemini'
import { REFERENCE_SYSTEM_PROMPT, buildReferenceUserPrompt } from '@/lib/ai/prompts/reference'
import { parseReferences, looksLikeValidReferenceFormat } from '@/lib/ai/validators-reference'

/**
 * POST /api/admin/ai/generate-reference
 * Gemini API-কে কল দিয়ে কুইক-রেফারেন্স জেনারেট করে
 */
export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY সেট করা নেই। .env ফাইলে যোগ করুন।' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const {
      topic,
      tutorialTitle,
      language = 'js',
      scope = 'Intermediate',
      count = 3,
      extraInstructions = '',
    } = body

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

    const userPrompt = buildReferenceUserPrompt({
      topic: String(topic).trim(),
      tutorialTitle: String(tutorialTitle).trim(),
      language: String(language).trim(),
      scope: String(scope).trim(),
      count: numCount,
      extraInstructions: extraInstructions ? String(extraInstructions).trim() : undefined,
    })

    let rawOutput = ''
    let parsed = { references: [], errors: [] as any[] }
    let attempts = 0
    const maxAttempts = 2

    while (attempts < maxAttempts) {
      attempts++
      try {
        rawOutput = await generateText({
          systemPrompt: REFERENCE_SYSTEM_PROMPT,
          userPrompt,
          temperature: 0.4,
          maxOutputTokens: 8192,
        })

        if (!looksLikeValidReferenceFormat(rawOutput)) {
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

        parsed = parseReferences(rawOutput) as any

        if (parsed.references.length === numCount && parsed.errors.length === 0) {
          break
        }

        if (attempts === maxAttempts) {
          if (parsed.references.length > 0) {
            return NextResponse.json({
              success: true,
              references: parsed.references,
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
      references: parsed.references,
      warnings: parsed.errors,
      raw: rawOutput,
      attempts,
    })
  } catch (e: any) {
    console.error('AI reference generate error:', e)
    return NextResponse.json(
      { error: e?.message || 'সার্ভার সমস্যা' },
      { status: 500 }
    )
  }
}
