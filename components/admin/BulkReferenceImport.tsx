'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import AIReferenceGenerator from './AIReferenceGenerator'

type Tutorial = { id: string; title: string }

type ParsedReference = {
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

type ParseError = { block: number; message: string }
type ParseResult = { references: ParsedReference[]; errors: ParseError[] }

function splitPair(raw: string): [string, string] {
  const idx = raw.indexOf('||')
  if (idx === -1) return [raw.trim(), raw.trim()]
  return [raw.slice(0, idx).trim(), raw.slice(idx + 2).trim()]
}

function autoSlug(v: string): string {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseBulk(text: string): ParseResult {
  const references: ParsedReference[] = []
  const errors: ParseError[] = []

  const cleaned = text
    .replace(/```[a-z]*\n/g, '')
    .replace(/```\n?/g, '')
    .trim()

  const blocks = cleaned
    .split(/^---REFERENCE---\s*$/m)
    .map((b) => b.trim())
    .filter(Boolean)

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

    if (!titleBn) { errors.push({ block: blockNo, message: `রেফারেন্স ${blockNo}: বাংলা TITLE নেই` }); return }
    if (!titleEn) { errors.push({ block: blockNo, message: `রেফারেন্স ${blockNo}: ইংরেজি TITLE নেই (|| দিয়ে আলাদা করুন)` }); return }
    if (!descBn) { errors.push({ block: blockNo, message: `রেফারেন্স ${blockNo}: বাংলা DESC নেই` }); return }
    if (!descEn) { errors.push({ block: blockNo, message: `রেফারেন্স ${blockNo}: ইংরেজি DESC নেই` }); return }
    if (!syntaxBn || !syntaxEn) { errors.push({ block: blockNo, message: `রেফারেন্স ${blockNo}: SYNTAX_BN ও SYNTAX_EN দুটোই দরকার` }); return }
    if (!exampleBn || !exampleEn) { errors.push({ block: blockNo, message: `রেফারেন্স ${blockNo}: EXAMPLE_BN ও EXAMPLE_EN দুটোই দরকার` }); return }
    if (tags.length < 2) { errors.push({ block: blockNo, message: `রেফারেন্স ${blockNo}: কমপক্ষে ২টি TAGS দরকার` }); return }

    references.push({
      language, titleBn, titleEn,
      slug: slug || autoSlug(titleEn),
      descriptionBn: descBn, descriptionEn: descEn,
      syntaxBn, syntaxEn, exampleBn, exampleEn, tags,
    })
  })

  return { references, errors }
}

const SAMPLE = `---REFERENCE---
LANGUAGE: js
TITLE: Array.map() মেথড || Array.map() Method
SLUG: array-map
DESC: প্রতিটি এলিমেন্টে callback ফাংশন চালিয়ে নতুন array তৈরি করে। || Creates a new array by applying a callback function to each element.
SYNTAX_BN:
// সিনট্যাক্স
arr.map((el, i) => newValue)
END
SYNTAX_EN:
// Syntax
arr.map((el, i) => newValue)
END
EXAMPLE_BN:
const nums = [1, 2, 3]
const doubled = nums.map(n => n * 2)
console.log(doubled) // [2, 4, 6]
END
EXAMPLE_EN:
const nums = [1, 2, 3]
const doubled = nums.map(n => n * 2)
console.log(doubled) // [2, 4, 6]
END
TAGS: array, method, es6
---REFERENCE---`

export default function BulkReferenceImport({ tutorials }: { tutorials: Tutorial[] }) {
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

    if (parsed.errors.length > 0) { setError('পার্স এরর ঠিক করুন'); return }
    if (parsed.references.length === 0) { setError('কোনো রেফারেন্স পাওয়া যায়নি'); return }
    if (!tutorialId) { setError('Tutorial বেছে নিন'); return }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/references/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tutorialId, references: parsed.references }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'সেভ করা যায়নি'); setSaving(false); return }
      setSuccess(`${data.created}টি রেফারেন্স সফলভাবে সেভ হয়েছে!`)
      setText('')
      router.refresh()
    } catch {
      setError('নেটওয়ার্ক সমস্যা')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">১. কোথায় যোগ করবেন?</h2>
        <div>
          <label className="admin-label">&gt; Tutorial</label>
          <select className="admin-input" value={tutorialId} onChange={(e) => setTutorialId(e.target.value)}>
            {tutorials.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
      </div>

      <AIReferenceGenerator
        tutorialTitle={tutorials.find((t) => t.id === tutorialId)?.title || ''}
        onGenerated={(raw) => {
          const sep = text.trim() ? '\n' : ''
          setText((prev) => prev + sep + raw)
        }}
      />

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">২. রেফারেন্স পেস্ট করুন</h2>
          <button
            type="button"
            onClick={() => setText(SAMPLE)}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-[#22C55E] hover:text-[#22C55E] transition"
          >
            📋 Sample বসান
          </button>
        </div>

        <textarea
          className="admin-input font-mono text-xs leading-relaxed"
          rows={16}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={SAMPLE}
          spellCheck={false}
        />

        <details className="text-xs text-gray-600 dark:text-gray-400">
          <summary className="cursor-pointer font-semibold">ফরম্যাট নির্দেশিকা</summary>
          <pre className="mt-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-950 overflow-x-auto whitespace-pre-wrap">{SAMPLE}</pre>
        </details>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">
          ৩. প্রিভিউ{' '}
          <span className="text-sm font-normal text-gray-500">
            ({parsed.references.length}টি রেফারেন্স, {parsed.errors.length}টি এরর)
          </span>
        </h2>

        {parsed.errors.length > 0 && (
          <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 p-3 space-y-1">
            {parsed.errors.map((er, i) => (
              <p key={i} className="text-xs text-red-700 dark:text-red-300">❌ {er.message}</p>
            ))}
          </div>
        )}

        {parsed.references.length === 0 && parsed.errors.length === 0 && (
          <p className="text-sm text-gray-500">উপরে রেফারেন্স পেস্ট করলে এখানে প্রিভিউ দেখাবে।</p>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {parsed.references.map((r, i) => (
            <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {i + 1}. {r.titleBn}
                </p>
                <span className="text-[10px] uppercase font-mono text-gray-500 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
                  {r.language}
                </span>
              </div>
              <p className="text-xs text-gray-500 italic mb-2">{r.titleEn}</p>
              <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">{r.descriptionBn}</p>
              <div className="text-[11px] font-mono bg-gray-100 dark:bg-gray-950 rounded p-2 overflow-x-auto whitespace-pre-wrap">
                {r.syntaxBn}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {r.tags.map((t, j) => (
                  <span key={j} className="text-[10px] px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300">
                    #{t}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-mono">slug: {r.slug}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || parsed.references.length === 0 || parsed.errors.length > 0}
          className="px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'সেভ হচ্ছে...' : `💾 ${parsed.references.length}টি রেফারেন্স সেভ করুন`}
        </button>
        {error && <span className="text-sm text-red-500">{error}</span>}
        {success && <span className="text-sm text-emerald-500">✅ {success}</span>}
      </div>
    </div>
  )
}
