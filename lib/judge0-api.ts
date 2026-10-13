/**
 * lib/judge0-api.ts
 * Judge0 CE API client — Piston-এর ফ্রি বিকল্প।
 * Auth ছাড়াই ৬০+ ভাষায় কোড রান করা যায়।
 *
 * API Base: https://ce.judge0.com
 */

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

export const BROWSER_LANGUAGES: SupportedLanguage[] = ['js', 'ts', 'html', 'css']
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

/** Judge0 CE-এর জন্য ভাষা ম্যাপিং (নামের বদলে language_id ব্যবহার করতে হবে) */
const JUDGE0_LANG_ID_MAP: Record<string, number> = {
  python: 71, // Python 3.8.1
  java: 62,   // Java (OpenJDK 13.0.1)
  cpp: 54,    // C++ (GCC 9.2.0)
  c: 50,      // C (GCC 9.2.0)
  go: 60,     // Go (1.13.5)
  rust: 73,   // Rust (1.40.0)
  php: 68,    // PHP (7.4.1)
  csharp: 51, // C# (Mono 6.6.0.161)
  kotlin: 78, // Kotlin (1.3.70)
  swift: 83,  // Swift (5.2.3)
}

export type Judge0Result = {
  output: string
  error?: string
}

/**
 * Judge0 CE-তে কোড সাবমিট করে রেজাল্ট পাওয়া
 */
export async function runInJudge0(
  language: SupportedLanguage,
  code: string,
  stdin: string = '',
  timeoutMs: number = 5000
): Promise<Judge0Result> {
  const languageId = JUDGE0_LANG_ID_MAP[language]
  if (!languageId) {
    return { output: '', error: `Judge0-তে অসমর্থিত ভাষা: ${language}` }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs + 5000)

  try {
    // ১. সাবমিশন তৈরি করা
    const submitRes = await fetch(
      'https://ce.judge0.com/submissions?base64_encoded=false&wait=false',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          language_id: languageId,
          source_code: code,
          stdin: stdin,
          cpu_time_limit: Math.ceil(timeoutMs / 1000),
          wall_time_limit: Math.ceil(timeoutMs / 1000) + 1,
        }),
      }
    )

    if (!submitRes.ok) {
      clearTimeout(timer)
      return {
        output: '',
        error: `Judge0 সাবমিশন ব্যর্থ (status ${submitRes.status})। আবার চেষ্টা করুন।`,
      }
    }

    const submitData = await submitRes.json()
    const token = submitData.token

    if (!token) {
      clearTimeout(timer)
      return { output: '', error: 'Judge0 টোকেন পাওয়া যায়নি' }
    }

    // ২. রেজাল্টের জন্য পোল করা (In Queue = 1, Processing = 2)
    let resultData: any = null
    const pollStart = Date.now()

    while (Date.now() - pollStart < timeoutMs + 3000) {
      await new Promise((r) => setTimeout(r, 500))

      const pollRes = await fetch(
        `https://ce.judge0.com/submissions/${token}?base64_encoded=false`,
        { signal: controller.signal }
      )

      if (!pollRes.ok) continue

      const data = await pollRes.json()
      const statusId = data.status?.id

      // 1 = In Queue, 2 = Processing
      if (statusId !== 1 && statusId !== 2) {
        resultData = data
        break
      }
    }

    clearTimeout(timer)

    if (!resultData) {
      return { output: '', error: 'Judge0 থেকে সময়ের মধ্যে রেজাল্ট পাওয়া যায়নি' }
    }

    const statusId = resultData.status?.id

    // 3 = Accepted (সফল)
    if (statusId === 3) {
      return { output: resultData.stdout || '' }
    }

    // 6 = Compilation Error
    if (statusId === 6) {
      return {
        output: '',
        error: `Compile error:\n${resultData.compile_output || 'Unknown'}`,
      }
    }

    // 11 = NZEC (Runtime error) বা অন্য এরর
    return {
      output: resultData.stdout || '',
      error: resultData.stderr || resultData.message || `Runtime error (status ${statusId})`,
    }
  } catch (e: any) {
    clearTimeout(timer)
    if (e?.name === 'AbortError') {
      return { output: '', error: `Time limit exceeded` }
    }
    return {
      output: '',
      error: `Network সমস্যা: ${e?.message || 'Judge0-তে পৌঁছানো যাচ্ছে না'}`,
    }
  }
}

export function isBrowserLanguage(lang: string): boolean {
  return (BROWSER_LANGUAGES as string[]).includes(lang)
}

export function isRemoteLanguage(lang: string): boolean {
  return (REMOTE_LANGUAGES as string[]).includes(lang)
}
