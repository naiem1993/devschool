'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DeleteButton from './DeleteButton'
import RichEditor from './RichEditor'

export type ChapterRow = {
  id: string
  chapterNo: number
  title: string
  content: string
  codeExample: string | null
}

/**
 * Chapters manager (Option A)
 * — প্রতিটা chapter আলাদা করে সেভ/ডিলিট/reorder হয়
 * — এক chapter বদলালে বাকিগুলোর ID অটুট থাকে
 */
export default function ChaptersManager({
  tutorialId,
  chapters: initial,
}: {
  tutorialId: string
  chapters: ChapterRow[]
}) {
  const router = useRouter()
  const [chapters, setChapters] = useState<ChapterRow[]>(initial)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  // server refresh হলে নতুন props এসে state sync করবে
  useEffect(() => {
    setChapters(initial)
  }, [initial])

  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(''), 3000)
  }

  /* ── reorder ── */
  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir
    if (j < 0 || j >= chapters.length || busy) return

    const next = [...chapters]
    ;[next[idx], next[j]] = [next[j], next[idx]]
    const renumbered = next.map((c, i) => ({ ...c, chapterNo: i + 1 }))
    setChapters(renumbered)
    setBusy(true)

    try {
      const res = await fetch(`/api/admin/tutorials/${tutorialId}/chapters`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: renumbered.map((c) => c.id) }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        flash(d.error || 'reorder ব্যর্থ')
        router.refresh()
      } else {
        router.refresh()
      }
    } catch {
      flash('network error')
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      {msg && (
        <div className="text-xs font-mono px-3 py-2 rounded border border-amber-500/40 text-amber-600 dark:text-amber-400">
          {msg}
        </div>
      )}

      {/* ════════ LIST ════════ */}
      {chapters.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            এখনো কোনো chapter নেই। নিচে প্রথমটা যোগ করুন।
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {chapters.map((ch, idx) => (
            <ChapterCard
              key={ch.id}
              chapter={ch}
              tutorialId={tutorialId}
              isFirst={idx === 0}
              isLast={idx === chapters.length - 1}
              busy={busy}
              onMoveUp={() => move(idx, -1)}
              onMoveDown={() => move(idx, 1)}
              onFlash={flash}
            />
          ))}
        </ol>
      )}

      {/* ════════ ADD NEW ════════ */}
      <AddChapterForm
        tutorialId={tutorialId}
        nextNo={(chapters[chapters.length - 1]?.chapterNo ?? 0) + 1}
        onDone={(m) => {
          flash(m)
          router.refresh()
        }}
      />
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   একটা chapter কার্ড — collapse/expand + inline edit
   ──────────────────────────────────────────────────────────── */
function ChapterCard({
  chapter,
  tutorialId,
  isFirst,
  isLast,
  busy,
  onMoveUp,
  onMoveDown,
  onFlash,
}: {
  chapter: ChapterRow
  tutorialId: string
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
    title: chapter.title,
    content: chapter.content,
    codeExample: chapter.codeExample || '',
  })

  useEffect(() => {
    setDraft({
      title: chapter.title,
      content: chapter.content,
      codeExample: chapter.codeExample || '',
    })
  }, [chapter])

  const dirty =
    draft.title !== chapter.title ||
    draft.content !== chapter.content ||
    draft.codeExample !== (chapter.codeExample || '')

  const save = async () => {
    if (!draft.title.trim() || !draft.content.trim()) {
      onFlash('title ও content দুটোই দরকার')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(
        `/api/admin/tutorials/${tutorialId}/chapters/${chapter.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: draft.title,
            content: draft.content,
            codeExample: draft.codeExample || null,
          }),
        }
      )
      if (res.ok) {
        onFlash(`ch#${chapter.chapterNo} সেভ হয়েছে ✓`)
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
    <li className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      {/* header row */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="text-xs font-mono text-gray-400 w-8 shrink-0">
          #{chapter.chapterNo}
        </span>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex-1 min-w-0 text-left text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-[#15803d] dark:hover:text-[#4ADE80] transition truncate"
          title={chapter.title}
        >
          {chapter.title || '(শিরোনামহীন)'}
        </button>

        {/* reorder */}
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst || busy}
          aria-label="উপরে সরাও"
          className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[#15803d] hover:border-[#22C55E]/60 disabled:opacity-25 disabled:cursor-not-allowed transition text-xs"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast || busy}
          aria-label="নিচে সরাও"
          className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[#15803d] hover:border-[#22C55E]/60 disabled:opacity-25 disabled:cursor-not-allowed transition text-xs"
        >
          ↓
        </button>

        {/* delete — PIN protected */}
        <DeleteButton
          endpoint={`/api/admin/tutorials/${tutorialId}/chapters/${chapter.id}`}
          itemLabel={`ch#${chapter.chapterNo} ${chapter.title}`}
        />

        {/* expand */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'গুটাও' : 'খোলো'}
          className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[#15803d] transition text-xs"
        >
          {open ? '▴' : '▾'}
        </button>
      </div>

      {/* expanded editor */}
      {open && (
        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-4 space-y-3 bg-gray-50/60 dark:bg-black/20">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">
              Title
            </label>
            <input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:border-[#22C55E]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">
              Content
            </label>
            <RichEditor
              value={draft.content}
              onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
              rows={10}
              className="w-full px-3 py-2 text-sm font-mono leading-relaxed rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:border-[#22C55E] resize-y"
            />
            <p className="mt-1 text-[11px] text-gray-400 font-mono">
              Try It বসাতে: [[tryit]] ... [[/tryit]]
            </p>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">
              Code example (ঐচ্ছিক)
            </label>
            <textarea
              value={draft.codeExample}
              onChange={(e) => setDraft((d) => ({ ...d, codeExample: e.target.value }))}
              rows={5}
              className="w-full px-3 py-2 text-sm font-mono leading-relaxed rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:border-[#22C55E] resize-y"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={save}
              disabled={saving || !dirty}
              className="px-4 py-2 rounded-lg bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {saving ? 'সেভ হচ্ছে...' : 'সেভ করো'}
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft({
                  title: chapter.title,
                  content: chapter.content,
                  codeExample: chapter.codeExample || '',
                })
                setOpen(false)
              }}
              className="admin-btn-ghost"
            >
              বাতিল
            </button>
            {dirty && !saving && (
              <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                unsaved changes
              </span>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

/* ────────────────────────────────────────────────────────────
   নতুন chapter যোগ করার ফর্ম
   ──────────────────────────────────────────────────────────── */
function AddChapterForm({
  tutorialId,
  nextNo,
  onDone,
}: {
  tutorialId: string
  nextNo: number
  onDone: (msg: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [codeExample, setCodeExample] = useState('')

  const reset = () => {
    setTitle('')
    setContent('')
    setCodeExample('')
  }

  const submit = async () => {
    if (!title.trim() || !content.trim()) {
      onDone('title ও content দুটোই দরকার')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/tutorials/${tutorialId}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, codeExample: codeExample || undefined }),
      })
      if (res.ok) {
        onDone(`ch#${nextNo} যোগ হয়েছে ✓`)
        reset()
        setOpen(false)
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
        className="w-full py-3 rounded-xl border border-dashed border-[#22C55E]/50 text-[#15803d] dark:text-[#4ADE80] text-sm font-semibold hover:bg-[#22C55E]/5 transition"
      >
        + নতুন chapter যোগ করো (ch#{nextNo})
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-[#22C55E]/40 bg-[#22C55E]/[0.04] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-[#15803d] dark:text-[#4ADE80] font-bold">
          নতুন chapter #{nextNo}
        </span>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            reset()
          }}
          className="text-xs font-mono text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          বাতিল
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Chapter title (যেমন: HTML Styles)"
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:border-[#22C55E]"
      />

      <RichEditor
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={'Content...\n\n[[tryit]]\n<h1>Hello</h1>\n[[/tryit]]'}
        rows={8}
        className="w-full px-3 py-2 text-sm font-mono leading-relaxed rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:border-[#22C55E] resize-y"
      />

      <textarea
        value={codeExample}
        onChange={(e) => setCodeExample(e.target.value)}
        placeholder="Code example (ঐচ্ছিক)"
        rows={4}
        className="w-full px-3 py-2 text-sm font-mono leading-relaxed rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:border-[#22C55E] resize-y"
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] text-sm font-bold disabled:opacity-40 transition"
        >
          {saving ? 'যোগ হচ্ছে...' : 'যোগ করো'}
        </button>
      </div>
    </div>
  )
}
