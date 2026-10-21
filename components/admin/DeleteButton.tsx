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
        className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors disabled:opacity-40"
      >
        {busy ? (
          '...'
        ) : (
          <>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
            Delete
          </>
        )}
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
