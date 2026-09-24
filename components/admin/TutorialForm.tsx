'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function TutorialForm({
  initial,
  mode = 'create',
}: {
  initial?: any
  mode?: 'create' | 'edit'
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    titleBn: initial?.titleBn || '',
    titleEn: initial?.titleEn || '',
    slug: initial?.slug || '',
    descriptionBn: initial?.descriptionBn || '',
    descriptionEn: initial?.descriptionEn || '',
    icon: initial?.icon || '',
    difficulty: initial?.difficulty || 'Beginner',
    duration: initial?.duration ?? 0,
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

    // Nested v3 — chapter/lesson আলাদা chapters পেজ থেকে manage হয়।
    // তাই এখানে contents পাঠানো হয় না (না create, না edit)।
    const url =
      mode === 'edit'
        ? `/api/admin/tutorials/${initial?.id}`
        : '/api/admin/tutorials'

    try {
      const res = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        if (mode === 'edit') {
          router.push('/admin/tutorials')
          router.refresh()
        } else {
          const data = await res.json().catch(() => ({}))
          const newId = data?.id
          if (newId) {
            router.push(`/admin/tutorials/${newId}/chapters`)
            router.refresh()
          } else {
            router.push('/admin/tutorials')
            router.refresh()
          }
        }
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'save failed')
      }
    } catch {
      setError('network error — save failed')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-3xl">
      <div>
        <label className="admin-label">&gt; Title</label>
        <input
          className="admin-input"
          value={form.titleBn}
          onChange={(e) => {
            const t = e.target.value
            setForm((f) => ({
              ...f,
              titleBn: t,
              slug: mode === 'create' ? autoSlug(t) : f.slug,
            }))
          }}
          required
        />
      </div>

      <div>
        <label className="admin-label">&gt; Title (English)</label>
        <input
          className="admin-input"
          value={form.titleEn || ''}
          onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))}
          placeholder="Optional — English title"
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
        <label className="admin-label">&gt; Description</label>
        <textarea
          className="admin-input"
          rows={3}
          value={form.descriptionBn || ''}
          onChange={(e) => setForm((f) => ({ ...f, descriptionBn: e.target.value }))}
        />
      </div>

      <div>
        <label className="admin-label">&gt; Description (English)</label>
        <textarea
          className="admin-input"
          rows={3}
          value={form.descriptionEn || ''}
          onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
          placeholder="Optional — English description"
        />
      </div>

      <div>
        <label className="admin-label">&gt; Icon (emoji)</label>
        <input
          className="admin-input"
          placeholder="যেমন: 🌐 🎨 🟨 🐍 (ফাঁকা রাখলেও চলবে)"
          value={form.icon || ''}
          onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
          maxLength={20}
        />
        <p className="text-xs text-slate-500 mt-1">
          কার্ডে টিউটোরিয়ালের পাশে এই emoji দেখা যাবে।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">&gt; Difficulty</label>
          <select
            className="admin-input"
            value={form.difficulty}
            onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="admin-label">&gt; Duration (min)</label>
          <input
            type="number"
            className="admin-input"
            value={form.duration}
            onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-xs text-[#22C55E]/80 font-mono">
          <input
            type="checkbox"
            className="accent-[#22C55E]"
            checked={form.isPublished}
            onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
          />
          is_published
        </label>
        <label className="flex items-center gap-2 text-xs text-[#22C55E]/80 font-mono">
          <input
            type="checkbox"
            className="accent-[#22C55E]"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
          />
          is_active
        </label>
      </div>

      {error && (
        <div className="text-xs font-mono px-3 py-2 rounded border border-red-500/40 text-red-500">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="admin-btn disabled:opacity-40">
        {loading ? 'saving…' : mode === 'edit' ? 'save changes' : 'create tutorial'}
      </button>
    </form>
  )
}
