'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DeleteButton from './DeleteButton'

export type GroupRow = {
  id: string
  title: string
  sortOrder: number
  chapterCount: number
}

/**
 * ChapterGroup manager (nested v3)
 * — group header (sidebar-এ non-clickable divider)
 * — যোগ / rename / reorder / delete (PIN)
 */
export default function GroupsManager({
  tutorialId,
  groups: initial,
}: {
  tutorialId: string
  groups: GroupRow[]
}) {
  const router = useRouter()
  const [groups, setGroups] = useState<GroupRow[]>(initial)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setGroups(initial)
  }, [initial])

  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(''), 3000)
  }

  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir
    if (j < 0 || j >= groups.length || busy) return
    const next = [...groups]
    ;[next[idx], next[j]] = [next[j], next[idx]]
    setGroups(next)
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/tutorials/${tutorialId}/groups`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: next.map((g) => g.id) }),
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
    <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
          Groups <span className="text-gray-400 font-normal">({groups.length})</span>
        </h2>
      </div>

      {msg && (
        <div className="mb-3 text-xs font-mono px-3 py-2 rounded border border-amber-500/40 text-amber-600 dark:text-amber-400">
          {msg}
        </div>
      )}

      {groups.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          এখনো কোনো group নেই। sidebar-এ section divider দরকার হলে group যোগ করুন।
        </p>
      ) : (
        <ul className="space-y-2 mb-3">
          {groups.map((g, idx) => (
            <GroupItem
              key={g.id}
              group={g}
              tutorialId={tutorialId}
              isFirst={idx === 0}
              isLast={idx === groups.length - 1}
              busy={busy}
              onMoveUp={() => move(idx, -1)}
              onMoveDown={() => move(idx, 1)}
              onFlash={flash}
            />
          ))}
        </ul>
      )}

      <AddGroupForm
        tutorialId={tutorialId}
        onDone={(m) => {
          flash(m)
          router.refresh()
        }}
      />
    </section>
  )
}

function GroupItem({
  group,
  tutorialId,
  isFirst,
  isLast,
  busy,
  onMoveUp,
  onMoveDown,
  onFlash,
}: {
  group: GroupRow
  tutorialId: string
  isFirst: boolean
  isLast: boolean
  busy: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onFlash: (m: string) => void
}) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(group.title)
  const [saving, setSaving] = useState(false)

  useEffect(() => setTitle(group.title), [group.title])

  const save = async () => {
    if (!title.trim()) return onFlash('title দরকার')
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/tutorials/${tutorialId}/groups/${group.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleBn: title.trim() }),
      })
      if (res.ok) {
        onFlash('group সেভ হয়েছে ✓')
        setEditing(false)
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
    <li className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-black/20">
      {editing ? (
        <>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 min-w-0 text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="text-xs px-2 py-1 rounded border border-[#22C55E]/60 text-[#15803d] dark:text-[#4ADE80] disabled:opacity-40"
          >
            {saving ? '…' : 'সেভ'}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false)
              setTitle(group.title)
            }}
            className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-500"
          >
            বাতিল
          </button>
        </>
      ) : (
        <>
          <span className="flex-1 min-w-0 text-sm font-semibold text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 truncate">
            {group.title}
          </span>
          <span className="text-[10px] font-mono text-gray-400 shrink-0">
            {group.chapterCount} ch
          </span>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst || busy}
            aria-label="উপরে সরাও"
            className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[#15803d] disabled:opacity-25 disabled:cursor-not-allowed text-xs"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast || busy}
            aria-label="নিচে সরাও"
            className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[#15803d] disabled:opacity-25 disabled:cursor-not-allowed text-xs"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="এডিট"
            className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[#15803d] text-xs"
          >
            ✎
          </button>
          <DeleteButton
            endpoint={`/api/admin/tutorials/${tutorialId}/groups/${group.id}`}
            itemLabel={`group “${group.title}”`}
          />
        </>
      )}
    </li>
  )
}

function AddGroupForm({
  tutorialId,
  onDone,
}: {
  tutorialId: string
  onDone: (m: string) => void
}) {
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return onDone('title দরকার')
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/tutorials/${tutorialId}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleBn: title.trim() }),
      })
      if (res.ok) {
        setTitle('')
        onDone('নতুন group যোগ হয়েছে ✓')
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
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="নতুন group title (যেমন HTML Forms)"
        className="flex-1 min-w-0 text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
      />
      <button
        type="submit"
        disabled={saving}
        className="text-xs font-mono px-3 py-2 rounded-lg border border-[#22C55E]/60 text-[#15803d] dark:text-[#4ADE80] hover:bg-[#22C55E]/10 disabled:opacity-40 whitespace-nowrap"
      >
        {saving ? '…' : '+ group'}
      </button>
    </form>
  )
}
