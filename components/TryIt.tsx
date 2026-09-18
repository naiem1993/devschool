'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  /** ইউজার যা এডিট করবে — প্রাথমিক HTML কোড */
  code: string
  /** বাটনের লেখা */
  label?: string
  /** এডিটর প্যানেলের বাঁ পাশের শিরোনাম */
  title?: string
  /** tutorial slug — ↗ বাটনের জন্য দরকার (না থাকলে ↗ দেখাবে না) */
  slug?: string
  /** lesson path for ↗ button — e.g. "html/basic" or "html/basic/exercises" */
  lessonPath?: string
}

/**
 * W3Schools-style "Try it Yourself"
 * — প্রথমে শুধু সবুজ বাটন দেখায়, editor লুকানো থাকে
 * — ক্লিক করলে inline খোলে, আবার ক্লিক / ✕ / ESC-এ বন্ধ হয়
 * — এক পেজে যতবার চাও ব্যবহার করা যায় (প্রতিটা আলাদা state)
 *
 * ★ Theme-aware:
 *   Light mode → প্যানেল হালকা (সাদা/মিন্ট), এডিটর হালকা bg + গাঢ় সবুজ কোড,
 *                Result সাদা bg + কালো টেক্সট
 *   Dark mode  → প্যানেল কালো, এডিটর কালো bg + নিয়ন সবুজ কোড,
 *                Result কালো bg + হালকা টেক্সট
 */
export default function TryIt({
  code,
  label = 'Try it Yourself',
  title = 'index.html',
  slug,
  lessonPath,
}: Props) {
  const [open, setOpen] = useState(false)
  const [src, setSrc] = useState(code)
  const [isDark, setIsDark] = useState(true)
  const frameRef = useRef<HTMLIFrameElement | null>(null)

  /* ── সাইটের theme ট্র্যাক করি (<html class="dark">) ── */
  useEffect(() => {
    const root = document.documentElement
    const sync = () => setIsDark(root.classList.contains('dark'))
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  /* ── Result iframe-এর ভেতরের ডকুমেন্ট (theme অনুযায়ী) ── */
  const run = useCallback(() => {
    const bg = isDark ? '#0a0f0c' : '#ffffff'
    const fg = isDark ? '#e6f4ea' : '#0f1a14'
    const muted = isDark ? '#8b9a90' : '#5b6b62'
    const accent = isDark ? '#4ADE80' : '#15803d'
    const border = isDark ? 'rgba(255,255,255,.12)' : '#cfd8d3'
    const codeBg = isDark ? '#050806' : '#f3f7f4'

    const doc =
      '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' +
      '*{box-sizing:border-box}' +
      'html,body{margin:0;min-height:100%}' +
      'body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Bengali",sans-serif;' +
      'padding:14px;font-size:15px;line-height:1.6;' +
      'background:' + bg + ';color:' + fg + ';}' +
      'h1{font-size:24px;margin:0 0 10px}' +
      'h2{font-size:19px;margin:14px 0 8px}' +
      'h3{font-size:16px;margin:12px 0 6px}' +
      'p{margin:0 0 10px}' +
      'ul,ol{margin:0 0 10px 20px}li{margin:4px 0}' +
      'img{max-width:100%}' +
      'a{color:' + accent + '}' +
      'hr{border:0;border-top:1px solid ' + border + ';margin:14px 0}' +
      'table{border-collapse:collapse;margin:10px 0}' +
      'td,th{border:1px solid ' + border + ';padding:6px}' +
      'pre{background:' + codeBg + ';border:1px solid ' + border + ';border-radius:8px;' +
      'padding:12px;overflow-x:auto;font-family:ui-monospace,Menlo,Consolas,monospace;' +
      'font-size:13.5px;white-space:pre;color:' + fg + '}' +
      'code{font-family:ui-monospace,Menlo,Consolas,monospace;color:' + accent + '}' +
      'blockquote{border-left:3px solid ' + accent + ';margin:10px 0;padding:2px 0 2px 12px;color:' + muted + '}' +
      '</style></head><body>' +
      src +
      '</body></html>'

    if (frameRef.current) frameRef.current.srcdoc = doc
  }, [src, isDark])

  /* প্যানেল খোলা থাকলে render — কোড বা theme বদলালেও */
  useEffect(() => {
    if (open) run()
  }, [open, run])

  /* ESC → বন্ধ */
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
      {/* ── ২টা বাটন: সবুজ toggle (inline editor) + ↗ নতুন ট্যাব ── */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`inline-flex items-center gap-2.5 text-[#050806] font-extrabold text-[14.5px] px-5 py-2.5 rounded-lg transition-colors ${
            open
              ? 'bg-[#15803d] hover:bg-[#166534] text-white'
              : 'bg-[#22C55E] hover:bg-[#4ADE80]'
          }`}
        >
          <span
            className={`inline-block transition-transform duration-200 ${
              open ? '' : 'rotate-90'
            }`}
          >
            {open ? '✕' : '»'}
          </span>
          {open ? 'বন্ধ করুন' : label}
        </button>

        {/* ↗ নতুন ট্যাবে — শুধু slug+lessonPath থাকলে দেখায় */}
        {slug && lessonPath ? (
          <a
            href={`/tutorials/${slug}/${lessonPath}/tryit`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-emerald-300/70 dark:border-emerald-800/70 text-slate-700 dark:text-slate-200 hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#4ADE80] font-semibold text-[13.5px] px-4 py-2.5 rounded-lg transition-colors"
          >
            <span aria-hidden="true">↗</span>
            নতুন ট্যাবে
          </a>
        ) : null}
      </div>

      {/* ── প্যানেল — light: হালকা | dark: কালো ── */}
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
                className="flex-1 min-h-[190px] w-full resize-y bg-[#f3f7f4] text-[#15803d] dark:bg-[#050806] dark:text-[#4ADE80] font-mono text-[13.2px] leading-relaxed p-4 outline-none"
              />
            </div>

            {/* Result — theme-aware (iframe srcdoc থেকে রঙ আসে) */}
            <div className="flex flex-col min-w-0 border-t md:border-t-0 border-emerald-200/70 dark:border-emerald-900/50">
              <div className="px-3.5 py-2 text-[10.5px] font-extrabold tracking-widest uppercase text-slate-500 dark:text-slate-400 border-b border-emerald-200/70 dark:border-emerald-900/50">
                Result
              </div>
              <iframe
                ref={frameRef}
                title="Try it result"
                className="flex-1 min-h-[190px] w-full bg-white dark:bg-[#0a0f0c]"
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
