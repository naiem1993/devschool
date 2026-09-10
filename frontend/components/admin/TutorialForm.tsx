'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Chapter {
  chapterNo: number
  title: string
  content: string
  codeExample: string
}

interface Props {
  initial?: {
    id?: string
    title: string
    slug: string
    description: string
    difficulty: string
    categoryId: string
    isActive: boolean
    isPublished: boolean
    contents: Chapter[]
  }
}

export default function TutorialForm({ initial }: Props) {
  const router = useRouter()
  const isEdit = !!initial?.id
  const [title, setTitle] = useState(initial?.title || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [difficulty, setDifficulty] = useState(initial?.difficulty || 'Beginner')
  const [categoryId, setCategoryId] = useState(initial?.categoryId || '')
  const [isActive, setIsActive] = useState(initial?.isActive ?? true)
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false)
  const [chapters, setChapters] = useState<Chapter[]>(
    initial?.contents?.length
      ? initial.contents
      : [{ chapterNo: 1, title: '', content: '', codeExample: '' }]
  )
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

  const updateChapter = (i: number, patch: Partial<Chapter>) => {
    const copy = [...chapters]
    copy[i] = { ...copy[i], ...patch }
    setChapters(copy)
  }

  const addChapter = () => {
    setChapters([...chapters, { chapterNo: chapters.length + 1, title: '', content: '', codeExample: '' }])
  }

  const removeChapter = (i: number) => {
    const filtered = chapters.filter((_, idx) => idx !== i).map((c, idx) => ({ ...c, chapterNo: idx + 1 }))
    setChapters(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const payload = {
      title, slug, description, difficulty, categoryId, isActive, isPublished,
      contents: chapters.filter((c) => c.title && c.content),
    }
    const url = isEdit ? `/api/admin/tutorials/${initial!.id}` : '/api/admin/tutorials'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) router.push('/admin/tutorials')
    else {
      const d = await res.json()
      setError(d.error || 'সংরক্ষণ ব্যর্থ')
    }
    setLoading(false)
  }

  const input = 'w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">ক্যাটাগরি *</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={input} required>
            <option value="">সিলেক্ট করুন</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">লেভেল</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={input}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div className="flex items-center gap-4 mt-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> সক্রিয়
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} /> প্রকাশিত
          </label>
        </div>
      </div>

      <div className="border-t pt-6 dark:border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">📖 অধ্যায় / কন্টেন্ট</h2>
        {chapters.map((ch, i) => (
          <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">অধ্যায় #{ch.chapterNo}</span>
              {chapters.length > 1 && (
                <button type="button" onClick={() => removeChapter(i)} className="text-red-600 text-xs">মুছুন</button>
              )}
            </div>
            <input
              placeholder="অধ্যায়ের শিরোনাম"
              value={ch.title}
              onChange={(e) => updateChapter(i, { title: e.target.value })}
              className={input}
            />
            <textarea
              placeholder="কন্টেন্ট (Markdown বা HTML)"
              value={ch.content}
              onChange={(e) => updateChapter(i, { content: e.target.value })}
              rows={6}
              className={input + ' font-mono text-sm'}
            />
            <textarea
              placeholder="কোড উদাহরণ (ঐচ্ছিক)"
              value={ch.codeExample}
              onChange={(e) => updateChapter(i, { codeExample: e.target.value })}
              rows={3}
              className={input + ' font-mono text-sm'}
            />
          </div>
        ))}
        <button type="button" onClick={addChapter} className="w-full py-2 border-2 border-dashed border-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
          + আরেকটি অধ্যায় যোগ করুন
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50">
        {loading ? 'সেভ হচ্ছে...' : isEdit ? 'আপডেট করুন' : 'তৈরি করুন'}
      </button>
    </form>
  )
}
