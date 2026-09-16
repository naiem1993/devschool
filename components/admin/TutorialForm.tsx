'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
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

  // ── Content-এ একটা Try It ব্লক বসায় (W3Schools-style inline editor) ──
  const insertTryItBlock = (idx: number) => {
    const block =
      '\n\n[[tryit]]\n<h1>Hello DevSchool</h1>\n<p>Edit this code and press Run.</p>\n[[/tryit]]\n'
    setChapters((prev) =>
      prev.map((c, i) =>
        i === idx ? { ...c, content: (c.content || '') + block } : c
      )
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

    // ⚠️ Option A: chapter এখানে বাধ্যতামূলক নয়।
    // create mode-এ শুধু course-এর shell বানানো হয়, তারপর chapters পেজে
    // গিয়ে একটার পর একটা lesson যোগ করা হয়। তাই title+content খালি
    // থাকলে শুধু বাদ পড়ে — কোনো error নেই।
    // edit mode-এও contents পাঠানো হয় না (আলাদা chapters পেজ manage করে),
    // নাহলে PUT handler সব chapter মুছে নতুন করে বানাবে।
    const payload =
      mode === 'edit'
        ? { ...form }
        : {
            ...form,
            contents: validChapters.length
              ? validChapters.map((c, i) => ({
                  chapterNo: i + 1,
                  title: c.title.trim(),
                  content: c.content.trim(),
                  codeExample: c.codeExample?.trim() || undefined,
                }))
              : undefined,
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
        if (mode === 'edit') {
          router.push('/admin/tutorials')
          router.refresh()
        } else {
          // নতুন tutorial তৈরি হলো → সোজা chapters পেজে নিয়ে যাই,
          // যাতে একটার পর একটা lesson যোগ করা যায়।
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
        <label className="flex items-center gap-2 text-xs text-[#22C55E]/80 font-mono">
          <input
            type="checkbox"
            className="accent-[#22C55E]"
            checked={form.isPublished}
            onChange={(e) =>
              setForm((f) => ({ ...f, isPublished: e.target.checked }))
            }
          />
          is_published
        </label>
        <label className="flex items-center gap-2 text-xs text-[#22C55E]/80 font-mono">
          <input
            type="checkbox"
            className="accent-[#22C55E]"
            checked={form.isActive}
            onChange={(e) =>
              setForm((f) => ({ ...f, isActive: e.target.checked }))
            }
          />
          is_active
        </label>
      </div>

      {/* ═══════ EDIT MODE — Chapters আলাদা পেজে ═══════ */}
      {mode === 'edit' && initial?.id && (
        <div className="border-t border-[#22C55E]/20 pt-4 mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/[0.05] p-4">
            <div>
              <h2 className="text-sm font-bold text-[#15803d] dark:text-[#4ADE80]">
                📚 Chapters / Lessons ({chapters.length})
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                chapter যোগ/এডিট/ডিলিট/reorder এখন আলাদা পেজে — এক chapter
                বদলালে বাকিগুলো অটুট থাকে।
              </p>
            </div>
            <Link
              href={`/admin/tutorials/${initial.id}/chapters`}
              className="px-4 py-2 rounded-lg bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] text-sm font-bold transition whitespace-nowrap"
            >
              Chapters manage করো →
            </Link>
          </div>
        </div>
      )}

      {/* ═══════ CREATE MODE — chapters এখানেই ═══════ */}
      {mode === 'create' && (
        <div className="border-t border-[#22C55E]/20 pt-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#22C55E] font-mono">
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
                className="border border-[#22C55E]/20 rounded-md p-4 bg-[#0a0f0a]/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#22C55E]/70">
                    chapter #{ch.chapterNo}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => insertTryItBlock(idx)}
                      title="Content-এ [[tryit]] … [[/tryit]] ব্লক বসাবে"
                      className="text-xs px-2.5 py-1 rounded border border-[#22C55E]/40 text-[#22C55E] hover:bg-[#22C55E]/10"
                    >
                      + Try It
                    </button>
                    {chapters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChapter(idx)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        🗑 Remove
                      </button>
                    )}
                  </div>
                </div>

                <input
                  className="admin-input"
                  placeholder="Chapter title (যেমন: HTML Styles)"
                  value={ch.title}
                  onChange={(e) => updateChapter(idx, 'title', e.target.value)}
                />

                <textarea
                  className="admin-input"
                  rows={8}
                  placeholder={'Content...\n\n[[tryit]]\n<h1>Hello</h1>\n[[/tryit]]'}
                  value={ch.content}
                  onChange={(e) => updateChapter(idx, 'content', e.target.value)}
                />

                <textarea
                  className="admin-input"
                  rows={4}
                  placeholder="Code example (ঐচ্ছিক)"
                  value={ch.codeExample}
                  onChange={(e) => updateChapter(idx, 'codeExample', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 font-mono border border-red-500/30 rounded px-3 py-2">
          {error}
        </p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="admin-btn disabled:opacity-50"
        >
          {loading ? 'সেভ হচ্ছে...' : mode === 'edit' ? 'আপডেট করো' : 'টিউটোরিয়াল তৈরি করো'}
        </button>
      </div>
    </form>
  )
}
