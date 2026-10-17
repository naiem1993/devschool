/**
 * lib/html-css-sandbox.ts
 * HTML/CSS চ্যালেঞ্জের জন্য DOM-based sandbox।
 *
 * ইউজারের HTML/CSS কোড একটি sandboxed iframe-এ render হয়,
 * তারপর CSS selector + assertion দিয়ে চেক করা হয়।
 *
 * Test Case ফরম্যাট:
 *   selector | text = expected text
 *   selector | attr-href = url
 *   selector | exists
 *   selector | count = 3
 *   selector | html = <h1>Hello</h1>
 */

import { getErrorMessage } from './api-error'

export type HtmlTestType = 'text' | 'exists' | 'count' | 'html' | 'attribute'

export type ParsedHtmlTest = {
  selector: string
  type: HtmlTestType
  value: string
  attributeName?: string // attr-href এর জন্য
}

export type HtmlTestResult = {
  passed: boolean
  message: string
}

/**
 * একটি HTML/CSS test case পার্স করা
 * Format: "selector | type = value" বা "selector | exists"
 */
export function parseHtmlTest(raw: string): ParsedHtmlTest | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const parts = trimmed.split('|').map((s) => s.trim())
  if (parts.length < 2) return null

  const selector = parts[0]
  const assertion = parts[1]

  // "exists" টাইপ
  if (/^exists$/i.test(assertion)) {
    return { selector, type: 'exists', value: '' }
  }

  // "type = value" টাইপ
  const eqIdx = assertion.indexOf('=')
  if (eqIdx === -1) return null

  const key = assertion.slice(0, eqIdx).trim().toLowerCase()
  const value = assertion.slice(eqIdx + 1).trim()

  if (key === 'text') {
    return { selector, type: 'text', value }
  }
  if (key === 'count') {
    return { selector, type: 'count', value }
  }
  if (key === 'html') {
    return { selector, type: 'html', value }
  }
  // attr-xxx ফরম্যাট (attr-href, attr-src, attr-alt ইত্যাদি)
  if (key.startsWith('attr-')) {
    return {
      selector,
      type: 'attribute',
      attributeName: key.slice(5),
      value,
    }
  }

  return null
}

/**
 * একটি HTML test চেক করা (DOM element-এ)
 */
export function evaluateHtmlTest(
  test: ParsedHtmlTest,
  iframeDoc: Document
): HtmlTestResult {
  try {
    const elements = iframeDoc.querySelectorAll(test.selector)

    // exists check
    if (test.type === 'exists') {
      return {
        passed: elements.length > 0,
        message:
          elements.length > 0
            ? `✅ <${test.selector}> element পাওয়া গেছে`
            : `❌ <${test.selector}> element পাওয়া যায়নি`,
      }
    }

    // count check
    if (test.type === 'count') {
      const expected = parseInt(test.value, 10)
      const actual = elements.length
      return {
        passed: actual === expected,
        message:
          actual === expected
            ? `✅ ${test.selector}: ${actual}টি পাওয়া গেছে (প্রত্যাশিত ${expected})`
            : `❌ ${test.selector}: পাওয়া গেছে ${actual}টি, প্রত্যাশিত ছিল ${expected}টি`,
      }
    }

    // element না থাকলে বাকিগুলো fail
    if (elements.length === 0) {
      return {
        passed: false,
        message: `❌ ${test.selector} element পাওয়া যায়নি`,
      }
    }

    const el = elements[0] as HTMLElement

    // text check (trim করে compare)
    if (test.type === 'text') {
      const actual = (el.textContent || '').trim()
      const expected = test.value.trim()
      return {
        passed: actual === expected,
        message:
          actual === expected
            ? `✅ টেক্সট মিলেছে: "${actual}"`
            : `❌ টেক্সট মেলেনি। পাওয়া গেছে: "${actual}", প্রত্যাশিত: "${expected}"`,
      }
    }

    // html check (innerHTML compare, whitespace normalize)
    if (test.type === 'html') {
      const normalize = (s: string) => s.replace(/\s+/g, ' ').trim()
      const actual = normalize(el.innerHTML)
      const expected = normalize(test.value)
      return {
        passed: actual === expected,
        message:
          actual === expected
            ? `✅ HTML মিলেছে`
            : `❌ HTML মেলেনি।\nপাওয়া গেছে: ${actual}\nপ্রত্যাশিত: ${expected}`,
      }
    }

    // attribute check
    if (test.type === 'attribute' && test.attributeName) {
      const actual = el.getAttribute(test.attributeName) || ''
      const expected = test.value
      return {
        passed: actual === expected,
        message:
          actual === expected
            ? `✅ ${test.attributeName}="${actual}" মিলেছে`
            : `❌ ${test.attributeName} মেলেনি। পাওয়া গেছে: "${actual}", প্রত্যাশিত: "${expected}"`,
      }
    }

    return { passed: false, message: `❌ অজানা test type` }
  } catch (e: unknown) {
    return {
      passed: false,
      message: `❌ Selector ভুল: ${test.selector} — ${getErrorMessage(e)}`,
    }
  }
}

/**
 * CSS property check (computed style)
 * Format: "selector | style-color = rgb(34, 197, 94)"
 */
export type ParsedCssTest = {
  selector: string
  property: string
  value: string
}

export function parseCssTest(raw: string): ParsedCssTest | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const parts = trimmed.split('|').map((s) => s.trim())
  if (parts.length < 2) return null

  const selector = parts[0]
  const assertion = parts[1]

  const eqIdx = assertion.indexOf('=')
  if (eqIdx === -1) return null

  const key = assertion.slice(0, eqIdx).trim().toLowerCase()
  const value = assertion.slice(eqIdx + 1).trim()

  if (!key.startsWith('style-')) return null

  return {
    selector,
    property: key.slice(6), // 'style-color' → 'color'
    value,
  }
}

export function evaluateCssTest(
  test: ParsedCssTest,
  iframeWindow: Window
): HtmlTestResult {
  try {
    const iframeDoc = iframeWindow.document
    const elements = iframeDoc.querySelectorAll(test.selector)

    if (elements.length === 0) {
      return {
        passed: false,
        message: `❌ ${test.selector} element পাওয়া যায়নি`,
      }
    }

    const el = elements[0] as HTMLElement
    const computed = iframeWindow.getComputedStyle(el)
    const actual = (computed as any)[test.property] as string

    // normalize color values (rgb vs hex)
    const normalize = (v: string) => v.replace(/\s+/g, '').toLowerCase()
    const passed = normalize(actual) === normalize(test.value)

    return {
      passed,
      message: passed
        ? `✅ ${test.selector} { ${test.property}: ${actual} } মিলেছে`
        : `❌ ${test.selector} { ${test.property} } মেলেনি। পাওয়া গেছে: "${actual}", প্রত্যাশিত: "${test.value}"`,
    }
  } catch (e: unknown) {
    return {
      passed: false,
      message: `❌ CSS check ব্যর্থ: ${getErrorMessage(e)}`,
    }
  }
}
