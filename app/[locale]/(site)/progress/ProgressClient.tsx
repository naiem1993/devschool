'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDeviceId } from '@/lib/device'

type Progress = {
  quiz: { total: number; correct: number; accuracy: number }
  challenge: { attempted: number; passed: number; totalPoints: number }
  recent: Array<{
    kind: 'quiz' | 'challenge'
    id: string
    at: string
    passed: boolean
    title: string
    href: string
  }>
}

export default function ProgressClient() {
  const [data, setData] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const id = getDeviceId()
      if (!id) throw new Error('device id unavailable')
      const res = await fetch(`/api/attempts/${id}`)
      if (!res.ok) throw new Error('load failed')
      setData(await res.json())
    } catch (e: any) {
      setError(e?.message || 'progress load failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-lg font-bold mb-2">লোড করা যাচ্ছে না</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error}</p>
        <button
          onClick={load}
          className="px-5 py-2.5 bg-[#22C55E] hover:bg-[#1faf53] text-black rounded-xl text-sm font-semibold transition"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    )
  }

  if (!data) return null

  const noActivity = data.quiz.total === 0 && data.challenge.attempted === 0

  if (noActivity) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
        <div className="text-6xl mb-4">🌱</div>
        <h3 className="text-xl font-bold mb-2">এখনো কোনো অগ্রগতি নেই</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
          একটা কুইজ দিয়ে শুরু করুন অথবা একটা কোডিং চ্যালেঞ্জ সমাধান করুন — তখনই এখানে ডেটা দেখা যাবে।
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/challenges" className="px-6 py-2.5 bg-[#22C55E] hover:bg-[#1faf53] text-black rounded-xl text-sm font-semibold transition">
            ⚔️ চ্যালেঞ্জ দেখুন
          </Link>
          <Link href="/tutorials" className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-semibold transition">
            📚 টিউটোরিয়াল দেখুন
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon="🧠"
          label="কুইজ নির্ভুলতা"
          value={`${data.quiz.accuracy}%`}
          sub={`${data.quiz.correct}/${data.quiz.total} সঠিক`}
          color="green"
        />
        <StatCard
          icon="⚔️"
          label="চ্যালেঞ্জ পাস"
          value={String(data.challenge.passed)}
          sub={`${data.challenge.attempted} টি চেষ্টার মধ্যে`}
          color="emerald"
        />
        <StatCard
          icon="⭐"
          label="মোট পয়েন্ট"
          value={String(data.challenge.totalPoints)}
          sub="পাস করা চ্যালেঞ্জ থেকে"
          color="amber"
        />
      </div>

      {/* Accuracy bar */}
      {data.quiz.total > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold">কুইজ পারফরম্যান্স</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{data.quiz.accuracy}%</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#22C55E] to-[#4ADE80] transition-all"
              style={{ width: `${data.quiz.accuracy}%` }}
            />
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            সাম্প্রতিক অ্যাক্টিভিটি
          </h2>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.recent.map((r) => (
            <li key={`${r.kind}-${r.id}`}>
              <Link
                href={r.href}
                className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-950 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg flex-shrink-0">{r.kind === 'quiz' ? '🧠' : '⚔️'}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
                      {r.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(r.at).toLocaleString('bn-BD', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold flex-shrink-0 ${
                    r.passed
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {r.passed ? '✓ পাস' : '✗ ফেইল'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          onClick={load}
          className="text-xs text-slate-500 hover:text-[#22C55E] transition"
        >
          ↻ রিফ্রেশ
        </button>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: string
  label: string
  value: string
  sub: string
  color: 'green' | 'emerald' | 'amber'
}) {
  const colorMap = {
    green: 'text-[#22C55E]',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-600 dark:text-amber-400',
  } as const
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5">
      <div className="text-3xl mb-2">{icon}</div>
      <div className={`text-3xl font-extrabold ${colorMap[color]}`}>{value}</div>
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
        {label}
      </div>
      <div className="text-[11px] text-slate-400 mt-1">{sub}</div>
    </div>
  )
}
