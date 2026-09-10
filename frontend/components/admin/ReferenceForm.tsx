'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  initial?: {
    id?: string
    categoryId: string
    title: string
    slug: string
    description: string
    syntax: string
    example: string
    tags: string
    language: string
  }
}

export default function ReferenceForm({ initial }: Props) {
  const router = useRouter()
  const isEdit = !!initial?.id
  const [categoryId, setCategoryId] = useState(initial?.categoryId || '')
  const [title, setTitle] = useState(initial?.title || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [syntax, setSyntax] = useState(initial?.syntax || '')
  const [example, setExample] = useState(initial?.example || '')
  const [tags, setTags] = useState(initial?.tags || '')
  const [language, setLanguage] = useState(initial?.language || 'javascript')
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/categories').then((r) => r.json()).then(setCategories)
  }, [])

  const autoSlug = (v: string) => {
    setTitle(v)
    if (!isEdit) setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const tagArr = tags.split(',').map((t) => t.trim()).filter(Boolean)
    const url = isEdit ? `/api/admin/references/${initial!.id}` : '/api/admin/references'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryId, title, slug, description, syntax, example, tags: tagArr, language }),
    })
    if (res.ok) router.push('/admin/references')
    else {
      const d = await res.json()
      setError(d.error || 'সংরক্ষণ ব্যর্থ')
    }
    setLoading(false)
  }

  const input = 'w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
  const mono = input + ' font-mono text-sm'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">ক্যাটাগরি *</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={input} required>
          <option value="">সিলেক্ট করুন</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">শিরোনাম *</label>
          <input value={title} onChange={(e) => autoSlug(e.target.value)} className={input} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">স্লাগ *</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className={input} required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">বিবরণ</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={input} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">সিনট্যাক্স</label>
        <textarea value={syntax} onChange={(e) => setSyntax(e.target.value)} rows={3} className={mono} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">উদাহরণ</label>
        <textarea value={example} onChange={(e) => setExample(e.target.value)} rows={5} className={mono} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">ট্যাগ (কমা দিয়ে)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="array, push, map" className={input} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ভাষা</label>
          <input value={language} onChange={(e) => setLanguage(e.target.value)} className={input} />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 disabled:opacity-50">
        {loading ? 'সেভ হচ্ছে...' : isEdit ? 'আপডেট' : 'তৈরি'}
      </button>
    </form>
  )
}
