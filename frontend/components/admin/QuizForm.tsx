'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Option { text: string; isCorrect: boolean }

interface Props {
  initial?: {
    id?: string
    tutorialId: string
    question: string
    explanation: string
    orderIndex: number
    options: Option[]
  }
}

export default function QuizForm({ initial }: Props) {
  const router = useRouter()
  const isEdit = !!initial?.id
  const [tutorialId, setTutorialId] = useState(initial?.tutorialId || '')
  const [question, setQuestion] = useState(initial?.question || '')
  const [explanation, setExplanation] = useState(initial?.explanation || '')
  const [orderIndex, setOrderIndex] = useState(initial?.orderIndex ?? 0)
  const [options, setOptions] = useState<Option[]>(
    initial?.options?.length ? initial.options : [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]
  )
  const [tutorials, setTutorials] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/tutorials?limit=100').then((r) => r.json()).then((d) => setTutorials(d.tutorials || d || []))
  }, [])

  const updateOption = (i: number, patch: Partial<Option>) => {
    const copy = [...options]
    copy[i] = { ...copy[i], ...patch }
    setOptions(copy)
  }

  const setCorrect = (i: number) => {
    setOptions(options.map((o, idx) => ({ ...o, isCorrect: idx === i })))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const url = isEdit ? `/api/admin/quiz/${initial!.id}` : '/api/admin/quiz'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tutorialId, question, explanation, orderIndex, options }),
    })
    if (res.ok) router.push('/admin/quizzes')
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
        <label className="block text-sm font-medium mb-1">টিউটোরিয়াল *</label>
        <select value={tutorialId} onChange={(e) => setTutorialId(e.target.value)} className={input} required>
          <option value="">সিলেক্ট করুন</option>
          {tutorials.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">প্রশ্ন *</label>
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={3} className={input} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">ব্যাখ্যা (ঐচ্ছিক)</label>
        <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={2} className={input} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">অপশনসমূহ * (সঠিকটির বামে রেডিও সিলেক্ট করুন)</label>
        {options.map((o, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input type="radio" name="correct" checked={o.isCorrect} onChange={() => setCorrect(i)} />
            <input
              value={o.text}
              onChange={(e) => updateOption(i, { text: e.target.value })}
              placeholder={`অপশন ${i + 1}`}
              className={input}
              required
            />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">ক্রম</label>
        <input type="number" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} className={input} />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50">
        {loading ? 'সেভ হচ্ছে...' : isEdit ? 'আপডেট' : 'তৈরি'}
      </button>
    </form>
  )
}
