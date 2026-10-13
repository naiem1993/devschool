'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { runInSandbox } from '@/lib/sandbox-runner'
import { runInJudge0 } from '@/lib/judge0-api'
import { useDict } from '@/lib/i18n/I18nProvider'

type CursorPos = { lineNumber: number; column: number }

type MonacoEditorInstance = {
  addCommand: (keybinding: number, handler: () => void) => void
  onDidChangeCursorPosition: (cb: (e: { position: CursorPos }) => void) => void
  getPosition: () => CursorPos | null
  focus: () => void
  layout: () => void
}

type MonacoTheme = {
  base: string
  inherit: boolean
  rules: Array<{ token: string; foreground?: string; fontStyle?: string }>
  colors: Record<string, string>
}

type MonacoNamespace = {
  KeyMod: { CtrlCmd: number }
  KeyCode: { Enter: number }
  editor: {
    defineTheme: (name: string, theme: MonacoTheme) => void
    setTheme: (name: string) => void
  }
}

type MonacoProps = {
  height?: string | number
  defaultLanguage?: string
  language?: string
  theme?: string
  value?: string
  onChange?: (value: string | undefined) => void
  beforeMount?: (monaco: MonacoNamespace) => void
  onMount?: (editor: MonacoEditorInstance, monaco: MonacoNamespace) => void
  options?: Record<string, unknown>
}

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-[#f3f7f4] dark:bg-[#050806]">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <PlaygroundLoadingLabel />
      </div>
    </div>
  ),
}) as React.ComponentType<MonacoProps>

function PlaygroundLoadingLabel() {
  const t = useDict()
  return <span className="text-xs font-mono text-[#5b6b62] dark:text-[#8b9a90]">{t.playgroundUi.editorLoading}</span>
}

// ── Inline SVG icon set (no dependency) ──
type IconProps = { className?: string }

function IconCopy({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function IconCheck({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function IconReset({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function IconTrash({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  )
}

function IconRotate({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="7" rx="1.5" />
      <rect x="3" y="14" width="18" height="7" rx="1.5" />
    </svg>
  )
}

function IconFullscreen({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}

function IconFullscreenExit({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </svg>
  )
}

function IconPlay({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  )
}

// ── Custom Monaco themes (brand-matched) ──
const DS_DARK: MonacoTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: '', foreground: 'd4d4d4' },
    { token: 'comment', foreground: '6b7f6e', fontStyle: 'italic' },
    { token: 'keyword', foreground: '4ADE80', fontStyle: 'bold' },
    { token: 'keyword.control', foreground: '4ADE80', fontStyle: 'bold' },
    { token: 'string', foreground: 'fbbf24' },
    { token: 'number', foreground: 'f472b6' },
    { token: 'regexp', foreground: 'fb7185' },
    { token: 'operator', foreground: 'e2e8f0' },
    { token: 'delimiter', foreground: '94a3b8' },
    { token: 'tag', foreground: 'f87171' },
    { token: 'attribute.name', foreground: '86efac' },
    { token: 'attribute.value', foreground: 'fbbf24' },
    { token: 'type', foreground: '67e8f9' },
    { token: 'type.identifier', foreground: '67e8f9' },
    { token: 'identifier', foreground: 'e2e8f0' },
    { token: 'function', foreground: 'a5b4fc' },
    { token: 'variable', foreground: 'e2e8f0' },
    { token: 'variable.predefined', foreground: '67e8f9' },
    { token: 'constant', foreground: 'f472b6' },
  ],
  colors: {
    'editor.background': '#050806',
    'editor.foreground': '#e6f4ea',
    'editorLineNumber.foreground': '#3f5247',
    'editorLineNumber.activeForeground': '#4ADE80',
    'editor.lineHighlightBackground': '#0a0f0c',
    'editor.selectionBackground': '#22c55e33',
    'editor.inactiveSelectionBackground': '#22c55e20',
    'editorCursor.foreground': '#4ADE80',
    'editorIndentGuide.background1': '#12201a',
    'editorIndentGuide.activeBackground1': '#1e4030',
    'editorBracketMatch.background': '#22c55e25',
    'editorBracketMatch.border': '#4ADE80',
    'editorGutter.background': '#050806',
    'editorWidget.background': '#080c0a',
    'editorWidget.border': '#064e3b80',
    'scrollbar.shadow': '#00000000',
  },
}

const DS_LIGHT: MonacoTheme = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: '', foreground: '1e293b' },
    { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
    { token: 'keyword', foreground: '15803d', fontStyle: 'bold' },
    { token: 'keyword.control', foreground: '15803d', fontStyle: 'bold' },
    { token: 'string', foreground: 'b45309' },
    { token: 'number', foreground: 'be185d' },
    { token: 'regexp', foreground: 'be123c' },
    { token: 'operator', foreground: '334155' },
    { token: 'delimiter', foreground: '64748b' },
    { token: 'tag', foreground: 'b91c1c' },
    { token: 'attribute.name', foreground: '15803d' },
    { token: 'attribute.value', foreground: 'b45309' },
    { token: 'type', foreground: '0e7490' },
    { token: 'type.identifier', foreground: '0e7490' },
    { token: 'identifier', foreground: '1e293b' },
    { token: 'function', foreground: '4338ca' },
    { token: 'variable', foreground: '1e293b' },
    { token: 'variable.predefined', foreground: '0e7490' },
    { token: 'constant', foreground: 'be185d' },
  ],
  colors: {
    'editor.background': '#f3f7f4',
    'editor.foreground': '#0f1a14',
    'editorLineNumber.foreground': '#94a3b8',
    'editorLineNumber.activeForeground': '#15803d',
    'editor.lineHighlightBackground': '#e8f0eb',
    'editor.selectionBackground': '#22c55e33',
    'editor.inactiveSelectionBackground': '#22c55e20',
    'editorCursor.foreground': '#15803d',
    'editorIndentGuide.background1': '#d8e2dc',
    'editorIndentGuide.activeBackground1': '#a7c7b4',
    'editorBracketMatch.background': '#22c55e25',
    'editorBracketMatch.border': '#15803d',
    'editorGutter.background': '#f3f7f4',
    'editorWidget.background': '#ffffff',
    'editorWidget.border': '#a7f3d0',
    'scrollbar.shadow': '#00000000',
  },
}

function IconSpinner({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

type Lang = 'javascript' | 'html' | 'css' | 'python' | 'java' | 'cpp'

const SAMPLES: Record<Lang, string> = {
  javascript: `// Welcome to DevSchool Playground 🎮\n// Write JS and click Run (Ctrl+Enter)\n\nconst greet = (name) => \`Hello, \${name}!\`;\n\nconsole.log(greet('DevSchool'));\n\nconst nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map((n) => n * 2);\nconsole.log('Doubled:', doubled);\n\nconst sum = nums.reduce((a, b) => a + b, 0);\nconsole.log('Sum:', sum);\n`,
  html: `<!-- HTML Playground 🎨 -->\n<div class="card">\n  <h1>Hello, DevSchool!</h1>\n  <p>Edit me and click Run to preview.</p>\n</div>\n\n<style>\n  .card { padding: 24px; border: 2px solid #4f46e5; border-radius: 16px; font-family: sans-serif; }\n  h1 { color: #4f46e5; margin: 0 0 8px; }\n</style>`,
  css: `/* CSS Playground 🎨 */\n/* Wrap your selectors for a live <style> preview */\n\n.preview-box {\n  padding: 32px;\n  background: linear-gradient(135deg, #6366f1, #06b6d4);\n  color: white;\n  border-radius: 20px;\n  font-family: sans-serif;\n  text-align: center;\n  font-size: 20px;\n  font-weight: bold;\n}`,
  python: `# Python Playground 🐍\n# Write Python and click Run (Ctrl+Enter)\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("DevSchool"))\n\nnums = [1, 2, 3, 4, 5]\ndoubled = [n * 2 for n in nums]\nprint("Doubled:", doubled)\n\ntotal = sum(nums)\nprint("Sum:", total)\n`,
  java: `// Java Playground ☕\n// Write Java and click Run (Ctrl+Enter)\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, DevSchool!");\n        \n        int[] nums = {1, 2, 3, 4, 5};\n        int sum = 0;\n        for (int n : nums) sum += n;\n        System.out.println("Sum: " + sum);\n    }\n}\n`,
  cpp: `// C++ Playground ⚙️\n// Write C++ and click Run (Ctrl+Enter)\n\n#include <iostream>\n#include <vector>\n#include <numeric>\n\nint main() {\n    std::cout << "Hello, DevSchool!" << std::endl;\n    \n    std::vector<int> nums = {1, 2, 3, 4, 5};\n    int sum = std::accumulate(nums.begin(), nums.end(), 0);\n    std::cout << "Sum: " << sum << std::endl;\n    return 0;\n}\n`,
}

type LangMeta = { id: Lang; label: string; dot: string; monacoLang: string; remote?: boolean }

const LANGUAGES: LangMeta[] = [
  { id: 'javascript', label: 'JavaScript', dot: 'bg-yellow-400', monacoLang: 'javascript' },
  { id: 'html', label: 'HTML', dot: 'bg-orange-500', monacoLang: 'html' },
  { id: 'css', label: 'CSS', dot: 'bg-sky-500', monacoLang: 'css' },
  { id: 'python', label: 'Python', dot: 'bg-blue-500', monacoLang: 'python', remote: true },
  { id: 'java', label: 'Java', dot: 'bg-red-500', monacoLang: 'java', remote: true },
  { id: 'cpp', label: 'C++', dot: 'bg-indigo-500', monacoLang: 'cpp', remote: true },
]

const PRIMARY_LANGS = LANGUAGES.filter((l) => !l.remote)
const REMOTE_LANGS_META = LANGUAGES.filter((l) => l.remote)

export default function PlaygroundClient() {
  const t = useDict()
  const [lang, setLang] = useState<Lang>('javascript')
  const [code, setCode] = useState(SAMPLES.javascript)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [cursor, setCursor] = useState<CursorPos>({ lineNumber: 1, column: 1 })
  const [runtime, setRuntime] = useState<number | null>(null)
  const [splitPct, setSplitPct] = useState(50)
  const [orientation, setOrientation] = useState<'h' | 'v'>('h')
  const [isDark, setIsDark] = useState(true)
  const splitRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  // ── Orientation persistence ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem('playground:orientation')
      if (saved === 'h' || saved === 'v') setOrientation(saved)
    } catch { /* ignore */ }
  }, [])

  const toggleOrientation = () => {
    setOrientation((o) => {
      const next = o === 'h' ? 'v' : 'h'
      try { localStorage.setItem('playground:orientation', next) } catch { /* ignore */ }
      return next
    })
  }

  // ── Theme sync: observe <html class="dark"> changes ──
  useEffect(() => {
    const root = document.documentElement
    const sync = () => setIsDark(root.classList.contains('dark'))
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`playground:${lang}`)
      if (saved) setCode(saved)
      else setCode(SAMPLES[lang])
    } catch {
      setCode(SAMPLES[lang])
    }
    setOutput('')
    setRuntime(null)
  }, [lang])

  const run = useCallback(async () => {
    setRunning(true)
    const started = performance.now()
    try {
      if (lang === 'javascript') {
        const r = await runInSandbox(code, '', 'playground')
        setOutput(r.error ? `✗ ${r.error}` : r.output || '(no output)')
      } else if (lang === 'html') {
        setOutput('__HTML_PREVIEW__')
      } else if (lang === 'css') {
        setOutput('__CSS_PREVIEW__')
      } else if (lang === 'python' || lang === 'java' || lang === 'cpp') {
        // Remote execution via Judge0 CE
        setOutput('⏳ Running on remote server...')
        const r = await runInJudge0(lang, code, '', 5000)
        setOutput(r.error ? `✗ ${r.error}` : r.output || '(no output)')
      }
    } finally {
      const ms = performance.now() - started
      setRuntime(ms)
      setRunning(false)
    }
  }, [code, lang])

  const runRef = useRef(run)
  useEffect(() => {
    runRef.current = run
  }, [run])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* ignore */ }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        runRef.current()
      }
      if (e.key === 'Escape') {
        setFullscreen((f) => (f ? false : f))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    try { localStorage.setItem(`playground:${lang}`, code) } catch { /* ignore */ }
  }, [code, lang])

  // ── Resizable split (mouse + touch) ──
  useEffect(() => {
    const onMove = (clientX: number) => {
      if (!draggingRef.current || !splitRef.current) return
      const rect = splitRef.current.getBoundingClientRect()
      const pct = ((clientX - rect.left) / rect.width) * 100
      setSplitPct(Math.min(80, Math.max(20, pct)))
    }
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX)
    const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX)
    const stop = () => { draggingRef.current = false; document.body.style.cursor = ''; document.body.style.userSelect = '' }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', stop)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', stop)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', stop)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', stop)
    }
  }, [])

  const startDrag = () => {
    draggingRef.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const previewKind = output === '__HTML_PREVIEW__' ? 'html' : output === '__CSS_PREVIEW__' ? 'css' : null

  const srcDoc = (() => {
    if (!previewKind) return ''
    if (previewKind === 'html') {
      return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:system-ui,sans-serif;margin:0;padding:24px;background:#fff;color:#111}</style></head><body>${code}</body></html>`
    }
    return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:system-ui,sans-serif;margin:0;padding:24px;background:#fff;color:#111}${code}</style></head><body><div class="preview-box">${t.playgroundUi.cssPreview}</div></body></html>`
  })()

  const containerClass = fullscreen
    ? 'fixed inset-0 z-[100] bg-white dark:bg-[#0a0f0c] flex flex-col'
    : 'flex flex-col border border-emerald-200/70 dark:border-emerald-900/50 rounded-xl overflow-hidden bg-white dark:bg-[#0a0f0c] lg:h-[calc(100dvh-128px)] shadow-sm'

  const monacoLang = LANGUAGES.find((l) => l.id === lang)?.monacoLang || 'javascript'
  const isHorizontal = orientation === 'h'
  // Horizontal → grid item, pura height per column
  // Vertical  → flex-col, duita panel exactly 50-50 (mobile e 45dvh each)
  const panelHeight = isHorizontal
    ? (fullscreen ? 'h-full' : 'h-[45dvh] lg:h-full')
    : 'h-[45dvh] lg:h-auto lg:basis-1/2 lg:flex-none lg:min-h-0'

  return (
    <div className={containerClass}>
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-3.5 py-2 bg-[#f6f8f7] dark:bg-[#080c0a] border-b border-emerald-200/70 dark:border-emerald-900/50 flex-wrap">
        <div className="flex items-center gap-1 overflow-x-auto ds-scroll">
          {PRIMARY_LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                lang === l.id
                  ? 'bg-[#22C55E] text-[#050806]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#22C55E] dark:hover:text-[#4ADE80] hover:bg-emerald-50/70 dark:hover:bg-emerald-900/20'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${l.dot}`} aria-hidden />
              {l.label}
            </button>
          ))}
          <span className="mx-1 w-px h-5 bg-emerald-200/70 dark:bg-emerald-900/50 shrink-0" aria-hidden />
          {REMOTE_LANGS_META.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                lang === l.id
                  ? 'bg-[#22C55E] text-[#050806]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#22C55E] dark:hover:text-[#4ADE80] hover:bg-emerald-50/70 dark:hover:bg-emerald-900/20'
              }`}
              title={`${l.label} (runs on remote server)`}
            >
              <span className={`w-2 h-2 rounded-full ${l.dot}`} aria-hidden />
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={copy}
            className={`p-1.5 rounded-md border transition-colors ${
              copied
                ? 'text-[#22C55E] border-[#22C55E] bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-emerald-300/70 dark:border-emerald-800/70 text-slate-600 dark:text-slate-300 hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#4ADE80]'
            }`}
            title={t.playgroundUi.copy}
            aria-label={t.playgroundUi.copy}
          >
            {copied ? <IconCheck /> : <IconCopy />}
          </button>
          <button
            onClick={() => { setCode(SAMPLES[lang]); setOutput(''); setRuntime(null) }}
            className="p-1.5 rounded-md border border-emerald-300/70 dark:border-emerald-800/70 text-slate-600 dark:text-slate-300 hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition-colors"
            title={t.playgroundUi.reset}
            aria-label={t.playgroundUi.reset}
          >
            <IconReset />
          </button>
          <button
            onClick={() => { setCode(''); setOutput(''); setRuntime(null) }}
            className="p-1.5 rounded-md border border-emerald-300/70 dark:border-emerald-800/70 text-slate-600 dark:text-slate-300 hover:border-red-500 hover:text-red-500 transition-colors"
            title={t.playgroundUi.clear}
            aria-label={t.playgroundUi.clear}
          >
            <IconTrash />
          </button>
          <button
            onClick={toggleOrientation}
            className="p-1.5 rounded-md border border-emerald-300/70 dark:border-emerald-800/70 text-slate-600 dark:text-slate-300 hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition-colors"
            title={orientation === 'h' ? 'Switch to vertical layout' : 'Switch to horizontal layout'}
            aria-label="Change orientation"
          >
            <IconRotate />
          </button>
          <button
            onClick={() => setFullscreen((f) => !f)}
            className="p-1.5 rounded-md border border-emerald-300/70 dark:border-emerald-800/70 text-slate-600 dark:text-slate-300 hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition-colors"
            title={fullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
            aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? <IconFullscreenExit /> : <IconFullscreen />}
          </button>
        </div>
      </div>

      {/* ── Split area ── */}
      <div
        ref={splitRef}
        className={`flex-1 min-h-0 flex flex-col ${
          isHorizontal
            ? (fullscreen ? 'grid grid-cols-[1fr_auto_1fr]' : 'lg:grid lg:grid-cols-[1fr_auto_1fr]')
            : ''
        }`}
        style={isHorizontal && splitPct !== 50 ? { gridTemplateColumns: `minmax(0, ${splitPct}fr) auto minmax(0, ${100 - splitPct}fr)` } : undefined}
      >
        {/* Editor */}
        <div className={`${panelHeight} min-w-0 min-h-0 flex flex-col ${isHorizontal ? 'border-b lg:border-b-0' : 'border-b'} border-emerald-200/70 dark:border-emerald-900/50`}>
          <div className="flex-1 min-h-0">
          <MonacoEditor
            height="100%"
            language={monacoLang}
            theme={isDark ? 'ds-dark' : 'ds-light'}
            value={code}
            onChange={(v) => setCode(v || '')}
            beforeMount={(monaco) => {
              monaco.editor.defineTheme('ds-dark', DS_DARK)
              monaco.editor.defineTheme('ds-light', DS_LIGHT)
            }}
            onMount={(editor, monaco) => {
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                () => { runRef.current() }
              )
              // Monaco mount er por sathe sathe position ready thake na —
              // tai next frame e read kori jate correct Ln/Col dekhay.
              requestAnimationFrame(() => {
                const pos = editor.getPosition()
                if (pos) setCursor({ lineNumber: pos.lineNumber, column: pos.column })
              })
              editor.onDidChangeCursorPosition((e) => {
                setCursor({ lineNumber: e.position.lineNumber, column: e.position.column })
              })
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
              fontLigatures: true,
              scrollBeyondLastLine: false,
              padding: { top: 14, bottom: 14 },
              tabSize: 2,
              automaticLayout: true,
              wordWrap: 'on',
              renderLineHighlight: 'line',
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
                useShadows: false,
                verticalSliderSize: 8,
                horizontalSliderSize: 8,
                alwaysConsumeMouseWheel: false,
              },
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              renderWhitespace: 'selection',
              bracketPairColorization: { enabled: true },
              guides: { bracketPairs: true, indentation: false },
              lineNumbersMinChars: 3,
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 8,
            }}
          />
          </div>
          {/* Editor bottom action bar with big Run button */}
          <div className="flex items-center gap-2 px-3 sm:px-3.5 py-2.5 bg-[#f6f8f7] dark:bg-[#080c0a] border-t border-emerald-200/70 dark:border-emerald-900/50 shrink-0">
            <button
              onClick={run}
              disabled={running}
              className="flex-1 sm:flex-none px-3 py-1 bg-[#22C55E] hover:bg-[#4ADE80] active:bg-[#16a34a] text-[#050806] rounded text-[10.5px] font-extrabold tracking-widest uppercase transition disabled:opacity-50 flex items-center justify-center gap-1.5"
              title="Run (Ctrl+Enter)"
            >
              {running ? <IconSpinner className="w-3 h-3" /> : <IconPlay className="w-3 h-3" />}
              {running ? t.playgroundUi.running : t.playgroundUi.run}
            </button>
            <span className="hidden sm:inline text-[10.5px] text-[#5b6b62] dark:text-[#8b9a90] font-mono">
              Ctrl + Enter
            </span>
          </div>
        </div>

        {/* Drag handle (desktop only, horizontal layout) */}
        {isHorizontal && (
          <div
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            className="hidden lg:flex w-px relative cursor-col-resize bg-emerald-200/60 dark:bg-emerald-900/40 hover:bg-[#22C55E] transition-colors items-center justify-center group shrink-0"
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panels"
          >
            <span className="absolute w-1 h-8 rounded-full bg-emerald-300 dark:bg-emerald-800 opacity-0 group-hover:opacity-100 group-hover:bg-white transition-all" aria-hidden />
          </div>
        )}

        {/* Output */}
        <div className={`${panelHeight} min-w-0 min-h-0 flex flex-col bg-white dark:bg-[#0a0f0c]`}>
          {previewKind ? (
            <iframe
              title="preview"
              className="w-full flex-1 bg-white"
              sandbox="allow-scripts"
              srcDoc={srcDoc}
            />
          ) : (
            <div className="flex-1 overflow-auto ds-scroll">
              {output ? (
                <pre className="p-4 text-[13.2px] text-[#15803d] dark:text-[#4ADE80] font-mono whitespace-pre-wrap leading-relaxed">
                  {output}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-start pt-[14vh] text-center px-6 select-none">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-[#0a1810] flex items-center justify-center mb-4 text-emerald-500 dark:text-[#4ADE80] ring-1 ring-emerald-200/70 dark:ring-emerald-900/50 shadow-sm">
                    <IconPlay className="w-5 h-5 ml-0.5" />
                  </div>
                  <p className="text-[13px] font-medium text-slate-600 dark:text-slate-300">
                    {t.playgroundUi.emptyOutput}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-[#5b6b62] dark:text-[#8b9a90] font-mono">
                    <kbd className="px-1.5 py-0.5 rounded border border-emerald-200/70 dark:border-emerald-900/50 bg-white dark:bg-[#080c0a] text-[10px] font-semibold">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-1.5 py-0.5 rounded border border-emerald-200/70 dark:border-emerald-900/50 bg-white dark:bg-[#080c0a] text-[10px] font-semibold">Enter</kbd>
                  </p>
                </div>
              )}
            </div>
          )}
          {/* Console footer — symmetric with editor bottom bar */}
          <div className="flex items-center justify-between gap-2 px-3 sm:px-3.5 py-2 bg-[#f6f8f7] dark:bg-[#080c0a] border-t border-emerald-200/70 dark:border-emerald-900/50 shrink-0 min-h-[44px]">
            <span className="flex items-center gap-2 text-[10.5px] font-extrabold tracking-widest uppercase text-slate-500 dark:text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" aria-hidden />
              {previewKind ? 'Preview' : 'Output'}
            </span>
            <span className="text-[11px] text-[#5b6b62] dark:text-[#8b9a90] font-mono">
              {runtime !== null ? `${runtime.toFixed(0)} ms` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center justify-between gap-3 px-3 py-1 bg-[#22C55E] text-[#050806] text-[11px] font-mono select-none">
        <div className="flex items-center gap-3 min-w-0">
          <span className="truncate">{LANGUAGES.find((l) => l.id === lang)?.label}</span>
          <span className="opacity-70" aria-hidden>|</span>
          <span className="truncate">Ln {cursor.lineNumber}, Col {cursor.column}</span>
          <span className="opacity-70" aria-hidden>|</span>
          <span className="truncate">{code.split('\n').length} lines</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {runtime !== null && (
            <>
              <span className="opacity-90">{runtime.toFixed(0)} ms</span>
              <span className="opacity-70" aria-hidden>|</span>
            </>
          )}
          <span className="opacity-90">{running ? 'Running…' : 'Ready'}</span>
        </div>
      </div>
    </div>
  )
}
