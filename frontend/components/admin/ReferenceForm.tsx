'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Category = { id: string; name: string }

export default function ReferenceForm({
  initial,
  categories,
  mode = 'create',
}: {
  initial?: any
  categories: Category[]
  mode?: 'create' | 'edit'
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: initial?.title || '',
    slug: initial?.slug || '',
    description: initial?.description || '',
    syntax: initial?.syntax || '',
    example: initial?.example || '',
    tags: (initial?.tags || []).join(', '),
    language: initial?.language || '',
    categoryId: initial?.categoryId || categories[0]?.id || '',
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
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
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
        <input className="admin-input" value={form.title} onChange={(e) => { const t = e.target.value; setForm((f) => ({ ...f, title: t, slug: mode === 'create' ? autoSlug(t) : f.slug })) }} required />
      </div>
      <div>
        <label className="admin-label">&gt; Slug</label>
        <input className="admin-input" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label">&gt; Category</label>
          <select className="admin-input" value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} required>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="admin-label">&gt; Language</label>
          <input className="admin-input" value={form.language} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))} placeholder="javascript" />
        </div>
      </div>
      <div>
        <label className="admin-label">&gt; Description</label>
        <textarea className="admin-input" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
      </div>
      <div>
        <label className="admin-label">&gt; Syntax</label>
        <textarea className="admin-input" rows={2} value={form.syntax} onChange={(e) => setForm((f) => ({ ...f, syntax: e.target.value }))} />
      </div>
      <div>
        <label className="admin-label">&gt; Example</label>
        <textarea className="admin-input" rows={4} value={form.example} onChange={(e) => setForm((f) => ({ ...f, example: e.target.value }))} />
      </div>
      <div>
        <label className="admin-label">&gt; Tags (comma separated)</label>
        <input className="admin-input" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="array, method, es6" />
      </div>

      {error && <div className="admin-error">[!] {error}</div>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">{loading ? '> saving...' : '$ save'}</button>
        <button type="button" onClick={() => router.back()} className="admin-btn-ghost">$ cancel</button>
      </div>
    </form>
  )
}
