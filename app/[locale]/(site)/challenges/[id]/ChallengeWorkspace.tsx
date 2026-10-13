'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  runInSandbox,
  TIMEOUT_CHALLENGE_MS,
  TIMEOUT_CHALLENGE_TOTAL_MS,
} from '@/lib/sandbox-runner'
import { runChallenge, buildPreviewDoc } from '@/lib/challenge-runner'
import { useDict, useLocale } from '@/lib/i18n/I18nProvider'
import { localeHref } from '@/lib/i18n/link'

// ── Monaco types ──
type MonacoEditorInstance = {
  addCommand: (keybinding: number, handler: () => void) => void
  onDidChangeCursorPosition: (cb: (e: { position: { lineNumber: number; column: number } }) => void) => void
  getPosition: () => { lineNumber: number; column: number } | null
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

// ── Loading skeleton (green dots, TryIt/Playground style) ──
function ChallengeEditorLoading() {
  const t = useDict().challengeWorkspace
  return (
    <div className="h-full flex items-center justify-center bg-[#f3f7f4] dark:bg-[#050806]">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-xs font-mono text-[#5b6b62] dark:text-[#8b9a90]">{t.editorLoading}</span>
      </div>
    </div>
  )
}

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <ChallengeEditorLoading />,
}) as React.ComponentType<MonacoProps>

// ── Custom Monaco themes (brand-matched, same as Playground) ──
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

// ── Inline SVG icons (same as Playground) ──
type IconProps = { className?: string }

function IconPlay({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.14v14l11-7-11-7z" />
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

function IconEye({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
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

function IconSpinner({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

type TestCase = { id: string; input: string; expectedOutput: string; isHidden: boolean }
type TestResult = { id: string; passed: boolean; output: string; expected: string; error?: string }

export default function ChallengeWorkspace({
  challengeId,
  starterCode,
  solution,
  testCases,
  tutorialSlug,
  tutorialTitle,
  language = 'js',
}: {
  challengeId: string
  starterCode: string
  solution: string | null
  testCases: TestCase[]
  tutorialSlug: string
  tutorialTitle: string
  language?: string
}) {
  const t = useDict().challengeWorkspace
  const locale = useLocale()

  // ── Filename per language ──
  const editorFilename =
    language === 'html' ? 'index.html'
    : language === 'css' ? 'styles.css'
    : language === 'ts' ? 'solution.ts'
    : language === 'python' ? 'solution.py'
    : language === 'java' ? 'Main.java'
    : language === 'cpp' ? 'solution.cpp'
    : language === 'c' ? 'solution.c'
    : language === 'go' ? 'solution.go'
    : language === 'rust' ? 'solution.rs'
    : language === 'php' ? 'solution.php'
    : language === 'csharp' ? 'Solution.cs'
    : language === 'kotlin' ? 'Solution.kt'
    : language === 'swift' ? 'Solution.swift'
    : 'solution.js'

  // ── Monaco language ID ──
  const monacoLang =
    language === 'html' ? 'html'
    : language === 'css' ? 'css'
    : language === 'ts' ? 'typescript'
    : language === 'python' ? 'python'
    : language === 'java' ? 'java'
    : language === 'cpp' || language === 'c' ? 'cpp'
    : language === 'go' ? 'go'
    : language === 'rust' ? 'rust'
    : language === 'php' ? 'php'
    : language === 'csharp' ? 'csharp'
    : language === 'kotlin' ? 'kotlin'
    : language === 'swift' ? 'swift'
    : 'javascript'

  const [code, setCode] = useState(starterCode)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [runningCustom, setRunningCustom] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [activeTab, setActiveTab] = useState<'tests' | 'output' | 'preview'>('tests')
  const [customOutput, setCustomOutput] = useState('')
  const [orientation, setOrientation] = useState<'h' | 'v'>('h')
  const [splitPct, setSplitPct] = useState(50)
  const [fullscreen, setFullscreen] = useState(false)
  const splitRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [isDark, setIsDark] = useState(true)
  const [cursor, setCursor] = useState({ lineNumber: 1, column: 1 })
  const [runtime, setRuntime] = useState<number | null>(null)

  // ── Theme sync via MutationObserver ──
  useEffect(() => {
    const root = document.documentElement
    const sync = () => setIsDark(root.classList.contains('dark'))
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  // ── Orientation persistence ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem('challenge:orientation')
      if (saved === 'h' || saved === 'v') setOrientation(saved)
    } catch { /* ignore */ }
  }, [])

  const toggleOrientation = () => {
    setOrientation((o) => {
      const next = o === 'h' ? 'v' : 'h'
      try { localStorage.setItem('challenge:orientation', next) } catch { /* ignore */ }
      return next
    })
  }

  const toggleFullscreen = () => {
    setFullscreen((f) => !f)
  }

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
    const stop = () => {
      draggingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
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

  // ── Esc to exit fullscreen ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen((f) => (f ? false : f))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // ── Run all tests ──
  const runTests = useCallback(async () => {
    setRunning(true)
    setActiveTab('tests')
    const start = Date.now()

    try {
      const list = await runChallenge(language, code, testCases, solution)

      if (Date.now() - start > TIMEOUT_CHALLENGE_TOTAL_MS) {
        console.warn('Challenge took too long overall')
      }

      setResults(list)
    } catch (err: any) {
      setResults(
        testCases.map((tc) => ({
          id: tc.id,
          passed: false,
          output: '',
          expected: tc.expectedOutput,
          error: err?.message || String(err),
        }))
      )
    } finally {
      setRuntime(Date.now() - start)
      setRunning(false)
    }
  }, [code, testCases, language, solution])

  // ── Run custom (single output) ──
  const runCustom = useCallback(async () => {
    setActiveTab('output')
    setRunningCustom(true)
    const start = Date.now()
    try {
      const r = await runInSandbox(code, '', 'challenge', TIMEOUT_CHALLENGE_MS)
      setCustomOutput(r.error ? `✗ ${r.error}` : r.output || '(no output)')
    } catch (err: any) {
      setCustomOutput(`✗ ${err?.message || String(err)}`)
    } finally {
      setRuntime(Date.now() - start)
      setRunningCustom(false)
    }
  }, [code])

  // ── Stale closure ref for Ctrl+Enter ──
  const runTestsRef = useRef(runTests)
  useEffect(() => {
    runTestsRef.current = runTests
  }, [runTests])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        runTestsRef.current()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const totalCount = testCases.length
  const hiddenCount = testCases.filter((tc) => tc.isHidden).length
  const passedCount = results?.filter((r) => r.passed).length ?? 0
  const allPassed = results !== null && passedCount === totalCount && totalCount > 0

  const resultsWithMeta = results?.map((r) => {
    const tc = testCases.find((tc) => tc.id === r.id)
    return { ...r, isHidden: tc?.isHidden ?? false }
  }) ?? null

  const isHorizontal = orientation === 'h'
  const isHtmlOrCss = language === 'html' || language === 'css'

  const containerClass = fullscreen
    ? 'fixed inset-0 z-[100] bg-white dark:bg-[#0a0f0c] flex flex-col p-2'
    : 'flex flex-col border border-emerald-200/70 dark:border-emerald-900/50 rounded-xl overflow-hidden bg-white dark:bg-[#0a0f0c] shadow-sm lg:h-[calc(100dvh-260px)] lg:min-h-[600px]'

  return (
    <div className={containerClass}>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-[#f6f8f7] dark:bg-[#080c0a] border-b border-emerald-200/70 dark:border-emerald-900/50 shrink-0 flex-wrap">
        {/* Left: filename */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center gap-2 text-[10.5px] font-extrabold tracking-widest uppercase text-slate-500 dark:text-slate-400 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0" aria-hidden />
            {editorFilename}
          </span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Primary: Run Tests */}
          <button
            onClick={runTests}
            disabled={running}
            className="px-3 py-1.5 bg-[#22C55E] hover:bg-[#4ADE80] active:bg-[#16a34a] text-[#050806] rounded-md text-[11px] font-extrabold tracking-wider uppercase transition flex items-center gap-1.5 disabled:opacity-50"
            title="Run Tests (Ctrl+Enter)"
          >
            {running ? <IconSpinner className="w-3 h-3" /> : <IconPlay className="w-3 h-3" />}
            {running ? t.btnRunning : t.btnRunTests}
          </button>

          {/* Secondary: Run Custom */}
          <button
            onClick={runCustom}
            disabled={runningCustom}
            className="p-1.5 rounded-md border border-emerald-300/70 dark:border-emerald-800/70 text-slate-600 dark:text-slate-300 hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition-colors disabled:opacity-50"
            title={t.btnRunCustom}
            aria-label={t.btnRunCustom}
          >
            {runningCustom ? <IconSpinner /> : <IconPlay />}
          </button>

          {/* Reset */}
          <button
            onClick={() => { setCode(starterCode); setResults(null); setCustomOutput(''); setRuntime(null) }}
            className="p-1.5 rounded-md border border-emerald-300/70 dark:border-emerald-800/70 text-slate-600 dark:text-slate-300 hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition-colors"
            title={t.btnReset}
            aria-label={t.btnReset}
          >
            <IconReset />
          </button>

          {/* Show solution */}
          {solution && (
            <button
              onClick={() => setShowSolution((s) => !s)}
              className={`p-1.5 rounded-md border transition-colors ${
                showSolution
                  ? 'border-amber-500 text-amber-500 bg-amber-500/10'
                  : 'border-emerald-300/70 dark:border-emerald-800/70 text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500'
              }`}
              title={showSolution ? t.btnHideSolution : t.btnShowSolution}
              aria-label={showSolution ? t.btnHideSolution : t.btnShowSolution}
            >
              <IconEye />
            </button>
          )}

          <span className="w-px h-5 bg-emerald-300/70 dark:bg-emerald-800/70 mx-0.5" aria-hidden />

          {/* Rotate */}
          <button
            onClick={toggleOrientation}
            className="p-1.5 rounded-md border border-emerald-300/70 dark:border-emerald-800/70 text-slate-600 dark:text-slate-300 hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#4ADE80] transition-colors"
            title={orientation === 'h' ? 'Switch to vertical layout' : 'Switch to horizontal layout'}
            aria-label="Change orientation"
          >
            <IconRotate />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
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
        className={`flex-1 min-h-0 ${isHorizontal ? 'flex flex-col lg:grid lg:grid-cols-[1fr_auto_1fr]' : 'flex flex-col lg:grid lg:grid-rows-2'}`}
        style={isHorizontal && splitPct !== 50 ? { gridTemplateColumns: `minmax(0, ${splitPct}fr) auto minmax(0, ${100 - splitPct}fr)` } : undefined}
      >

        {/* ── Editor panel ── */}
        <div className={`min-w-0 min-h-0 flex flex-col h-[45dvh] lg:h-full ${isHorizontal ? 'border-b lg:border-b-0 lg:border-r' : 'border-b'} border-emerald-200/70 dark:border-emerald-900/50`}>
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
                  () => { runTestsRef.current() }
                )
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

          {/* Solution reveal (in editor panel bottom) */}
          {showSolution && solution && (
            <div className="shrink-0 border-t border-amber-500/40 bg-[#080c0a] max-h-[40%] overflow-auto ds-scroll">
              <div className="px-3 py-1.5 border-b border-amber-500/30 bg-amber-500/10 text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                {editorFilename} — {t.solutionWarning}
              </div>
              <pre className="p-3 text-[12px] text-amber-200 font-mono"><code>{solution}</code></pre>
            </div>
          )}
        </div>

        {/* ── Draggable divider ── */}
        {isHorizontal && (
          <div
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            className="hidden lg:flex w-1.5 cursor-col-resize bg-emerald-200/60 dark:bg-emerald-900/40 hover:bg-[#22C55E] transition-colors items-center justify-center group shrink-0"
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panels"
          >
            <span className="w-0.5 h-8 rounded-full bg-emerald-400/60 dark:bg-emerald-600/60 group-hover:bg-white transition-colors" aria-hidden />
          </div>
        )}

        {/* ── Results panel ── */}
        <div className={`min-w-0 min-h-0 flex flex-col h-[45dvh] lg:h-full bg-white dark:bg-[#0a0f0c]`}>
          {/* Tabs header */}
          <div className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-[#f6f8f7] dark:bg-[#080c0a] border-b border-emerald-200/70 dark:border-emerald-900/50 shrink-0 overflow-x-auto ds-scroll">
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-1 rounded text-[10.5px] font-extrabold tracking-widest uppercase whitespace-nowrap transition-colors ${
                activeTab === 'tests'
                  ? 'bg-[#22C55E] text-[#050806]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#22C55E] dark:hover:text-[#4ADE80] hover:bg-emerald-50/70 dark:hover:bg-emerald-900/20'
              }`}
            >
              {t.tabTests}{results ? ` (${passedCount}/${totalCount})` : ''}
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`px-3 py-1 rounded text-[10.5px] font-extrabold tracking-widest uppercase whitespace-nowrap transition-colors ${
                activeTab === 'output'
                  ? 'bg-[#22C55E] text-[#050806]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#22C55E] dark:hover:text-[#4ADE80] hover:bg-emerald-50/70 dark:hover:bg-emerald-900/20'
              }`}
            >
              {t.tabOutput}
            </button>
            {isHtmlOrCss && (
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded text-[10.5px] font-extrabold tracking-widest uppercase whitespace-nowrap transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-[#22C55E] text-[#050806]'
                    : 'text-slate-500 dark:text-slate-400 hover:text-[#22C55E] dark:hover:text-[#4ADE80] hover:bg-emerald-50/70 dark:hover:bg-emerald-900/20'
                }`}
              >
                Preview
              </button>
            )}
          </div>

          {/* Results content */}
          <div className="flex-1 min-h-0 overflow-auto ds-scroll p-3 sm:p-4">

            {/* Success banner */}
            {allPassed && activeTab === 'tests' && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold flex items-center gap-2">
                {t.successBanner}
              </div>
            )}

            {/* ── Tests tab ── */}
            {activeTab === 'tests' && (
              totalCount === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">{t.noTestCases}</p>
              ) : results === null ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {testCases.map((tc, i) => (
                    <div key={tc.id} className="rounded-lg border border-emerald-200/70 dark:border-emerald-900/50 p-3 bg-[#f6f8f7] dark:bg-[#080c0a]">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
                        {tc.isHidden ? t.hiddenTestLabelTpl.replace('{n}', String(i + 1)) : t.testLabelTpl.replace('{n}', String(i + 1))}
                      </div>
                      {!tc.isHidden && (
                        <div className="text-[11px] space-y-0.5 font-mono">
                          <div><span className="text-slate-500">{t.inputLabel}</span> <span className="text-slate-800 dark:text-slate-200">{tc.input}</span></div>
                          <div><span className="text-slate-500">{t.expectedLabel}</span> <span className="text-emerald-600 dark:text-emerald-400">{tc.expectedOutput}</span></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {resultsWithMeta && resultsWithMeta.map((r, i) => (
                    <div
                      key={r.id}
                      className={`rounded-lg border p-3 ${
                        r.passed
                          ? 'border-emerald-500/40 bg-emerald-500/5'
                          : 'border-red-500/40 bg-red-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {r.isHidden ? t.hiddenTestLabelTpl.replace('{n}', String(i + 1)) : t.testLabelTpl.replace('{n}', String(i + 1))}
                        </span>
                        <span className={`text-xs font-bold ${r.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {r.passed ? `✓ ${t.statusPassed}` : `✗ ${t.statusFailed}`}
                        </span>
                      </div>
                      {r.isHidden ? (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">{t.hiddenTestDetail}</p>
                      ) : (
                        <div className="text-[11px] font-mono space-y-0.5">
                          <div><span className="text-slate-500">{t.outputLabel}</span> <span className="text-slate-800 dark:text-slate-200">{r.error ? `${t.errPrefix} ${r.error}` : r.output || t.emptyOutput}</span></div>
                          {!r.passed && !r.error && (
                            <div><span className="text-slate-500">{t.expectedLabel}</span> <span className="text-emerald-600 dark:text-emerald-400">{r.expected}</span></div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}

            {/* ── Output tab ── */}
            {activeTab === 'output' && (
              <pre className="p-3 text-[12.5px] text-[#15803d] dark:text-[#4ADE80] font-mono whitespace-pre-wrap">
                {customOutput || t.outputPlaceholder}
              </pre>
            )}

            {/* ── Preview tab ── */}
            {activeTab === 'preview' && isHtmlOrCss && (
              <iframe
                title="preview"
                className="w-full h-[420px] bg-white rounded-md border border-emerald-200/70 dark:border-emerald-900/50"
                sandbox="allow-same-origin"
                srcDoc={buildPreviewDoc(language, code)}
              />
            )}

            {/* Footer note about hidden tests */}
            {activeTab === 'tests' && hiddenCount > 0 && (
              <p className="mt-3 pt-3 border-t border-emerald-200/70 dark:border-emerald-900/50 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                {t.hiddenCountNoteTpl.replace('{n}', String(hiddenCount))}
              </p>
            )}

            {/* ── Related tutorial link (bottom) ── */}
            <div className="mt-3 pt-3 border-t border-emerald-200/70 dark:border-emerald-900/50">
              <Link
                href={localeHref(locale, `/tutorials/${tutorialSlug}`)}
                className="inline-flex items-center gap-1.5 text-xs text-[#15803d] dark:text-[#4ADE80] hover:underline font-semibold"
              >
                {t.relatedTutorialTpl.replace('{title}', tutorialTitle)}
              </Link>
            </div>

            {/* ── Help hint ── */}
            <div className="mt-3 p-3 rounded-lg bg-[#22C55E]/5 border border-[#22C55E]/20 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'html' ? (
                <>
                  <strong className="text-[#15803d] dark:text-[#4ADE80]">{t.tipsLabel}</strong>{' '}
                  {t.tipsHtml}{' '}
                  <code className="font-mono">{t.tipsHtmlExample}</code>)
                </>
              ) : language === 'css' ? (
                <>
                  <strong className="text-[#15803d] dark:text-[#4ADE80]">{t.tipsLabel}</strong>{' '}
                  {t.tipsCss}{' '}
                  <code className="font-mono">{t.tipsCssExample}</code>
                </>
              ) : (
                <>
                  <strong className="text-[#15803d] dark:text-[#4ADE80]">{t.tipsLabel}</strong> {t.tipsBefore}{' '}
                  <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">function solve(input) {'{ ... }'}</code>{' '}
                  {t.tipsMiddle} <code className="font-mono">input</code> {t.tipsAfter}
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center justify-between gap-3 px-3 py-1 bg-[#22C55E] text-[#050806] text-[11px] font-mono select-none shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="truncate">{editorFilename}</span>
          <span className="opacity-70" aria-hidden>|</span>
          <span className="truncate">Ln {cursor.lineNumber}, Col {cursor.column}</span>
          <span className="opacity-70" aria-hidden>|</span>
          <span className="truncate">{code.split('\n').length} lines</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {results !== null && (
            <>
              <span className="font-bold">{passedCount}/{totalCount} passed</span>
              <span className="opacity-70" aria-hidden>|</span>
            </>
          )}
          {runtime !== null && (
            <>
              <span>{runtime.toFixed(0)} ms</span>
              <span className="opacity-70" aria-hidden>|</span>
            </>
          )}
          <span>{running ? 'Running…' : 'Ready'}</span>
        </div>
      </div>
    </div>
  )
}
