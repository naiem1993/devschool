'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

type Tutorial = { id: string; title: string }
type Lesson = { id: string; title: string; tutorialId: string }
type Chapter = { id: string; title: string; tutorialId: string; hasLessons: boolean }
type Option = { textBn: string; textEn: string; isCorrect: boolean }

// কোন location-এ quiz বসবে
type LocationType = 'lesson' | 'chapter'

export default function QuizForm({
  initial,
  tutorials,
  lessons,
  chapters,
  mode = 'create',
}: {
  initial?: any
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
      ? initial.options.map((o: any) => ({
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
    const body: any = {
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
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
      {/* ── Tutorial ── */}
      <div>
        <label className="admin-label">&gt; Tutorial</label>
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

      {/* ── Location Type ── */}
      <div>
        <label className="admin-label">&gt; কোথায় দেখাবে?</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="locationType"
              checked={locationType === 'lesson'}
              onChange={() => onLocationTypeChange('lesson')}
              className="accent-[#22C55E]"
            />
            <span>Lesson (nested chapter)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="locationType"
              checked={locationType === 'chapter'}
              onChange={() => onLocationTypeChange('chapter')}
              className="accent-[#22C55E]"
            />
            <span>Chapter (single-page)</span>
          </label>
        </div>
      </div>

      {/* ── Lesson / Chapter select ── */}
      {locationType === 'lesson' ? (
        <div>
          <label className="admin-label">&gt; Lesson</label>
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
            <p className="text-[10px] text-amber-500 mt-1">
              এই tutorial-এ কোনো nested lesson নেই। Chapter mode চেষ্টা করুন।
            </p>
          )}
        </div>
      ) : (
        <div>
          <label className="admin-label">&gt; Chapter (single-page)</label>
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
            <p className="text-[10px] text-amber-500 mt-1">
              এই tutorial-এ কোনো single-page chapter নেই। Lesson mode চেষ্টা করুন।
            </p>
          )}
        </div>
      )}

      {/* ── Order ── */}
      <div>
        <label className="admin-label">&gt; Order Index (marker number)</label>
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
        <p className="text-[10px] text-gray-500 mt-1">
          content-এ প্রথম{' '}
          <code className="px-1 rounded bg-gray-200 dark:bg-gray-800">[[quiz]]</code> = 1,
          দ্বিতীয় = 2, তৃতীয় = 3 ...
        </p>
      </div>

      {/* ── Question ── */}
      <div>
        <label className="admin-label">&gt; Question (BN)</label>
        <textarea
          className="admin-input"
          rows={2}
          value={form.questionBn}
          onChange={(e) => setForm((f) => ({ ...f, questionBn: e.target.value }))}
          required
        />
      </div>
      <div>
        <label className="admin-label">&gt; Explanation (BN, optional)</label>
        <textarea
          className="admin-input"
          rows={2}
          value={form.explanationBn || ''}
          onChange={(e) =>
            setForm((f) => ({ ...f, explanationBn: e.target.value }))
          }
        />
      </div>

      {/* ── English ── */}
      <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4 space-y-4">
        <p className="text-[10px] uppercase tracking-widest font-mono text-gray-500">
          English (required — /en সাইটে দেখাবে)
        </p>
        <div>
          <label className="admin-label">&gt; Question (EN)</label>
          <textarea
            className="admin-input"
            rows={2}
            value={form.questionEn}
            onChange={(e) =>
              setForm((f) => ({ ...f, questionEn: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <label className="admin-label">&gt; Explanation (EN, optional)</label>
          <textarea
            className="admin-input"
            rows={2}
            value={form.explanationEn}
            onChange={(e) =>
              setForm((f) => ({ ...f, explanationEn: e.target.value }))
            }
          />
        </div>
      </div>

      {/* ── Options ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="admin-label mb-0">&gt; Options (সঠিকটায় radio দিন)</span>
          <button
            type="button"
            className="text-xs text-cyan-400 hover:text-[#22C55E]"
            onClick={() =>
              setOptions((o) => [
                ...o,
                { textBn: '', textEn: '', isCorrect: false },
              ])
            }
          >
            + add
          </button>
        </div>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div
              key={i}
              className="space-y-1 border border-gray-200 dark:border-gray-800 rounded p-2"
            >
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="correct"
                  checked={opt.isCorrect}
                  className="accent-[#22C55E]"
                  onChange={() =>
                    setOptions((o) =>
                      o.map((x, j) => ({ ...x, isCorrect: j === i }))
                    )
                  }
                />
                <input
                  className="admin-input"
                  value={opt.textBn}
                  placeholder={`option ${i + 1} (BN)`}
                  onChange={(e) =>
                    setOptions((o) =>
                      o.map((x, j) =>
                        j === i ? { ...x, textBn: e.target.value } : x
                      )
                    )
                  }
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    className="text-red-500/70 hover:text-red-500 text-xs"
                    onClick={() =>
                      setOptions((o) => o.filter((_, j) => j !== i))
                    }
                  >
                    rm
                  </button>
                )}
              </div>
              <input
                className="admin-input"
                value={opt.textEn}
                placeholder={`option ${i + 1} (EN)`}
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
          ))}
        </div>
      </div>

      {error && <div className="admin-error">[!] {error}</div>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">
          {loading ? '> saving...' : '$ save'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/quizzes')}
          className="admin-btn-ghost"
        >
          $ cancel
        </button>
      </div>
    </form>
  )
}
