'use client'

import { useState } from 'react'

type Props = {
  /** জেনারেট হলে raw text প্যারেন্টে পাঠাবে (bulk textarea-তে বসানোর জন্য) */
  onGenerated: (rawText: string) => void
  tutorialTitle?: string
}

export default function AIQuizGenerator({ onGenerated, tutorialTitle = '' }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [topic, setTopic] = useState('')
  const [scope, setScope] = useState('Intermediate')
  const [count, setCount] = useState(3)
  const [difficulty, setDifficulty] = useState('Mixed')
  const [extraInstructions, setExtraInstructions] = useState('')

  const allFilled =
    topic.trim() !== '' &&
    tutorialTitle.trim() !== '' &&
    scope.trim() !== '' &&
    count >= 1 &&
    count <= 10 &&
    difficulty.trim() !== '' &&
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
      const res = await fetch('/api/admin/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          tutorialTitle: tutorialTitle.trim(),
          scope,
          count,
          difficulty,
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
        `✅ ${data.quizzes?.length || 0}টি কুইজ জেনারেট হয়েছে! নিচে প্রিভিউ দেখুন।`
      )
    } catch (e: any) {
      setError(e?.message || 'নেটওয়ার্ক সমস্যা')
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
              AI Quiz Generator
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              টপিক লিখুন → AI অটো কুইজ বানাবে
            </p>
          </div>
        </div>
        <span className="text-xl text-emerald-600 dark:text-emerald-400">
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-2 space-y-4 border-t border-emerald-200 dark:border-emerald-900">
          <Field label="১. Topic" required hint="কুইজের বিষয়">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="যেমন: HTML tags, CSS selectors, JavaScript loops"
              className="admin-input"
            />
          </Field>

          <Field label="২. Scope" required hint="কতটা গভীর">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="৩. Count" required hint="কতটি">
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

            <Field label="৪. Difficulty" required hint="কঠিনতা">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="admin-input"
              >
                <option value="Mixed">Mixed (Easy + Medium + Hard)</option>
                <option value="Easy">All Easy</option>
                <option value="Medium">All Medium</option>
                <option value="Hard">All Hard</option>
              </select>
            </Field>
          </div>

          <Field label="৫. Extra Instructions" required hint="অতিরিক্ত নির্দেশনা">
            <textarea
              value={extraInstructions}
              onChange={(e) => setExtraInstructions(e.target.value)}
              placeholder="যেমন: শুধু semantic HTML নিয়ে প্রশ্ন করুন, কোড উদাহরণ অন্তর্ভুক্ত করুন"
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
            {loading ? '> generating...' : '🤖 Generate Quizzes'}
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
