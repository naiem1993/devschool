'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CategoryForm({
  initial,
  mode = 'create',
}: {
  initial?: {
    id?: string
    name?: string
    slug?: string
    icon?: string | null
    description?: string | null
    sortOrder?: number
    isActive?: boolean
  }
  mode?: 'create' | 'edit'
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: initial?.name || '',
    slug: initial?.slug || '',
    icon: initial?.icon || '',
    description: initial?.description || '',
    sortOrder: initial?.sortOrder ?? 0,
    isActive: initial?.isActive ?? true,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const autoSlug = (v: string) =>
    v
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const url =
      mode === 'edit'
        ? `/api/admin/categories/${initial?.id}`
        : '/api/admin/categories'
    const res = await fetch(url, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push('/admin/categories')
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
        <label className="admin-label">&gt; Name</label>
        <input
          className="admin-input"
          value={form.name}
          onChange={(e) => {
            const name = e.target.value
            setForm((f) => ({
              ...f,
              name,
              slug: mode === 'create' ? autoSlug(name) : f.slug,
            }))
          }}
          required
        />
      </div>

      <div>
        <label className="admin-label">&gt; Slug</label>
        <input
          className="admin-input"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="admin-label">&gt; Icon (emoji, optional)</label>
        <input
          className="admin-input"
          value={form.icon || ''}
          onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
          placeholder="📚"
        />
      </div>

      <div>
        <label className="admin-label">&gt; Description</label>
        <textarea
          className="admin-input"
          rows={3}
          value={form.description || ''}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label">&gt; Sort Order</label>
          <input
            type="number"
            className="admin-input"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-xs text-[#22C55E]/80 font-mono">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="accent-[#22C55E]"
            />
            is_active
          </label>
        </div>
      </div>

      {error && <div className="admin-error">[!] {error}</div>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">
          {loading ? '> saving...' : '$ save'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/categories')}
          className="admin-btn-ghost"
        >
          $ cancel
        </button>
      </div>
    </form>
  )
}
