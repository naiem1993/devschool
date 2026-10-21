'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

type Tutorial = { id: string; title: string }
type Lesson = { id: string; title: string; tutorialId: string }
type Chapter = { id: string; title: string; tutorialId: string; hasLessons: boolean }
type Option = { textBn: string; textEn: string; isCorrect: boolean }

// কোন location-এ quiz বসবে
type LocationType = 'lesson' | 'chapter'

type QuizFormInitial = {
  id: string
  tutorialId: string
  lessonId: string
  chapterId: string
  questionBn: string
  questionEn: string
  explanationBn: string
  explanationEn: string
  orderIndex: number
  options: Option[]
}

export default function QuizForm({
  initial,
  tutorials,
  lessons,
  chapters,
  mode = 'create',
}: {
  initial?: QuizFormInitial
  tutorials: Tutorial[]
  lessons: Lesson[]
  chapters: Chapter[]
  mode?: 'create' | 'edit'
}) {
  const router = useRouter()

  // initial থেকে location type detect
  const initialType: LocationType = initial?.lessonId
    ? 'lesson'
    : initial?.chapterId
      ? 'chapter'
      : 'lesson'

  const [locationType, setLocationType] = useState<LocationType>(initialType)

  const [form, setForm] = useState({
    tutorialId: initial?.tutorialId || tutorials[0]?.id || '',
    lessonId: initial?.lessonId || '',
    chapterId: initial?.chapterId || '',
    questionBn: initial?.questionBn || '',
    questionEn: initial?.questionEn || '',
    explanationBn: initial?.explanationBn || '',
    explanationEn: initial?.explanationEn || '',
    orderIndex: initial?.orderIndex ?? 1,
  })

  const [options, setOptions] = useState<Option[]>(
    initial?.options?.length
      ? initial.options.map((o) => ({
          textBn: o.textBn,
          textEn: o.textEn || '',
          isCorrect: o.isCorrect,
        }))
      : [
          { textBn: '', textEn: '', isCorrect: true },
          { textBn: '', textEn: '', isCorrect: false },
        ]
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // filter by tutorial
  const availableLessons = useMemo(
    () => lessons.filter((l) => l.tutorialId === form.tutorialId),
    [lessons, form.tutorialId]
  )

  // শুধু single-page chapter দেখাব (nested chapter-এ quiz first lesson-এ যাবে)
  const availableChapters = useMemo(
    () => chapters.filter((c) => c.tutorialId === form.tutorialId && !c.hasLessons),
    [chapters, form.tutorialId]
  )

  const onTutorialChange = (tutorialId: string) => {
    setForm((f) => ({ ...f, tutorialId, lessonId: '', chapterId: '' }))
  }

  const onLocationTypeChange = (t: LocationType) => {
    setLocationType(t)
    setForm((f) => ({ ...f, lessonId: '', chapterId: '' }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const hasLocation = locationType === 'lesson' ? !!form.lessonId : !!form.chapterId
    if (!hasLocation) {
      setError(
        locationType === 'lesson'
          ? 'Lesson বেছে নিন'
          : 'Chapter বেছে নিন (single-page chapter)'
      )
      return
    }
    if (!form.questionEn.trim()) {
      setError('ইংরেজি Question দরকার (জোড়া নিয়ম)')
      return
    }
    if (options.some((o) => !o.textEn.trim())) {
      setError('প্রতিটি option-এর ইংরেজি text দরকার (জোড়া নিয়ম)')
      return
    }
    if (!options.some((o) => o.isCorrect)) {
      setError('একটি সঠিক option select করুন')
      return
    }

    setLoading(true)
    setError('')

    // location type অনুযায়ী body তৈরি
    const body = {
      tutorialId: form.tutorialId,
      lessonId: locationType === 'lesson' ? form.lessonId : null,
      chapterId: locationType === 'chapter' ? form.chapterId : null,
      questionBn: form.questionBn,
      questionEn: form.questionEn,
      explanationBn: form.explanationBn,
      explanationEn: form.explanationEn,
      orderIndex: form.orderIndex,
      options,
    }

    const url =
      mode === 'edit' ? `/api/admin/quiz/${initial?.id}` : '/api/admin/quiz'
    const res = await fetch(url, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      router.push('/admin/quizzes')
      router.refresh()
    } else {
      const d = await res.json().catch(() => ({}))
      setError(d.error || 'save failed')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ── Settings Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Tutorial</label>
            <select
              className="admin-input"
              value={form.tutorialId}
              onChange={(e) => onTutorialChange(e.target.value)}
              required
            >
              {tutorials.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="admin-label">Order Index (marker number)</label>
            <input
              type="number"
              min={1}
              className="admin-input"
              value={form.orderIndex}
              onChange={(e) =>
                setForm((f) => ({ ...f, orderIndex: Number(e.target.value) || 1 }))
              }
              required
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              content-এ প্রথম{' '}
              <code className="px-1 rounded bg-slate-100 dark:bg-slate-800">[[quiz]]</code> = 1, দ্বিতীয় = 2, তৃতীয় = 3 ...
            </p>
          </div>
        </div>

        <div>
          <label className="admin-label">কোথায় দেখাবে?</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <label
              className={
                'flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ' +
                (locationType === 'lesson'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600')
              }
            >
              <input
                type="radio"
                name="locationType"
                checked={locationType === 'lesson'}
                onChange={() => onLocationTypeChange('lesson')}
                className="accent-emerald-500"
              />
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">Lesson</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">nested chapter-এর ভিতরে</div>
              </div>
            </label>
            <label
              className={
                'flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ' +
                (locationType === 'chapter'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600')
              }
            >
              <input
                type="radio"
                name="locationType"
                checked={locationType === 'chapter'}
                onChange={() => onLocationTypeChange('chapter')}
                className="accent-emerald-500"
              />
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">Chapter</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">single-page chapter</div>
              </div>
            </label>
          </div>
        </div>

        <div>
          {locationType === 'lesson' ? (
            <>
              <label className="admin-label">Lesson</label>
              <select
                className="admin-input"
                value={form.lessonId}
                onChange={(e) => setForm((f) => ({ ...f, lessonId: e.target.value }))}
                required
              >
                <option value="">— Lesson বেছে নিন —</option>
                {availableLessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
              {availableLessons.length === 0 && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1.5">
                  এই tutorial-এ কোনো nested lesson নেই। Chapter mode চেষ্টা করুন।
                </p>
              )}
            </>
          ) : (
            <>
              <label className="admin-label">Chapter (single-page)</label>
              <select
                className="admin-input"
                value={form.chapterId}
                onChange={(e) => setForm((f) => ({ ...f, chapterId: e.target.value }))}
                required
              >
                <option value="">— Chapter বেছে নিন —</option>
                {availableChapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              {availableChapters.length === 0 && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1.5">
                  এই tutorial-এ কোনো single-page chapter নেই। Lesson mode চেষ্টা করুন।
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Question Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Question</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Question (বাংলা)</label>
            <textarea
              className="admin-input"
              rows={3}
              value={form.questionBn}
              onChange={(e) => setForm((f) => ({ ...f, questionBn: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="admin-label">Question (English)</label>
            <textarea
              className="admin-input"
              rows={3}
              value={form.questionEn}
              onChange={(e) =>
                setForm((f) => ({ ...f, questionEn: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Explanation (বাংলা, optional)</label>
            <textarea
              className="admin-input"
              rows={3}
              value={form.explanationBn || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, explanationBn: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="admin-label">Explanation (English, optional)</label>
            <textarea
              className="admin-input"
              rows={3}
              value={form.explanationEn}
              onChange={(e) =>
                setForm((f) => ({ ...f, explanationEn: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* ── Options Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Options</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">সঠিক উত্তরে radio দিন</p>
          </div>
          <button
            type="button"
            className="admin-btn-ghost"
            onClick={() =>
              setOptions((o) => [
                ...o,
                { textBn: '', textEn: '', isCorrect: false },
              ])
            }
          >
            + Add option
          </button>
        </div>

        <div className="space-y-3">
          {options.map((opt, i) => (
            <div
              key={i}
              className={
                'rounded-xl border p-4 space-y-3 transition-colors ' +
                (opt.isCorrect
                  ? 'border-emerald-400 dark:border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-500/5'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/20')
              }
            >
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                  <input
                    type="radio"
                    name="correct"
                    checked={opt.isCorrect}
                    className="accent-emerald-500 w-4 h-4"
                    onChange={() =>
                      setOptions((o) =>
                        o.map((x, j) => ({ ...x, isCorrect: j === i }))
                      )
                    }
                  />
                  <span className={opt.isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}>
                    {opt.isCorrect ? '✓ Correct answer' : 'Mark as correct'}
                  </span>
                </label>
                {options.length > 2 && (
                  <button
                    type="button"
                    className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline"
                    onClick={() =>
                      setOptions((o) => o.filter((_, j) => j !== i))
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <input
                  className="admin-input"
                  value={opt.textBn}
                  placeholder={`Option ${i + 1} (বাংলা)`}
                  onChange={(e) =>
                    setOptions((o) =>
                      o.map((x, j) =>
                        j === i ? { ...x, textBn: e.target.value } : x
                      )
                    )
                  }
                  required
                />
                <input
                  className="admin-input"
                  value={opt.textEn}
                  placeholder={`Option ${i + 1} (English)`}
                  onChange={(e) =>
                    setOptions((o) =>
                      o.map((x, j) =>
                        j === i ? { ...x, textEn: e.target.value } : x
                      )
                    )
                  }
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">
          {loading ? 'Saving...' : 'Save quiz'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/quizzes')}
          className="admin-btn-ghost"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
