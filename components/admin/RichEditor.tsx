'use client'

import { useEffect, useRef } from 'react'

/**
 * Hybrid lesson editor (textarea-compatible API):
 *  • Row ১ — MARKER বাটন: `[[note]]...[[/note]]` লেখা বসায়
 *  • Row ২ — FORMAT বাটন: selected text-এ সরাসরি হাইলাইট/লিংক
 *
 * onChange signature textarea-র মতোই: (e: {target:{value:string}}) => void
 */

type Props = {
  value: string
  onChange: (e: { target: { value: string } }) => void
  rows?: number
  minHeight?: number
  placeholder?: string
  className?: string
  // textarea-compatible extras (unused, so swap-in is 1-word):
  required?: boolean
  disabled?: boolean
  name?: string
  id?: string
  maxLength?: number
}

const MBTN =
  'rounded-md border px-2.5 py-1 text-[11px] font-bold transition-colors'

const COLORS = {
  note: { bg: '#FEF3C7', fg: '#78350F' },
  warn: { bg: '#FEE2E2', fg: '#7F1D1D' },
  tip: { bg: '#DCFCE7', fg: '#14532D' },
  important: { bg: '#DBEAFE', fg: '#1E3A8A' },
} as const

export default function RichEditor({
  value,
  onChange,
  rows = 12,
  minHeight,
  placeholder = 'এখানে lesson লিখো…',
  className,
  // textarea-compatible extras — received but not used yet
  required: _required,
  disabled: _disabled,
  name: _name,
  id: _id,
  maxLength: _maxLength,
}: Props) {
  void _required
  void _disabled
  void _name
  void _id
  void _maxLength
  const ref = useRef<HTMLDivElement | null>(null)
  const h = minHeight ?? Math.max(200, rows * 22)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.innerHTML !== value) el.innerHTML = value
  }, [value])

  const fire = () => {
    const el = ref.current
    if (el) onChange({ target: { value: el.innerHTML } })
  }

  const insertText = (text: string) => {
    const el = ref.current
    if (!el) return
    el.focus()
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) {
      el.innerHTML += '<br>' + text
      fire()
      return
    }
    const r = sel.getRangeAt(0)
    r.deleteContents()
    const tn = document.createTextNode(text)
    r.insertNode(tn)
    r.setStartAfter(tn)
    r.setEndAfter(tn)
    sel.removeAllRanges()
    sel.addRange(r)
    fire()
  }

  const applyStyle = (style: Partial<CSSStyleDeclaration>) => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return
    const r = sel.getRangeAt(0)
    const span = document.createElement('span')
    Object.assign(span.style, style)
    span.style.borderRadius = '3px'
    span.style.padding = '1px 4px'
    try {
      r.surroundContents(span)
    } catch {
      const frag = r.extractContents()
      span.appendChild(frag)
      r.insertNode(span)
    }
    sel.removeAllRanges()
    fire()
  }

  const clearFormat = () => {
    const el = ref.current
    if (!el) return
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    let node: Node | null = sel.getRangeAt(0).startContainer
    while (node && node !== el) {
      if (node.nodeType === 1 && (node as HTMLElement).tagName === 'SPAN') {
        const sp = node as HTMLElement
        sp.replaceWith(...Array.from(sp.childNodes))
        fire()
        return
      }
      node = node.parentNode
    }
  }

  const applyLink = () => {
    const url = window.prompt(
      'URL দিন (যেমন /tutorials/html/3 বা https://...)'
    )
    if (!url) return
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return
    const r = sel.getRangeAt(0)
    const a = document.createElement('a')
    a.href = url
    if (/^https?:\/\//i.test(url)) {
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
    }
    a.style.color = '#22C55E'
    a.style.textDecoration = 'underline'
    try {
      r.surroundContents(a)
    } catch {
      const frag = r.extractContents()
      a.appendChild(frag)
      r.insertNode(a)
    }
    sel.removeAllRanges()
    fire()
  }

  return (
    <div
      className={
        className ||
        'rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900'
      }
    >
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-black/20 p-2 space-y-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 mr-1">
            Insert:
          </span>
          <button
            type="button"
            onClick={() => insertText('[[tryit]]\n\n[[/tryit]]\n')}
            className={`${MBTN} border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10`}
          >
            + Try It
          </button>
          <button
            type="button"
            onClick={() => insertText('[[note]]\n\n[[/note]]\n')}
            className={`${MBTN} border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10`}
          >
            + Note
          </button>
          <button
            type="button"
            onClick={() => insertText('[[warn]]\n\n[[/warn]]\n')}
            className={`${MBTN} border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/10`}
          >
            + Warn
          </button>
          <button
            type="button"
            onClick={() => insertText('[[tip]]\n\n[[/tip]]\n')}
            className={`${MBTN} border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10`}
          >
            + Tip
          </button>
          <button
            type="button"
            onClick={() => insertText('[[important]]\n\n[[/important]]\n')}
            className={`${MBTN} border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10`}
          >
            + Important
          </button>
          <button
            type="button"
            onClick={() =>
              insertText('[[link:/tutorials/slug/1|বাটনের লেখা|green]]\n')
            }
            className={`${MBTN} border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10`}
          >
            + Link
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 mr-1">
            Format:
          </span>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              applyStyle({ backgroundColor: COLORS.note.bg, color: COLORS.note.fg })
            }
            className={`${MBTN} border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10`}
          >
            🟡 Yellow
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              applyStyle({ backgroundColor: COLORS.warn.bg, color: COLORS.warn.fg })
            }
            className={`${MBTN} border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/10`}
          >
            🔴 Red
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              applyStyle({ backgroundColor: COLORS.tip.bg, color: COLORS.tip.fg })
            }
            className={`${MBTN} border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10`}
          >
            🟢 Green
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              applyStyle({
                backgroundColor: COLORS.important.bg,
                color: COLORS.important.fg,
              })
            }
            className={`${MBTN} border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10`}
          >
            🔵 Blue
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyStyle({ fontWeight: '700' })}
            className={`${MBTN} border-slate-400/40 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10`}
          >
            <b>B</b>
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={applyLink}
            className={`${MBTN} border-[#22C55E]/40 text-[#15803d] dark:text-[#4ADE80] hover:bg-[#22C55E]/10`}
          >
            🔗 Link
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={clearFormat}
            className={`${MBTN} border-slate-400/40 text-slate-500 hover:bg-slate-500/10`}
          >
            ✕ Clear
          </button>
        </div>
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={fire}
        onBlur={fire}
        data-placeholder={placeholder}
        className="px-3 py-2 text-sm leading-relaxed text-gray-900 dark:text-gray-100 outline-none"
        style={{ minHeight: h }}
      />
    </div>
  )
}
