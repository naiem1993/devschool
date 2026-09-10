'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface TC { input: string; expectedOutput: string; isHidden: boolean }

interface Props {
  initial?: {
    id?: string
    tutorialId: string
    title: string
    description: string
    starterCode: string
    solution: string
    difficulty: string
    points: number
    testCases: TC[]
  }
}

export default function ChallengeForm({ initial }: Props) {
  const router = useRouter()
  const isEdit = !!initial?.id
  const [tutorialId, setTutorialId] = useState(initial?.tutorialId || '')
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [starterCode, setStarterCode] = useState(initial?.starterCode || 'function solution(input) {\n  // your code\n}')
  const [solution, setSolution] = useState(initial?.solution || '')
  const [difficulty, setDifficulty] = useState(initial?.difficulty || 'Easy')
  const [points, setPoints] = useState(initial?.points ?? 10)
  const [testCases, setTestCases] = useState<TC[]>(
    initial?.testCases?.length ? initial.testCases : [{ input: '', expectedOutput: '', isHidden: false }]
  )
  const [tutorials, setTutorials] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/tutorials?limit=100').then((r) => r.json()).then((d) => setTutorials(d.tutorials || d || []))
  }, [])

  const updateTC = (i: number, patch: Partial<TC>) => {
    const copy = [...testCases]
    copy[i] = { ...copy[i], ...patch }
    setTestCases(copy)
  }

  const addTC = () => setTestCases([...testCases, { input: '', expectedOutput: '', isHidden: false }])
  const removeTC = (i: number) => setTestCases(testCases.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const url = isEdit ? `/api/admin/challenges/${initial!.id}` : '/api/admin/challenges'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tutorialId, title, description, starterCode, solution, difficulty, points, testCases }),
    })
    if (res.ok) router.push('/admin/challenges')
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
        <label className="block text-sm font-medium mb-1">টিউটোরিয়াল *</label>
        <select value={tutorialId} onChange={(e) => setTutorialId(e.target.value)} className={input} required>
          <option value="">সিলেক্ট করুন</option>
          {tutorials.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">শিরোনাম *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">বিবরণ *</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={input} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">কঠিনতা</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={input}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">পয়েন্টস</label>
          <input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} className={input} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">স্টার্টার কোড</label>
        <textarea value={starterCode} onChange={(e) => setStarterCode(e.target.value)} rows={5} className={mono} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">সমাধান (ঐচ্ছিক)</label>
        <textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={5} className={mono} />
      </div>
      <div className="border-t pt-4 dark:border-gray-800">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">🧪 টেস্ট কেস</h3>
        {testCases.map((tc, i) => (
          <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">টেস্ট #{i + 1}</span>
              {testCases.length > 1 && (
                <button type="button" onClick={() => removeTC(i)} className="text-red-600 text-xs">মুছুন</button>
              )}
            </div>
            <input value={tc.input} onChange={(e) => updateTC(i, { input: e.target.value })} placeholder='ইনপুট (যেমন: [1,2,3])' className={input} />
            <input value={tc.expectedOutput} onChange={(e) => updateTC(i, { expectedOutput: e.target.value })} placeholder='প্রত্যাশিত আউটপুট (যেমন: 6)' className={input} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={tc.isHidden} onChange={(e) => updateTC(i, { isHidden: e.target.checked })} />
              ইউজারকে দেখাবেন না
            </label>
          </div>
        ))}
        <button type="button" onClick={addTC} className="w-full py-2 border-2 border-dashed border-gray-400 rounded-lg text-sm">
          + টেস্ট কেস যোগ করুন
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50">
        {loading ? 'সেভ হচ্ছে...' : isEdit ? 'আপডেট' : 'তৈরি'}
      </button>
    </form>
  )
}
