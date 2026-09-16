'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Tutorial = { id: string; title: string }
type TC = { input: string; expectedOutput: string; isHidden: boolean }

export default function ChallengeForm({
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
    title: initial?.title || '',
    description: initial?.description || '',
    starterCode: initial?.starterCode || '',
    solution: initial?.solution || '',
    difficulty: initial?.difficulty || 'Easy',
    points: initial?.points ?? 10,
  })
  const [testCases, setTestCases] = useState<TC[]>(
    initial?.testCases?.length
      ? initial.testCases.map((t: any) => ({ input: t.input, expectedOutput: t.expectedOutput, isHidden: t.isHidden }))
      : [{ input: '', expectedOutput: '', isHidden: false }]
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const url = mode === 'edit' ? `/api/admin/challenges/${initial?.id}` : '/api/admin/challenges'
    const res = await fetch(url, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, testCases }),
    })
    if (res.ok) { router.push('/admin/challenges'); router.refresh() }
    else { const d = await res.json().catch(() => ({})); setError(d.error || 'save failed') }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-3xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label">&gt; Tutorial</label>
          <select className="admin-input" value={form.tutorialId} onChange={(e) => setForm((f) => ({ ...f, tutorialId: e.target.value }))} required>
            {tutorials.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <div>
          <label className="admin-label">&gt; Difficulty</label>
          <select className="admin-input" value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}>
            <option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
        </div>
      </div>
      <div>
        <label className="admin-label">&gt; Title</label>
        <input className="admin-input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
      </div>
      <div>
        <label className="admin-label">&gt; Description</label>
        <textarea className="admin-input" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label">&gt; Starter Code</label>
          <textarea className="admin-input" rows={5} value={form.starterCode || ''} onChange={(e) => setForm((f) => ({ ...f, starterCode: e.target.value }))} />
        </div>
        <div>
          <label className="admin-label">&gt; Solution</label>
          <textarea className="admin-input" rows={5} value={form.solution || ''} onChange={(e) => setForm((f) => ({ ...f, solution: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="admin-label">&gt; Points</label>
        <input type="number" className="admin-input" value={form.points} onChange={(e) => setForm((f) => ({ ...f, points: Number(e.target.value) }))} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="admin-label mb-0">&gt; Test Cases</span>
          <button type="button" className="text-xs text-cyan-400 hover:text-[#22C55E]" onClick={() => setTestCases((t) => [...t, { input: '', expectedOutput: '', isHidden: false }])}>+ add</button>
        </div>
        <div className="space-y-3">
          {testCases.map((tc, i) => (
            <div key={i} className="border border-[#22C55E]/20 rounded p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input className="admin-input" placeholder="input" value={tc.input} onChange={(e) => setTestCases((a) => a.map((x, j) => j === i ? { ...x, input: e.target.value } : x))} />
                <input className="admin-input" placeholder="expected output" value={tc.expectedOutput} onChange={(e) => setTestCases((a) => a.map((x, j) => j === i ? { ...x, expectedOutput: e.target.value } : x))} />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-[#22C55E]/80 font-mono">
                  <input type="checkbox" className="accent-[#22C55E]" checked={tc.isHidden} onChange={(e) => setTestCases((a) => a.map((x, j) => j === i ? { ...x, isHidden: e.target.checked } : x))} />
                  hidden
                </label>
                {testCases.length > 1 && <button type="button" className="text-red-500/70 hover:text-red-500 text-xs" onClick={() => setTestCases((a) => a.filter((_, j) => j !== i))}>rm</button>}
              </div>
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
