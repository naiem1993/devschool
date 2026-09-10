'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteButton({ endpoint }: { endpoint: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const onDelete = async () => {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 3000)
      return
    }
    setBusy(true)
    const res = await fetch(endpoint, { method: 'DELETE' })
    setBusy(false)
    if (res.ok) router.refresh()
    else alert('delete failed')
  }

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      className={`text-xs font-mono transition ${
        confirm
          ? 'text-red-500 hover:text-red-400 font-bold'
          : 'text-red-500/60 hover:text-red-500'
      } disabled:opacity-40`}
    >
      {busy ? '...' : confirm ? 'confirm?' : 'rm'}
    </button>
  )
}
