'use client'

// ============================================================
//  QuizWidget — W3Schools-style inline quiz
// ============================================================
//  • One question at a time
//  • Instant feedback (correct / wrong + explanation)
//  • Option order shuffle (anti-memorize)
//  • Progress bar
//  • Score at end + Best score
//  • Review answers
//  • Try Again
//  • bn + en fully localized
// ============================================================

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDict, useLocale } from '@/lib/i18n/I18nProvider'
import { getDeviceHeaders } from '@/lib/device'

// ── Types ──────────────────────────────────────────────────
export type QuizOptionData = {
  id: string
  text: string
}

export type QuizQuestionData = {
  id: string
  question: string
  options: QuizOptionData[]
}

type Props = {
  /** lesson বা chapter id — server থেকে আসে */
  lessonId: string
  /** locale-সঠিক প্রশ্নগুলো — server component প্রি-fetch করে পাঠায় */
  questions: QuizQuestionData[]
}

type Phase = 'answering' | 'feedback' | 'complete'

// ── Shuffle helper (Fisher-Yates) ──────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ============================================================
export default function QuizWidget({ lessonId, questions }: Props) {
  const dict = useDict()
  const locale = useLocale()
  const t = dict.quiz

  const total = questions.length

  // ── State ─────────────────────────────────────────────────
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('answering')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // Collapsed by default — user চাইলে খুলবে
  const [started, setStarted] = useState(false)
  // Quiz section collapse/expand (after start)
  const [collapsed, setCollapsed] = useState(false)

  // প্রতিটা প্রশ্নের জন্য option order।
  // ⚠️ SSR-safe: প্রথম render-এ natural order রাখি (Math.random() নয়),
  // তারপর client mount-এ shuffle করি — হাইড্রেশন mismatch এড়াতে।
  const [optionOrders, setOptionOrders] = useState<string[][]>(() =>
    questions.map((q) => q.options.map((o) => o.id))
  )

  // client mount-এ shuffle (শুধু একবার)
  // INTENTIONAL: shuffle uses Math.random() which is non-deterministic on
  // server — running it only after mount prevents SSR/CSR hydration mismatch.
   
  useEffect(() => {
    setOptionOrders(questions.map((q) => shuffle(q.options.map((o) => o.id))))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // attempt tracking
  const [answers, setAnswers] = useState<Record<string, string>>({}) // questionId → selectedOptionId
  const [correctMap, setCorrectMap] = useState<Record<string, boolean>>({})
  const [correctOptionMap, setCorrectOptionMap] = useState<Record<string, string>>({})
  const [explanationMap, setExplanationMap] = useState<Record<string, string>>({})

  // best score tracking (localStorage)
  const bestKey = `quiz:best:${lessonId}`
  const [bestPct, setBestPct] = useState<number | null>(null)

  // INTENTIONAL: localStorage is unavailable server-side — read after mount.
   
  useEffect(() => {
    try {
      const saved = localStorage.getItem(bestKey)
      if (saved) setBestPct(Number(saved))
    } catch {
      /* ignore */
    }
  }, [bestKey])

  const q = questions[current]
  const orderedOptionIds = optionOrders[current] ?? []
  const orderedOptions = useMemo(() => {
    if (!q) return []
    return orderedOptionIds
      .map((id) => q.options.find((o) => o.id === id))
      .filter((x): x is QuizOptionData => !!x)
  }, [q, orderedOptionIds])

  const correctCount = Object.values(correctMap).filter(Boolean).length

  // ── Submit answer ─────────────────────────────────────────
  const submit = useCallback(async () => {
    if (!selected || !q || busy) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/quizzes/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
          ...getDeviceHeaders(),
        },
        body: JSON.stringify({ questionId: q.id, selectedId: selected }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(t.errSubmitFailed)
        setBusy(false)
        return
      }

      setAnswers((a) => ({ ...a, [q.id]: selected }))
      setCorrectMap((m) => ({ ...m, [q.id]: !!data.isCorrect }))
      if (data.correctOptionId) {
        setCorrectOptionMap((m) => ({ ...m, [q.id]: data.correctOptionId }))
      }
      if (data.explanation) {
        setExplanationMap((m) => ({ ...m, [q.id]: data.explanation }))
      }
      setPhase('feedback')
    } catch {
      setError(t.errSubmitFailed)
    } finally {
      setBusy(false)
    }
  }, [selected, q, busy, locale, t])

  // ── Next question / Finish ────────────────────────────────
  const next = useCallback(() => {
    if (current + 1 < total) {
      setCurrent((c) => c + 1)
      setSelected(null)
      setPhase('answering')
    } else {
      setPhase('complete')
      // best score save
      const finalCorrect = Object.values({ ...correctMap }).filter(Boolean).length
      const pct = total > 0 ? Math.round((finalCorrect / total) * 100) : 0
      try {
        const prev = Number(localStorage.getItem(bestKey) || 0)
        if (pct > prev) localStorage.setItem(bestKey, String(pct))
        setBestPct((b) => (b === null || pct > b ? pct : b))
      } catch {
        /* ignore */
      }
    }
  }, [current, total, correctMap, bestKey])

  // ── Try Again ─────────────────────────────────────────────
  const tryAgain = useCallback(() => {
    setCurrent(0)
    setSelected(null)
    setPhase('answering')
    setAnswers({})
    setCorrectMap({})
    setCorrectOptionMap({})
    setExplanationMap({})
    setError('')
    setOptionOrders(questions.map((q) => shuffle(q.options.map((o) => o.id))))
  }, [questions])

  // ── Render guards ─────────────────────────────────────────
  if (total === 0 || !q) return null

  // ── Collapsed view (before start) ─────────────────────────
  if (!started) {
    return (
      <section
        aria-label={t.sectionTitle}
        className="my-8 rounded-3xl border border-emerald-200/70 dark:border-emerald-900/40 bg-gradient-to-br from-white to-[#f2fbf4] dark:from-[#0a0f0c] dark:to-[#050806] shadow-sm overflow-hidden"
      >
        <div className="px-5 sm:px-7 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-[#15803d] dark:text-[#4ADE80] mb-1">
              {t.sectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.startHintTpl.replace('{count}', String(total))}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] font-bold text-sm transition whitespace-nowrap"
          >
            {t.startBtn}
          </button>
        </div>
      </section>
    )
  }

  // ── Collapsed view (after start) ──────────────────────────
  if (collapsed) {
    return (
      <section
        aria-label={t.sectionTitle}
        className="my-8 rounded-3xl border border-emerald-200/70 dark:border-emerald-900/40 bg-gradient-to-br from-white to-[#f2fbf4] dark:from-[#0a0f0c] dark:to-[#050806] shadow-sm overflow-hidden"
      >
        <div className="px-5 sm:px-7 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-[#15803d] dark:text-[#4ADE80] mb-1">
              {t.sectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {phase === 'complete'
                ? t.scoreTitle
                : t.questionOfTpl.replace('{n}', String(current + 1)).replace('{total}', String(total))}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="px-5 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] font-bold text-sm transition whitespace-nowrap"
            aria-label="Expand quiz"
          >
            ▼
          </button>
        </div>
      </section>
    )
  }

  const progressPct = phase === 'complete'
    ? 100
    : Math.round(((current + (phase === 'feedback' ? 1 : 0)) / total) * 100)

  const isCorrect = correctMap[q.id]
  const correctOptionId = correctOptionMap[q.id]
  const explanation = explanationMap[q.id]

  // ── UI ────────────────────────────────────────────────────
  return (
    <section
      aria-label={t.sectionTitle}
      className="my-8 rounded-3xl border border-emerald-200/70 dark:border-emerald-900/40 bg-gradient-to-br from-white to-[#f2fbf4] dark:from-[#0a0f0c] dark:to-[#050806] shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 sm:px-7 py-4 border-b border-emerald-200/70 dark:border-emerald-900/40 flex items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-[#15803d] dark:text-[#4ADE80]">
          {t.sectionTitle}
        </h2>
        <div className="flex items-center gap-3">
          {phase !== 'complete' && (
            <span className="text-[11px] sm:text-xs font-mono text-slate-500 dark:text-slate-400">
              {t.questionOfTpl.replace('{n}', String(current + 1)).replace('{total}', String(total))}
            </span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="flex-shrink-0 w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:border-[#4ADE80] dark:hover:text-[#4ADE80] flex items-center justify-center text-xs font-bold transition"
            aria-label="Collapse quiz"
            title="Collapse"
          >
            ▲
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {phase !== 'complete' && (
        <div className="h-1.5 bg-emerald-100 dark:bg-emerald-950/40">
          <div
            className="h-full bg-[#22C55E] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* Body */}
      <div className="px-5 sm:px-7 py-6">
        {/* ═══════════ ANSWERING / FEEDBACK ═══════════ */}
        {phase !== 'complete' && (
          <>
            <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed mb-5">
              {q.question}
            </p>

            <ul className="space-y-2.5">
              {orderedOptions.map((opt, idx) => {
                const isSelected = selected === opt.id
                const showCorrect = phase === 'feedback' && opt.id === correctOptionId
                const showWrong = phase === 'feedback' && isSelected && opt.id !== correctOptionId

                const base = 'w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-start gap-3'
                let tone =
                  'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#22C55E]/60 dark:hover:border-[#22C55E]/60'
                if (showCorrect)
                  tone =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                else if (showWrong)
                  tone =
                    'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200'
                else if (isSelected && phase === 'answering')
                  tone = 'border-[#22C55E] bg-[#22C55E]/10'

                return (
                  <li key={opt.id}>
                    <button
                      type="button"
                      disabled={phase === 'feedback'}
                      onClick={() => setSelected(opt.id)}
                      className={`${base} ${tone} disabled:cursor-default`}
                    >
                      <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-bold border-current">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm sm:text-[15px] leading-relaxed">
                        {opt.text}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            {error && (
              <p className="mt-4 text-sm text-red-500 dark:text-red-400">{error}</p>
            )}

            {/* Feedback box */}
            {phase === 'feedback' && (
              <div
                className={`mt-5 rounded-2xl border p-4 ${
                  isCorrect
                    ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30'
                    : 'border-red-300 bg-red-50 dark:bg-red-950/30'
                }`}
              >
                <p
                  className={`font-extrabold text-sm mb-1 ${
                    isCorrect
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}
                >
                  {isCorrect ? t.correctLabel : t.wrongLabel}
                </p>
                {!isCorrect && correctOptionId && (
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">{t.correctAnswerWas} </span>
                    {q.options.find((o) => o.id === correctOptionId)?.text}
                  </p>
                )}
                {explanation && (
                  <p className="mt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-semibold">{t.explanationLabel} </span>
                    {explanation}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* ═══════════ COMPLETE ═══════════ */}
        {phase === 'complete' && (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              {t.scoreTitle}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-2">
              {t.scoreTpl
                .replace('{correct}', String(correctCount))
                .replace('{total}', String(total))}
            </p>
            <p className="text-3xl sm:text-4xl font-black text-[#22C55E] mb-1">
              {t.scorePctTpl.replace(
                '{pct}',
                String(total > 0 ? Math.round((correctCount / total) * 100) : 0)
              )}
            </p>
            {bestPct !== null && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
                {t.bestScoreTpl.replace('{pct}', String(bestPct))}
              </p>
            )}

            {/* Review list */}
            <details className="mt-4 text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950">
                {t.reviewTitle}
              </summary>
              <ol className="divide-y divide-slate-100 dark:divide-slate-800">
                {questions.map((qq, i) => {
                  const ok = correctMap[qq.id]
                  const userOptId = answers[qq.id]
                  const correctOptId = correctOptionMap[qq.id]
                  const userText = qq.options.find((o) => o.id === userOptId)?.text
                  const correctText = qq.options.find((o) => o.id === correctOptId)?.text
                  return (
                    <li key={qq.id} className="px-4 py-3 text-sm">
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            ok
                              ? 'bg-emerald-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {ok ? '✓' : '✗'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            {i + 1}. {qq.question}
                          </p>
                          {userText && (
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-semibold">{t.yourAnswer} </span>
                              <span className={ok ? '' : 'line-through'}>{userText}</span>
                            </p>
                          )}
                          {!ok && correctText && (
                            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                              <span className="font-semibold">{t.correctAnswerWas} </span>
                              {correctText}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </details>

            <button
              type="button"
              onClick={tryAgain}
              className="mt-6 px-6 py-3 rounded-xl bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] font-bold text-sm transition"
            >
              {t.tryAgainBtn}
            </button>
          </div>
        )}
      </div>

      {/* Footer actions */}
      {phase !== 'complete' && (
        <div className="px-5 sm:px-7 py-4 border-t border-emerald-200/70 dark:border-emerald-900/40 flex items-center justify-end gap-3 bg-white/60 dark:bg-black/20">
          {phase === 'answering' && (
            <button
              type="button"
              disabled={!selected || busy}
              onClick={submit}
              className="px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.submitBtn}
            </button>
          )}
          {phase === 'feedback' && (
            <button
              type="button"
              onClick={next}
              className="px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] font-bold text-sm transition"
            >
              {current + 1 < total ? t.nextBtn : t.finishBtn}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
