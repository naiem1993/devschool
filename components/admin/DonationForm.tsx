'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type DonationFormInitial = {
  id: string
  donorName: string | null
  donorEmail: string | null
  amount: number
  currency: string
  transactionId: string | null
  status: string
  message: string | null
  isPublic: boolean
}

export default function DonationForm({
  initial,
  mode = 'create',
}: {
  initial?: DonationFormInitial
  mode?: 'create' | 'edit'
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    donorName: initial?.donorName || '',
    donorEmail: initial?.donorEmail || '',
    amount: initial?.amount ?? 0,
    currency: initial?.currency || 'BDT',
    transactionId: initial?.transactionId || '',
    status: initial?.status || 'completed',
    message: initial?.message || '',
    isPublic: initial?.isPublic ?? false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      donorName: form.donorName || '',
      donorEmail: form.donorEmail || '',
      amount: Number(form.amount) || 0,
      currency: form.currency || 'BDT',
      transactionId: form.transactionId || '',
      status: form.status,
      message: form.message || '',
      isPublic: form.isPublic,
    }

    const url =
      mode === 'edit'
        ? `/api/admin/donations/${initial?.id}`
        : '/api/admin/donations'
    const res = await fetch(url, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      router.push('/admin/donations')
      router.refresh()
    } else {
      const d = await res.json().catch(() => ({}))
      setError(d.error || 'save failed')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      {/* ── Donor info ── */}
      <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5'>
        <h2 className='text-base font-semibold text-slate-900 dark:text-white'>Donor info</h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
          <div>
            <label className='admin-label'>Donor Name</label>
            <input
              className='admin-input'
              value={form.donorName}
              onChange={(e) => setForm((f) => ({ ...f, donorName: e.target.value }))}
              placeholder='Anonymous হলে খালি রাখুন'
            />
          </div>
          <div>
            <label className='admin-label'>Donor Email (optional)</label>
            <input
              type='email'
              className='admin-input'
              value={form.donorEmail}
              onChange={(e) => setForm((f) => ({ ...f, donorEmail: e.target.value }))}
              placeholder='donor@example.com'
            />
          </div>
        </div>

        <div>
          <label className='admin-label'>Message (optional)</label>
          <textarea
            className='admin-input'
            rows={2}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder='ডোনারের ছোট বার্তা'
          />
        </div>
      </div>

      {/* ── Payment ── */}
      <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5'>
        <h2 className='text-base font-semibold text-slate-900 dark:text-white'>Payment details</h2>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
          <div className='sm:col-span-2'>
            <label className='admin-label'>Amount *</label>
            <input
              type='number'
              step='0.01'
              min='0'
              className='admin-input'
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
              required
            />
          </div>
          <div>
            <label className='admin-label'>Currency</label>
            <select
              className='admin-input'
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
            >
              <option value='BDT'>BDT</option>
              <option value='USD'>USD</option>
              <option value='EUR'>EUR</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <div>
            <label className='admin-label'>Transaction ID</label>
            <input
              className='admin-input font-mono'
              value={form.transactionId}
              onChange={(e) => setForm((f) => ({ ...f, transactionId: e.target.value }))}
              placeholder='bKash/Nagad TrxID'
            />
          </div>
          <div>
            <label className='admin-label'>Status</label>
            <select
              className='admin-input'
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <option value='completed'>Completed</option>
              <option value='pending'>Pending</option>
              <option value='failed'>Failed</option>
            </select>
          </div>
        </div>

        <div className='pt-2 border-t border-slate-100 dark:border-slate-800'>
          <label className='flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none'>
            <input
              type='checkbox'
              className='accent-emerald-500 w-4 h-4 mt-0.5'
              checked={form.isPublic}
              onChange={(e) => setForm((f) => ({ ...f, isPublic: e.target.checked }))}
            />
            <span>
              <span className='block font-medium'>Public thank-you list-এ দেখাও</span>
              <span className='block text-xs text-slate-500 dark:text-slate-400'>
                চেক থাকলে supporters পেজে donor-এর নাম দেখাবে। চেক না থাকলে শুধু admin দেখবে।
              </span>
            </span>
          </label>
        </div>
      </div>

      {error && <div className='admin-error'>{error}</div>}

      <div className='flex gap-3 pt-2'>
        <button type='submit' disabled={loading} className='admin-btn'>
          {loading ? 'Saving...' : 'Save donation'}
        </button>
        <button
          type='button'
          onClick={() => router.push('/admin/donations')}
          className='admin-btn-ghost'
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
