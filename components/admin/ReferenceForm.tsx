'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type TutorialOption = { id: string; title: string }

export default function ReferenceForm({
  initial,
  tutorials,
  mode = 'create',
}: {
  initial?: any
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
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="admin-label">&gt; Title</label>
        <input className="admin-input" value={form.titleBn} onChange={(e) => { const t = e.target.value; setForm((f) => ({ ...f, titleBn: t, slug: mode === 'create' ? autoSlug(t) : f.slug })) }} required />
      </div>
      <div>
        <label className="admin-label">&gt; Slug</label>
        <input className="admin-input" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">&gt; Tutorial</label>
          <select className="admin-input" value={form.tutorialId} onChange={(e) => setForm((f) => ({ ...f, tutorialId: e.target.value }))} required>
            {tutorials.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="admin-label">&gt; Language</label>
          <input className="admin-input" value={form.language} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))} placeholder="javascript" />
        </div>
      </div>
      <div>
        <label className="admin-label">&gt; Description</label>
        <textarea className="admin-input" rows={2} value={form.descriptionBn} onChange={(e) => setForm((f) => ({ ...f, descriptionBn: e.target.value }))} />
      </div>
      <div>
        <label className="admin-label">&gt; Syntax</label>
        <textarea className="admin-input" rows={2} value={form.syntaxBn} onChange={(e) => setForm((f) => ({ ...f, syntaxBn: e.target.value }))} />
      </div>
      <div>
        <label className="admin-label">&gt; Example</label>
        <textarea className="admin-input" rows={4} value={form.exampleBn} onChange={(e) => setForm((f) => ({ ...f, exampleBn: e.target.value }))} />
      </div>
      {/* PART 9f — ইংরেজি ভার্সন (optional) */}
      <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4 space-y-4">
        <p className="text-[10px] uppercase tracking-widest font-mono text-gray-500">
          English (optional — /en সাইটে দেখাবে)
        </p>
        <div>
          <label className="admin-label">&gt; Title (EN)</label>
          <input className="admin-input" value={form.titleEn} onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))} placeholder="e.g. Array map" />
        </div>
        <div>
          <label className="admin-label">&gt; Description (EN)</label>
          <textarea className="admin-input" rows={2} value={form.descriptionEn} onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))} />
        </div>
        <div>
          <label className="admin-label">&gt; Syntax (EN)</label>
          <textarea className="admin-input" rows={2} value={form.syntaxEn} onChange={(e) => setForm((f) => ({ ...f, syntaxEn: e.target.value }))} />
        </div>
        <div>
          <label className="admin-label">&gt; Example (EN)</label>
          <textarea className="admin-input" rows={4} value={form.exampleEn} onChange={(e) => setForm((f) => ({ ...f, exampleEn: e.target.value }))} />
        </div>
      </div>

      <div>
        <label className="admin-label">&gt; Tags (comma separated)</label>
        <input className="admin-input" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="array, method, es6" />
      </div>

      {error && <div className="admin-error">[!] {error}</div>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">{loading ? '> saving...' : '$ save'}</button>
        <button type="button" onClick={() => router.push('/admin/references')} className="admin-btn-ghost">$ cancel</button>
      </div>
    </form>
  )
}
