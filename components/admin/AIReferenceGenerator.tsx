'use client'

import { useState } from 'react'

type Props = {
  /** জেনারেট হলে raw text প্যারেন্টে পাঠাবে (bulk textarea-তে বসানোর জন্য) */
  onGenerated: (rawText: string) => void
  tutorialTitle?: string
}

export default function AIReferenceGenerator({ onGenerated, tutorialTitle = '' }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [topic, setTopic] = useState('')
  const [language, setLanguage] = useState('js')
  const [scope, setScope] = useState('Intermediate')
  const [count, setCount] = useState(3)
  const [extraInstructions, setExtraInstructions] = useState('')

  const allFilled =
    topic.trim() !== '' &&
    tutorialTitle.trim() !== '' &&
    scope.trim() !== '' &&
    count >= 1 &&
    count <= 10 &&
    extraInstructions.trim() !== ''

  const onGenerate = async () => {
    setError('')
    setSuccess('')

    if (!allFilled) {
      setError('সব ফিল্ড পূরণ করুন (Extra Instructions সহ)')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/ai/generate-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          tutorialTitle: tutorialTitle.trim(),
          language,
          scope,
          count,
          extraInstructions: extraInstructions.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || 'AI জেনারেশন ব্যর্থ হয়েছে')
        setLoading(false)
        return
      }

      const rawText = data.raw || ''
      if (!rawText) {
        setError('AI কিছু ফেরত দেয়নি')
        setLoading(false)
        return
      }

      onGenerated(rawText)
      setSuccess(
        `✅ ${data.references?.length || 0}টি রেফারেন্স জেনারেট হয়েছে! নিচে প্রিভিউ দেখুন।`
      )
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'নেটওয়ার্ক সমস্যা')
    }
    setLoading(false)
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-gray-900 rounded-xl border-2 border-emerald-300 dark:border-emerald-800 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3 flex items-center justify-between gap-3 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition"
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">
              AI Reference Generator
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              টপিক লিখুন → AI অটো কুইক-রেফারেন্স বানাবে
            </p>
          </div>
        </div>
        <span className="text-xl text-emerald-600 dark:text-emerald-400">
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-2 space-y-4 border-t border-emerald-200 dark:border-emerald-900">
          <Field label="১. Topic" required hint="কী নিয়ে রেফারেন্স">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="যেমন: Array methods, CSS Flexbox, String functions"
              className="admin-input"
            />
          </Field>

          <Field label="২. প্রোগ্রামিং ভাষা" required hint="কোন ভাষায়">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="admin-input"
            >
              <optgroup label="🌐 Browser">
                <option value="js">JavaScript</option>
                <option value="ts">TypeScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </optgroup>
              <optgroup label="☁️ Remote">
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="php">PHP</option>
                <option value="csharp">C#</option>
                <option value="kotlin">Kotlin</option>
                <option value="swift">Swift</option>
              </optgroup>
            </select>
          </Field>

          <Field label="৩. Scope" required hint="কতটা গভীর">
            <div className="flex gap-3 flex-wrap">
              {['Basic', 'Intermediate', 'Advanced'].map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={scope === s}
                    onChange={() => setScope(s)}
                    className="accent-[#22C55E]"
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="৪. Count" required hint="কতটি">
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="admin-input"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}টি
                </option>
              ))}
            </select>
          </Field>

          <Field label="৫. Extra Instructions" required hint="অতিরিক্ত নির্দেশনা">
            <textarea
              value={extraInstructions}
              onChange={(e) => setExtraInstructions(e.target.value)}
              placeholder="যেমন: শুধু ES6 মেথড নিয়ে, প্রতিটিতে ২টি উদাহরণ দিন"
              rows={2}
              className="admin-input"
            />
          </Field>

          {error && <div className="admin-error">[!] {error}</div>}
          {success && (
            <div className="text-sm text-emerald-600 dark:text-emerald-400">
              {success}
            </div>
          )}

          <button
            type="button"
            onClick={onGenerate}
            disabled={loading || !allFilled}
            className="admin-btn w-full"
          >
            {loading ? '> generating...' : '🤖 Generate References'}
          </button>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="admin-label">
        &gt; {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {hint && (
          <span className="text-gray-400 font-normal ml-2">({hint})</span>
        )}
      </label>
      {children}
    </div>
  )
}
