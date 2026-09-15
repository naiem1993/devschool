'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Category = { id: string; name: string }

type Chapter = {
  chapterNo: number
  title: string
  content: string
  codeExample: string
}

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
    difficulty: initial?.difficulty || 'Beginner',
    duration: initial?.duration ?? 0,
    categoryId: initial?.categoryId || categories[0]?.id || '',
    isPublished: initial?.isPublished ?? false,
    isActive: initial?.isActive ?? true,
  })

  const [chapters, setChapters] = useState<Chapter[]>(
    initial?.contents?.length
      ? initial.contents.map((c: any) => ({
          chapterNo: c.chapterNo,
          title: c.title || '',
          content: c.content || '',
          codeExample: c.codeExample || '',
        }))
      : [{ chapterNo: 1, title: '', content: '', codeExample: '' }]
  )

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const autoSlug = (v: string) =>
    v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const addChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        chapterNo: prev.length + 1,
        title: '',
        content: '',
        codeExample: '',
      },
    ])
  }

  const removeChapter = (idx: number) => {
    setChapters((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((c, i) => ({ ...c, chapterNo: i + 1 }))
    )
  }

  const updateChapter = (
    idx: number,
    field: keyof Chapter,
    value: string | number
  ) => {
    setChapters((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    )
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // শুধু যে chapters-এ title + content আছে সেগুলো নিন
    const validChapters = chapters.filter(
      (c) => c.title.trim() && c.content.trim()
    )

    if (validChapters.length === 0) {
      setError('অন্তত একটা chapter-এ title ও content দিতে হবে')
      setLoading(false)
      return
    }

    const payload = {
      ...form,
      contents: validChapters.map((c, i) => ({
        chapterNo: i + 1,
        title: c.title.trim(),
        content: c.content.trim(),
        codeExample: c.codeExample?.trim() || undefined,
      })),
    }

    const url =
      mode === 'edit'
        ? `/api/admin/tutorials/${initial?.id}`
        : '/api/admin/tutorials'

    try {
      const res = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        router.push('/admin/tutorials')
        router.refresh()
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
          value={form.title}
          onChange={(e) => {
            const t = e.target.value
            setForm((f) => ({
              ...f,
              title: t,
              slug: mode === 'create' ? autoSlug(t) : f.slug,
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
          <label className="admin-label">&gt; Category</label>
          <select
            className="admin-input"
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
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
      </div>

      <div>
        <label className="admin-label">&gt; Duration (min)</label>
        <input
          type="number"
          className="admin-input"
          value={form.duration}
          onChange={(e) =>
            setForm((f) => ({ ...f, duration: Number(e.target.value) }))
          }
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-xs text-[#00ff88]/80 font-mono">
          <input
            type="checkbox"
            className="accent-[#00ff88]"
            checked={form.isPublished}
            onChange={(e) =>
              setForm((f) => ({ ...f, isPublished: e.target.checked }))
            }
          />
          is_published
        </label>
        <label className="flex items-center gap-2 text-xs text-[#00ff88]/80 font-mono">
          <input
            type="checkbox"
            className="accent-[#00ff88]"
            checked={form.isActive}
            onChange={(e) =>
              setForm((f) => ({ ...f, isActive: e.target.checked }))
            }
          />
          is_active
        </label>
      </div>

      {/* ================= CHAPTERS / LESSONS ================= */}
      <div className="border-t border-[#00ff88]/20 pt-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#00ff88] font-mono">
            📚 Lessons / Chapters ({chapters.length})
          </h2>
          <button
            type="button"
            onClick={addChapter}
            className="admin-btn text-sm"
          >
            + chapter যোগ করুন
          </button>
        </div>

        <div className="space-y-4">
          {chapters.map((ch, idx) => (
            <div
              key={idx}
              className="border border-[#00ff88]/20 rounded-md p-4 bg-[#0a0f0a]/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#00ff88]/70">
                  chapter #{ch.chapterNo}
                </span>
                {chapters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChapter(idx)}
                    className="text-xs text-red-400 hover:text-red-300 font-mono"
                  >
                    ✕ remove
                  </button>
                )}
              </div>

              <div>
                <label className="admin-label">&gt; Lesson Title</label>
                <input
                  className="admin-input"
                  value={ch.title}
                  onChange={(e) => updateChapter(idx, 'title', e.target.value)}
                  placeholder="যেমন: HTML Introduction"
                />
              </div>

              <div>
                <label className="admin-label">&gt; Content (বাংলায় ব্যাখ্যা)</label>
                <textarea
                  className="admin-input"
                  rows={6}
                  value={ch.content}
                  onChange={(e) => updateChapter(idx, 'content', e.target.value)}
                  placeholder="HTML হলো ওয়েব পেজ তৈরির স্ট্যান্ডার্ড মার্কআপ ভাষা..."
                />
              </div>

              <div>
                <label className="admin-label">&gt; Code Example (optional)</label>
                <textarea
                  className="admin-input font-mono text-sm"
                  rows={4}
                  value={ch.codeExample}
                  onChange={(e) =>
                    updateChapter(idx, 'codeExample', e.target.value)
                  }
                  placeholder="<h1>Hello World</h1>"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="admin-error">[!] {error}</div>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">
          {loading ? '> saving...' : '$ save'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="admin-btn-ghost"
        >
          $ cancel
        </button>
      </div>
    </form>
  )
}
