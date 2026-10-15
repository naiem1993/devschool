// ============================================================
//  AI Reference Output Parser & Validator
//  Format: TITLE / SLUG / DESC / SYNTAX_BN/EN / EXAMPLE_BN/EN / TAGS
// ============================================================

export type ParsedReference = {
  language: string
  titleBn: string
  titleEn: string
  slug: string
  descriptionBn: string
  descriptionEn: string
  syntaxBn: string
  syntaxEn: string
  exampleBn: string
  exampleEn: string
  tags: string[]
}

export type ReferenceValidationError = { block: number; message: string }
export type ReferenceParseResult = {
  references: ParsedReference[]
  errors: ReferenceValidationError[]
}

// ── Helpers ────────────────────────────────────────────────
function splitPair(raw: string): [string, string] {
  const idx = raw.indexOf('||')
  if (idx === -1) return [raw.trim(), raw.trim()]
  return [raw.slice(0, idx).trim(), raw.slice(idx + 2).trim()]
}

function autoSlug(v: string): string {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ── Main Parser ────────────────────────────────────────────
export function parseReferences(text: string): ReferenceParseResult {
  const references: ParsedReference[] = []
  const errors: ReferenceValidationError[] = []

  // markdown fence সরানো
  const cleaned = text
    .replace(/```[a-z]*\n/g, '')
    .replace(/```\n?/g, '')
    .trim()

  // ---REFERENCE--- দিয়ে ব্লক ভাগ
  const blocks = cleaned
    .split(/^---REFERENCE---\s*$/m)
    .map((b) => b.trim())
    .filter(Boolean)

  if (blocks.length === 0) {
    errors.push({ block: 0, message: 'কোনো ---REFERENCE--- ব্লক পাওয়া যায়নি' })
    return { references, errors }
  }

  blocks.forEach((block, idx) => {
    const blockNo = idx + 1
    const lines = block.split(/\r?\n/)

    let language = 'js'
    let titleBn = ''
    let titleEn = ''
    let slug = ''
    let descBn = ''
    let descEn = ''
    let tags: string[] = []

    type Mode = 'normal' | 'syntaxBn' | 'syntaxEn' | 'exampleBn' | 'exampleEn'
    let mode: Mode = 'normal'
    const syntaxBnLines: string[] = []
    const syntaxEnLines: string[] = []
    const exampleBnLines: string[] = []
    const exampleEnLines: string[] = []

    for (const rawLine of lines) {
      const line = rawLine
      const trimmed = line.trim()

      if (mode !== 'normal') {
        if (trimmed === 'END') {
          mode = 'normal'
        } else {
          if (mode === 'syntaxBn') syntaxBnLines.push(line)
          else if (mode === 'syntaxEn') syntaxEnLines.push(line)
          else if (mode === 'exampleBn') exampleBnLines.push(line)
          else if (mode === 'exampleEn') exampleEnLines.push(line)
        }
        continue
      }

      if (!trimmed) continue

      if (/^LANGUAGE\s*:/i.test(trimmed)) {
        const val = trimmed.replace(/^LANGUAGE\s*:\s*/i, '').trim().toLowerCase()
        const allowed = ['js','ts','html','css','python','java','cpp','c','go','rust','php','csharp','kotlin','swift']
        language = allowed.includes(val) ? val : 'js'
      } else if (/^TITLE\s*:/i.test(trimmed)) {
        const body = trimmed.replace(/^TITLE\s*:\s*/i, '')
        const [bn, en] = splitPair(body)
        titleBn = bn
        titleEn = en
      } else if (/^SLUG\s*:/i.test(trimmed)) {
        slug = trimmed.replace(/^SLUG\s*:\s*/i, '').trim()
      } else if (/^DESC\s*:/i.test(trimmed)) {
        const body = trimmed.replace(/^DESC\s*:\s*/i, '')
        const [bn, en] = splitPair(body)
        descBn = bn
        descEn = en
      } else if (/^SYNTAX_BN\s*:/i.test(trimmed)) {
        mode = 'syntaxBn'
      } else if (/^SYNTAX_EN\s*:/i.test(trimmed)) {
        mode = 'syntaxEn'
      } else if (/^EXAMPLE_BN\s*:/i.test(trimmed)) {
        mode = 'exampleBn'
      } else if (/^EXAMPLE_EN\s*:/i.test(trimmed)) {
        mode = 'exampleEn'
      } else if (/^TAGS\s*:/i.test(trimmed)) {
        const body = trimmed.replace(/^TAGS\s*:\s*/i, '')
        tags = body.split(',').map((t) => t.trim()).filter(Boolean)
      }
    }

    const syntaxBn = syntaxBnLines.join('\n').trim()
    const syntaxEn = syntaxEnLines.join('\n').trim()
    const exampleBn = exampleBnLines.join('\n').trim()
    const exampleEn = exampleEnLines.join('\n').trim()

    // ── Validation ──
    if (!titleBn) {
      errors.push({ block: blockNo, message: `রেফারেন্স ${blockNo}: বাংলা TITLE নেই` })
      return
    }
    if (!titleEn) {
      errors.push({ block: blockNo, message: `রেফারেন্স ${blockNo}: ইংরেজি TITLE নেই (|| দিয়ে আলাদা করুন)` })
      return
    }
    if (!slug) {
      slug = autoSlug(titleEn)
    }
    if (!descBn) {
      errors.push({ block: blockNo, message: `রেফারেন্স ${blockNo}: বাংলা DESC নেই` })
      return
    }
    if (!descEn) {
      errors.push({ block: blockNo, message: `রেফারেন্স ${blockNo}: ইংরেজি DESC নেই` })
      return
    }
    if (!syntaxBn || !syntaxEn) {
      errors.push({ block: blockNo, message: `রেফারেন্স ${blockNo}: SYNTAX_BN ও SYNTAX_EN দুটোই দরকার` })
      return
    }
    if (!exampleBn || !exampleEn) {
      errors.push({ block: blockNo, message: `রেফারেন্স ${blockNo}: EXAMPLE_BN ও EXAMPLE_EN দুটোই দরকার` })
      return
    }
    if (tags.length < 2) {
      errors.push({ block: blockNo, message: `রেফারেন্স ${blockNo}: কমপক্ষে ২টি TAGS দরকার` })
      return
    }

    references.push({
      language,
      titleBn,
      titleEn,
      slug,
      descriptionBn: descBn,
      descriptionEn: descEn,
      syntaxBn,
      syntaxEn,
      exampleBn,
      exampleEn,
      tags,
    })
  })

  return { references, errors }
}

// ── Quick check ────────────────────────────────────────────
export function looksLikeValidReferenceFormat(text: string): boolean {
  return /---REFERENCE---/.test(text) && /TITLE\s*:/i.test(text) && /TAGS\s*:/i.test(text)
}
