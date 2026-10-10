'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { TRYIT_TEXT } from '@/lib/i18n/tryit-text'

type Props = {
  code: string
  label?: string
  title?: string
  slug?: string
  lessonPath?: string
}

export default function TryIt({
  code,
  label,
  title = 'index.html',
  slug,
  lessonPath,
}: Props) {
  const pathname = usePathname() || ''
  const locale: 'bn' | 'en' = pathname.startsWith('/en') ? 'en' : 'bn'
  const t = TRYIT_TEXT[locale]

  const btnLabel = label ?? t.run
  const [src, setSrc] = useState(code)
  const [isDark, setIsDark] = useState(true)
  const [copied, setCopied] = useState(false)
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  /* ── সাইটের theme ── */
  useEffect(() => {
    const root = document.documentElement
    const sync = () => setIsDark(root.classList.contains('dark'))
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  /* ── Auto-resize textarea ── */
  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight + 4}px`
  }, [])

  useEffect(() => {
    autoResize()
  }, [src, autoResize])

  /* ── iframe render ── */
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(src)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  const handleReset = () => setSrc(code)

  const handleOpenFull = () => {
    try {
      const key = `tryit:${slug || 'x'}:${lessonPath || 'y'}`
      localStorage.setItem(key, src)
    } catch {
      /* ignore */
    }
  }

  const fullEditorHref =
    slug && lessonPath
      ? `/tutorials/${slug}/${lessonPath}/tryit`
      : null

  return (
    <div className="my-6">
      <div className="rounded-xl overflow-hidden border border-emerald-200/70 dark:border-emerald-900/50 bg-white dark:bg-[#0a0f0c] shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-emerald-200/70 dark:border-emerald-900/50 bg-[#f6f8f7] dark:bg-[#080c0a]">
          <span className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="flex gap-1">
              <i className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 block" />
              <i className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 block" />
              <i className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 block" />
            </span>
            {t.editorTitle}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-300/70 dark:border-emerald-800/70 text-slate-600 dark:text-slate-300 hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition-colors"
            >
              {copied ? t.copied : t.copy}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-300/70 dark:border-emerald-800/70 text-slate-600 dark:text-slate-300 hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition-colors"
            >
              ↺ {t.reset}
            </button>
          </div>
        </div>

        {/* Editor + Result */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
          {/* Editor */}
          <div className="flex flex-col min-w-0 md:border-r border-emerald-200/70 dark:border-emerald-900/50">
            <div className="px-3.5 py-2 text-[10.5px] font-extrabold tracking-widest uppercase text-slate-500 dark:text-slate-400 border-b border-emerald-200/70 dark:border-emerald-900/50">
              {title}
            </div>
            <textarea
              ref={textareaRef}
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              onInput={autoResize}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault()
                  run()
                }
              }}
              spellCheck={false}
              rows={1}
              className="w-full resize-none overflow-hidden bg-[#f3f7f4] text-[#15803d] dark:bg-[#050806] dark:text-[#4ADE80] font-mono text-[13.2px] leading-relaxed p-4 outline-none"
            />
          </div>

          {/* Result */}
          <div className="flex flex-col min-w-0 border-t md:border-t-0 border-emerald-200/70 dark:border-emerald-900/50">
            <div className="px-3.5 py-2 text-[10.5px] font-extrabold tracking-widest uppercase text-slate-500 dark:text-slate-400 border-b border-emerald-200/70 dark:border-emerald-900/50">
              {t.result}
            </div>
            <iframe
              ref={frameRef}
              title="Try it result"
              className="flex-1 w-full h-full min-h-0 bg-white dark:bg-[#0a0f0c]"
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 border-t border-emerald-200/70 dark:border-emerald-900/50 bg-[#f6f8f7] dark:bg-[#080c0a]">
          <button
            type="button"
            onClick={run}
            className="inline-flex items-center gap-2 bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] font-extrabold text-[13.5px] px-5 py-2 rounded-lg transition-colors"
          >
            ▶ {btnLabel}
          </button>

          <span className="text-xs text-slate-500 dark:text-slate-400">
            {t.tip}
          </span>

          {fullEditorHref ? (
            <a
              href={fullEditorHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenFull}
              className="inline-flex items-center gap-1.5 border border-emerald-300/70 dark:border-emerald-800/70 text-slate-700 dark:text-slate-200 hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#4ADE80] font-semibold text-[13px] px-4 py-2 rounded-lg transition-colors"
            >
              <span aria-hidden="true">🖥️</span>
              {t.openFull}
              <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}