/**
 * lib/challenge-runner.ts
 * Multi-language challenge runner — ভাষা বুঝে সঠিক sandbox-এ যায়।
 *
 * • JS/TS      → ব্রাউজার sandbox (sandbox-runner.ts)
 * • HTML       → ব্রাউজার DOM sandbox (html-css-sandbox.ts)
 * • CSS        → ব্রাউজার DOM sandbox (html-css-sandbox.ts)
 * • Python/Java/C++/ইত্যাদি → Piston API (piston-api.ts)
 */

'use client'

import { runInSandbox, TIMEOUT_CHALLENGE_MS } from './sandbox-runner'
import {
  runInJudge0,
  isBrowserLanguage,
  isRemoteLanguage,
  type SupportedLanguage,
} from './judge0-api'
import {
  parseHtmlTest,
  evaluateHtmlTest,
  parseCssTest,
  evaluateCssTest,
} from './html-css-sandbox'
import { getErrorMessage } from './api-error'

export type ChallengeTestCase = {
  id: string
  input: string
  expectedOutput: string
  isHidden: boolean
}

export type ChallengeResult = {
  id: string
  passed: boolean
  output: string
  expected: string
  error?: string
}

/**
 * সব ভাষার জন্য একটি unified entry-point
 */
export async function runChallenge(
  language: string,
  code: string,
  testCases: ChallengeTestCase[],
  solutionCode?: string | null
): Promise<ChallengeResult[]> {
  // ── HTML ──
  if (language === 'html') {
    return runHtmlCssChallenge(code, testCases, 'html')
  }

  // ── CSS ──
  if (language === 'css') {
    return runHtmlCssChallenge(code, testCases, 'css', solutionCode)
  }

  // ── JS / TS (browser) ──
  if (isBrowserLanguage(language)) {
    return runJsLikeChallenge(code, testCases)
  }

  // ── Remote (Python, Java, C++, etc.) ──
  if (isRemoteLanguage(language)) {
    return runRemoteChallenge(language as SupportedLanguage, code, testCases)
  }

  // অজানা ভাষা
  return testCases.map((tc) => ({
    id: tc.id,
    passed: false,
    output: '',
    expected: tc.expectedOutput,
    error: `অসমর্থিত ভাষা: ${language}`,
  }))
}

// ═══════════════════════════════════════════════════
//  JS / TS — browser sandbox
// ═══════════════════════════════════════════════════
async function runJsLikeChallenge(
  code: string,
  testCases: ChallengeTestCase[]
): Promise<ChallengeResult[]> {
  const results: ChallengeResult[] = []

  for (const tc of testCases) {
    try {
      const r = await runInSandbox(code, tc.input, 'challenge', TIMEOUT_CHALLENGE_MS)
      const passed = !r.error && r.output.trim() === tc.expectedOutput.trim()
      results.push({
        id: tc.id,
        passed,
        output: r.output,
        expected: tc.expectedOutput,
        error: r.error,
      })
    } catch (e: unknown) {
      results.push({
        id: tc.id,
        passed: false,
        output: '',
        expected: tc.expectedOutput,
        error: getErrorMessage(e),
      })
    }
  }

  return results
}

// ═══════════════════════════════════════════════════
//  HTML / CSS — DOM sandbox
// ═══════════════════════════════════════════════════
async function runHtmlCssChallenge(
  code: string,
  testCases: ChallengeTestCase[],
  kind: 'html' | 'css',
  cssCode?: string | null
): Promise<ChallengeResult[]> {
  if (typeof window === 'undefined') {
    return testCases.map((tc) => ({
      id: tc.id,
      passed: false,
      output: '',
      expected: tc.expectedOutput,
      error: 'DOM sandbox শুধু ব্রাউজারে চলে',
    }))
  }

  // CSS চ্যালেঞ্জের ক্ষেত্রে code = HTML part, cssCode = CSS part
  const htmlPart = kind === 'css' ? (cssCode || '') : code
  const cssPart = kind === 'css' ? code : ''

  // iframe তৈরি করি — allow-same-origin, কিন্তু allow-scripts নয়
  const iframe = document.createElement('iframe')
  iframe.setAttribute('sandbox', 'allow-same-origin') // scripts disabled
  iframe.style.position = 'absolute'
  iframe.style.left = '-9999px'
  iframe.style.width = '800px'
  iframe.style.height = '600px'

  const docContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">${cssPart ? `<style>${cssPart}</style>` : ''}</head>
<body>${htmlPart}</body>
</html>`

  iframe.srcdoc = docContent

  // load হওয়ার জন্য অপেক্ষা
  await new Promise<void>((resolve) => {
    iframe.onload = () => resolve()
    document.body.appendChild(iframe)
    // সেফটি: ২ সেকেন্ডে force resolve
    setTimeout(resolve, 2000)
  })

  // ⚠️ srcdoc + allow-same-origin — কিছু ব্রাউজারে parent থেকে contentDocument
  // পড়া যায় না, সেক্ষেত্রে postMessage fallback দরকার। এখানে সরাসরি পড়ার
  // চেষ্টা করছি এবং ব্যর্থ হলে error রিপোর্ট করছি।
  const iframeDoc = iframe.contentDocument
  const iframeWindow = iframe.contentWindow

  if (!iframeDoc || !iframeWindow) {
    document.body.removeChild(iframe)
    return testCases.map((tc) => ({
      id: tc.id,
      passed: false,
      output: '',
      expected: tc.expectedOutput,
      error: 'DOM পড়া যায়নি (browser sandbox limitation)',
    }))
  }

  const results: ChallengeResult[] = []

  for (const tc of testCases) {
    // Test case-এর `input` ফিল্ডে assertion থাকে
    // যেমন: "h1 | text = Hello" বা ".box | style-display = flex"

    if (kind === 'html') {
      const parsed = parseHtmlTest(tc.input)
      if (!parsed) {
        results.push({
          id: tc.id,
          passed: false,
          output: '',
          expected: tc.expectedOutput,
          error: `Test format ভুল: ${tc.input}`,
        })
        continue
      }
      const r = evaluateHtmlTest(parsed, iframeDoc)
      results.push({
        id: tc.id,
        passed: r.passed,
        output: r.message,
        expected: tc.expectedOutput,
      })
    } else {
      // CSS — প্রথমে CSS-specific test চেষ্টা, না হলে HTML test-এ fallback
      const cssParsed = parseCssTest(tc.input)
      if (cssParsed) {
        const r = evaluateCssTest(cssParsed, iframeWindow)
        results.push({
          id: tc.id,
          passed: r.passed,
          output: r.message,
          expected: tc.expectedOutput,
        })
        continue
      }
      const htmlParsed = parseHtmlTest(tc.input)
      if (htmlParsed) {
        const r = evaluateHtmlTest(htmlParsed, iframeDoc)
        results.push({
          id: tc.id,
          passed: r.passed,
          output: r.message,
          expected: tc.expectedOutput,
        })
        continue
      }
      results.push({
        id: tc.id,
        passed: false,
        output: '',
        expected: tc.expectedOutput,
        error: `Test format ভুল: ${tc.input}`,
      })
    }
  }

  document.body.removeChild(iframe)
  return results
}

// ═══════════════════════════════════════════════════
//  Remote (Python, Java, C++, etc.) — Piston API
// ═══════════════════════════════════════════════════
async function runRemoteChallenge(
  language: SupportedLanguage,
  code: string,
  testCases: ChallengeTestCase[]
): Promise<ChallengeResult[]> {
  const results: ChallengeResult[] = []

  for (const tc of testCases) {
    try {
      const r = await runInJudge0(language, code, tc.input, TIMEOUT_CHALLENGE_MS)
      const passed = !r.error && r.output.trim() === tc.expectedOutput.trim()
      results.push({
        id: tc.id,
        passed,
        output: r.output,
        expected: tc.expectedOutput,
        error: r.error,
      })
    } catch (e: unknown) {
      results.push({
        id: tc.id,
        passed: false,
        output: '',
        expected: tc.expectedOutput,
        error: getErrorMessage(e),
      })
    }
  }

  return results
}

// ═══════════════════════════════════════════════════
//  Live Preview (HTML/CSS editor-এ preview দেখানোর জন্য)
// ═══════════════════════════════════════════════════
export function buildPreviewDoc(
  language: string,
  code: string,
  htmlPart?: string
): string {
  if (language === 'html') {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;padding:16px;color:#111}</style></head><body>${code}</body></html>`
  }
  if (language === 'css') {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;padding:16px;color:#111}</style><style>${code}</style></head><body>${htmlPart || '<h1>Hello</h1><p>Preview</p><div class="box">Box</div>'}</body></html>`
  }
  return ''
}
