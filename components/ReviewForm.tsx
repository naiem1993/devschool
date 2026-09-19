'use client'

import { useState } from 'react'
import { getDeviceHeaders } from '@/lib/device'

export default function ReviewForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [stars, setStars] = useState(5)
  const [text, setText] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setMsg(null)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getDeviceHeaders() },
        body: JSON.stringify({ name, role: role || null, stars, text, website }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setMsg({ kind: 'ok', text: '✅ ধন্যবাদ! আপনার রিভিউ অনুমোদনের জন্য পাঠানো হয়েছে।' })
        setName('')
        setRole('')
        setStars(5)
        setText('')
      } else {
        setMsg({ kind: 'err', text: data.error || 'কিছু ভুল হয়েছে — আবার চেষ্টা করুন।' })
      }
    } catch {
      setMsg({ kind: 'err', text: 'নেটওয়ার্ক সমস্যা — আবার চেষ্টা করুন।' })
    } finally {
      setBusy(false)
    }
  }

  if (!open) {
    return (
      <div className="text-center mt-2">
        <button
          onClick={() => setOpen(true)}
          className="px-6 py-3 rounded-2xl bg-[#22C55E] text-[#050806] font-semibold hover:bg-[#4ADE80] transition"
        >
          ✍️ আপনার রিভিউ দিন
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold">আপনার অভিজ্ঞতা শেয়ার করুন</h3>
        <button onClick={() => setOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">
          বন্ধ
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {/* honeypot — লুকানো, bot-এর জন্য ফাঁদ */}
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">আপনার নাম *</label>
            <input
              required
              minLength={2}
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
              placeholder="যেমন: রাফি আহমেদ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">পরিচয় (ঐচ্ছিক)</label>
            <input
              maxLength={80}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
              placeholder="যেমন: স্টুডেন্ট"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">রেটিং</label>
          <div className="flex gap-1 text-3xl">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setStars(n)}
                className={n <= stars ? 'text-[#22C55E]' : 'text-slate-300 dark:text-slate-700'}
                aria-label={`${n} star`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">আপনার মতামত *</label>
          <textarea
            required
            minLength={5}
            maxLength={600}
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-[#22C55E] resize-y"
            placeholder="DevSchool সম্পর্কে আপনার অভিজ্ঞতা লিখুন..."
          />
          <p className="text-xs text-slate-400 mt-1">{text.length}/600</p>
        </div>

        {msg && (
          <p className={`text-sm ${msg.kind === 'ok' ? 'text-[#15803D] dark:text-[#4ADE80]' : 'text-red-500'}`}>
            {msg.text}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 rounded-xl bg-[#22C55E] text-[#050806] font-semibold hover:bg-[#4ADE80] transition disabled:opacity-50"
        >
          {busy ? 'পাঠানো হচ্ছে...' : 'রিভিউ জমা দিন'}
        </button>
        <p className="text-xs text-slate-400 text-center">
          জমা দেওয়ার পর অ্যাডমিন অনুমোদন করলে রিভিউটি দেখানো হবে।
        </p>
      </form>
    </div>
  )
}
