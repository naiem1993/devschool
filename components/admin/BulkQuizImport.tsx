'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import AIQuizGenerator from './AIQuizGenerator'

type Tutorial = { id: string; title: string }
type Lesson = { id: string; title: string; tutorialId: string }
type Chapter = { id: string; title: string; tutorialId: string; hasLessons: boolean }

type ParsedOption = { textBn: string; textEn: string; isCorrect: boolean }
type ParsedQuiz = {
  questionBn: string
  questionEn: string
  explanationBn: string
  explanationEn: string
  options: ParsedOption[]
}
type ParseError = { line: number; message: string }
type ParseResult = { quizzes: ParsedQuiz[]; errors: ParseError[] }

// ── Parser ─────────────────────────────────────────────────
// Format:
//   Q: বাংলা প্রশ্ন | English question
//   A: বাংলা অপশন | English option ✓
//   B: ...
//   C: ...
//   D: ...
//   E: বাংলা ব্যাখ্যা | English explanation   (optional)
//   ---
function splitPair(raw: string): [string, string] {
  const idx = raw.indexOf('|')
  if (idx === -1) return [raw.trim(), raw.trim()]
  return [raw.slice(0, idx).trim(), raw.slice(idx + 1).trim()]
}

function parseBulk(text: string): ParseResult {
  const quizzes: ParsedQuiz[] = []
  const errors: ParseError[] = []
  const blocks = text.split(/^---\s*$/m)

  blocks.forEach((block, blockIdx) => {
    const raw = block.trim()
    if (!raw) return

    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    let question: string | null = null
    let questionEn = ''
    const options: ParsedOption[] = []
    let expBn = ''
    let expEn = ''

    lines.forEach((line) => {
      if (/^Q[:\-]/i.test(line)) {
        const body = line.replace(/^Q[:\-]\s*/i, '')
        const [bn, en] = splitPair(body)
        question = bn
        questionEn = en
      } else if (/^[A-D][\)\.:\-]/i.test(line)) {
        let body = line.replace(/^[A-D][\)\.:\-]\s*/i, '')
        let isCorrect = false
        if (/[✓✔]\s*$/.test(body) || /\*\s*$/.test(body)) {
          isCorrect = true
          body = body.replace(/[✓✔\*]\s*$/, '').trim()
        }
        const [bn, en] = splitPair(body)
        options.push({ textBn: bn, textEn: en, isCorrect })
      } else if (/^E[:\-]/i.test(line)) {
        const body = line.replace(/^E[:\-]\s*/i, '')
        const [bn, en] = splitPair(body)
        expBn = bn
        expEn = en
      }
    })

    const lineNo = blockIdx + 1

    if (!question) {
      errors.push({ line: lineNo, message: `ব্লক ${lineNo}: Q: লাইন পাওয়া যায়নি` })
      return
    }
    if (options.length < 2) {
      errors.push({ line: lineNo, message: `ব্লক ${lineNo}: অন্তত ২টি অপশন দরকার` })
      return
    }
    if (!options.some((o) => o.isCorrect)) {
      errors.push({ line: lineNo, message: `ব্লক ${lineNo}: সঠিক উত্তরে ✓ চিহ্ন দিন` })
      return
    }

    quizzes.push({
      questionBn: question,
      questionEn: questionEn || question,
      explanationBn: expBn,
      explanationEn: expEn,
      options,
    })
  })

  return { quizzes, errors }
}

// ── Sample template ────────────────────────────────────────
const SAMPLE = `Q: HTML মানে কী? | What does HTML stand for?
A: Hyper Text Markup Language | Hyper Text Markup Language ✓
B: Home Tool Markup Language | Home Tool Markup Language
C: Hyperlinks and Text Markup Language | Hyperlinks and Text Markup Language
D: Hyper Tool Markup Language | Hyper Tool Markup Language
E: HTML = Hyper Text Markup Language। | HTML = Hyper Text Markup Language.
---
Q: HTML element-এর অংশ কতটি? | How many parts does an HTML element have?
A: ১টি | 1
B: ২টি | 2
C: ৩টি | 3 ✓
D: ৪টি | 4
E: start tag + content + end tag। | start tag + content + end tag.
---`

export default function BulkQuizImport({
  tutorials,
  lessons,
  chapters,
}: {
  tutorials: Tutorial[]
  lessons: Lesson[]
  chapters: Chapter[]
}) {
  const router = useRouter()

  const [tutorialId, setTutorialId] = useState(tutorials[0]?.id || '')
  const [locationType, setLocationType] = useState<'lesson' | 'chapter'>('lesson')
  const [lessonId, setLessonId] = useState('')
  const [chapterId, setChapterId] = useState('')
  const [startOrderIndex, setStartOrderIndex] = useState(1)
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const availableLessons = useMemo(
    () => lessons.filter((l) => l.tutorialId === tutorialId),
    [lessons, tutorialId]
  )
  const availableChapters = useMemo(
    () => chapters.filter((c) => c.tutorialId === tutorialId && !c.hasLessons),
    [chapters, tutorialId]
  )

  const parsed = useMemo(() => parseBulk(text), [text])

  const onSave = async () => {
    setError('')
    setSuccess('')

    if (parsed.errors.length > 0) {
      setError('পার্স এরর ঠিক করুন')
      return
    }
    if (parsed.quizzes.length === 0) {
      setError('কোনো কুইজ পাওয়া যায়নি')
      return
    }
    const hasLocation = locationType === 'lesson' ? !!lessonId : !!chapterId
    if (!hasLocation) {
      setError(locationType === 'lesson' ? 'Lesson বেছে নিন' : 'Chapter বেছে নিন')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/quiz/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorialId,
          lessonId: locationType === 'lesson' ? lessonId : null,
          chapterId: locationType === 'chapter' ? chapterId : null,
          startOrderIndex,
          quizzes: parsed.quizzes,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'সেভ করা যায়নি')
        setSaving(false)
        return
      }
      setSuccess(`${data.created}টি কুইজ সফলভাবে সেভ হয়েছে!`)
      setText('')
      router.refresh()
    } catch {
      setError('নেটওয়ার্ক সমস্যা')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* ── Location ── */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">১. কোথায় যোগ করবেন?</h2>

        <div>
          <label className="admin-label">&gt; Tutorial</label>
          <select
            className="admin-input"
            value={tutorialId}
            onChange={(e) => {
              setTutorialId(e.target.value)
              setLessonId('')
              setChapterId('')
            }}
          >
            {tutorials.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="admin-label">&gt; কোথায় দেখাবে?</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                checked={locationType === 'lesson'}
                onChange={() => { setLocationType('lesson'); setChapterId('') }}
                className="accent-[#22C55E]"
              />
              <span>Lesson (nested)</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                checked={locationType === 'chapter'}
                onChange={() => { setLocationType('chapter'); setLessonId('') }}
                className="accent-[#22C55E]"
              />
              <span>Chapter (single-page)</span>
            </label>
          </div>
        </div>

        {locationType === 'lesson' ? (
          <div>
            <label className="admin-label">&gt; Lesson</label>
            <select className="admin-input" value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
              <option value="">— Lesson বেছে নিন —</option>
              {availableLessons.map((l) => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="admin-label">&gt; Chapter</label>
            <select className="admin-input" value={chapterId} onChange={(e) => setChapterId(e.target.value)}>
              <option value="">— Chapter বেছে নিন —</option>
              {availableChapters.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="admin-label">&gt; Start Order Index</label>
          <input
            type="number"
            min={1}
            className="admin-input"
            value={startOrderIndex}
            onChange={(e) => setStartOrderIndex(Number(e.target.value) || 1)}
          />
          <p className="text-[10px] text-gray-500 mt-1">
            প্রথম কুইজের orderIndex। পরেরগুলো স্বয়ংক্রিয়ভাবে ১ করে বাড়বে।
          </p>
        </div>
      </div>

      {/* ── AI Generator ── */}
      <AIQuizGenerator
        tutorialTitle={tutorials.find((t) => t.id === tutorialId)?.title || ''}
        onGenerated={(raw) => {
          const sep = text.trim() ? '\n' : ''
          setText((prev) => prev + sep + raw)
        }}
      />

      {/* ── Paste area ── */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">২. কুইজ পেস্ট করুন</h2>
          <button
            type="button"
            onClick={() => setText(SAMPLE)}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-[#22C55E] hover:text-[#22C55E] transition"
          >
            📋 Sample বসান
          </button>
        </div>

        <textarea
          className="admin-input font-mono text-xs leading-relaxed"
          rows={16}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={SAMPLE}
          spellCheck={false}
        />

        <details className="text-xs text-gray-600 dark:text-gray-400">
          <summary className="cursor-pointer font-semibold">ফরম্যাট নির্দেশিকা</summary>
          <pre className="mt-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-950 overflow-x-auto whitespace-pre-wrap">{SAMPLE}</pre>
        </details>
      </div>

      {/* ── Preview ── */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">
          ৩. প্রিভিউ{' '}
          <span className="text-sm font-normal text-gray-500">
            ({parsed.quizzes.length}টি কুইজ, {parsed.errors.length}টি এরর)
          </span>
        </h2>

        {parsed.errors.length > 0 && (
          <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 p-3 space-y-1">
            {parsed.errors.map((er, i) => (
              <p key={i} className="text-xs text-red-700 dark:text-red-300">❌ {er.message}</p>
            ))}
          </div>
        )}

        {parsed.quizzes.length === 0 && parsed.errors.length === 0 && (
          <p className="text-sm text-gray-500">উপরে কুইজ পেস্ট করলে এখানে প্রিভিউ দেখাবে।</p>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {parsed.quizzes.map((q, i) => (
            <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {i + 1}. {q.questionBn}
              </p>
              <p className="text-xs text-gray-500 italic mb-2">{q.questionEn}</p>
              <ul className="space-y-1">
                {q.options.map((o, j) => (
                  <li
                    key={j}
                    className={`text-xs px-2 py-1 rounded ${
                      o.isCorrect
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {o.isCorrect ? '✓' : String.fromCharCode(65 + j) + ')'} {o.textBn}
                    <span className="text-gray-400"> | {o.textEn}</span>
                  </li>
                ))}
              </ul>
              {(q.explanationBn || q.explanationEn) && (
                <p className="text-[11px] text-gray-500 mt-2">
                  💡 {q.explanationBn} <span className="italic">| {q.explanationEn}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Save ── */}
      <div className="sticky bottom-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || parsed.quizzes.length === 0 || parsed.errors.length > 0}
          className="px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'সেভ হচ্ছে...' : `💾 ${parsed.quizzes.length}টি কুইজ সেভ করুন`}
        </button>
        {error && <span className="text-sm text-red-500">{error}</span>}
        {success && <span className="text-sm text-emerald-500">✅ {success}</span>}
      </div>
    </div>
  )
}
