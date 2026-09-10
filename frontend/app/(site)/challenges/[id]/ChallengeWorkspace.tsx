'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

type MonacoProps = {
  height?: string | number
  defaultLanguage?: string
  language?: string
  theme?: string
  value?: string
  onChange?: (value: string | undefined) => void
  options?: Record<string, unknown>
}

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] flex items-center justify-center bg-slate-950 text-slate-500 text-sm font-mono rounded-2xl">
      এডিটর লোড হচ্ছে...
    </div>
  ),
}) as React.ComponentType<MonacoProps>

type TestCase = { id: string; input: string; expectedOutput: string; isHidden: boolean }
type TestResult = { id: string; passed: boolean; output: string; expected: string; error?: string }

/**
 * Runs user code safely-ish in the browser using `new Function`.
 * The user code must define a function `solve(input)` that returns output.
 */
function runUserCode(userCode: string, input: string, timeoutMs = 2000): { output: string; error?: string } {
  try {
    // Wrap user code so they can `return` from `solve`
    const wrapped = `
      "use strict";
      ${userCode}
      ;
      if (typeof solve !== 'function') {
        throw new Error("'solve' ফাংশন খুঁজে পাওয়া যায়নি। 'function solve(input) { ... }' ডিফাইন করো।");
      }
      return solve(${JSON.stringify(input)});
    `
    // eslint-disable-next-line no-new-func
    const fn = new Function(wrapped)
    const result = fn()
    return { output: typeof result === 'string' ? result : JSON.stringify(result) }
  } catch (err: any) {
    return { output: '', error: err?.message || String(err) }
  }
}

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
  const [code, setCode] = useState(starterCode)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [activeTab, setActiveTab] = useState<'tests' | 'output'>('tests')
  const [customOutput, setCustomOutput] = useState('')

  const runTests = () => {
    setRunning(true)
    setActiveTab('tests')
    const list: TestResult[] = []
    const visible = testCases.filter((t) => !t.isHidden)

    for (const t of visible) {
      const { output, error } = runUserCode(code, t.input)
      const passed = !error && output.trim() === t.expectedOutput.trim()
      list.push({
        id: t.id,
        passed,
        output,
        expected: t.expectedOutput,
        error,
      })
    }

    setResults(list)
    setRunning(false)
  }

  const runCustom = () => {
    setActiveTab('output')
    const { output, error } = runUserCode(code, '')
    setCustomOutput(error ? `❌ ${error}` : output || '(no output)')
  }

  const visibleCases = testCases.filter((t) => !t.isHidden)
  const hiddenCount = testCases.length - visibleCases.length
  const passedCount = results?.filter((r) => r.passed).length ?? 0
  const allPassed = results !== null && passedCount === visibleCases.length && visibleCases.length > 0

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
          <span className="text-[10px] font-mono text-slate-400">solution.js</span>
          <span className="w-10" />
        </div>
        <div className="h-[420px]">
          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v || '')}
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
            {running ? '⌛ চলছে...' : '▶ রান টেস্ট'}
          </button>
          <button
            onClick={runCustom}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            ⚡ রান
          </button>
          <button
            onClick={() => { setCode(starterCode); setResults(null) }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            ↺ রিসেট
          </button>
          {solution && (
            <button
              onClick={() => setShowSolution((s) => !s)}
              className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/40 rounded-xl text-xs font-semibold transition"
            >
              {showSolution ? '🙈 সলিউশন লুকাও' : '💡 সলিউশন দেখো'}
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
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            🧪 টেস্ট কেস {results && `(${passedCount}/${visibleCases.length})`}
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'output'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            📤 আউটপুট
          </button>
        </div>

        {/* Success banner */}
        {allPassed && activeTab === 'tests' && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold flex items-center gap-2">
            🎉 সব টেস্ট পাস! অসাধারণ কাজ।
          </div>
        )}

        {/* Tests panel */}
        {activeTab === 'tests' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 max-h-[520px] overflow-y-auto">
            {visibleCases.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
                এই চ্যালেঞ্জে কোনো দৃশ্যমান টেস্ট কেস নেই।
              </p>
            ) : results === null ? (
              <div className="space-y-3">
                {visibleCases.map((t, i) => (
                  <div key={t.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-950">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">Test #{i + 1}</div>
                    <div className="text-xs space-y-1 font-mono">
                      <div><span className="text-slate-500">input:</span> <span className="text-slate-800 dark:text-slate-200">{t.input}</span></div>
                      <div><span className="text-slate-500">expected:</span> <span className="text-emerald-600 dark:text-emerald-400">{t.expectedOutput}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((r, i) => (
                  <div
                    key={r.id}
                    className={`rounded-xl border p-3 ${
                      r.passed
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : 'border-red-500/40 bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold">Test #{i + 1}</span>
                      <span className={`text-xs font-bold ${r.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {r.passed ? '✓ পাস' : '✗ ফেইল'}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono space-y-1">
                      <div><span className="text-slate-500">output:</span> <span className="text-slate-800 dark:text-slate-200">{r.error ? `[error] ${r.error}` : r.output || '(empty)'}</span></div>
                      {!r.passed && !r.error && (<div><span className="text-slate-500">expected:</span> <span className="text-emerald-600 dark:text-emerald-400">{r.expected}</span></div>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {hiddenCount > 0 && (
              <p className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                🔒 {hiddenCount} টি লুকানো টেস্ট কেস আছে যা সাবমিটের সময় যাচাই করা হবে।
              </p>
            )}
          </div>
        )}

        {/* Output panel */}
        {activeTab === 'output' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-800 text-[10px] font-mono text-slate-500">output.txt</div>
            <pre className="p-4 text-xs text-emerald-300 font-mono overflow-x-auto max-h-[400px] whitespace-pre-wrap">
              {customOutput || '▶ রান বাটনে ক্লিক করো'}
            </pre>
          </div>
        )}

        {/* Solution reveal */}
        {showSolution && solution && (
          <div className="bg-slate-950 border border-amber-500/40 rounded-2xl overflow-hidden">
            <div className="px-4 py-2 border-b border-amber-500/30 bg-amber-500/10 text-[10px] font-mono text-amber-400 font-bold">solution.js — শুধু শেষ উপায়ে দেখো!</div>
            <pre className="p-4 text-xs text-amber-200 font-mono overflow-x-auto max-h-[300px]"><code>{solution}</code></pre>
          </div>
        )}

        {/* Help hint */}
        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong className="text-indigo-600 dark:text-indigo-400">💡 টিপস:</strong> তোমার কোডে অবশ্যই <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">function solve(input) {'{ ... }'}</code> ফাংশন থাকতে হবে — যা <code className="font-mono">input</code> নিয়ে output রিটার্ন করবে।
        </div>

        <Link href={`/tutorials/${tutorialSlug}`} className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
          📚 সম্পর্কিত টিউটোরিয়াল: {tutorialTitle} →
        </Link>
      </div>
    </div>
  )
}
