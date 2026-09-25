'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DeleteButton from './DeleteButton'
import RichEditor from './RichEditor'
import LessonsManager, { type LessonRow } from './LessonsManager'

// slug auto-generate — শুধু English title-এর জন্য; বাংলা title হলে admin নিজে slug লিখবে
const autoSlug = (v: string) =>
  v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
// unicode escape-এর বদলে codepoint check — escape bug এড়াতে
const hasBangla = (v: string) =>
  Array.from(v).some((ch) => {
    const c = ch.charCodeAt(0)
    return c >= 0x0980 && c <= 0x09ff
  })

export type ChapterRow = {
  id: string
  title: string
  titleEn: string | null
  slug: string
  groupId: string | null
  groupTitle: string | null
  content: string | null
  contentEn: string | null
  codeExample: string | null
  codeExampleEn: string | null
  sortOrder: number
  lessons: LessonRow[]
}

export type GroupOption = { id: string; title: string }

/**
 * Chapters manager (nested v3)
 * — chapter CRUD + group assign + nested lessons
 * — single-page = lesson নেই; nested = lesson আছে
 */
export default function ChaptersManager({
  tutorialId,
  chapters: initial,
  groups,
}: {
  tutorialId: string
  chapters: ChapterRow[]
  groups: GroupOption[]
}) {
  const router = useRouter()
  const [chapters, setChapters] = useState<ChapterRow[]>(initial)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setChapters(initial)
  }, [initial])

  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(''), 3000)
  }

  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir
    if (j < 0 || j >= chapters.length || busy) return
    const next = [...chapters]
    ;[next[idx], next[j]] = [next[j], next[idx]]
    setChapters(next)
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/tutorials/${tutorialId}/chapters`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: next.map((c) => c.id) }),
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
    <div className="space-y-6">
      {msg && (
        <div className="text-xs font-mono px-3 py-2 rounded border border-amber-500/40 text-amber-600 dark:text-amber-400">
          {msg}
        </div>
      )}

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
              groups={groups}
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

      <AddChapterForm
        tutorialId={tutorialId}
        groups={groups}
        onDone={(m) => {
          flash(m)
          router.refresh()
        }}
      />
    </div>
  )
}

function ChapterCard({
  chapter,
  tutorialId,
  groups,
  isFirst,
  isLast,
  busy,
  onMoveUp,
  onMoveDown,
  onFlash,
}: {
  chapter: ChapterRow
  tutorialId: string
  groups: GroupOption[]
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
    titleEn: chapter.titleEn || '',
    slug: chapter.slug,
    groupId: chapter.groupId || '',
    content: chapter.content || '',
    contentEn: chapter.contentEn || '',
    codeExample: chapter.codeExample || '',
    codeExampleEn: chapter.codeExampleEn || '',
  })

  useEffect(() => {
    setDraft({
      title: chapter.title,
      titleEn: chapter.titleEn || '',
      slug: chapter.slug,
      groupId: chapter.groupId || '',
      content: chapter.content || '',
      contentEn: chapter.contentEn || '',
      codeExample: chapter.codeExample || '',
      codeExampleEn: chapter.codeExampleEn || '',
    })
  }, [chapter])

  const nested = chapter.lessons.length > 0

  const save = async () => {
    if (!draft.title.trim() || !draft.slug.trim()) {
      return onFlash('title ও slug দুটোই দরকার')
    }
    if (!draft.titleEn.trim()) {
      return onFlash('ইংরেজি title দরকার (জোড়া নিয়ম)')
    }
    setSaving(true)
    try {
      const res = await fetch(
        `/api/admin/tutorials/${tutorialId}/chapters/${chapter.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titleBn: draft.title.trim(),
            titleEn: draft.titleEn.trim() || null,
            slug: draft.slug.trim(),
            groupId: draft.groupId || null,
            contentBn: draft.content || null,
            contentEn: draft.contentEn || null,
            codeExampleBn: draft.codeExample || null,
            codeExampleEn: draft.codeExampleEn || null,
          }),
        }
      )
      if (res.ok) {
        onFlash('chapter সেভ হয়েছে ✓')
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
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="text-[10px] font-mono text-gray-400 w-6 shrink-0">{chapter.sortOrder + 1}</span>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex-1 min-w-0 text-left text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-[#15803d] dark:hover:text-[#4ADE80] transition truncate"
          title={chapter.title}
        >
          {chapter.title || '(শিরোনামহীন)'}
        </button>

        {/* type badge */}
        <span
          className={
            nested
              ? 'text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-[#22C55E]/50 text-[#15803d] dark:text-[#4ADE80] shrink-0'
              : 'text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-700 text-gray-500 shrink-0'
          }
        >
          {nested ? `${chapter.lessons.length} lessons` : 'single'}
        </span>

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

        <DeleteButton
          endpoint={`/api/admin/tutorials/${tutorialId}/chapters/${chapter.id}`}
          itemLabel={`chapter “${chapter.title}”`}
        />

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'গুটাও' : 'খোলো'}
          className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[#15803d] transition text-xs"
        >
          {open ? '▴' : '▾'}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-4 space-y-3 bg-gray-50/60 dark:bg-black/20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
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
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">Group</label>
              <select
                value={draft.groupId}
                onChange={(e) => setDraft({ ...draft, groupId: e.target.value })}
                className="w-full text-sm px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                <option value="">— কোনো group নেই —</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!nested && (
            <>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">
                  Content (single-page)
                </label>
                <RichEditor
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">
                  Code example (optional)
                </label>
                <textarea
                  value={draft.codeExample}
                  onChange={(e) => setDraft({ ...draft, codeExample: e.target.value })}
                  rows={3}
                  className="w-full text-xs font-mono px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>
            </>
          )}

          {/* PART 9d — ইংরেজি ভার্সন (optional) */}
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-3 space-y-3">
            <p className="text-[10px] uppercase tracking-widest font-mono text-gray-500">
              English (required — /en সাইটে দেখাবে)
            </p>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">
                Title (EN)
              </label>
              <input
                value={draft.titleEn}
                onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })}
                placeholder="e.g. HTML Paragraphs"
                required
                className="w-full text-sm px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
            {!nested && (
              <>
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
              </>
            )}
          </div>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#22C55E]/60 text-[#15803d] dark:text-[#4ADE80] hover:bg-[#22C55E]/10 disabled:opacity-40"
          >
            {saving ? 'সেভ হচ্ছে…' : 'সেভ করো'}
          </button>

          <LessonsManager
            tutorialId={tutorialId}
            chapterId={chapter.id}
            lessons={chapter.lessons}
          />
        </div>
      )}
    </li>
  )
}

function AddChapterForm({
  tutorialId,
  groups,
  onDone,
}: {
  tutorialId: string
  groups: GroupOption[]
  onDone: (m: string) => void
}) {
  const [title, setTitle] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [slug, setSlug] = useState('')
  const [groupId, setGroupId] = useState('')
  const [content, setContent] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [codeExample, setCodeExample] = useState('')
  const [codeExampleEn, setCodeExampleEn] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) return onDone('title ও slug দরকার')
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/tutorials/${tutorialId}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleBn: title.trim(),
          titleEn: titleEn.trim() || null,
          slug: slug.trim(),
          groupId: groupId || null,
          contentBn: content || null,
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
        onDone('নতুন chapter যোগ হয়েছে ✓')
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

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-dashed border-[#22C55E]/40 p-4 space-y-3"
    >
      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">+ নতুন Chapter</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            placeholder="যেমন HTML Paragraphs"
            className="w-full text-sm px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="html-paragraphs"
            className="w-full text-sm px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">Group</label>
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="w-full text-sm px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="">— কোনো group নেই —</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">
          Content (single-page chapter-এর জন্য; খালি রাখলে lesson যোগ করতে পারবেন)
        </label>
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

      {/* PART 9d — ইংরেজি ভার্সন (optional) */}
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

      <button
        type="submit"
        disabled={saving}
        className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#22C55E]/60 text-[#15803d] dark:text-[#4ADE80] hover:bg-[#22C55E]/10 disabled:opacity-40"
      >
        {saving ? 'যোগ হচ্ছে…' : '+ chapter যোগ করো'}
      </button>
    </form>
  )
}
