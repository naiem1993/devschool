/**
 * lib/piston-api.ts
 * Piston API client — ব্রাউজারে যেসব ভাষা চলে না (Python, Java, C++, etc.)
 * সেগুলো এই free API দিয়ে remote server-এ execute করা হয়।
 *
 * API: https://emkc.org/api/v2/piston/execute
 * কোনো API key লাগে না, fair-use limit।
 */

import { getErrorMessage } from './api-error'

export type SupportedLanguage =
  | 'js'
  | 'ts'
  | 'html'
  | 'css'
  | 'python'
  | 'java'
  | 'cpp'
  | 'c'
  | 'go'
  | 'rust'
  | 'php'
  | 'csharp'
  | 'kotlin'
  | 'swift'

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  js: 'JavaScript',
  ts: 'TypeScript',
  html: 'HTML',
  css: 'CSS',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
  csharp: 'C#',
  kotlin: 'Kotlin',
  swift: 'Swift',
}

/** ব্রাউজারে চলে এমন ভাষা */
export const BROWSER_LANGUAGES: SupportedLanguage[] = ['js', 'ts', 'html', 'css']

/** Piston API-তে চলে এমন ভাষা */
export const REMOTE_LANGUAGES: SupportedLanguage[] = [
  'python',
  'java',
  'cpp',
  'c',
  'go',
  'rust',
  'php',
  'csharp',
  'kotlin',
  'swift',
]

/** Piston API-এর ভাষা ম্যাপিং (ভার্সন সহ) */
const PISTON_LANG_MAP: Record<string, { language: string; version: string }> = {
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.68.2' },
  php: { language: 'php', version: '8.2.3' },
  csharp: { language: 'csharp', version: '6.12.0' },
  kotlin: { language: 'kotlin', version: '1.8.20' },
  swift: { language: 'swift', version: '5.3.3' },
}

export type PistonResult = {
  output: string
  error?: string
}

/**
 * Piston API দিয়ে কোড execute করা
 */
export async function runInPiston(
  language: SupportedLanguage,
  code: string,
  stdin: string = '',
  timeoutMs: number = 5000
): Promise<PistonResult> {
  const mapping = PISTON_LANG_MAP[language]
  if (!mapping) {
    return { output: '', error: `অসমর্থিত ভাষা: ${language}` }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs + 3000)

  try {
    const res = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        language: mapping.language,
        version: mapping.version,
        files: [{ content: code }],
        stdin,
        run_timeout: timeoutMs,
        compile_timeout: 10000,
      }),
    })

    clearTimeout(timer)

    if (!res.ok) {
      return {
        output: '',
        error: `Piston API সমস্যা (status ${res.status})। কিছুক্ষণ পর আবার চেষ্টা করুন।`,
      }
    }

    const data = await res.json()

    // compile error থাকলে
    if (data.compile && data.compile.code !== 0) {
      return {
        output: '',
        error: `Compile error:\n${data.compile.stderr || data.compile.output}`,
      }
    }

    // run stage
    if (data.run) {
      if (data.run.code !== 0 && data.run.stderr) {
        return {
          output: data.run.stdout || '',
          error: data.run.stderr,
        }
      }
      return { output: data.run.stdout || '' }
    }

    return { output: '', error: 'Piston API থেকে অপ্রত্যাশিত response' }
  } catch (e: unknown) {
    clearTimeout(timer)
    if (e instanceof Error && e.name === 'AbortError') {
      return { output: '', error: `Time limit exceeded (${Math.round(timeoutMs / 1000)}s)` }
    }
    return {
      output: '',
      error: `Network সমস্যা: ${getErrorMessage(e) || 'Piston API-তে পৌঁছানো যাচ্ছে না'}`,
    }
  }
}

/**
 * একটি ভাষা ব্রাউজারে চলে কি না
 */
export function isBrowserLanguage(lang: string): boolean {
  return (BROWSER_LANGUAGES as string[]).includes(lang)
}

/**
 * একটি ভাষা remote API-তে চলে কি না
 */
export function isRemoteLanguage(lang: string): boolean {
  return (REMOTE_LANGUAGES as string[]).includes(lang)
}
