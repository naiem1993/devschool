'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  runInSandbox,
  TIMEOUT_CHALLENGE_MS,
  TIMEOUT_CHALLENGE_TOTAL_MS,
} from '@/lib/sandbox-runner'
import { useDict, useLocale } from '@/lib/i18n/I18nProvider'
import { localeHref } from '@/lib/i18n/link'

type MonacoEditorInstance = {
  addCommand: (keybinding: number, handler: () => void) => void
}

type MonacoNamespace = {
  KeyMod: { CtrlCmd: number }
  KeyCode: { Enter: number }
}

type MonacoProps = {
  height?: string | number
  defaultLanguage?: string
  language?: string
  theme?: string
  value?: string
  onChange?: (value: string | undefined) => void
  onMount?: (editor: MonacoEditorInstance, monaco: MonacoNamespace) => void
  options?: Record<string, unknown>
}

// Monaco-এর loading component dynamic() কল করার সময়ই নির্ধারিত হয়,
// তাই hook ব্যবহার করা যায় না — এই ছোট wrapper দিয়ে dictionary থেকে লেখা আনি।
function ChallengeEditorLoading() {
  const t = useDict().challengeWorkspace
  return (
    <div className="h-[420px] flex items-center justify-center bg-slate-950 text-slate-500 text-sm font-mono rounded-2xl">
      {t.editorLoading}
    </div>
  )
}

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <ChallengeEditorLoading />,
}) as React.ComponentType<MonacoProps>

type TestCase = { id: string; input: string; expectedOutput: string; isHidden: boolean }
type TestResult = { id: string; passed: boolean; output: string; expected: string; error?: string }

// NOTE: পূর্বে এখানে runUserCode() ছিল যা সরাসরি new Function দিয়ে ব্রাউজারে কোড চালাত।
// নিরাপত্তার জন্য এখন lib/sandbox-runner.ts-এর runInSandbox() ব্যবহার করা হয়,
// যা একটা sandboxed iframe-এ কোড চালায় (parent DOM/localStorage অগম্য)।

export default function ChallengeWorkspace({
  challengeId,
  starterCode,
  solution,
  testCases,
  tutorialSlug,
  tutorialTitle,
}: {
  challengeId: string
  starterCode: string
  solution: string | null
  testCases: TestCase[]
  tutorialSlug: string
  tutorialTitle: string
}) {
  const t = useDict().challengeWorkspace
  const locale = useLocale()
  const [code, setCode] = useState(starterCode)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [activeTab, setActiveTab] = useState<'tests' | 'output'>('tests')
  const [customOutput, setCustomOutput] = useState('')

  const runTests = useCallback(async () => {
    setRunning(true)
    setActiveTab('tests')
    const list: TestResult[] = []
    const start = Date.now()

    // সব test case (visible + hidden) এখন sandbox-এ চলে।
    for (const tc of testCases) {
      // ৩০ সেকেন্ড total cap — সামগ্রিকভাবে যেন ব্রাউজার আটকে না যায়।
      if (Date.now() - start > TIMEOUT_CHALLENGE_TOTAL_MS) {
        list.push({
          id: tc.id,
          passed: false,
          output: '',
          expected: tc.expectedOutput,
          error: t.errTimeoutTpl.replace('{n}', String(TIMEOUT_CHALLENGE_TOTAL_MS / 1000)),
        })
        continue
      }

      try {
        const r = await runInSandbox(code, tc.input, 'challenge', TIMEOUT_CHALLENGE_MS)
        const passed = !r.error && r.output.trim() === tc.expectedOutput.trim()
        list.push({
          id: tc.id,
          passed,
          output: r.output,
          expected: tc.expectedOutput,
          error: r.error,
        })
      } catch (err: any) {
        // Defensive: ভবিষ্যতে sandbox throw করলে যেন loop না ভাঙে।
        list.push({
          id: tc.id,
          passed: false,
          output: '',
          expected: tc.expectedOutput,
          error: err?.message || String(err),
        })
      }
    }

    setResults(list)
    setRunning(false)
  }, [code, testCases, t])

  const runCustom = useCallback(async () => {
    setActiveTab('output')
    try {
      const r = await runInSandbox(code, '', 'challenge', TIMEOUT_CHALLENGE_MS)
      setCustomOutput(r.error ? `❌ ${r.error}` : r.output || '(no output)')
    } catch (err: any) {
      setCustomOutput(`❌ ${err?.message || String(err)}`)
    }
  }, [code])

  // Monaco onMount একবারই চলে — তাই stale closure এড়াতে ref-এ latest runTests রাখা হলো।
  const runTestsRef = useRef(runTests)
  useEffect(() => {
    runTestsRef.current = runTests
  }, [runTests])

  // Keyboard: Ctrl/Cmd + Enter = Run Tests (window-level fallback)
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

  // সব test (visible + hidden) এখন sandbox-এ চলবে, তাই সব একসাথে গোনা হয়।
  const totalCount = testCases.length
  const hiddenCount = testCases.filter((t) => t.isHidden).length
  const passedCount = results?.filter((r) => r.passed).length ?? 0
  const allPassed = results !== null && passedCount === totalCount && totalCount > 0

  // result-এর সাথে isHidden meta merge — UI-তে hidden test আলাদা দেখানোর জন্য।
  const resultsWithMeta = results?.map((r) => {
    const tc = testCases.find((t) => t.id === r.id)
    return { ...r, isHidden: tc?.isHidden ?? false }
  }) ?? null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* ─── Editor column ─── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-[10px] font-mono text-slate-400">{t.editorFilename}</span>
          <span className="w-10" />
        </div>
        <div className="h-[420px]">
          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v || '')}
            onMount={(editor, monaco) => {
              // Monaco নিজেই Ctrl/Cmd+Enter ধরে ফেলে — তাই editor.addCommand দিয়ে bind করা হলো
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                () => {
                  runTestsRef.current()
                }
              )
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
              tabSize: 2,
              automaticLayout: true,
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2 p-3 bg-slate-950 border-t border-slate-800">
          <button
            onClick={runTests}
            disabled={running}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
          >
            {running ? t.btnRunning : t.btnRunTests}
          </button>
          <button
            onClick={runCustom}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            {t.btnRunCustom}
          </button>
          <button
            onClick={() => { setCode(starterCode); setResults(null) }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            {t.btnReset}
          </button>
          {solution && (
            <button
              onClick={() => setShowSolution((s) => !s)}
              className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/40 rounded-xl text-xs font-semibold transition"
            >
              {showSolution ? t.btnHideSolution : t.btnShowSolution}
            </button>
          )}
        </div>
      </div>

      {/* ─── Results column ─── */}
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'tests'
                ? 'bg-[#22C55E] text-[#050806]'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {t.tabTests} {results && `(${passedCount}/${totalCount})`}
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'output'
                ? 'bg-[#22C55E] text-[#050806]'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {t.tabOutput}
          </button>
        </div>

        {/* Success banner */}
        {allPassed && activeTab === 'tests' && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold flex items-center gap-2">
            {t.successBanner}
          </div>
        )}

        {/* Tests panel */}
        {activeTab === 'tests' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 max-h-[520px] overflow-y-auto">
            {totalCount === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
                {t.noTestCases}
              </p>
            ) : results === null ? (
              <div className="space-y-3">
                {testCases.map((tc, i) => (
                  tc.isHidden ? (
                    <div key={tc.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-950">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                        {t.hiddenTestLabelTpl.replace('{n}', String(i + 1))}
                      </div>
                    </div>
                  ) : (
                    <div key={tc.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-950">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">{t.testLabelTpl.replace('{n}', String(i + 1))}</div>
                      <div className="text-xs space-y-1 font-mono">
                        <div><span className="text-slate-500">{t.inputLabel}</span> <span className="text-slate-800 dark:text-slate-200">{tc.input}</span></div>
                        <div><span className="text-slate-500">{t.expectedLabel}</span> <span className="text-emerald-600 dark:text-emerald-400">{tc.expectedOutput}</span></div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {resultsWithMeta && resultsWithMeta.map((r, i) => (
                  <div
                    key={r.id}
                    className={`rounded-xl border p-3 ${
                      r.passed
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : 'border-red-500/40 bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold">
                        {r.isHidden ? t.hiddenTestLabelTpl.replace('{n}', String(i + 1)) : t.testLabelTpl.replace('{n}', String(i + 1))}
                      </span>
                      <span className={`text-xs font-bold ${r.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {r.passed ? t.statusPassed : t.statusFailed}
                      </span>
                    </div>
                    {r.isHidden ? (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        {t.hiddenTestDetail}
                      </p>
                    ) : (
                      <div className="text-[11px] font-mono space-y-1">
                        <div><span className="text-slate-500">{t.outputLabel}</span> <span className="text-slate-800 dark:text-slate-200">{r.error ? `${t.errPrefix} ${r.error}` : r.output || t.emptyOutput}</span></div>
                        {!r.passed && !r.error && (<div><span className="text-slate-500">{t.expectedLabel}</span> <span className="text-emerald-600 dark:text-emerald-400">{r.expected}</span></div>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {hiddenCount > 0 && (
              <p className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                {t.hiddenCountNoteTpl.replace('{n}', String(hiddenCount))}
              </p>
            )}
          </div>
        )}

        {/* Output panel */}
        {activeTab === 'output' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-800 text-[10px] font-mono text-slate-500">output.txt</div>
            <pre className="p-4 text-xs text-emerald-300 font-mono overflow-x-auto max-h-[400px] whitespace-pre-wrap">
              {customOutput || t.outputPlaceholder}
            </pre>
          </div>
        )}

        {/* Solution reveal */}
        {showSolution && solution && (
          <div className="bg-slate-950 border border-amber-500/40 rounded-2xl overflow-hidden">
            <div className="px-4 py-2 border-b border-amber-500/30 bg-amber-500/10 text-[10px] font-mono text-amber-400 font-bold">{t.solutionRevealTitle}</div>
            <pre className="p-4 text-xs text-amber-200 font-mono overflow-x-auto max-h-[300px]"><code>{solution}</code></pre>
          </div>
        )}

        {/* Help hint */}
        <div className="p-4 rounded-2xl bg-[#22C55E]/5 border border-[#22C55E]/20 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong className="text-[#15803d] dark:text-[#4ADE80]">{t.tipsLabel}</strong> {t.tipsBefore}{' '}
          <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">function solve(input) {'{ ... }'}</code>{' '}
          {t.tipsMiddle} <code className="font-mono">input</code> {t.tipsAfter}
        </div>

        <Link href={localeHref(locale, `/tutorials/${tutorialSlug}`)} className="inline-flex items-center gap-2 text-sm text-[#15803d] dark:text-[#4ADE80] hover:underline font-semibold">
          {t.relatedTutorialTpl.replace('{title}', tutorialTitle)}
        </Link>
      </div>
    </div>
  )
}
