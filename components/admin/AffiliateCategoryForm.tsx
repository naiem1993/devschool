'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type CategoryFormInitial = {
  id: string
  slug: string
  nameBn: string
  nameEn: string | null
  icon: string | null
  description: string | null
  sortOrder: number
  isActive: boolean
}

export default function AffiliateCategoryForm({
  initial,
  mode = 'create',
}: {
  initial?: CategoryFormInitial
  mode?: 'create' | 'edit'
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    slug: initial?.slug || '',
    nameBn: initial?.nameBn || '',
    nameEn: initial?.nameEn || '',
    icon: initial?.icon || '📦',
    description: initial?.description || '',
    sortOrder: initial?.sortOrder ?? 0,
    isActive: initial?.isActive ?? true,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      slug: form.slug,
      nameBn: form.nameBn,
      nameEn: form.nameEn || '',
      icon: form.icon || '📦',
      description: form.description || '',
      sortOrder: Number(form.sortOrder) || 0,
      isActive: form.isActive,
    }

    const url =
      mode === 'edit'
        ? `/api/admin/affiliate-categories/${initial?.id}`
        : '/api/admin/affiliate-categories'
    const res = await fetch(url, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      router.push('/admin/shop-categories')
      router.refresh()
    } else {
      const d = await res.json().catch(() => ({}))
      setError(d.error || 'save failed')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5'>
        <h2 className='text-base font-semibold text-slate-900 dark:text-white'>Category info</h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
          <div>
            <label className='admin-label'>Name (বাংলা) *</label>
            <input
              className='admin-input'
              value={form.nameBn}
              onChange={(e) => setForm((f) => ({ ...f, nameBn: e.target.value }))}
              required
              placeholder='হোস্টিং'
            />
          </div>
          <div>
            <label className='admin-label'>Name (English)</label>
            <input
              className='admin-input'
              value={form.nameEn}
              onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
              placeholder='Hosting'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
          <div>
            <label className='admin-label'>Slug *</label>
            <input
              className='admin-input font-mono'
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
              required
              placeholder='hosting'
            />
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
              URL-safe, শুধু lowercase ও dash (যেমন: <code>hosting</code>, <code>dev-tools</code>)
            </p>
          </div>
          <div>
            <label className='admin-label'>Icon (emoji)</label>
            <input
              className='admin-input'
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              placeholder='🌐'
              maxLength={10}
            />
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
              একটা emoji দিন — 🌐 👕 📱 📚 🎓 🛠️ 📦
            </p>
          </div>
        </div>

        <div>
          <label className='admin-label'>Description (optional)</label>
          <textarea
            className='admin-input'
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder='ওয়েবসাইট হোস্টিং সার্ভিস'
          />
        </div>
      </div>

      <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5'>
        <h2 className='text-base font-semibold text-slate-900 dark:text-white'>Display</h2>

        <div>
          <label className='admin-label'>Sort order (lower = first)</label>
          <input
            type='number'
            className='admin-input'
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
          />
        </div>

        <div className='pt-2 border-t border-slate-100 dark:border-slate-800'>
          <label className='flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none'>
            <input
              type='checkbox'
              className='accent-emerald-500 w-4 h-4'
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            Active (public shop-এ দেখাবে)
          </label>
        </div>
      </div>

      {error && <div className='admin-error'>{error}</div>}

      <div className='flex gap-3 pt-2'>
        <button type='submit' disabled={loading} className='admin-btn'>
          {loading ? 'Saving...' : 'Save category'}
        </button>
        <button
          type='button'
          onClick={() => router.push('/admin/shop-categories')}
          className='admin-btn-ghost'
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
