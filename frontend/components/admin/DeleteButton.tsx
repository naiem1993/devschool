'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteButton({ url, label = 'ডিলিট' }: { url: string; label?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('আপনি কি নিশ্চিত? এই ডাটা ডিলিট হয়ে যাবে।')) return
    setLoading(true)
    const res = await fetch(url, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      alert('ডিলিট ব্যর্থ হয়েছে')
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:underline text-sm disabled:opacity-50"
    >
      {loading ? 'মুছছে...' : label}
    </button>
  )
}
