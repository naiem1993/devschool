'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Tutorial = { id: string; title: string }
type Option = { text: string; isCorrect: boolean }

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
    question: initial?.question || '',
    explanation: initial?.explanation || '',
  })
  const [options, setOptions] = useState<Option[]>(
    initial?.options?.length
      ? initial.options.map((o: any) => ({ text: o.text, isCorrect: o.isCorrect }))
      : [{ text: '', isCorrect: true }, { text: '', isCorrect: false }]
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        <textarea className="admin-input" rows={2} value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} required />
      </div>
      <div>
        <label className="admin-label">&gt; Explanation</label>
        <textarea className="admin-input" rows={2} value={form.explanation || ''} onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="admin-label mb-0">&gt; Options</span>
          <button type="button" className="text-xs text-cyan-400 hover:text-[#22C55E]" onClick={() => setOptions((o) => [...o, { text: '', isCorrect: false }])}>+ add</button>
        </div>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="radio" name="correct" checked={opt.isCorrect} className="accent-[#22C55E]" onChange={() => setOptions((o) => o.map((x, j) => ({ ...x, isCorrect: j === i })))} />
              <input className="admin-input" value={opt.text} placeholder={`option ${i + 1}`} onChange={(e) => setOptions((o) => o.map((x, j) => j === i ? { ...x, text: e.target.value } : x))} required />
              {options.length > 2 && (
                <button type="button" className="text-red-500/70 hover:text-red-500 text-xs" onClick={() => setOptions((o) => o.filter((_, j) => j !== i))}>rm</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && <div className="admin-error">[!] {error}</div>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">{loading ? '> saving...' : '$ save'}</button>
        <button type="button" onClick={() => router.back()} className="admin-btn-ghost">$ cancel</button>
      </div>
    </form>
  )
}
