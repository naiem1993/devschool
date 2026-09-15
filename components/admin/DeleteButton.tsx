'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PinModal from './PinModal'

export default function DeleteButton({
  endpoint,
  itemLabel,
}: {
  endpoint: string
  itemLabel?: string
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [pinOpen, setPinOpen] = useState(false)

  const onDelete = async (token: string) => {
    setBusy(true)
    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'x-pin-token': token },
      })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        alert(data.error || 'delete failed')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setPinOpen(true)}
        disabled={busy}
        className="text-xs font-mono transition text-red-500/60 hover:text-red-500 disabled:opacity-40"
      >
        {busy ? '...' : 'rm'}
      </button>
      <PinModal
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        onSuccess={onDelete}
        itemLabel={itemLabel}
      />
    </>
  )
}
