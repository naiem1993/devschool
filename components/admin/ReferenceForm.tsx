'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Reference } from '@prisma/client'

type TutorialOption = { id: string; title: string }

export default function ReferenceForm({
  initial,
  tutorials,
  mode = 'create',
}: {
  initial?: Partial<Reference>
  tutorials: TutorialOption[]
  mode?: 'create' | 'edit'
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    titleBn: initial?.titleBn || '',
    titleEn: initial?.titleEn || '',
    slug: initial?.slug || '',
    descriptionBn: initial?.descriptionBn || '',
    descriptionEn: initial?.descriptionEn || '',
    syntaxBn: initial?.syntaxBn || '',
    syntaxEn: initial?.syntaxEn || '',
    exampleBn: initial?.exampleBn || '',
    exampleEn: initial?.exampleEn || '',
    tags: (initial?.tags || []).join(', '),
    language: initial?.language || '',
    tutorialId: initial?.tutorialId || tutorials[0]?.id || '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const autoSlug = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titleEn.trim()) {
      setError('ইংরেজি title দরকার (জোড়া নিয়ম)')
      return
    }
    setLoading(true)
    setError('')
    const payload = {
      ...form,
      tags: form.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
    }
    const url = mode === 'edit' ? `/api/admin/references/${initial?.id}` : '/api/admin/references'
    const res = await fetch(url, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) { router.push('/admin/references'); router.refresh() }
    else { const d = await res.json().catch(() => ({})); setError(d.error || 'save failed') }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ── Settings Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Tutorial</label>
            <select className="admin-input" value={form.tutorialId} onChange={(e) => setForm((f) => ({ ...f, tutorialId: e.target.value }))} required>
              {tutorials.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-label">Language</label>
            <input className="admin-input" value={form.language} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))} placeholder="javascript" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Slug</label>
            <input className="admin-input font-mono text-sm" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required />
          </div>
          <div>
            <label className="admin-label">Tags (comma separated)</label>
            <input className="admin-input" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="array, method, es6" />
          </div>
        </div>
      </div>

      {/* ── Title Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Title</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Title (বাংলা)</label>
            <input className="admin-input" value={form.titleBn} onChange={(e) => { const t = e.target.value; setForm((f) => ({ ...f, titleBn: t, slug: mode === 'create' ? autoSlug(t) : f.slug })) }} required />
          </div>
          <div>
            <label className="admin-label">Title (English)</label>
            <input className="admin-input" value={form.titleEn} onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))} placeholder="e.g. Array map" required />
          </div>
        </div>
      </div>

      {/* ── Description Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Description</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Description (বাংলা)</label>
            <textarea className="admin-input" rows={3} value={form.descriptionBn} onChange={(e) => setForm((f) => ({ ...f, descriptionBn: e.target.value }))} />
          </div>
          <div>
            <label className="admin-label">Description (English)</label>
            <textarea className="admin-input" rows={3} value={form.descriptionEn} onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* ── Syntax Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Syntax</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Syntax (বাংলা)</label>
            <textarea className="admin-input font-mono text-xs" rows={3} value={form.syntaxBn} onChange={(e) => setForm((f) => ({ ...f, syntaxBn: e.target.value }))} />
          </div>
          <div>
            <label className="admin-label">Syntax (English)</label>
            <textarea className="admin-input font-mono text-xs" rows={3} value={form.syntaxEn} onChange={(e) => setForm((f) => ({ ...f, syntaxEn: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* ── Example Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Example</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Example (বাংলা)</label>
            <textarea className="admin-input font-mono text-xs" rows={6} value={form.exampleBn} onChange={(e) => setForm((f) => ({ ...f, exampleBn: e.target.value }))} />
          </div>
          <div>
            <label className="admin-label">Example (English)</label>
            <textarea className="admin-input font-mono text-xs" rows={6} value={form.exampleEn} onChange={(e) => setForm((f) => ({ ...f, exampleEn: e.target.value }))} />
          </div>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">{loading ? 'Saving...' : 'Save reference'}</button>
        <button type="button" onClick={() => router.push('/admin/references')} className="admin-btn-ghost">Cancel</button>
      </div>
    </form>
  )
}
