'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Props = {
  code: string
  tutorialTitle: string
  chapterTitle: string
  slug: string
  chapterNo: number
}

/**
 * Full-page "Try it Yourself" editor।
 * — বাঁ দিকে বড় editor, ডানে বড় preview
 * — Ctrl/Cmd + Enter চাপলেই run
 * — theme-aware (সাইটের <html class="dark"> ট্র্যাক করে)
 */
export default function TryItFullClient({
  code,
  tutorialTitle,
  chapterTitle,
  slug,
  chapterNo,
}: Props) {
  const [src, setSrc] = useState(code)
  const [isDark, setIsDark] = useState(true)
  const [copied, setCopied] = useState(false)
  const frameRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    const root = document.documentElement
    const sync = () => setIsDark(root.classList.contains('dark'))
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

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

  useEffect(() => {
    run()
  }, [run])

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(src)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard না থাকলে চুপচাপ */
    }
  }, [src])

  const reset = useCallback(() => setSrc(code), [code])

  return (
    <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806] text-slate-900 dark:text-slate-100">
      {/* top bar */}
      <header className="sticky top-0 z-10 border-b border-emerald-200/60 dark:border-emerald-900/40 bg-white/85 dark:bg-[#080c0a]/85 backdrop-blur">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap">
          <Link
            href={`/tutorials/${slug}/${chapterNo}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition-colors"
          >
            ← ফিরে যান
          </Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {tutorialTitle} / {chapterTitle}
          </span>
        </div>
      </header>

      {/* two-pane editor */}
      <main className="max-w-[1500px] mx-auto px-3 sm:px-5 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* editor pane */}
          <section className="flex flex-col rounded-xl overflow-hidden border border-emerald-200/70 dark:border-emerald-900/50 bg-white dark:bg-[#0a0f0c] shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-emerald-200/70 dark:border-emerald-900/50 bg-[#f6f8f7] dark:bg-[#080c0a]">
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                index.html
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copy}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-md border border-emerald-200/70 dark:border-emerald-900/50 text-slate-600 dark:text-slate-300 hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition-colors"
                >
                  {copied ? '✓ কপি হয়েছে' : 'কপি'}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-md border border-emerald-200/70 dark:border-emerald-900/50 text-slate-600 dark:text-slate-300 hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition-colors"
                >
                  রিসেট
                </button>
              </div>
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
              className="flex-1 min-h-[340px] lg:min-h-[calc(100vh-190px)] w-full resize-none bg-[#f3f7f4] text-[#15803d] dark:bg-[#050806] dark:text-[#4ADE80] font-mono text-[13.5px] leading-relaxed p-4 outline-none"
            />
          </section>

          {/* preview pane */}
          <section className="flex flex-col rounded-xl overflow-hidden border border-emerald-200/70 dark:border-emerald-900/50 bg-white dark:bg-[#0a0f0c] shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-emerald-200/70 dark:border-emerald-900/50 bg-[#f6f8f7] dark:bg-[#080c0a]">
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                Result
              </span>
              <button
                type="button"
                onClick={run}
                className="bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] font-extrabold text-[12.5px] px-4 py-1.5 rounded-md transition-colors"
              >
                Run »
              </button>
            </div>
            <iframe
              ref={frameRef}
              title="Try it result"
              className="flex-1 min-h-[340px] lg:min-h-[calc(100vh-190px)] w-full bg-white dark:bg-[#0a0f0c]"
            />
          </section>
        </div>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          টিপ: Ctrl / Cmd + <kbd className="px-1.5 py-0.5 rounded border border-emerald-200/70 dark:border-emerald-900/50 text-[10px]">Enter</kbd> চাপলে সাথে সাথে run হবে।
        </p>
      </main>
    </div>
  )
}
