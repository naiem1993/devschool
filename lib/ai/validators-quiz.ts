// ============================================================
//  AI Quiz Output Parser & Validator
//  AI-এর লিখা টেক্সট পার্স করে চেক করে সব ঠিক আছে কি না
//  Format: Q: ... | A/B/C/D options | E explanation
// ============================================================

export type ParsedQuizOption = {
  textBn: string
  textEn: string
  isCorrect: boolean
}

export type ParsedQuiz = {
  questionBn: string
  questionEn: string
  explanationBn: string
  explanationEn: string
  options: ParsedQuizOption[]
}

export type QuizValidationError = { block: number; message: string }
export type QuizParseResult = {
  quizzes: ParsedQuiz[]
  errors: QuizValidationError[]
}

// ── Helpers ────────────────────────────────────────────────
function splitPair(raw: string): [string, string] {
  const idx = raw.indexOf('|')
  if (idx === -1) return [raw.trim(), raw.trim()]
  return [raw.slice(0, idx).trim(), raw.slice(idx + 1).trim()]
}

// ── Main Parser ────────────────────────────────────────────
export function parseQuizzes(text: string): QuizParseResult {
  const quizzes: ParsedQuiz[] = []
  const errors: QuizValidationError[] = []

  // markdown fence সরানো
  const cleaned = text
    .replace(/```[a-z]*\n/g, '')
    .replace(/```\n?/g, '')
    .trim()

  // --- দিয়ে ব্লক ভাগ করা
  const blocks = cleaned
    .split(/^---\s*$/m)
    .map((b) => b.trim())
    .filter(Boolean)

  if (blocks.length === 0) {
    errors.push({ block: 0, message: 'কোনো কুইজ ব্লক পাওয়া যায়নি' })
    return { quizzes, errors }
  }

  blocks.forEach((block, idx) => {
    const blockNo = idx + 1
    const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)

    let questionBn = ''
    let questionEn = ''
    let explanationBn = ''
    let explanationEn = ''
    const options: ParsedQuizOption[] = []

    lines.forEach((line) => {
      if (/^Q[:\-]/i.test(line)) {
        const body = line.replace(/^Q[:\-]\s*/i, '')
        const [bn, en] = splitPair(body)
        questionBn = bn
        questionEn = en
      } else if (/^[A-D][)\.:\-]/i.test(line)) {
        let body = line.replace(/^[A-D][)\.:\-]\s*/i, '')
        let isCorrect = false
        if (/[✓✔]\s*$/.test(body) || /\*\s*$/.test(body)) {
          isCorrect = true
          body = body.replace(/[✓✔\*]\s*$/, '').trim()
        }
        const [bn, en] = splitPair(body)
        options.push({ textBn: bn, textEn: en, isCorrect })
      } else if (/^E[:\-]/i.test(line)) {
        const body = line.replace(/^E[:\-]\s*/i, '')
        const [bn, en] = splitPair(body)
        explanationBn = bn
        explanationEn = en
      }
    })

    // ── Validation ──
    if (!questionBn) {
      errors.push({ block: blockNo, message: `কুইজ ${blockNo}: Q: লাইন পাওয়া যায়নি` })
      return
    }
    if (options.length < 2) {
      errors.push({ block: blockNo, message: `কুইজ ${blockNo}: অন্তত ২টি অপশন দরকার` })
      return
    }
    if (!options.some((o) => o.isCorrect)) {
      errors.push({ block: blockNo, message: `কুইজ ${blockNo}: সঠিক উত্তরে ✓ চিহ্ন দিন` })
      return
    }

    quizzes.push({
      questionBn,
      questionEn: questionEn || questionBn,
      explanationBn,
      explanationEn,
      options,
    })
  })

  return { quizzes, errors }
}

// ── Quick check: AI output ফরম্যাটে আছে কি না ────────────────
export function looksLikeValidQuizFormat(text: string): boolean {
  return /Q[:\-]/i.test(text) && /^[A-D][)\.:\-]/im.test(text)
}
