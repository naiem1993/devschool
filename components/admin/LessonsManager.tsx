'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DeleteButton from './DeleteButton'
import RichEditor from './RichEditor'

// slug auto-generate — শুধু English title-এর জন্য; বাংলা title হলে admin নিজে slug লিখবে
const autoSlug = (v: string) =>
  v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
// unicode escape-এর বদলে codepoint check — escape bug এড়াতে
const hasBangla = (v: string) =>
  Array.from(v).some((ch) => {
    const c = ch.charCodeAt(0)
    return c >= 0x0980 && c <= 0x09ff
  })

export type LessonRow = {
  id: string
  title: string
  titleEn: string | null
  slug: string
  content: string
  contentEn: string | null
  codeExample: string | null
  codeExampleEn: string | null
  sortOrder: number
}

/**
 * Lesson manager (nested v3) — একটা chapter-এর ভেতরের lesson গুলো
 * First lesson-এর slug = chapter slug (D6a, server auto-sync)।
 */
export default function LessonsManager({
  tutorialId,
  chapterId,
  lessons: initial,
}: {
  tutorialId: string
  chapterId: string
  lessons: LessonRow[]
}) {
  const router = useRouter()
  const [lessons, setLessons] = useState<LessonRow[]>(initial)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setLessons(initial)
  }, [initial])

  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(''), 3000)
  }

  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir
    if (j < 0 || j >= lessons.length || busy) return
    const next = [...lessons]
    ;[next[idx], next[j]] = [next[j], next[idx]]
    setLessons(next)
    setBusy(true)
    const base = `/api/admin/tutorials/${tutorialId}/chapters/${chapterId}/lessons`
    try {
      const res = await fetch(base, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: next.map((l) => l.id) }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        flash(d.error || 'reorder ব্যর্থ')
      }
      router.refresh()
    } catch {
      flash('network error')
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-3 border-t border-gray-200 dark:border-gray-800 pt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest font-mono text-gray-500">
          Lessons ({lessons.length})
        </span>
        {msg && <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">{msg}</span>}
      </div>

      {lessons.length === 0 ? (
        <p className="text-xs text-gray-400 mb-2">
          lesson নেই → এটা single-page chapter (নিজেই একটা page)।
        </p>
      ) : (
        <ul className="space-y-2 mb-3">
          {lessons.map((l, idx) => (
            <LessonItem
              key={l.id}
              lesson={l}
              tutorialId={tutorialId}
              chapterId={chapterId}
              isFirst={idx === 0}
              isLast={idx === lessons.length - 1}
              busy={busy}
              onMoveUp={() => move(idx, -1)}
              onMoveDown={() => move(idx, 1)}
              onFlash={flash}
            />
          ))}
        </ul>
      )}

      <AddLessonForm
        tutorialId={tutorialId}
        chapterId={chapterId}
        nextOrder={lessons.length}
        onDone={(m) => {
          flash(m)
          router.refresh()
        }}
      />
    </div>
  )
}

function LessonItem({
  lesson,
  tutorialId,
  chapterId,
  isFirst,
  isLast,
  busy,
  onMoveUp,
  onMoveDown,
  onFlash,
}: {
  lesson: LessonRow
  tutorialId: string
  chapterId: string
  isFirst: boolean
  isLast: boolean
  busy: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onFlash: (m: string) => void
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState({
    title: lesson.title,
    titleEn: lesson.titleEn || '',
    slug: lesson.slug,
    content: lesson.content,
    contentEn: lesson.contentEn || '',
    codeExample: lesson.codeExample || '',
    codeExampleEn: lesson.codeExampleEn || '',
  })

  useEffect(() => {
    setDraft({
      title: lesson.title,
      titleEn: lesson.titleEn || '',
      slug: lesson.slug,
      content: lesson.content,
      contentEn: lesson.contentEn || '',
      codeExample: lesson.codeExample || '',
      codeExampleEn: lesson.codeExampleEn || '',
    })
  }, [lesson])

  const save = async () => {
    if (!draft.title.trim() || !draft.content.trim() || !draft.slug.trim()) {
      return onFlash('title, slug, content — সব দরকার')
    }
    setSaving(true)
    const base = `/api/admin/tutorials/${tutorialId}/chapters/${chapterId}/lessons/${lesson.id}`
    try {
      const res = await fetch(base, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleBn: draft.title.trim(),
          titleEn: draft.titleEn.trim() || null,
          slug: draft.slug.trim(),
          contentBn: draft.content,
          contentEn: draft.contentEn || null,
          codeExampleBn: draft.codeExample || null,
          codeExampleEn: draft.codeExampleEn || null,
        }),
      })
      if (res.ok) {
        onFlash('lesson সেভ হয়েছে ✓')
        setOpen(false)
        router.refresh()
      } else {
        const d = await res.json().catch(() => ({}))
        onFlash(d.error || 'save ব্যর্থ')
      }
    } catch {
      onFlash('network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <li className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="flex items-center gap-2 px-2.5 py-2">
        <span className="text-[10px] font-mono text-gray-400 w-6 shrink-0">{lesson.sortOrder + 1}</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex-1 min-w-0 text-left text-xs font-medium text-gray-800 dark:text-gray-200 hover:text-[#15803d] dark:hover:text-[#4ADE80] truncate"
        >
          {lesson.title}
          {isFirst && (
            <span className="ml-2 text-[9px] font-mono uppercase text-[#15803d] dark:text-[#4ADE80]">
              first
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst || busy}
          aria-label="উপরে"
          className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[#15803d] disabled:opacity-25 text-[10px]"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast || busy}
          aria-label="নিচে"
          className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[#15803d] disabled:opacity-25 text-[10px]"
        >
          ↓
        </button>
        <DeleteButton
          endpoint={`/api/admin/tutorials/${tutorialId}/chapters/${chapterId}/lessons/${lesson.id}`}
          itemLabel={`lesson “${lesson.title}”`}
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'গুটাও' : 'খোলো'}
          className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[#15803d] text-[10px]"
        >
          {open ? '▴' : '▾'}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-200 dark:border-gray-800 px-3 py-3 space-y-3 bg-gray-50/60 dark:bg-black/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">Title</label>
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="w-full text-sm px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">Slug</label>
              <input
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                className="w-full text-sm px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">Content</label>
            <RichEditor value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">Code example (optional)</label>
            <textarea
              value={draft.codeExample}
              onChange={(e) => setDraft({ ...draft, codeExample: e.target.value })}
              rows={3}
              className="w-full text-xs font-mono px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* PART 9e — ইংরেজি ভার্সন (optional) */}
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-3 space-y-3">
            <p className="text-[10px] uppercase tracking-widest font-mono text-gray-500">
              English (optional — /en সাইটে দেখাবে)
            </p>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">
                Title (EN)
              </label>
              <input
                value={draft.titleEn}
                onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })}
                placeholder="e.g. HTML Paragraphs"
                className="w-full text-sm px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">
                Content (EN)
              </label>
              <RichEditor
                value={draft.contentEn}
                onChange={(e) => setDraft({ ...draft, contentEn: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">
                Code example (EN, optional)
              </label>
              <textarea
                value={draft.codeExampleEn}
                onChange={(e) => setDraft({ ...draft, codeExampleEn: e.target.value })}
                rows={3}
                className="w-full text-xs font-mono px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#22C55E]/60 text-[#15803d] dark:text-[#4ADE80] hover:bg-[#22C55E]/10 disabled:opacity-40"
          >
            {saving ? 'সেভ হচ্ছে…' : 'সেভ করো'}
          </button>
        </div>
      )}
    </li>
  )
}

function AddLessonForm({
  tutorialId,
  chapterId,
  nextOrder,
  onDone,
}: {
  tutorialId: string
  chapterId: string
  nextOrder: number
  onDone: (m: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [codeExample, setCodeExample] = useState('')
  const [codeExampleEn, setCodeExampleEn] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !slug.trim() || !content.trim()) {
      return onDone('title, slug, content — সব দরকার')
    }
    setSaving(true)
    const base = `/api/admin/tutorials/${tutorialId}/chapters/${chapterId}/lessons`
    try {
      const res = await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleBn: title.trim(),
          titleEn: titleEn.trim() || null,
          slug: slug.trim(),
          contentBn: content,
          contentEn: contentEn || null,
          codeExampleBn: codeExample || null,
          codeExampleEn: codeExampleEn || null,
        }),
      })
      if (res.ok) {
        setTitle('')
        setTitleEn('')
        setSlug('')
        setContent('')
        setContentEn('')
        setCodeExample('')
        setCodeExampleEn('')
        setOpen(false)
        onDone(nextOrder === 0 ? 'প্রথম lesson যোগ — chapter এখন nested ✓' : 'lesson যোগ হয়েছে ✓')
      } else {
        const d = await res.json().catch(() => ({}))
        onDone(d.error || 'যোগ ব্যর্থ')
      }
    } catch {
      onDone('network error')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-mono px-3 py-1.5 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 hover:text-[#15803d] hover:border-[#22C55E]/60 transition"
      >
        + lesson
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border border-[#22C55E]/30 p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => {
                const t = e.target.value
                setTitle(t)
                // English title হলে slug auto; বাংলা হলে admin নিজে লিখবে
                if (!hasBangla(t)) setSlug(autoSlug(t))
              }}
            className="w-full text-sm px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="lowercase-hyphen"
            className="w-full text-sm px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">Content</label>
        <RichEditor value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">Code example (optional)</label>
        <textarea
          value={codeExample}
          onChange={(e) => setCodeExample(e.target.value)}
          rows={3}
          className="w-full text-xs font-mono px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* PART 9e — ইংরেজি ভার্সন (optional) */}
      <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-3 space-y-3">
        <p className="text-[10px] uppercase tracking-widest font-mono text-gray-500">
          English (optional — /en সাইটে দেখাবে)
        </p>
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">
            Title (EN)
          </label>
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="e.g. HTML Paragraphs"
            className="w-full text-sm px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">
            Content (EN)
          </label>
          <RichEditor value={contentEn} onChange={(e) => setContentEn(e.target.value)} />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">
            Code example (EN, optional)
          </label>
          <textarea
            value={codeExampleEn}
            onChange={(e) => setCodeExampleEn(e.target.value)}
            rows={3}
            className="w-full text-xs font-mono px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#22C55E]/60 text-[#15803d] dark:text-[#4ADE80] hover:bg-[#22C55E]/10 disabled:opacity-40"
        >
          {saving ? 'যোগ হচ্ছে…' : 'যোগ করো'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-mono px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500"
        >
          বাতিল
        </button>
      </div>
    </form>
  )
}
