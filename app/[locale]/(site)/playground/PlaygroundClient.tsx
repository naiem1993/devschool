'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { runInSandbox } from '@/lib/sandbox-runner'

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

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] flex items-center justify-center bg-slate-950 text-slate-500 text-sm font-mono rounded-2xl">
      এডিটর লোড হচ্ছে...
    </div>
  ),
}) as React.ComponentType<MonacoProps>

type Lang = 'javascript' | 'typescript' | 'html' | 'css'

const SAMPLES: Record<Lang, string> = {
  javascript: `// Welcome to DevSchool Playground 🎮\n// Write JS and click Run (Ctrl+Enter)\n\nconst greet = (name) => \`Hello, \${name}!\`;\n\nconsole.log(greet('DevSchool'));\n\n// Try arrays, objects, anything!\nconst nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map((n) => n * 2);\nconsole.log('Doubled:', doubled);\n\nconst sum = nums.reduce((a, b) => a + b, 0);\nconsole.log('Sum:', sum);\n`,
  typescript: `// TypeScript Playground 🟦\n\ninterface User {\n  name: string;\n  age: number;\n}\n\nconst me: User = { name: 'Naiem', age: 25 };\n\nfunction birthday(u: User): User {\n  return { ...u, age: u.age + 1 };\n}\n\nconsole.log(birthday(me));\n\n// NOTE: TS type checking runs on the editor only.\n// Run button executes the JS-compatible output.\n`,
  html: `<!-- HTML Playground 🎨 -->\n<div class="card">\n  <h1>Hello, DevSchool!</h1>\n  <p>Edit me and click Run to preview.</p>\n</div>\n\n<style>\n  .card { padding: 24px; border: 2px solid #4f46e5; border-radius: 16px; font-family: sans-serif; }\n  h1 { color: #4f46e5; margin: 0 0 8px; }\n</style>`,
  css: `/* CSS Playground 🎨 */\n/* Wrap your selectors for a live <style> preview */\n\n.preview-box {\n  padding: 32px;\n  background: linear-gradient(135deg, #6366f1, #06b6d4);\n  color: white;\n  border-radius: 20px;\n  font-family: sans-serif;\n  text-align: center;\n  font-size: 20px;\n  font-weight: bold;\n}`,
}

// NOTE: TypeScript option আপাতত সরানো হলো — sandbox-এ new Function দিয়ে TS syntax
// বোঝা যায় না। Judge0 যোগ হলে TS ফিরিয়ে আনা হবে (সে TS transpile করতে পারে)।
// type Lang ও SAMPLES-এ typescript key অপরিবর্তিত রাখা হলো — ভবিষ্যতে সহজে ফেরাতে পারবেন।
const LANGUAGES: { id: Lang; label: string; icon: string }[] = [
  { id: 'javascript', label: 'JavaScript', icon: '🟨' },
  { id: 'html', label: 'HTML', icon: '🟧' },
  { id: 'css', label: 'CSS', icon: '🎨' },
]

export default function PlaygroundClient() {
  const [lang, setLang] = useState<Lang>('javascript')
  const [code, setCode] = useState(SAMPLES.javascript)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  // Persist per-language code
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`playground:${lang}`)
      if (saved) setCode(saved)
      else setCode(SAMPLES[lang])
    } catch {
      setCode(SAMPLES[lang])
    }
  }, [lang])

  const run = useCallback(async () => {
    setRunning(true)
    try {
      if (lang === 'javascript' || lang === 'typescript') {
        const r = await runInSandbox(code, '', 'playground')
        setOutput(r.error ? `✗ ${r.error}` : r.output || '(no output)')
      } else if (lang === 'html') {
        setOutput('__HTML_PREVIEW__')
      } else if (lang === 'css') {
        setOutput('__CSS_PREVIEW__')
      }
    } finally {
      setRunning(false)
    }
  }, [code, lang])

  // Monaco onMount একবারই চলে, তাই stale closure এড়াতে ref-এ latest run রাখা হলো।
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

  // Keyboard: Ctrl/Cmd + Enter = Run (window-level fallback)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        runRef.current()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [run])

  // Save on edit
  useEffect(() => {
    try { localStorage.setItem(`playground:${lang}`, code) } catch { /* ignore */ }
  }, [code, lang])

  const isPreview = output.startsWith('__') && output.endsWith('__')
  const previewKind = output === '__HTML_PREVIEW__' ? 'html' : output === '__CSS_PREVIEW__' ? 'css' : null

  const srcDoc = (() => {
    if (!previewKind) return ''
    if (previewKind === 'html') {
      return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:system-ui,sans-serif;margin:0;padding:24px;background:#fff;color:#111}</style></head><body>${code}</body></html>`
    }
    // CSS preview
    return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:system-ui,sans-serif;margin:0;padding:24px;background:#fff;color:#111}${code}</style></head><body><div class="preview-box">CSS প্রিভিউ — এখানে তোমার স্টাইল দেখাবে</div></body></html>`
  })()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Editor */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border-b border-slate-800 overflow-x-auto">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition ${
                lang === l.id
                  ? 'bg-[#22C55E] text-[#050806]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {l.icon} {l.label}
            </button>
          ))}
        </div>
        <div className="h-[520px]">
          <MonacoEditor
            height="100%"
            language={lang}
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v || '')}
            onMount={(editor, monaco) => {
              // Monaco নিজেই Ctrl/Cmd+Enter ধরে ফেলে — তাই editor.addCommand দিয়ে bind করা হলো
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                () => {
                  runRef.current()
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
            onClick={run}
            disabled={running}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
          >
            {running ? '⌛ চলছে...' : '▶ রান (Ctrl+Enter)'}
          </button>
          <button
            onClick={copy}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            {copied ? '✓ কপি হয়েছে' : '📋 কপি'}
          </button>
          <button
            onClick={() => { setCode(SAMPLES[lang]); setOutput('') }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            ↺ রিসেট
          </button>
          <button
            onClick={() => { setCode(''); setOutput('') }}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/40 rounded-xl text-xs font-semibold transition"
          >
            🗑 ক্লিয়ার
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
          <span className="text-[10px] font-mono text-slate-500">
            {previewKind ? `${previewKind}-preview` : 'output.console'}
          </span>
          <span className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </span>
        </div>

        {previewKind ? (
          <iframe
            title="preview"
            className="w-full h-[520px] bg-white"
            sandbox="allow-scripts"
            srcDoc={srcDoc}
          />
        ) : (
          <pre className="p-4 text-xs text-emerald-300 font-mono overflow-auto h-[520px] whitespace-pre-wrap">
            {output || '▶ রান বাটনে ক্লিক করো অথবা Ctrl+Enter চাপো...'}
          </pre>
        )}
      </div>

      <div className="lg:col-span-2 p-4 rounded-2xl bg-[#22C55E]/5 border border-[#22C55E]/20 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <strong className="text-[#22C55E]">💡 টিপস:</strong> কোড <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">localStorage</code>-এ auto-save হয়, তাই ব্রাউজার রিফ্রেশ করলেও তোমার কোড থাকবে। TypeScript এখন শুধু syntax highlight করে — type checking এর জন্য পরবর্তী আপডেটে Web Worker যোগ করা হবে।
      </div>
    </div>
  )
}
