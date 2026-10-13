import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Gemini API ক্লায়েন্ট (singleton)
 * Free tier: 15 requests/min, 1500 requests/day
 */

if (!process.env.GEMINI_API_KEY) {
  console.warn('[gemini] GEMINI_API_KEY is missing in .env')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

/**
 * সাধারণ টেক্সট জেনারেশনের জন্য মডেল
 * temperature কম = consistent output
 */
export function getGeminiModel(options?: {
  temperature?: number
  maxOutputTokens?: number
}) {
  return genAI.getGenerativeModel({
    model: 'gemini-flash-lite-latest',
    generationConfig: {
      temperature: options?.temperature ?? 0.4,
      maxOutputTokens: options?.maxOutputTokens ?? 8192,
      topP: 0.8,
      topK: 40,
    },
  })
}

/**
 * Gemini-কে কল করে টেক্সট জেনারেট করা
 */
export async function generateText({
  systemPrompt,
  userPrompt,
  temperature = 0.4,
  maxOutputTokens = 8192,
}: {
  systemPrompt: string
  userPrompt: string
  temperature?: number
  maxOutputTokens?: number
}): Promise<string> {
  const model = getGeminiModel({ temperature, maxOutputTokens })
  const result = await model.generateContent([
    { text: systemPrompt },
    { text: userPrompt },
  ])
  const response = result.response
  return response.text()
}
