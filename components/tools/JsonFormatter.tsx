'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ─────────────────────────────────────────────────────────────
//  সীমা — বড় ইনপুটে ব্রাউজার যেন আটকে না যায়
// ─────────────────────────────────────────────────────────────

/** এর বেশি হলে live-format বন্ধ, ইউজার নিজে বাটন চাপবে */
const AUTO_FORMAT_LIMIT = 200_000
/** হার্ড ক্যাপ — এর বেশি ইনপুট গ্রহণ করা হয় না */
const MAX_INPUT_LIMIT = 2_000_000
/** এর বেশি হলে syntax highlight বাদ (হাজার হাজার span এড়াতে) */
const HIGHLIGHT_LIMIT = 120_000
/** recursion depth limit — গভীর nested JSON-এ stack overflow ঠেকায় */
const MAX_DEPTH = 64

type Indent = '2' | '4' | 'tab'
type Mode = 'format' | 'minify' | 'validate'
type StatusKind = 'idle' | 'ok' | 'bad'
type Status = { kind: StatusKind; text: string }
type Token = { text: string; cls: 'key' | 'str' | 'num' | 'lit' | 'plain' }

const SAMPLE = {
  name: 'DevSchool',
  version: 2,
  active: true,
  owner: null,
  tags: ['html', 'css', 'javascript'],
  meta: { locale: 'bn-BD', theme: { mode: 'dark', accent: '#22C55E' } },
  courses: [
    { id: 1, title: 'HTML', lessons: 12 },
    { id: 2, title: 'CSS', lessons: 18 },
  ],
}

const TOKEN_CLASS: Record<Token['cls'], string> = {
  key: 'text-[#15803d] dark:text-[#22C55E] font-semibold',
  str: 'text-amber-700 dark:text-amber-300',
  num: 'text-cyan-700 dark:text-cyan-300',
  lit: 'text-violet-700 dark:text-violet-300',
  plain: 'text-slate-500 dark:text-slate-400',
}

const BTN =
  'rounded-xl border px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40 disabled:cursor-not-allowed disabled:opacity-40'
const BTN_GHOST = `${BTN} border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f0c] text-slate-700 dark:text-slate-200 hover:border-[#22C55E] hover:text-[#22C55E]`
const BTN_PRIMARY = `${BTN} border-[#22C55E] bg-[#22C55E] text-black hover:brightness-110`
const SELECT =
  'rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f0c] px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40'

// ─────────────────────────────────────────────────────────────
//  হেল্পার
// ─────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n < 1000) return String(n)
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)}K`
  return `${(n / 1_000_000).toFixed(2)}M`
}

/** কী-এর মোট সংখ্যা (nested সহ) — depth limit মানা হয় */
function countKeys(value: unknown, depth = 0): number {
  if (depth > MAX_DEPTH) return 0
  if (Array.isArray(value)) {
    return value.reduce<number>((sum, item) => sum + countKeys(item, depth + 1), 0)
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    let total = 0
    for (const key of Object.keys(record)) total += 1 + countKeys(record[key], depth + 1)
    return total
  }
  return 0
}

/** key গুলো A→Z সাজায় (nested সহ) — depth limit মানা হয় */
function sortKeysDeep(value: unknown, depth = 0): unknown {
  if (depth > MAX_DEPTH) return value
  if (Array.isArray(value)) return value.map((item) => sortKeysDeep(item, depth + 1))
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(record).sort()) {
      sorted[key] = sortKeysDeep(record[key], depth + 1)
    }
    return sorted
  }
  return value
}

/**
 * JSON-কে টোকেনে ভেঙে দেয় — যাতে React element হিসেবে রঙ করা যায়।
 * এখানে কোনো HTML string তৈরি হয় না, তাই XSS-এর সুযোগ নেই।
 */
function tokenize(json: string): Token[] {
  const tokens: Token[] = []
  const pattern =
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(json)) !== null) {
    if (match.index > cursor) {
      tokens.push({ text: json.slice(cursor, match.index), cls: 'plain' })
    }

    const full = match[0]
    const quoted = match[1]
    const colon = match[2]

    if (quoted !== undefined) {
      tokens.push({ text: quoted, cls: colon ? 'key' : 'str' })
      if (colon) tokens.push({ text: colon, cls: 'plain' })
    } else if (/^(?:true|false|null)$/.test(full)) {
      tokens.push({ text: full, cls: 'lit' })
    } else {
      tokens.push({ text: full, cls: 'num' })
    }

    cursor = pattern.lastIndex
  }

  if (cursor < json.length) tokens.push({ text: json.slice(cursor), cls: 'plain' })
  return tokens
}

// ─────────────────────────────────────────────────────────────
//  কম্পোনেন্ট
// ─────────────────────────────────────────────────────────────

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle', text: 'অপেক্ষায়' })
  const [error, setError] = useState('')
  const [indent, setIndent] = useState<Indent>('2')
  const [sortOn, setSortOn] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
    }
  }, [])

  const tooBig = input.length > MAX_INPUT_LIMIT
  const busy = !input.trim() || tooBig

  // ── মূল কাজ: parse → (sort) → stringify ──────────────────
  const process = useCallback((raw: string, mode: Mode, opts: { indent: Indent; sort: boolean }) => {
    setError('')

    const trimmed = raw.trim()
    if (!trimmed) {
      setOutput('')
      setStatus({ kind: 'idle', text: 'অপেক্ষায়' })
      return
    }

    if (raw.length > MAX_INPUT_LIMIT) {
      setOutput('')
      setStatus({ kind: 'bad', text: '✕ ইনপুট অনেক বড়' })
      setError(
        `ইনপুট ${formatCount(raw.length)} অক্ষর — সর্বোচ্চ ${formatCount(MAX_INPUT_LIMIT)} অনুমোদিত।`
      )
      return
    }

    try {
      // JSON.parse শুধু ডেটা পড়ে — কোনো কোড চালায় না, তাই নিরাপদ
      const parsed: unknown = JSON.parse(trimmed)
      const target = opts.sort ? sortKeysDeep(parsed) : parsed
      const step = opts.indent === 'tab' ? '\t' : Number(opts.indent)
      const text = mode === 'minify' ? JSON.stringify(target) : JSON.stringify(target, null, step)

      setOutput(text)
      setStatus({
        kind: 'ok',
        text:
          mode === 'minify'
            ? '✓ মিনিফাই হয়েছে'
            : mode === 'validate'
              ? '✓ ভ্যালিড JSON'
              : '✓ ফরম্যাট হয়েছে',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      const at = /position (\d+)/.exec(message)

      setOutput('')
      setStatus({ kind: 'bad', text: '✕ ভুল JSON' })

      if (at) {
        const position = Number(at[1])
        const upto = trimmed.slice(0, position)
        const line = upto.split('\n').length
        const column = position - upto.lastIndexOf('\n')
        setError(`${message} — লাইন ${line}, কলাম ${column}`)
      } else {
        setError(message)
      }
    }
  }, [])

  // ── হ্যান্ডলার ────────────────────────────────────────────
  const handleChange = (value: string) => {
    setInput(value)
    if (value.length <= AUTO_FORMAT_LIMIT) process(value, 'format', { indent, sort: sortOn })
    else setStatus({ kind: 'idle', text: 'বড় ইনপুট — Format চাপুন' })
  }

  const handleIndent = (next: Indent) => {
    setIndent(next)
    if (input.trim()) process(input, 'format', { indent: next, sort: sortOn })
  }

  const handleSort = () => {
    const next = !sortOn
    setSortOn(next)
    if (input.trim()) process(input, 'format', { indent, sort: next })
  }

  const loadSample = () => {
    const text = JSON.stringify(SAMPLE)
    setInput(text)
    process(text, 'format', { indent, sort: sortOn })
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
    setStatus({ kind: 'idle', text: 'অপেক্ষায়' })
  }

  const handleCopy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setError('ক্লিপবোর্ডে কপি করা যায়নি — ব্রাউজার অনুমতি দেয়নি।')
    }
  }

  // Ctrl/Cmd + Enter = Format
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault()
        process(input, 'format', { indent, sort: sortOn })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [input, indent, sortOn, process])

  // ── ডেরাইভড ভ্যালু ─────────────────────────────────────────
  const tokens = useMemo(
    () => (output && output.length <= HIGHLIGHT_LIMIT ? tokenize(output) : null),
    [output]
  )

  const lineCount = output ? output.split('\n').length : 0
  const keyCount = useMemo(() => {
    if (!output) return 0
    try {
      return countKeys(JSON.parse(output))
    } catch {
      return 0
    }
  }, [output])

  const badgeClass =
    status.kind === 'ok'
      ? 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#15803d] dark:text-[#22C55E]'
      : status.kind === 'bad'
        ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
        : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'

  return (
    <div className="space-y-4">
      {/* ─── Toolbar ─── */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-3">
        <button
          type="button"
          onClick={() => process(input, 'format', { indent, sort: sortOn })}
          disabled={busy}
          className={BTN_PRIMARY}
        >
          ✦ Format
        </button>
        <button
          type="button"
          onClick={() => process(input, 'minify', { indent, sort: sortOn })}
          disabled={busy}
          className={BTN_GHOST}
        >
          ⇥ Minify
        </button>
        <button
          type="button"
          onClick={() => process(input, 'validate', { indent, sort: sortOn })}
          disabled={busy}
          className={BTN_GHOST}
        >
          ✓ Validate
        </button>
        <button
          type="button"
          onClick={handleSort}
          aria-pressed={sortOn}
          className={sortOn ? BTN_PRIMARY : BTN_GHOST}
        >
          ⇅ Sort keys
        </button>

        <label htmlFor="json-indent" className="sr-only">
          ইনডেন্ট
        </label>
        <select
          id="json-indent"
          value={indent}
          onChange={(event) => handleIndent(event.target.value as Indent)}
          className={SELECT}
        >
          <option value="2">2 space</option>
          <option value="4">4 space</option>
          <option value="tab">Tab</option>
        </select>

        <span className="hidden flex-1 sm:block" />

        <button type="button" onClick={loadSample} className={BTN_GHOST}>
          নমুনা
        </button>
        <button type="button" onClick={handleCopy} disabled={!output} className={BTN_GHOST}>
          {copied ? '✓ কপি হয়েছে' : '⧉ Copy'}
        </button>
        <button
          type="button"
          onClick={clearAll}
          disabled={!input && !output}
          className={BTN_GHOST}
        >
          ✕ Clear
        </button>
      </div>

      {/* ─── Panes ─── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c]">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 px-4 py-2.5">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]/60" />
            </span>
            <span className="font-mono text-[10px] text-slate-400">input.json</span>
          </div>
          <textarea
            value={input}
            onChange={(event) => handleChange(event.target.value)}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            aria-label="JSON ইনপুট"
            placeholder={'{\n  "name": "DevSchool"\n}'}
            className="h-[420px] w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c]">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 px-4 py-2.5">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]/60" />
            </span>
            <span className="font-mono text-[10px] text-slate-400">output.json</span>
          </div>
          <pre className="h-[420px] overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[13px] leading-relaxed">
            {tokens
              ? tokens.map((token, index) => (
                  <span key={index} className={TOKEN_CLASS[token.cls]}>
                    {token.text}
                  </span>
                ))
              : output || <span className="text-slate-400">ফলাফল এখানে দেখাবে...</span>}
          </pre>
        </div>
      </div>

      {/* ─── Status ─── */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-3.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span
            role="status"
            aria-live="polite"
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${badgeClass}`}
          >
            {status.text}
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            ইনপুট <b className="text-slate-800 dark:text-slate-200">{formatCount(input.length)}</b>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            আউটপুট <b className="text-slate-800 dark:text-slate-200">{formatCount(output.length)}</b>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            লাইন <b className="text-slate-800 dark:text-slate-200">{lineCount}</b>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            কী <b className="text-slate-800 dark:text-slate-200">{keyCount}</b>
          </span>
          <span className="ml-auto hidden text-[11px] text-slate-400 sm:block">
            Ctrl / ⌘ + Enter = Format
          </span>
        </div>

        {error && (
          <p className="mt-2.5 break-words font-mono text-[12px] text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
