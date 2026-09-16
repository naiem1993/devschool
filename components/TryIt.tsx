'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  /** ইউজার যা এডিট করবে — প্রাথমিক HTML কোড */
  code: string
  /** বাটনের লেখা */
  label?: string
  /** এডিটর প্যানেলের বাঁ পাশের শিরোনাম */
  title?: string
}

/**
 * W3Schools-style "Try it Yourself"
 * — প্রথমে শুধু সবুজ বাটন দেখায়, editor লুকানো থাকে
 * — ক্লিক করলে inline খোলে, আবার ক্লিক / ✕ / ESC-এ বন্ধ হয়
 * — এক পেজে যতবার চাও ব্যবহার করা যায় (প্রতিটা আলাদা state)
 */
export default function TryIt({
  code,
  label = 'Try it Yourself',
  title = 'index.html',
}: Props) {
  const [open, setOpen] = useState(false)
  const [src, setSrc] = useState(code)
  const frameRef = useRef<HTMLIFrameElement | null>(null)

  const run = () => {
    const doc =
      '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<style>' +
      'body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Bengali",sans-serif;padding:14px;color:#0f1a14;font-size:15px;line-height:1.6}' +
      'h1{font-size:24px;margin:0 0 10px}h2{font-size:19px;margin:14px 0 8px}h3{font-size:16px;margin:12px 0 6px}' +
      'p{margin:0 0 10px}ul,ol{margin:0 0 10px 20px}li{margin:4px 0}img{max-width:100%}' +
      'table{border-collapse:collapse}td,th{border:1px solid #cfd8d3;padding:6px}' +
      '</style></head><body>' +
      src +
      '</body></html>'
    if (frameRef.current) frameRef.current.srcdoc = doc
  }

  // প্যানেল খোলার পরে প্রথমবার render চালাও
  useEffect(() => {
    if (open) run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // ESC → বন্ধ
  useEffect(() => {
    if (!open) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open])

  return (
    <div className="my-5">
      {/* ── সবুজ বাটন (ডিফল্ট অবস্থায় শুধু এটাই দেখা যায়) ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-2.5 bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] font-extrabold text-[14.5px] px-5 py-2.5 rounded-lg transition-colors"
      >
        <span
          className={`inline-block transition-transform duration-200 ${
            open ? 'rotate-90' : ''
          }`}
        >
          »
        </span>
        {label}
      </button>

      {/* ── প্যানেল (প্রথমে লুকানো) ── */}
      {open && (
        <div className="mt-3 rounded-xl overflow-hidden border border-emerald-200/70 dark:border-emerald-900/50 bg-white dark:bg-[#0a0f0c] shadow-lg">
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-emerald-200/70 dark:border-emerald-900/50 bg-[#f6f8f7] dark:bg-[#080c0a]">
            <span className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="flex gap-1">
                <i className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 block" />
                <i className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 block" />
                <i className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 block" />
              </span>
              Try it Yourself — Editor
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close editor"
              className="w-6 h-6 flex items-center justify-center rounded-md border border-emerald-200/70 dark:border-emerald-900/50 text-slate-500 hover:text-red-500 hover:border-red-400 transition-colors text-xs"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Editor */}
            <div className="flex flex-col min-w-0 md:border-r border-emerald-200/70 dark:border-emerald-900/50">
              <div className="px-3.5 py-2 text-[10.5px] font-extrabold tracking-widest uppercase text-slate-500 dark:text-slate-400 border-b border-emerald-200/70 dark:border-emerald-900/50">
                {title}
              </div>
              <textarea
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault()
                    run()
                  }
                }}
                spellCheck={false}
                className="flex-1 min-h-[190px] w-full resize-y bg-[#050806] text-[#4ADE80] font-mono text-[13.2px] leading-relaxed p-4 outline-none"
              />
            </div>

            {/* Result */}
            <div className="flex flex-col min-w-0 border-t md:border-t-0 border-emerald-200/70 dark:border-emerald-900/50">
              <div className="px-3.5 py-2 text-[10.5px] font-extrabold tracking-widest uppercase text-slate-500 dark:text-slate-400 border-b border-emerald-200/70 dark:border-emerald-900/50">
                Result
              </div>
              <iframe
                ref={frameRef}
                title="Try it result"
                className="flex-1 min-h-[190px] w-full bg-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 px-3.5 py-2.5 border-t border-emerald-200/70 dark:border-emerald-900/50 bg-[#f6f8f7] dark:bg-[#080c0a]">
            <button
              type="button"
              onClick={run}
              className="bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] font-extrabold text-[13.5px] px-5 py-2 rounded-lg transition-colors"
            >
              Run »
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              কোড এডিট করে <b>Run</b> চাপো — Ctrl/⌘ + Enter-ও কাজ করে
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
