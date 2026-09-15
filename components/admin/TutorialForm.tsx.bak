'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Category = { id: string; name: string }

export default function TutorialForm({
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
    difficulty: initial?.difficulty || 'beginner',
    duration: initial?.duration ?? 0,
    categoryId: initial?.categoryId || categories[0]?.id || '',
    isPublished: initial?.isPublished ?? false,
    isActive: initial?.isActive ?? true,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const autoSlug = (v: string) =>
    v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const url = mode === 'edit' ? `/api/admin/tutorials/${initial?.id}` : '/api/admin/tutorials'
    const res = await fetch(url, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push('/admin/tutorials')
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'save failed')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="admin-label">&gt; Title</label>
        <input className="admin-input" value={form.title}
          onChange={(e) => { const t = e.target.value; setForm((f) => ({ ...f, title: t, slug: mode === 'create' ? autoSlug(t) : f.slug })) }} required />
      </div>
      <div>
        <label className="admin-label">&gt; Slug</label>
        <input className="admin-input" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required />
      </div>
      <div>
        <label className="admin-label">&gt; Description</label>
        <textarea className="admin-input" rows={3} value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label">&gt; Category</label>
          <select className="admin-input" value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} required>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="admin-label">&gt; Difficulty</label>
          <select className="admin-input" value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}>
            <option value="beginner">beginner</option>
            <option value="intermediate">intermediate</option>
            <option value="advanced">advanced</option>
          </select>
        </div>
      </div>
      <div>
        <label className="admin-label">&gt; Duration (min)</label>
        <input type="number" className="admin-input" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))} />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-xs text-[#00ff88]/80 font-mono">
          <input type="checkbox" className="accent-[#00ff88]" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
          is_published
        </label>
        <label className="flex items-center gap-2 text-xs text-[#00ff88]/80 font-mono">
          <input type="checkbox" className="accent-[#00ff88]" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
          is_active
        </label>
      </div>
      {error && <div className="admin-error">[!] {error}</div>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">{loading ? '> saving...' : '$ save'}</button>
        <button type="button" onClick={() => router.back()} className="admin-btn-ghost">$ cancel</button>
      </div>
    </form>
  )
}
