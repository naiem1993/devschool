'use client'

import { useState } from 'react'

type Tutorial = { id: string; title: string }

type Props = {
  tutorials: Tutorial[]
  /** জেনারেট হলে raw text প্যারেন্টে পাঠাবে (bulk textarea-তে বসানোর জন্য) */
  onGenerated: (rawText: string, tutorialTitle: string) => void
}

export default function AIChallengeGenerator({ tutorials, onGenerated }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ৭টি বাধ্যতামূলক ফিল্ড
  const [topic, setTopic] = useState('')
  const [tutorialTitle, setTutorialTitle] = useState(tutorials[0]?.title || '')
  const [scope, setScope] = useState('Intermediate')
  const [count, setCount] = useState(3)
  const [difficulty, setDifficulty] = useState('Mixed')
  const [visibleTests, setVisibleTests] = useState(2)
  const [hiddenTests, setHiddenTests] = useState(1)
  const [extraInstructions, setExtraInstructions] = useState('')

  // বাধ্যতামূলক ফিল্ড পূরণ হয়েছে কি না
  const allFilled =
    topic.trim() !== '' &&
    tutorialTitle.trim() !== '' &&
    scope.trim() !== '' &&
    count >= 1 &&
    count <= 10 &&
    difficulty.trim() !== '' &&
    visibleTests >= 1 &&
    hiddenTests >= 1 &&
    extraInstructions.trim() !== ''

  const onGenerate = async () => {
    setError('')
    setSuccess('')

    if (!allFilled) {
      setError('সব ৭টি ফিল্ড পূরণ করুন (Extra Instructions সহ)')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/ai/generate-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          tutorialTitle: tutorialTitle.trim(),
          scope,
          count,
          difficulty,
          visibleTests,
          hiddenTests,
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

      // প্যারেন্টকে পাঠানো — bulk textarea-তে বসবে
      onGenerated(rawText, tutorialTitle)
      setSuccess(
        `✅ ${data.challenges?.length || 0}টি চ্যালেঞ্জ জেনারেট হয়েছে! নিচে প্রিভিউ দেখুন।`
      )
    } catch (e: any) {
      setError(e?.message || 'নেটওয়ার্ক সমস্যা')
    }
    setLoading(false)
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-gray-900 rounded-xl border-2 border-emerald-300 dark:border-emerald-800 overflow-hidden">
      {/* Header — toggle button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3 flex items-center justify-between gap-3 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition"
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">
              AI Challenge Generator
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              টপিক লিখুন → AI অটো চ্যালেঞ্জ বানাবে
            </p>
          </div>
        </div>
        <span className="text-xl text-emerald-600 dark:text-emerald-400">
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-2 space-y-4 border-t border-emerald-200 dark:border-emerald-900">
          {/* ── ১. Topic ── */}
          <Field label="১. Topic" required hint="চ্যালেঞ্জের বিষয়">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="যেমন: Array methods, HTML Forms, CSS Flexbox"
              className="admin-input"
            />
          </Field>

          {/* ── ২. Tutorial ── */}
          <Field label="২. Tutorial / ভাষা" required hint="কোন ভাষায় কোড হবে">
            <select
              value={tutorialTitle}
              onChange={(e) => setTutorialTitle(e.target.value)}
              className="admin-input"
            >
              {tutorials.map((t) => (
                <option key={t.id} value={t.title}>
                  {t.title}
                </option>
              ))}
            </select>
          </Field>

          {/* ── ৩. Scope ── */}
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

          {/* ── ৪ + ৫ + ৬: Count / Difficulty / Test Cases ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

            <Field label="৫. Difficulty" required hint="কঠিনতা">
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

            <Field label="৬. Test Cases" required hint="Visible / Hidden">
              <div className="flex gap-2 items-center">
                <select
                  value={visibleTests}
                  onChange={(e) => setVisibleTests(Number(e.target.value))}
                  className="admin-input flex-1"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Visible
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-500">+</span>
                <select
                  value={hiddenTests}
                  onChange={(e) => setHiddenTests(Number(e.target.value))}
                  className="admin-input flex-1"
                >
                  {[1, 2, 3].map((n) => (
                    <option key={n} value={n}>
                      {n} Hidden
                    </option>
                  ))}
                </select>
              </div>
            </Field>
          </div>

          {/* ── ৭. Extra Instructions ── */}
          <Field
            label="৭. Extra Instructions"
            required
            hint="নির্দিষ্ট করে বলুন AI কী বানাবে"
          >
            <textarea
              value={extraInstructions}
              onChange={(e) => setExtraInstructions(e.target.value)}
              placeholder="যেমন: শুধু map, filter, reduce নিয়ে। বাস্তব উদাহরণ দাও। প্রতিটি চ্যালেঞ্জে numeric input।"
              className="admin-input font-mono text-xs"
              rows={3}
            />
          </Field>

          {/* ── Generate Button ── */}
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={onGenerate}
              disabled={loading || !allFilled}
              className="px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ AI লিখছে... (৩০-৬০ সেকেন্ড)' : '🤖 Generate Challenges'}
            </button>
            {!allFilled && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                ⚠️ সব ৭টি ফিল্ড পূরণ করুন
              </span>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3">
              <p className="text-xs text-red-700 dark:text-red-300">❌ {error}</p>
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3">
              <p className="text-xs text-emerald-700 dark:text-emerald-300">{success}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Field helper ──
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
      <label className="admin-label flex items-center gap-1.5">
        <span>{label}</span>
        {required && <span className="text-red-500 text-xs">*</span>}
        {hint && <span className="text-[10px] text-gray-400 font-normal">— {hint}</span>}
      </label>
      {children}
    </div>
  )
}
