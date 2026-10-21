'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import SponsorImageControl, { type SponsorImageValue } from './SponsorImageControl'

const TIERS = ['gold', 'silver', 'bronze', 'partner'] as const

type SponsorFormInitial = {
  id: string
  name: string
  websiteUrl: string | null
  description: string | null
  tier: string
  priority: number
  isActive: boolean
  startDate: string | null
  endDate: string | null
  imageId: string | null
  logoUrl: string | null
}

export default function SponsorForm({
  initial,
  mode = 'create',
}: {
  initial?: SponsorFormInitial
  mode?: 'create' | 'edit'
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: initial?.name || '',
    websiteUrl: initial?.websiteUrl || '',
    description: initial?.description || '',
    tier: initial?.tier || 'partner',
    priority: initial?.priority ?? 0,
    isActive: initial?.isActive ?? true,
    startDate: initial?.startDate ? initial.startDate.slice(0, 10) : '',
    endDate: initial?.endDate ? initial.endDate.slice(0, 10) : '',
  })
  const [image, setImage] = useState<SponsorImageValue>({
    imageId: initial?.imageId || null,
    logoUrl: initial?.logoUrl || '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      name: form.name,
      websiteUrl: form.websiteUrl || '',
      description: form.description || '',
      tier: form.tier,
      priority: Number(form.priority) || 0,
      isActive: form.isActive,
      logoUrl: image.logoUrl || '',
      imageId: image.imageId || null,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
    }

    const url = mode === 'edit' ? `/api/admin/sponsors/${initial?.id}` : '/api/admin/sponsors'
    const res = await fetch(url, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      router.push('/admin/sponsors')
      router.refresh()
    } else {
      const d = await res.json().catch(() => ({}))
      setError(d.error || 'save failed')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ── Basic Info Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Basic info</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Sponsor Name</label>
            <input
              className="admin-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label className="admin-label">Website URL (click target)</label>
            <input
              className="admin-input"
              value={form.websiteUrl}
              onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
              placeholder="https://acme.com"
            />
          </div>
        </div>
        <div>
          <label className="admin-label">Description (optional)</label>
          <textarea
            className="admin-input"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
      </div>

      {/* ── Logo Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Logo / Image</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Upload বা URL paste করুন</p>
        </div>
        <SponsorImageControl value={image} onChange={setImage} />
      </div>

      {/* ── Meta Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Meta</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Tier</label>
            <select
              className="admin-input"
              value={form.tier}
              onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value }))}
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="admin-label">Priority (higher = first)</label>
            <input
              type="number"
              className="admin-input"
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Start date (optional)</label>
            <input
              type="date"
              className="admin-input"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="admin-label">End date (optional)</label>
            <input
              type="date"
              className="admin-input"
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              className="accent-emerald-500 w-4 h-4"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            Active (public-এ দেখাবে)
          </label>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">
          {loading ? 'Saving...' : 'Save sponsor'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/sponsors')}
          className="admin-btn-ghost"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
