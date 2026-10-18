'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

export type LanguageOption = { value: string; label: string }

export default function LanguageSelect({
  label,
  allLabel,
  placeholder,
  value,
  options,
  onChange,
  variant = 'inline',
}: {
  label: string
  allLabel: string
  placeholder: string
  value: string
  options: LanguageOption[]
  onChange: (v: string) => void
  variant?: 'inline' | 'block'
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isBlock = variant === 'block'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  const items: LanguageOption[] = useMemo(
    () => [{ value: 'all', label: allLabel }, ...filtered],
    [allLabel, filtered]
  )

  const currentLabel =
    value === 'all' ? allLabel : options.find((o) => o.value === value)?.label ?? value

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  // INTENTIONAL: resetting local UI state (query + highlight) when the
  // dropdown opens — this is imperative, not derivable during render.
   
  useEffect(() => {
    if (!open) return
    setQuery('')
    setHighlight(0)
    const t = setTimeout(() => inputRef.current?.focus(), 20)
    return () => clearTimeout(t)
  }, [open])

  const select = (v: string) => {
    onChange(v)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = items[highlight]
      if (item) select(item.value)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const active = value !== 'all'

  const chevron = (
    <svg
      width={isBlock ? 14 : 12}
      height={isBlock ? 14 : 12}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <div ref={rootRef} className={isBlock ? 'relative w-full' : 'relative flex items-center gap-2'}>
      {!isBlock && (
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-[68px]">
          {label}
        </span>
      )}

      {isBlock ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={label}
          className="w-full px-4 py-3 rounded-2xl text-sm font-medium cursor-pointer bg-white dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition flex items-center justify-between gap-2 text-left"
        >
          <span className="truncate">{currentLabel}</span>
          {chevron}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition border min-w-[150px] justify-between ${
            active
              ? 'bg-[#22C55E] text-[#050806] border-[#22C55E] shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#22C55E]/60 dark:hover:border-[#22C55E]/60'
          }`}
        >
          <span className="truncate">{currentLabel}</span>
          {chevron}
        </button>
      )}

      {open && (
        <div
          className={`absolute z-30 top-full mt-2 bg-white dark:bg-[#0a0f0c] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden ${
            isBlock ? 'left-0 right-0 w-full' : 'left-0 w-64'
          }`}
        >
          <div className="p-2 border-b border-slate-100 dark:border-white/10">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setHighlight(0) }}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#22C55E]"
            />
          </div>

          <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
            {items.length === 0 ? (
              <li className="px-3 py-2 text-xs text-slate-400">—</li>
            ) : (
              items.map((o, i) => {
                const selected = o.value === value
                const isHighlight = i === highlight
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      onClick={() => select(o.value)}
                      onMouseEnter={() => setHighlight(i)}
                      role="option"
                      aria-selected={selected}
                      className={`w-full text-left px-3 py-2 text-xs transition flex items-center justify-between gap-2 ${
                        isHighlight ? 'bg-slate-100 dark:bg-white/5' : ''
                      } ${
                        selected
                          ? 'text-[#15803d] dark:text-[#4ADE80] font-semibold'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span className="truncate">{o.label}</span>
                      {selected && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
