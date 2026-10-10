'use client'

import React, { useRef } from 'react'

type Props = {
  value: string
  onChange: (e: { target: { value: string } }) => void
  rows?: number
  minHeight?: number
  placeholder?: string
  className?: string
  required?: boolean
  disabled?: boolean
  name?: string
  id?: string
  maxLength?: number
}

const MBTN =
  'rounded-md border px-2.5 py-1 text-[11px] font-bold transition-colors flex items-center justify-center min-w-[32px]'

export default function RichEditor({
  value,
  onChange,
  rows = 20,
  minHeight,
  placeholder = 'এখানে lesson লিখো… (Markdown + HTML supported)',
  className,
  required,
  disabled,
  name,
  id,
  maxLength,
}: Props) {
  const ref = useRef<HTMLTextAreaElement | null>(null)
  const h = minHeight ?? Math.max(300, rows * 22)

  // 🟢 Fix: execCommand('insertText') ব্যবহার করা হয় — native undo history রক্ষা হয়
  const insertAtCursor = (before: string, after: string = '', fallback = '') => {
    const el = ref.current
    if (!el) return
    el.focus()
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = el.value.substring(start, end)
    const insert = before + (selected || fallback) + after

    // 🟢 এটা browser native — Ctrl+Z কাজ করবে
    document.execCommand('insertText', false, insert)

    // নতুন কার্সর পজিশন সেট করো
    setTimeout(() => {
      const newPos = start + before.length + (selected || fallback).length
      el.setSelectionRange(newPos, newPos)
    }, 0)
  }

  // 🟢 লাইনের শুরুতে prefix বসায় (H1, H2, list ইত্যাদি)
  const insertLineStart = (prefix: string) => {
    const el = ref.current
    if (!el) return
    el.focus()
    const start = el.selectionStart
    const text = el.value
    const lineStart = text.lastIndexOf('\n', start - 1) + 1

    // কার্সর লাইনের শুরুতে নিয়ে যাও
    el.setSelectionRange(lineStart, lineStart)

    // 🟢 Native insert — undo কাজ করবে
    document.execCommand('insertText', false, prefix)

    // কার্সর আগের জায়গায় ফিরিয়ে আনো (prefix এর পরে)
    setTimeout(() => {
      el.setSelectionRange(start + prefix.length, start + prefix.length)
    }, 0)
  }

  return (
    <div
      className={
        className ||
        'rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900'
      }
    >
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-black/20 p-2 space-y-1.5">
        {/* Block Formatting */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 dark:border-gray-700 pb-1.5 mb-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 mr-1">Block:</span>
          <button type="button" onClick={() => insertLineStart('# ')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}>H1</button>
          <button type="button" onClick={() => insertLineStart('## ')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}>H2</button>
          <button type="button" onClick={() => insertLineStart('### ')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}>H3</button>
          <button type="button" onClick={() => insertAtCursor('\n```html\n', '\n```\n', '')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}>📦Code</button>
          <button type="button" onClick={() => insertLineStart('- ')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}>• List</button>
          <button type="button" onClick={() => insertLineStart('1. ')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}>1. List</button>
          <button type="button" onClick={() => insertLineStart('> ')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}>❝</button>
        </div>

        {/* Inline Formatting */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 dark:border-gray-700 pb-1.5 mb-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 mr-1">Inline:</span>
          <button type="button" onClick={() => insertAtCursor('**', '**', 'bold')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}><b>B</b></button>
          <button type="button" onClick={() => insertAtCursor('*', '*', 'italic')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}><i>I</i></button>
          <button type="button" onClick={() => insertAtCursor('`', '`', 'code')} className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}>` `</button>
          <button type="button" onClick={() => insertAtCursor('[', '](https://example.com)', 'link')} className={`${MBTN} border-[#22C55E]/40 text-[#15803d] dark:text-[#4ADE80] hover:bg-[#22C55E]/10`}>🔗 Link</button>
        </div>

        {/* Custom Callouts */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 dark:border-gray-700 pb-1.5 mb-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 mr-1">Insert:</span>
          <button type="button" onClick={() => insertAtCursor('[[tryit]]\n', '\n[[/tryit]]\n', '')} className={`${MBTN} border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10`}>+ Try It</button>
          <button type="button" onClick={() => insertAtCursor('[[note]]\n', '\n[[/note]]\n', '')} className={`${MBTN} border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10`}>+ Note</button>
          <button type="button" onClick={() => insertAtCursor('[[warn]]\n', '\n[[/warn]]\n', '')} className={`${MBTN} border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/10`}>+ Warn</button>
          <button type="button" onClick={() => insertAtCursor('[[tip]]\n', '\n[[/tip]]\n', '')} className={`${MBTN} border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10`}>+ Tip</button>
          <button type="button" onClick={() => insertAtCursor('[[important]]\n', '\n[[/important]]\n', '')} className={`${MBTN} border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10`}>+ Important</button>
        </div>

        {/* Highlight Colors */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 mr-1">Highlight:</span>
          <button type="button" onClick={() => insertAtCursor('[[note]]\n', '\n[[/note]]\n', '')} className={`${MBTN} border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10`}>🟡 Yellow</button>
          <button type="button" onClick={() => insertAtCursor('[[warn]]\n', '\n[[/warn]]\n', '')} className={`${MBTN} border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/10`}>🔴 Red</button>
          <button type="button" onClick={() => insertAtCursor('[[tip]]\n', '\n[[/tip]]\n', '')} className={`${MBTN} border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10`}>🟢 Green</button>
          <button type="button" onClick={() => insertAtCursor('[[important]]\n', '\n[[/important]]\n', '')} className={`${MBTN} border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10`}>🔵 Blue</button>
        </div>
      </div>

      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange({ target: { value: e.target.value } })}
        className="w-full bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono text-gray-900 dark:text-gray-100 outline-none resize-y leading-relaxed"
        style={{ minHeight: h }}
        placeholder={placeholder}
        spellCheck={false}
        required={required}
        disabled={disabled}
        name={name}
        id={id}
        maxLength={maxLength}
      />
    </div>
  )
}