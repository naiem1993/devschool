'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

// ─────────────────────────────────────────────────────────────
//  শব্দভাণ্ডার — ক্লাসিক Lorem Ipsum (সব স্ট্যাটিক, কোনো নেটওয়ার্ক কল নেই)
// ─────────────────────────────────────────────────────────────

const CLASSIC_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

const WORDS: string[] = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
  'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
  'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos', 'dolores',
  'quas', 'molestias', 'excepturi', 'obcaecati', 'cupiditate', 'provident',
  'similique', 'mollitia', 'animi', 'laborum', 'dolorum', 'fuga', 'harum',
  'quidem', 'rerum', 'facilis', 'expedita', 'distinctio', 'nam', 'libero',
  'tempore', 'cum', 'soluta', 'nobis', 'eligendi', 'optio', 'cumque', 'impedit',
  'quo', 'minus', 'quod', 'maxime', 'placeat', 'facere', 'possimus', 'omnis',
  'assumenda', 'repellendus', 'temporibus', 'quibusdam', 'aut', 'officiis',
  'debitis', 'necessitatibus', 'saepe', 'eveniet', 'voluptates', 'repudiandae',
  'recusandae', 'itaque', 'earum', 'hic', 'tenetur', 'a', 'sapiente', 'delectus',
  'reiciendis', 'voluptatibus', 'maiores', 'doloribus', 'asperiores', 'repellat',
]

// ─────────────────────────────────────────────────────────────
//  সীমা
// ─────────────────────────────────────────────────────────────

const MAX_COUNT = 100

type Unit = 'paragraphs' | 'sentences' | 'words'
type Wrapper = 'none' | 'p' | 'div'

const UNITS: { id: Unit; bn: string }[] = [
  { id: 'paragraphs', bn: 'প্যারা' },
  { id: 'sentences', bn: 'বাক্য' },
  { id: 'words', bn: 'শব্দ' },
]

const WRAPPERS: { id: Wrapper; bn: string }[] = [
  { id: 'none', bn: 'প্লেইন' },
  { id: 'p', bn: '<p>' },
  { id: 'div', bn: '<div>' },
]

// ─────────────────────────────────────────────────────────────
//  হেল্পার
// ─────────────────────────────────────────────────────────────

/** গোড়ায় Lorem ipsum শুরু করে শব্দ সাজায় — প্রথম অক্ষর বড় হাতের */
function makeWords(count: number, startClassic: boolean): string[] {
  const out: string[] = []

  if (startClassic) {
    const classic = CLASSIC_START.replace('.', '').split(' ')
    for (const w of classic) {
      if (out.length >= count) break
      out.push(w)
    }
  }

  while (out.length < count) {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)]
    out.push(w)
  }

  if (out.length > 0) {
    out[0] = out[0].charAt(0).toUpperCase() + out[0].slice(1)
  }

  return out
}

/** শব্দ থেকে একটা বাক্য — দৈর্ঘ্য ৮–১৫ শব্দ, শেষে দাড়ি */
function sentenceFromWords(pool: string[], min = 8, max = 15): string {
  const len = min + Math.floor(Math.random() * (max - min + 1))
  const picked: string[] = []
  for (let i = 0; i < len; i += 1) {
    picked.push(pool[Math.floor(Math.random() * pool.length)])
  }
  let s = picked.join(' ')
  s = s.charAt(0).toUpperCase() + s.slice(1)
  return s + '.'
}

/** মূল জেনারেটর */
function generate(unit: Unit, count: number, startClassic: boolean): string[] {
  const safe = Math.max(1, Math.min(MAX_COUNT, Math.floor(count)))
  const pool = WORDS

  if (unit === 'words') {
    return [makeWords(safe, startClassic).join(' ')]
  }

  if (unit === 'sentences') {
    const sentences: string[] = []
    if (startClassic) sentences.push(CLASSIC_START)
    while (sentences.length < safe) {
      sentences.push(sentenceFromWords(pool))
    }
    return [sentences.slice(0, safe).join(' ')]
  }

  // paragraphs
  const paragraphs: string[] = []
  for (let p = 0; p < safe; p += 1) {
    const sentenceCount = 3 + Math.floor(Math.random() * 3) // ৩–৫ বাক্য
    const sentences: string[] = []
    if (p === 0 && startClassic) sentences.push(CLASSIC_START)
    while (sentences.length < sentenceCount) {
      sentences.push(sentenceFromWords(pool))
    }
    paragraphs.push(sentences.join(' '))
  }
  return paragraphs
}

// ─────────────────────────────────────────────────────────────
//  কম্পোনেন্ট
// ─────────────────────────────────────────────────────────────

const BTN =
  'rounded-xl border px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40 disabled:cursor-not-allowed disabled:opacity-40'
const BTN_GHOST = BTN + ' border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f0c] text-slate-700 dark:text-slate-200 hover:border-[#22C55E] hover:text-[#22C55E]'
const BTN_PRIMARY = BTN + ' border-[#22C55E] bg-[#22C55E] text-black hover:brightness-110'
const TOGGLE_BASE =
  'rounded-xl px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40'
const NUMBER_INPUT =
  'w-20 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#050806] px-3 py-2 font-mono text-sm tabular-nums text-slate-900 dark:text-slate-100 outline-none transition focus:border-[#22C55E]'

export default function LoremIpsumTool() {
  const [unit, setUnit] = useState<Unit>('paragraphs')
  const [count, setCount] = useState(3)
  const [startClassic, setStartClassic] = useState(true)
  const [wrapper, setWrapper] = useState<Wrapper>('none')
  const [blocks, setBlocks] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const copyTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
    }
  }, [])

  // প্রথমবার একটা ডিফল্ট দেখাও
  useEffect(() => {
    setBlocks(generate('paragraphs', 3, true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const regenerate = () => setBlocks(generate(unit, count, startClassic))

  // ── আউটপুট স্ট্রিং ─────────────────────────────────────
  const output = useMemo(() => {
    if (blocks.length === 0) return ''
    if (wrapper === 'none') {
      // প্যারা/বাক্য → নতুন লাইনে ; শব্দ → এক লাইনে
      return unit === 'words' ? blocks[0] : blocks.join('\n\n')
    }
    // HTML wrapper — ট্যাগের ভেতরে টেক্সট, কিন্তু dangerouslySetInnerHTML কোথাও নেই
    const tag = wrapper
    return blocks.map((b) => '<' + tag + '>' + b + '</' + tag + '>').join('\n')
  }, [blocks, wrapper, unit])

  const stats = useMemo(() => {
    const text = blocks.join(' ')
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const chars = text.length
    const readMin = Math.max(1, Math.round(words / 200))
    return { words, chars, readMin, blocks: blocks.length }
  }, [blocks])

  // ── কপি ───────────────────────────────────────────────
  const copy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ব্রাউজার অনুমতি দেয়নি */
    }
  }

  const clearAll = () => {
    setBlocks([])
  }

  return (
    <div className="space-y-4">
      {/* ─── Controls ─── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-3">
        {/* Unit toggle */}
        <div role="group" aria-label="একক" className="inline-flex rounded-xl border border-slate-200 dark:border-white/10 p-0.5">
          {UNITS.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setUnit(u.id)}
              aria-pressed={unit === u.id}
              className={
                TOGGLE_BASE +
                ' ' +
                (unit === u.id
                  ? 'bg-[#22C55E] text-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#22C55E]')
              }
            >
              {u.bn}
            </button>
          ))}
        </div>

        {/* Count */}
        <label htmlFor="li-count" className="sr-only">সংখ্যা</label>
        <input
          id="li-count"
          type="number"
          min={1}
          max={MAX_COUNT}
          value={count}
          onChange={(e) => setCount(Number(e.target.value) || 1)}
          className={NUMBER_INPUT}
          aria-label="কতটি"
        />

        {/* Wrapper */}
        <div role="group" aria-label="HTML র‍্যাপার" className="inline-flex rounded-xl border border-slate-200 dark:border-white/10 p-0.5">
          {WRAPPERS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setWrapper(w.id)}
              aria-pressed={wrapper === w.id}
              className={
                TOGGLE_BASE +
                ' ' +
                (wrapper === w.id
                  ? 'bg-[#22C55E] text-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#22C55E]')
              }
            >
              {w.bn}
            </button>
          ))}
        </div>

        {/* Classic start */}
        <button
          type="button"
          onClick={() => setStartClassic((s) => !s)}
          aria-pressed={startClassic}
          className={startClassic ? BTN_PRIMARY : BTN_GHOST}
        >
          Lorem ipsum দিয়ে শুরু
        </button>

        <span className="hidden flex-1 sm:block" />

        <button type="button" onClick={regenerate} className={BTN_PRIMARY}>
          ✦ তৈরি করুন
        </button>
        <button type="button" onClick={copy} disabled={!output} className={BTN_GHOST}>
          {copied ? '✓ কপি হয়েছে' : '⧉ Copy'}
        </button>
        <button type="button" onClick={clearAll} disabled={!output} className={BTN_GHOST}>
          ✕ Clear
        </button>
      </div>

      {/* ─── Output ─── */}
      <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c]">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]/60" />
          </span>
          <span className="font-mono text-[10px] text-slate-400">lorem-ipsum.txt</span>
        </div>

        <textarea
          readOnly
          value={output}
          spellCheck={false}
          aria-label="তৈরি করা Lorem Ipsum"
          placeholder="তৈরি করুন চাপুন..."
          className="h-[380px] w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
        />
      </div>

      {/* ─── Stats ─── */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-3.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span
            role="status"
            aria-live="polite"
            className={
              'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ' +
              (output
                ? 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#15803d] dark:text-[#22C55E]'
                : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400')
            }
          >
            {output ? '✓ তৈরি হয়েছে' : 'অপেক্ষায়'}
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            শব্দ <b className="text-slate-800 dark:text-slate-200">{stats.words}</b>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            অক্ষর <b className="text-slate-800 dark:text-slate-200">{stats.chars}</b>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {unit === 'paragraphs' ? 'প্যারা' : 'একক'}{' '}
            <b className="text-slate-800 dark:text-slate-200">{stats.blocks}</b>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            পড়তে <b className="text-slate-800 dark:text-slate-200">~{stats.readMin} মিনিট</b>
          </span>
          <span className="ml-auto hidden text-[11px] text-slate-400 sm:block">
            🔒 সব ব্রাউজারেই, কোনো নেটওয়ার্ক কল নেই
          </span>
        </div>
      </div>
    </div>
  )
}
