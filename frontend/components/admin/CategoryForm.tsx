'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  initial?: {
    id?: string
    name: string
    slug: string
    description: string
    icon: string
    isActive: boolean
    sortOrder: number
  }
}

export default function CategoryForm({ initial }: Props) {
  const router = useRouter()
  const isEdit = !!initial?.id
  const [name, setName] = useState(initial?.name || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [icon, setIcon] = useState(initial?.icon || '')
  const [isActive, setIsActive] = useState(initial?.isActive ?? true)
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const autoSlug = (v: string) => {
    setName(v)
    if (!isEdit) setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const url = isEdit ? `/api/admin/categories/${initial!.id}` : '/api/admin/categories'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug, description, icon, isActive, sortOrder }),
    })
    if (res.ok) router.push('/admin/categories')
    else {
      const d = await res.json()
      setError(d.error || 'সংরক্ষণ ব্যর্থ')
    }
    setLoading(false)
  }

  const input = 'w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">নাম *</label>
        <input value={name} onChange={(e) => autoSlug(e.target.value)} className={input} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">স্লাগ *</label>
        <input value={slug} onChange={(e) => setSlug(e.target.value)} className={input} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">আইকন (ইমোজি)</label>
        <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="📘" className={input} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">বিবরণ</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={input} />
      </div>
      <div className="flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">ক্রম</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={input} />
        </div>
        <label className="flex items-center gap-2 mt-5">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          সক্রিয়
        </label>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50">
        {loading ? 'সেভ হচ্ছে...' : isEdit ? 'আপডেট করুন' : 'তৈরি করুন'}
      </button>
    </form>
  )
}
