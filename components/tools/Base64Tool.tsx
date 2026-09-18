'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ─────────────────────────────────────────────────────────────
//  সীমা — বড় ইনপুটে ব্রাউজার যেন আটকে না যায়
// ─────────────────────────────────────────────────────────────

/** এর বেশি হলে auto-convert বন্ধ, ইউজার নিজে বাটন চাপবে */
const AUTO_CONVERT_LIMIT = 200_000
/** হার্ড ক্যাপ — এর বেশি ইনপুট গ্রহণ করা হয় না */
const MAX_INPUT_LIMIT = 1_000_000
/** একবারে কত byte স্ট্রিং-এ রূপান্তর করা হবে (stack overflow ঠেকাতে) */
const CHUNK_SIZE = 0x8000

type Mode = 'encode' | 'decode'

const SAMPLE = 'DevSchool — শেখো, বানাও, এগিয়ে যাও 🚀'

const BTN =
  'rounded-xl border px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40 disabled:cursor-not-allowed disabled:opacity-40'
const BTN_GHOST = `${BTN} border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f0c] text-slate-700 dark:text-slate-200 hover:border-[#22C55E] hover:text-[#22C55E]`
const BTN_PRIMARY = `${BTN} border-[#22C55E] bg-[#22C55E] text-black hover:brightness-110`
const TOGGLE_BASE =
  'rounded-xl px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40'

// ─────────────────────────────────────────────────────────────
//  হেল্পার
// ─────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n < 1000) return String(n)
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)}K`
  return `${(n / 1_000_000).toFixed(2)}M`
}

function byteLength(text: string): number {
  return new TextEncoder().encode(text).length
}

/**
 * UTF-8 → Base64 (ASCII-only নিরাপদ স্ট্রিং)।
 * btoa শুধু Latin-1 বোঝে, তাই আগে TextEncoder দিয়ে byte-এ ভাঙা হয়।
 * টুকরো করে করা হয় যাতে বিশাল ইনপুটে `String.fromCharCode(...)` stack overflow না করে।
 */
function encodeBase64(text: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE))
  }
  const standard = btoa(binary)
  if (!urlSafe) return standard
  return standard.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Base64 → UTF-8 স্ট্রিং (বাংলাসহ যেকোনো ইউনিকোড)। */
function decodeBase64(input: string, urlSafe: boolean): string {
  // পেস্ট করা টেক্সটে নতুন লাইন/স্পেস থাকলে বাদ দাও
  let normalized = input.replace(/\s+/g, '')

  if (urlSafe) normalized = normalized.replace(/-/g, '+').replace(/_/g, '/')

  // প্যাডিং ফিরিয়ে দাও (Base64 দৈর্ঘ্য ৪-এর গুণিতক হতে হয়)
  const remainder = normalized.length % 4
  if (remainder === 2) normalized += '=='
  else if (remainder === 3) normalized += '='
  else if (remainder === 1) throw new Error('Base64 দৈর্ঘ্য ভুল (৪-এর গুণিতক হতে হবে)')

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
    throw new Error('এটি ভ্যালিড Base64 নয় — অননুমোদিত অক্ষর আছে')
  }

  const binary = atob(normalized)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)

  // fatal: true → ভুল UTF-8 হলে exception, চুপচাপ ভাঙা অক্ষর দেখাবে না
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
}

// ─────────────────────────────────────────────────────────────
//  কম্পোনেন্ট
// ─────────────────────────────────────────────────────────────

export default function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<Mode>('encode')
  const [urlSafe, setUrlSafe] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const copyTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
    }
  }, [])

  const tooBig = input.length > MAX_INPUT_LIMIT
  const busy = !input || tooBig

  // ── মূল রূপান্তর ─────────────────────────────────────────
  const convert = useCallback((raw: string, nextMode: Mode, nextUrlSafe: boolean) => {
    setError('')

    if (!raw) {
      setOutput('')
      return
    }

    if (raw.length > MAX_INPUT_LIMIT) {
      setOutput('')
      setError(
        `ইনপুট ${formatCount(raw.length)} অক্ষর — সর্বোচ্চ ${formatCount(MAX_INPUT_LIMIT)} অনুমোদিত।`
      )
      return
    }

    try {
      setOutput(
        nextMode === 'encode'
          ? encodeBase64(raw, nextUrlSafe)
          : decodeBase64(raw, nextUrlSafe)
      )
    } catch (err) {
      setOutput('')
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [])

  // ── হ্যান্ডলার ────────────────────────────────────────────
  const handleInput = (value: string) => {
    setInput(value)
    if (value.length <= AUTO_CONVERT_LIMIT) convert(value, mode, urlSafe)
    else setError('ইনপুট বড় — «রূপান্তর» বাটনে চাপুন।')
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    if (input) convert(input, next, urlSafe)
  }

  const toggleUrlSafe = () => {
    const next = !urlSafe
    setUrlSafe(next)
    if (input) convert(input, mode, next)
  }

  const swap = () => {
    const nextMode: Mode = mode === 'encode' ? 'decode' : 'encode'
    setMode(nextMode)
    setInput(output)
    setError('')
    if (output) convert(output, nextMode, urlSafe)
  }

  const loadSample = () => {
    setMode('encode')
    setInput(SAMPLE)
    convert(SAMPLE, 'encode', urlSafe)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
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

  // Ctrl/Cmd + Enter = রূপান্তর
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault()
        convert(input, mode, urlSafe)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [input, mode, urlSafe, convert])

  // ── ডেরাইভড ভ্যালু ─────────────────────────────────────────
  const inBytes = useMemo(() => byteLength(input), [input])
  const outBytes = useMemo(() => byteLength(output), [output])

  return (
    <div className="space-y-4">
      {/* ─── Toolbar ─── */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-3">
        {/* Mode toggle */}
        <div
          role="group"
          aria-label="মোড"
          className="inline-flex rounded-xl border border-slate-200 dark:border-white/10 p-0.5"
        >
          <button
            type="button"
            onClick={() => switchMode('encode')}
            aria-pressed={mode === 'encode'}
            className={`${TOGGLE_BASE} ${
              mode === 'encode'
                ? 'bg-[#22C55E] text-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#22C55E]'
            }`}
          >
            এনকোড
          </button>
          <button
            type="button"
            onClick={() => switchMode('decode')}
            aria-pressed={mode === 'decode'}
            className={`${TOGGLE_BASE} ${
              mode === 'decode'
                ? 'bg-[#22C55E] text-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#22C55E]'
            }`}
          >
            ডিকোড
          </button>
        </div>

        <button
          type="button"
          onClick={toggleUrlSafe}
          aria-pressed={urlSafe}
          className={urlSafe ? BTN_PRIMARY : BTN_GHOST}
        >
          URL-safe
        </button>

        <button type="button" onClick={swap} disabled={!output && !input} className={BTN_GHOST}>
          ⇅ Swap
        </button>

        <span className="hidden flex-1 sm:block" />

        <button type="button" onClick={loadSample} className={BTN_GHOST}>
          নমুনা
        </button>
        <button type="button" onClick={handleCopy} disabled={!output} className={BTN_GHOST}>
          {copied ? '✓ কপি হয়েছে' : '⧉ Copy'}
        </button>
        <button type="button" onClick={clearAll} disabled={!input && !output} className={BTN_GHOST}>
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
            <span className="font-mono text-[10px] text-slate-400">
              {mode === 'encode' ? 'plain text' : 'base64'}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(event) => handleInput(event.target.value)}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            aria-label="ইনপুট"
            placeholder={
              mode === 'encode' ? 'যেকোনো লেখা লিখুন...' : 'Base64 এখানে পেস্ট করুন...'
            }
            className="h-[300px] w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
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
            <span className="font-mono text-[10px] text-slate-400">
              {mode === 'encode' ? 'base64' : 'plain text'}
            </span>
          </div>
          <pre className="h-[300px] overflow-auto whitespace-pre-wrap break-all p-4 font-mono text-[13px] leading-relaxed text-slate-900 dark:text-slate-100">
            {output || <span className="text-slate-400">ফলাফল এখানে দেখাবে...</span>}
          </pre>
        </div>
      </div>

      {/* ─── Status ─── */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-3.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span
            role="status"
            aria-live="polite"
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${
              error
                ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                : output
                  ? 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#15803d] dark:text-[#22C55E]'
                  : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
            }`}
          >
            {error ? '✕ সমস্যা' : output ? '✓ রূপান্তর হয়েছে' : 'অপেক্ষায়'}
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            ইনপুট <b className="text-slate-800 dark:text-slate-200">{inBytes} B</b>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            আউটপুট <b className="text-slate-800 dark:text-slate-200">{outBytes} B</b>
          </span>
          {urlSafe && (
            <span className="text-slate-500 dark:text-slate-400">
              মোড <b className="text-slate-800 dark:text-slate-200">URL-safe</b>
            </span>
          )}
          <span className="ml-auto hidden text-[11px] text-slate-400 sm:block">
            Ctrl / ⌘ + Enter = রূপান্তর
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
