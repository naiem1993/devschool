'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
export type CategoryOption = { slug: string; label: string }

type AffiliateFormInitial = {
  id: string
  titleBn: string
  titleEn: string | null
  descriptionBn: string | null
  descriptionEn: string | null
  url: string
  imageUrl: string | null
  category: string
  priceLabel: string | null
  badge: string | null
  isActive: boolean
  priority: number
}

export default function AffiliateForm({
  initial,
  categories,
  mode = 'create',
}: {
  initial?: AffiliateFormInitial
  categories: CategoryOption[]
  mode?: 'create' | 'edit'
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    titleBn: initial?.titleBn || '',
    titleEn: initial?.titleEn || '',
    descriptionBn: initial?.descriptionBn || '',
    descriptionEn: initial?.descriptionEn || '',
    url: initial?.url || '',
    imageUrl: initial?.imageUrl || '',
    category: initial?.category || 'tools',
    priceLabel: initial?.priceLabel || '',
    badge: initial?.badge || '',
    isActive: initial?.isActive ?? true,
    priority: initial?.priority ?? 0,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      titleBn: form.titleBn,
      titleEn: form.titleEn || '',
      descriptionBn: form.descriptionBn || '',
      descriptionEn: form.descriptionEn || '',
      url: form.url,
      imageUrl: form.imageUrl || '',
      category: form.category,
      priceLabel: form.priceLabel || '',
      badge: form.badge || '',
      isActive: form.isActive,
      priority: Number(form.priority) || 0,
    }

    const url = mode === 'edit' ? `/api/admin/affiliates/${initial?.id}` : '/api/admin/affiliates'
    const res = await fetch(url, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      router.push('/admin/affiliates')
      router.refresh()
    } else {
      const d = await res.json().catch(() => ({}))
      setError(d.error || 'save failed')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      {/* ── Basic Info ── */}
      <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5'>
        <h2 className='text-base font-semibold text-slate-900 dark:text-white'>Basic info</h2>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
          <div>
            <label className='admin-label'>Title (বাংলা) *</label>
            <input
              className='admin-input'
              value={form.titleBn}
              onChange={(e) => setForm((f) => ({ ...f, titleBn: e.target.value }))}
              required
              placeholder='যেমন: Hostinger হোস্টিং'
            />
          </div>
          <div>
            <label className='admin-label'>Title (English)</label>
            <input
              className='admin-input'
              value={form.titleEn}
              onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))}
              placeholder='e.g. Hostinger Hosting'
            />
          </div>
        </div>

        <div>
          <label className='admin-label'>Description (বাংলা)</label>
          <textarea
            className='admin-input'
            rows={2}
            value={form.descriptionBn}
            onChange={(e) => setForm((f) => ({ ...f, descriptionBn: e.target.value }))}
            placeholder='ছোট বর্ণনা'
          />
        </div>

        <div>
          <label className='admin-label'>Description (English)</label>
          <textarea
            className='admin-input'
            rows={2}
            value={form.descriptionEn}
            onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
          />
        </div>
      </div>

      {/* ── Link & Image ── */}
      <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5'>
        <h2 className='text-base font-semibold text-slate-900 dark:text-white'>Link &amp; Media</h2>
        <div>
          <label className='admin-label'>Affiliate URL *</label>
          <input
            type='url'
            className='admin-input'
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            required
            placeholder='https://hostinger.com/affiliate?ref=devschool'
          />
          <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
            Product এর affiliate link। Public page-এ click করলে এই URL-এ redirect হবে।
          </p>
        </div>
        <div>
          <label className='admin-label'>Image URL (logo / product image)</label>
          <input
            className='admin-input'
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            placeholder='https://.../logo.png  অথবা  /path/logo.png'
          />
        </div>
      </div>

      {/* ── Meta ── */}
      <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5'>
        <h2 className='text-base font-semibold text-slate-900 dark:text-white'>Meta</h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <div>
            <label className='admin-label'>Category</label>
            <select
              className='admin-input'
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {/* পুরনো ক্যাটাগরি থাকলে সেটাও দেখাই যাতে ভুল না হয় */}
              {form.category && !categories.some((c) => c.slug === form.category) && (
                <option value={form.category}>{form.category} (পুরনো)</option>
              )}
              {categories.length === 0 && (
                <option value='' disabled>
                  — প্রথমে Shop Category যোগ করুন —
                </option>
              )}
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='admin-label'>Priority (higher = first)</label>
            <input
              type='number'
              className='admin-input'
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <div>
            <label className='admin-label'>Price label (optional)</label>
            <input
              className='admin-input'
              value={form.priceLabel}
              onChange={(e) => setForm((f) => ({ ...f, priceLabel: e.target.value }))}
              placeholder='৳500/mo, Free'
            />
          </div>
          <div>
            <label className='admin-label'>Badge (optional)</label>
            <input
              className='admin-input'
              value={form.badge}
              onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
              placeholder='Popular, Best value'
            />
          </div>
        </div>

        <div className='pt-2 border-t border-slate-100 dark:border-slate-800'>
          <label className='flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none'>
            <input
              type='checkbox'
              className='accent-emerald-500 w-4 h-4'
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            Active (public donate page-এ দেখাবে)
          </label>
        </div>
      </div>

      {error && <div className='admin-error'>{error}</div>}

      <div className='flex gap-3 pt-2'>
        <button type='submit' disabled={loading} className='admin-btn'>
          {loading ? 'Saving...' : 'Save link'}
        </button>
        <button
          type='button'
          onClick={() => router.push('/admin/affiliates')}
          className='admin-btn-ghost'
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
