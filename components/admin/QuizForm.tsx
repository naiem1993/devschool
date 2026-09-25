'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Tutorial = { id: string; title: string }
type Option = { textBn: string; textEn: string; isCorrect: boolean }

export default function QuizForm({
  initial,
  tutorials,
  mode = 'create',
}: {
  initial?: any
  tutorials: Tutorial[]
  mode?: 'create' | 'edit'
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    tutorialId: initial?.tutorialId || tutorials[0]?.id || '',
    questionBn: initial?.questionBn || '',
    questionEn: initial?.questionEn || '',
    explanationBn: initial?.explanationBn || '',
    explanationEn: initial?.explanationEn || '',
  })
  const [options, setOptions] = useState<Option[]>(
    initial?.options?.length
      ? initial.options.map((o: any) => ({ textBn: o.textBn, textEn: o.textEn || '', isCorrect: o.isCorrect }))
      : [{ textBn: '', textEn: '', isCorrect: true }, { textBn: '', textEn: '', isCorrect: false }]
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.questionEn.trim()) {
      setError('ইংরেজি Question দরকার (জোড়া নিয়ম)')
      return
    }
    if (options.some((o) => !o.textEn.trim())) {
      setError('প্রতিটি option-এর ইংরেজি text দরকার (জোড়া নিয়ম)')
      return
    }
    setLoading(true)
    setError('')
    const url = mode === 'edit' ? `/api/admin/quiz/${initial?.id}` : '/api/admin/quiz'
    const res = await fetch(url, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, options }),
    })
    if (res.ok) { router.push('/admin/quizzes'); router.refresh() }
    else { const d = await res.json().catch(() => ({})); setError(d.error || 'save failed') }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="admin-label">&gt; Tutorial</label>
        <select className="admin-input" value={form.tutorialId} onChange={(e) => setForm((f) => ({ ...f, tutorialId: e.target.value }))} required>
          {tutorials.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>
      <div>
        <label className="admin-label">&gt; Question</label>
        <textarea className="admin-input" rows={2} value={form.questionBn} onChange={(e) => setForm((f) => ({ ...f, questionBn: e.target.value }))} required />
      </div>
      <div>
        <label className="admin-label">&gt; Explanation</label>
        <textarea className="admin-input" rows={2} value={form.explanationBn || ''} onChange={(e) => setForm((f) => ({ ...f, explanationBn: e.target.value }))} />
      </div>

      {/* PART 9h — ইংরেজি ভার্সন (required) */}
      <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4 space-y-4">
        <p className="text-[10px] uppercase tracking-widest font-mono text-gray-500">
          English (required — /en সাইটে দেখাবে)
        </p>
        <div>
          <label className="admin-label">&gt; Question (EN)</label>
          <textarea className="admin-input" rows={2} value={form.questionEn} onChange={(e) => setForm((f) => ({ ...f, questionEn: e.target.value }))} required />
        </div>
        <div>
          <label className="admin-label">&gt; Explanation (EN, optional)</label>
          <textarea className="admin-input" rows={2} value={form.explanationEn} onChange={(e) => setForm((f) => ({ ...f, explanationEn: e.target.value }))} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="admin-label mb-0">&gt; Options</span>
          <button type="button" className="text-xs text-cyan-400 hover:text-[#22C55E]" onClick={() => setOptions((o) => [...o, { textBn: '', textEn: '', isCorrect: false }])}>+ add</button>
        </div>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="space-y-1 border border-gray-200 dark:border-gray-800 rounded p-2">
              <div className="flex gap-2 items-center">
                <input type="radio" name="correct" checked={opt.isCorrect} className="accent-[#22C55E]" onChange={() => setOptions((o) => o.map((x, j) => ({ ...x, isCorrect: j === i })))} />
                <input className="admin-input" value={opt.textBn} placeholder={`option ${i + 1} (BN)`} onChange={(e) => setOptions((o) => o.map((x, j) => j === i ? { ...x, textBn: e.target.value } : x))} required />
                {options.length > 2 && (
                  <button type="button" className="text-red-500/70 hover:text-red-500 text-xs" onClick={() => setOptions((o) => o.filter((_, j) => j !== i))}>rm</button>
                )}
              </div>
              <input className="admin-input" value={opt.textEn} placeholder={`option ${i + 1} (EN)`} onChange={(e) => setOptions((o) => o.map((x, j) => j === i ? { ...x, textEn: e.target.value } : x))} required />
            </div>
          ))}
        </div>
      </div>

      {error && <div className="admin-error">[!] {error}</div>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">{loading ? '> saving...' : '$ save'}</button>
        <button type="button" onClick={() => router.push('/admin/quizzes')} className="admin-btn-ghost">$ cancel</button>
      </div>
    </form>
  )
}
