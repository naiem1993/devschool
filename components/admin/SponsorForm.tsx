'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import SponsorImageControl, { type SponsorImageValue } from './SponsorImageControl'

const TIERS = ['gold', 'silver', 'bronze', 'partner'] as const

export default function SponsorForm({
  initial,
  mode = 'create',
}: {
  initial?: any
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

    const payload: any = {
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
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="admin-label">&gt; Sponsor Name</label>
        <input
          className="admin-input"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
          placeholder="Acme Corp"
        />
      </div>

      <div>
        <label className="admin-label">&gt; Logo / Image</label>
        <SponsorImageControl value={image} onChange={setImage} />
      </div>

      <div>
        <label className="admin-label">&gt; Website URL (click target)</label>
        <input
          className="admin-input"
          value={form.websiteUrl}
          onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
          placeholder="https://acme.com"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Sponsor logo-তে ক্লিক করলে এখানে যাবে।
        </p>
      </div>

      <div>
        <label className="admin-label">&gt; Description (optional)</label>
        <textarea
          className="admin-input"
          rows={2}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label">&gt; Tier</label>
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
          <label className="admin-label">&gt; Priority (higher = first)</label>
          <input
            type="number"
            className="admin-input"
            value={form.priority}
            onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label">&gt; Start date (optional)</label>
          <input
            type="date"
            className="admin-input"
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
          />
        </div>
        <div>
          <label className="admin-label">&gt; End date (optional)</label>
          <input
            type="date"
            className="admin-input"
            value={form.endDate}
            onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
        />
        <span>Active (public-এ দেখাবে)</span>
      </label>

      {error && <div className="admin-error">[!] {error}</div>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">
          {loading ? '&gt; saving...' : '$ save'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/sponsors')}
          className="admin-btn-ghost"
        >
          $ cancel
        </button>
      </div>
    </form>
  )
}
