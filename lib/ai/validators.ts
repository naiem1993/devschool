// ============================================================
//  AI Challenge Output Parser & Validator
//  AI-এর লিখা টেক্সট পার্স করে চেক করে সব ঠিক আছে কি না
//  Format: STARTER_BN / STARTER_EN / SOLUTION_BN / SOLUTION_EN
// ============================================================

export type ParsedTestCase = {
  input: string
  expectedOutput: string
  isHidden: boolean
}

export type ParsedChallenge = {
  titleBn: string
  titleEn: string
  descriptionBn: string
  descriptionEn: string
  difficulty: string
  points: number
  starterCodeBn: string
  starterCodeEn: string
  solutionBn: string
  solutionEn: string
  testCases: ParsedTestCase[]
}

export type ValidationError = { block: number; message: string }
export type ParseResult = {
  challenges: ParsedChallenge[]
  errors: ValidationError[]
}

// ── Helpers ────────────────────────────────────────────────
function splitPair(raw: string): [string, string] {
  const idx = raw.indexOf('||')
  if (idx === -1) return [raw.trim(), raw.trim()]
  return [raw.slice(0, idx).trim(), raw.slice(idx + 2).trim()]
}

function parseTestCase(body: string): { input: string; expectedOutput: string } | null {
  const idx = body.indexOf('=>')
  if (idx === -1) return null
  const input = body.slice(0, idx).trim()
  const output = body.slice(idx + 2).trim()
  if (!input || !output) return null
  return { input, expectedOutput: output }
}

// ── Main Parser ────────────────────────────────────────────
export function parseChallenges(text: string): ParseResult {
  const challenges: ParsedChallenge[] = []
  const errors: ValidationError[] = []

  // AI-এর লিখা পরিষ্কার করা — সম্ভাব্য markdown fences সরানো
  const cleaned = text
    .replace(/```[a-z]*\n/g, '')
    .replace(/```\n?/g, '')
    .trim()

  // ---CHALLENGE--- দিয়ে ব্লক ভাগ করা
  const blocks = cleaned
    .split(/^---CHALLENGE---\s*$/m)
    .map((b) => b.trim())
    .filter(Boolean)

  if (blocks.length === 0) {
    errors.push({ block: 0, message: 'কোনো ---CHALLENGE--- ব্লক পাওয়া যায়নি' })
    return { challenges, errors }
  }

  blocks.forEach((block, idx) => {
    const blockNo = idx + 1
    const lines = block.split(/\r?\n/)

    let titleBn = ''
    let titleEn = ''
    let descBn = ''
    let descEn = ''
    let difficulty = 'Easy'
    let points = 0
    const testCases: ParsedTestCase[] = []

    type Mode = 'normal' | 'starterBn' | 'starterEn' | 'solutionBn' | 'solutionEn'
    let mode: Mode = 'normal'
    const starterBnLines: string[] = []
    const starterEnLines: string[] = []
    const solutionBnLines: string[] = []
    const solutionEnLines: string[] = []

    for (const rawLine of lines) {
      const line = rawLine
      const trimmed = line.trim()

      // কোড ব্লক মোড — original line সংরক্ষণ করব
      if (mode !== 'normal') {
        if (trimmed === 'END') {
          mode = 'normal'
        } else {
          if (mode === 'starterBn') starterBnLines.push(line)
          else if (mode === 'starterEn') starterEnLines.push(line)
          else if (mode === 'solutionBn') solutionBnLines.push(line)
          else if (mode === 'solutionEn') solutionEnLines.push(line)
        }
        continue
      }

      if (!trimmed) continue

      if (/^TITLE\s*:/i.test(trimmed)) {
        const body = trimmed.replace(/^TITLE\s*:\s*/i, '')
        const [bn, en] = splitPair(body)
        titleBn = bn
        titleEn = en
      } else if (/^DESC\s*:/i.test(trimmed)) {
        const body = trimmed.replace(/^DESC\s*:\s*/i, '')
        const [bn, en] = splitPair(body)
        descBn = bn
        descEn = en
      } else if (/^LEVEL\s*:/i.test(trimmed)) {
        const val = trimmed.replace(/^LEVEL\s*:\s*/i, '').trim()
        difficulty = /^(Easy|Medium|Hard)$/i.test(val)
          ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
          : 'Easy'
      } else if (/^POINTS\s*:/i.test(trimmed)) {
        points = Number(trimmed.replace(/^POINTS\s*:\s*/i, '').trim()) || 0
      } else if (/^STARTER_BN\s*:/i.test(trimmed)) {
        mode = 'starterBn'
      } else if (/^STARTER_EN\s*:/i.test(trimmed)) {
        mode = 'starterEn'
      } else if (/^SOLUTION_BN\s*:/i.test(trimmed)) {
        mode = 'solutionBn'
      } else if (/^SOLUTION_EN\s*:/i.test(trimmed)) {
        mode = 'solutionEn'
      } else if (/^TEST_HIDDEN\s*:/i.test(trimmed)) {
        const body = trimmed.replace(/^TEST_HIDDEN\s*:\s*/i, '')
        const tc = parseTestCase(body)
        if (tc) testCases.push({ ...tc, isHidden: true })
      } else if (/^TEST\s*:/i.test(trimmed)) {
        const body = trimmed.replace(/^TEST\s*:\s*/i, '')
        const tc = parseTestCase(body)
        if (tc) testCases.push({ ...tc, isHidden: false })
      }
    }

    const starterCodeBn = starterBnLines.join('\n').trim()
    const starterCodeEn = starterEnLines.join('\n').trim()
    const solutionBn = solutionBnLines.join('\n').trim()
    const solutionEn = solutionEnLines.join('\n').trim()

    // ── Validation ──
    if (!titleBn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: বাংলা TITLE নেই` })
      return
    }
    if (!titleEn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: ইংরেজি TITLE নেই (|| দিয়ে আলাদা করুন)` })
      return
    }
    if (!descBn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: বাংলা DESC নেই` })
      return
    }
    if (!descEn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: ইংরেজি DESC নেই` })
      return
    }
    if (!starterCodeBn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: STARTER_BN কোড নেই` })
      return
    }
    if (!starterCodeEn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: STARTER_EN কোড নেই` })
      return
    }
    if (!solutionBn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: SOLUTION_BN কোড নেই` })
      return
    }
    if (!solutionEn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: SOLUTION_EN কোড নেই` })
      return
    }
    if (testCases.filter((t) => !t.isHidden).length < 2) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: কমপক্ষে ২টি দৃশ্যমান TEST দরকার` })
      return
    }
    if (testCases.filter((t) => t.isHidden).length < 1) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: কমপক্ষে ১টি TEST_HIDDEN দরকার` })
      return
    }

    challenges.push({
      titleBn,
      titleEn,
      descriptionBn: descBn,
      descriptionEn: descEn,
      difficulty,
      points,
      starterCodeBn,
      starterCodeEn,
      solutionBn,
      solutionEn,
      testCases,
    })
  })

  return { challenges, errors }
}

// ── Quick check: AI output ফরম্যাটে আছে কি না ────────────────
export function looksLikeValidFormat(text: string): boolean {
  return /---CHALLENGE---/.test(text) && /TITLE\s*:/i.test(text) && /TEST\s*:/i.test(text)
}
