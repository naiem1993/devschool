'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Tutorial } from '@prisma/client'

export default function TutorialForm({
  initial,
  mode = 'create',
}: {
  initial?: Partial<Tutorial>
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
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ── Title Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Title (বাংলা)</label>
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
            <label className="admin-label">Title (English)</label>
            <input
              className="admin-input"
              value={form.titleEn || ''}
              onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))}
              placeholder="Optional — English title"
            />
          </div>
        </div>

        <div>
          <label className="admin-label">Slug</label>
          <input
            className="admin-input font-mono text-sm"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
          />
        </div>
      </div>

      {/* ── Description Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Description</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Description (বাংলা)</label>
            <textarea
              className="admin-input"
              rows={4}
              value={form.descriptionBn || ''}
              onChange={(e) => setForm((f) => ({ ...f, descriptionBn: e.target.value }))}
            />
          </div>
          <div>
            <label className="admin-label">Description (English)</label>
            <textarea
              className="admin-input"
              rows={4}
              value={form.descriptionEn || ''}
              onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
              placeholder="Optional — English description"
            />
          </div>
        </div>
      </div>

      {/* ── Meta Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Meta</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="admin-label">Icon (emoji)</label>
            <input
              className="admin-input"
              placeholder="🌐 🎨 🟨 🐍"
              value={form.icon || ''}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              maxLength={20}
            />
          </div>
          <div>
            <label className="admin-label">Difficulty</label>
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
            <label className="admin-label">Duration (min)</label>
            <input
              type="number"
              className="admin-input"
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              className="accent-emerald-500 w-4 h-4"
              checked={form.isPublished}
              onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
            />
            Published (public-এ দেখাবে)
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              className="accent-emerald-500 w-4 h-4"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            Active
          </label>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn disabled:opacity-40">
          {loading ? 'Saving...' : mode === 'edit' ? 'Save changes' : 'Create tutorial'}
        </button>
      </div>
    </form>
  )
}
