'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DeleteButton from './DeleteButton'

type Review = {
  id: string
  name: string
  role: string | null
  stars: number
  text: string
  status: string
  createdAt: Date | string
}

export default function ReviewModeration({ reviews }: { reviews: Review[] }) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')

  const toggle = async (id: string, next: 'approved' | 'pending') => {
    setBusyId(id)
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (res.ok) router.refresh()
      else {
        const d = await res.json().catch(() => ({}))
        alert(d.error || 'update failed')
      }
    } finally {
      setBusyId(null)
    }
  }

  const shown = reviews.filter((r) => (filter === 'all' ? true : r.status === filter))

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === f
                ? 'bg-[#22C55E] text-[#050806]'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {f === 'pending' ? 'অপেক্ষমাণ' : f === 'approved' ? 'অনুমোদিত' : 'সব'}
            <span className="ml-2 opacity-70">
              {f === 'all' ? reviews.length : reviews.filter((r) => r.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center text-slate-500">
          কোনো রিভিউ নেই।
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[240px]">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg text-[#22C55E]">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                    <b className="text-slate-900 dark:text-white">{r.name}</b>
                    {r.role && <span className="text-sm text-slate-500">· {r.role}</span>}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        r.status === 'approved'
                          ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {r.status === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ'}
                    </span>
                  </div>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{r.text}</p>
                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(r.createdAt).toLocaleString('bn-BD')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {r.status === 'pending' ? (
                    <button
                      onClick={() => toggle(r.id, 'approved')}
                      disabled={busyId === r.id}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#22C55E] text-[#050806] hover:bg-[#4ADE80] transition disabled:opacity-50"
                    >
                      ✓ Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => toggle(r.id, 'pending')}
                      disabled={busyId === r.id}
                      className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition disabled:opacity-50"
                    >
                      Unapprove
                    </button>
                  )}
                  <DeleteButton endpoint={`/api/admin/reviews/${r.id}`} itemLabel={r.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
