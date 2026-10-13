'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import AIChallengeGenerator from './AIChallengeGenerator'

type Tutorial = { id: string; title: string }

type ParsedTestCase = {
  input: string
  expectedOutput: string
  isHidden: boolean
}

type ParsedChallenge = {
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

type ParseError = { block: number; message: string }
type ParseResult = { challenges: ParsedChallenge[]; errors: ParseError[] }

// ── Helpers ────────────────────────────────────────────────
function splitPair(raw: string): [string, string] {
  const idx = raw.indexOf('||')
  if (idx === -1) return [raw.trim(), raw.trim()]
  return [raw.slice(0, idx).trim(), raw.slice(idx + 2).trim()]
}

// ── Parser ─────────────────────────────────────────────────
function parseBulk(text: string): ParseResult {
  const challenges: ParsedChallenge[] = []
  const errors: ParseError[] = []

  // Split by ---CHALLENGE--- marker
  const blocks = text
    .split(/^---CHALLENGE---\s*$/m)
    .map((b) => b.trim())
    .filter(Boolean)

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

      // Code block modes — preserve original lines
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
        difficulty = trimmed.replace(/^LEVEL\s*:\s*/i, '').trim() || 'Easy'
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
        const tc = parseTest(body)
        if (tc) testCases.push({ ...tc, isHidden: true })
        else errors.push({ block: blockNo, message: `গোপন test case ফরম্যাট ভুল: ${body}` })
      } else if (/^TEST\s*:/i.test(trimmed)) {
        const body = trimmed.replace(/^TEST\s*:\s*/i, '')
        const tc = parseTest(body)
        if (tc) testCases.push({ ...tc, isHidden: false })
        else errors.push({ block: blockNo, message: `test case ফরম্যাট ভুল: ${body}` })
      }
    }

    const starterCodeBn = starterBnLines.join('\n').trim()
    const starterCodeEn = starterEnLines.join('\n').trim()
    const solutionBn = solutionBnLines.join('\n').trim()
    const solutionEn = solutionEnLines.join('\n').trim()

    // ── Validation ──
    if (!titleBn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: TITLE নেই` })
      return
    }
    if (!titleEn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: ইংরেজি TITLE নেই (|| দিয়ে আলাদা করুন)` })
      return
    }
    if (!descBn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: DESC নেই` })
      return
    }
    if (!descEn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: ইংরেজি DESC নেই` })
      return
    }
    if (!starterCodeBn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: STARTER_BN নেই` })
      return
    }
    if (!starterCodeEn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: STARTER_EN নেই` })
      return
    }
    if (!solutionBn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: SOLUTION_BN নেই` })
      return
    }
    if (!solutionEn) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: SOLUTION_EN নেই` })
      return
    }
    if (testCases.length === 0) {
      errors.push({ block: blockNo, message: `চ্যালেঞ্জ ${blockNo}: অন্তত ১টি TEST দরকার` })
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

function parseTest(body: string): { input: string; expectedOutput: string } | null {
  // Format: input => output
  const idx = body.indexOf('=>')
  if (idx === -1) return null
  const input = body.slice(0, idx).trim()
  const output = body.slice(idx + 2).trim()
  if (!input || !output) return null
  return { input, expectedOutput: output }
}

// ── Sample ─────────────────────────────────────────────────
const SAMPLE = `---CHALLENGE---
TITLE: দুই সংখ্যার যোগফল || Sum of Two Numbers
DESC: একটি function লিখুন যা দুইটি সংখ্যা যোগ করে return করে। || Write a function that returns the sum of two numbers.
LEVEL: Easy
POINTS: 10
STARTER_BN:
function add(a, b) {
  // এখানে আপনার কোড লিখুন
}
END
STARTER_EN:
function add(a, b) {
  // Write your code here
}
END
SOLUTION_BN:
function add(a, b) {
  return a + b
}
END
SOLUTION_EN:
function add(a, b) {
  return a + b
}
END
TEST: 2, 3 => 5
TEST: 10, 20 => 30
TEST_HIDDEN: 100, -50 => 50
TEST_HIDDEN: 0, 0 => 0
---CHALLENGE---
TITLE: জোড়-বিজোড় নির্ণয় || Even or Odd
DESC: একটি function লিখুন যা সংখ্যা জোড় হলে "even", বিজোড় হলে "odd" return করে। || Write a function that returns "even" if the number is even, else "odd".
LEVEL: Easy
POINTS: 5
STARTER_BN:
function check(n) {
  // এখানে আপনার কোড লিখুন
}
END
STARTER_EN:
function check(n) {
  // Write your code here
}
END
SOLUTION_BN:
function check(n) {
  return n % 2 === 0 ? "even" : "odd"
}
END
SOLUTION_EN:
function check(n) {
  return n % 2 === 0 ? "even" : "odd"
}
END
TEST: 4 => even
TEST: 7 => odd
TEST_HIDDEN: 0 => even
---CHALLENGE---`

export default function BulkChallengeImport({ tutorials }: { tutorials: Tutorial[] }) {
  const router = useRouter()

  const [tutorialId, setTutorialId] = useState(tutorials[0]?.id || '')
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const parsed = useMemo(() => parseBulk(text), [text])

  const onSave = async () => {
    setError('')
    setSuccess('')

    if (parsed.errors.length > 0) {
      setError('পার্স এরর ঠিক করুন')
      return
    }
    if (parsed.challenges.length === 0) {
      setError('কোনো চ্যালেঞ্জ পাওয়া যায়নি')
      return
    }
    if (!tutorialId) {
      setError('Tutorial বেছে নিন')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/challenges/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tutorialId, challenges: parsed.challenges }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'সেভ করা যায়নি')
        setSaving(false)
        return
      }
      setSuccess(`${data.created}টি চ্যালেঞ্জ সফলভাবে সেভ হয়েছে!`)
      setText('')
      router.refresh()
    } catch {
      setError('নেটওয়ার্ক সমস্যা')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* 🤖 AI Generator */}
      <AIChallengeGenerator
        tutorials={tutorials}
        onGenerated={(rawText, tutTitle) => {
          // textarea-তে AI output বসানো
          setText(rawText)
          // tutorial টাইটেল মিলে গেলে সেটি সেট করা
          const matched = tutorials.find((t) => t.title === tutTitle)
          if (matched) setTutorialId(matched.id)
          // নিচে scroll করে textarea-এর দিকে নেওয়া
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              document
                .getElementById('challenge-bulk-textarea')
                ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 200)
          }
        }}
      />

      {/* Tutorial */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <label className="admin-label">&gt; Tutorial</label>
        <select
          className="admin-input"
          value={tutorialId}
          onChange={(e) => setTutorialId(e.target.value)}
        >
          {tutorials.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
        <p className="text-[10px] text-gray-500 mt-1">
          সব চ্যালেঞ্জ এই টিউটোরিয়ালের সাথে যুক্ত হবে।
        </p>
      </div>

      {/* Paste area */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">চ্যালেঞ্জ পেস্ট করুন</h2>
          <button
            type="button"
            onClick={() => setText(SAMPLE)}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-[#22C55E] hover:text-[#22C55E] transition"
          >
            📋 Sample বসান
          </button>
        </div>

        <textarea
          id="challenge-bulk-textarea"
          className="admin-input font-mono text-xs leading-relaxed"
          rows={20}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={SAMPLE}
          spellCheck={false}
        />

        <details className="text-xs text-gray-600 dark:text-gray-400">
          <summary className="cursor-pointer font-semibold">📖 ফরম্যাট নির্দেশিকা</summary>
          <div className="mt-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-950 overflow-x-auto text-xs">
            <pre className="whitespace-pre-wrap">{SAMPLE}</pre>
            <div className="mt-3 border-t border-gray-300 dark:border-gray-700 pt-3 space-y-1">
              <p><code>---CHALLENGE---</code> — প্রতিটি চ্যালেঞ্জের শুরু</p>
              <p><code>TITLE: বাংলা || English</code> — নাম (বাধ্যতামূলক)</p>
              <p><code>DESC: বাংলা || English</code> — বর্ণনা (বাধ্যতামূলক)</p>
              <p><code>LEVEL: Easy</code> — Easy/Medium/Hard (ডিফল্ট Easy)</p>
              <p><code>POINTS: 10</code> — পয়েন্ট (ডিফল্ট 0)</p>
              <p><code>STARTER:</code> ... <code>END</code> — শুরুর কোড</p>
              <p><code>SOLUTION:</code> ... <code>END</code> — সমাধান</p>
              <p><code>TEST: input =&gt; output</code> — দৃশ্যমান টেস্ট</p>
              <p><code>TEST_HIDDEN: input =&gt; output</code> — গোপন টেস্ট</p>
            </div>
          </div>
        </details>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">
          প্রিভিউ{' '}
          <span className="text-sm font-normal text-gray-500">
            ({parsed.challenges.length}টি চ্যালেঞ্জ, {parsed.errors.length}টি এরর)
          </span>
        </h2>

        {parsed.errors.length > 0 && (
          <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 p-3 space-y-1">
            {parsed.errors.map((er, i) => (
              <p key={i} className="text-xs text-red-700 dark:text-red-300">❌ {er.message}</p>
            ))}
          </div>
        )}

        {parsed.challenges.length === 0 && parsed.errors.length === 0 && (
          <p className="text-sm text-gray-500">উপরে চ্যালেঞ্জ পেস্ট করলে এখানে প্রিভিউ দেখাবে।</p>
        )}

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {parsed.challenges.map((c, i) => (
            <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3 space-y-2">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {i + 1}. {c.titleBn}
                </p>
                <div className="flex gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{c.difficulty}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                    {c.points} pts
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">{c.titleEn}</p>
              <p className="text-xs text-gray-700 dark:text-gray-300">{c.descriptionBn}</p>

              {c.starterCodeBn && (
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">STARTER_BN:</p>
                  <pre className="text-[10px] bg-gray-100 dark:bg-gray-950 p-2 rounded overflow-x-auto">{c.starterCodeBn}</pre>
                </div>
              )}
              {c.starterCodeEn && (
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">STARTER_EN:</p>
                  <pre className="text-[10px] bg-gray-100 dark:bg-gray-950 p-2 rounded overflow-x-auto">{c.starterCodeEn}</pre>
                </div>
              )}
              {c.solutionBn && (
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">SOLUTION_BN:</p>
                  <pre className="text-[10px] bg-gray-100 dark:bg-gray-950 p-2 rounded overflow-x-auto">{c.solutionBn}</pre>
                </div>
              )}
              {c.solutionEn && (
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">SOLUTION_EN:</p>
                  <pre className="text-[10px] bg-gray-100 dark:bg-gray-950 p-2 rounded overflow-x-auto">{c.solutionEn}</pre>
                </div>
              )}

              <div>
                <p className="text-[10px] text-gray-500 mb-1">
                  TEST CASES ({c.testCases.length}টি, {c.testCases.filter((t) => t.isHidden).length}টি গোপন):
                </p>
                <ul className="space-y-1">
                  {c.testCases.map((t, j) => (
                    <li key={j} className="text-[11px] font-mono bg-gray-50 dark:bg-gray-950 px-2 py-1 rounded">
                      {t.isHidden && <span className="text-amber-500 mr-1">🔒</span>}
                      <span className="text-gray-600 dark:text-gray-400">{t.input}</span>
                      <span className="text-gray-400 mx-1">→</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{t.expectedOutput}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="sticky bottom-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || parsed.challenges.length === 0 || parsed.errors.length > 0}
          className="px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'সেভ হচ্ছে...' : `💾 ${parsed.challenges.length}টি চ্যালেঞ্জ সেভ করুন`}
        </button>
        {error && <span className="text-sm text-red-500">{error}</span>}
        {success && <span className="text-sm text-emerald-500">✅ {success}</span>}
      </div>
    </div>
  )
}
