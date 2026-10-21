'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Tutorial = { id: string; title: string }
type TC = { input: string; expectedOutput: string; isHidden: boolean }

type ChallengeFormInitial = {
  id: string
  tutorialId: string
  titleBn: string
  titleEn: string
  descriptionBn: string
  descriptionEn: string
  starterCodeBn: string
  starterCodeEn: string
  solutionBn: string
  solutionEn: string
  difficulty: string
  points: number
  language: string
  testCases: TC[]
}

export default function ChallengeForm({
  initial,
  tutorials,
  mode = 'create',
}: {
  initial?: ChallengeFormInitial
  tutorials: Tutorial[]
  mode?: 'create' | 'edit'
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    tutorialId: initial?.tutorialId || tutorials[0]?.id || '',
    titleBn: initial?.titleBn || '',
    titleEn: initial?.titleEn || '',
    descriptionBn: initial?.descriptionBn || '',
    descriptionEn: initial?.descriptionEn || '',
    starterCodeBn: initial?.starterCodeBn || '',
    starterCodeEn: initial?.starterCodeEn || '',
    solutionBn: initial?.solutionBn || '',
    solutionEn: initial?.solutionEn || '',
    difficulty: initial?.difficulty || 'Easy',
    points: initial?.points ?? 10,
    language: initial?.language || 'js',
  })
  const [testCases, setTestCases] = useState<TC[]>(
    initial?.testCases?.length
      ? initial.testCases.map((t) => ({ input: t.input, expectedOutput: t.expectedOutput, isHidden: t.isHidden }))
      : [{ input: '', expectedOutput: '', isHidden: false }]
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titleEn.trim() || !form.descriptionEn.trim()) {
      setError('ইংরেজি title ও description দরকার (জোড়া নিয়ম)')
      return
    }
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
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ── Settings Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="admin-label">Tutorial</label>
            <select className="admin-input" value={form.tutorialId} onChange={(e) => setForm((f) => ({ ...f, tutorialId: e.target.value }))} required>
              {tutorials.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-label">Difficulty</label>
            <select className="admin-input" value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Language</label>
            <select className="admin-input" value={form.language} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}>
              <optgroup label="Browser">
                <option value="js">JavaScript</option>
                <option value="ts">TypeScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </optgroup>
              <optgroup label="Remote API">
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
          </div>
          <div>
            <label className="admin-label">Points</label>
            <input type="number" className="admin-input" value={form.points} onChange={(e) => setForm((f) => ({ ...f, points: Number(e.target.value) }))} />
          </div>
        </div>
      </div>

      {/* ── Content Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Challenge details</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Title (বাংলা)</label>
            <input className="admin-input" value={form.titleBn} onChange={(e) => setForm((f) => ({ ...f, titleBn: e.target.value }))} required />
          </div>
          <div>
            <label className="admin-label">Title (English)</label>
            <input className="admin-input" value={form.titleEn} onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))} placeholder="e.g. Reverse a string" required />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Description (বাংলা)</label>
            <textarea className="admin-input" rows={4} value={form.descriptionBn} onChange={(e) => setForm((f) => ({ ...f, descriptionBn: e.target.value }))} required />
          </div>
          <div>
            <label className="admin-label">Description (English)</label>
            <textarea className="admin-input" rows={4} value={form.descriptionEn} onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))} required />
          </div>
        </div>
      </div>

      {/* ── Starter Code Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Starter Code</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">শিক্ষার্থী শুরুতেই যা দেখবে</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Starter Code (বাংলা)</label>
            <textarea className="admin-input font-mono text-xs" rows={6} value={form.starterCodeBn || ''} onChange={(e) => setForm((f) => ({ ...f, starterCodeBn: e.target.value }))} />
          </div>
          <div>
            <label className="admin-label">Starter Code (English)</label>
            <textarea className="admin-input font-mono text-xs" rows={6} value={form.starterCodeEn || ''} onChange={(e) => setForm((f) => ({ ...f, starterCodeEn: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* ── Solution Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Solution</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">সম্পূর্ণ সমাধান — Reveal করলে দেখাবে</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Solution (বাংলা)</label>
            <textarea className="admin-input font-mono text-xs" rows={6} value={form.solutionBn || ''} onChange={(e) => setForm((f) => ({ ...f, solutionBn: e.target.value }))} />
          </div>
          <div>
            <label className="admin-label">Solution (English)</label>
            <textarea className="admin-input font-mono text-xs" rows={6} value={form.solutionEn || ''} onChange={(e) => setForm((f) => ({ ...f, solutionEn: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* ── Test Cases Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Test Cases</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Input ও expected output</p>
          </div>
          <button type="button" className="admin-btn-ghost" onClick={() => setTestCases((t) => [...t, { input: '', expectedOutput: '', isHidden: false }])}>+ Add test case</button>
        </div>
        <div className="space-y-3">
          {testCases.map((tc, i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/20 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Test case #{i + 1}</span>
                {testCases.length > 1 && (
                  <button type="button" className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline" onClick={() => setTestCases((a) => a.filter((_, j) => j !== i))}>Remove</button>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <input className="admin-input font-mono text-xs" placeholder="input" value={tc.input} onChange={(e) => setTestCases((a) => a.map((x, j) => j === i ? { ...x, input: e.target.value } : x))} />
                <input className="admin-input font-mono text-xs" placeholder="expected output" value={tc.expectedOutput} onChange={(e) => setTestCases((a) => a.map((x, j) => j === i ? { ...x, expectedOutput: e.target.value } : x))} />
              </div>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input type="checkbox" className="accent-emerald-500" checked={tc.isHidden} onChange={(e) => setTestCases((a) => a.map((x, j) => j === i ? { ...x, isHidden: e.target.checked } : x))} />
                Hidden test case (শিক্ষার্থী দেখবে না)
              </label>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">{loading ? 'Saving...' : 'Save challenge'}</button>
        <button type="button" onClick={() => router.push('/admin/challenges')} className="admin-btn-ghost">Cancel</button>
      </div>
    </form>
  )
}
