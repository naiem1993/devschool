'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: (token: string) => void
  itemLabel?: string
}

export default function PinModal({ open, onClose, onSuccess, itemLabel }: Props) {
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setPin('')
      setError(null)
      setBusy(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const submit = async (value: string) => {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: value }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.token) {
        onSuccess(data.token)
        onClose()
        return
      }
      if (res.status === 423) {
        setError('🔒 Locked. Unlock manually: Supabase → PinLockout → set lockedUntil = null')
      } else if (typeof data.attemptsLeft === 'number') {
        setError(
          `Wrong PIN. ${data.attemptsLeft} attempt${data.attemptsLeft === 1 ? '' : 's'} left.`
        )
      } else {
        setError(data.error || 'Verify failed')
      }
    } catch {
      setError('Network error')
    } finally {
      setPin('')
      setBusy(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1-digit PIN — auto-submit the moment a digit lands
    const v = e.target.value.replace(/\D/g, '').slice(0, 1)
    setPin(v)
    if (v.length === 1) submit(v)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-950 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-mono uppercase tracking-wider text-red-400">
            🔒 Confirm delete
          </h3>
          <button
            onClick={onClose}
            className="text-[10px] font-mono text-neutral-500 hover:text-neutral-200"
          >
            esc
          </button>
        </div>

        {itemLabel && (
          <p className="text-xs text-neutral-400 mb-3 font-mono">
            target: <span className="text-neutral-200">{itemLabel}</span>
          </p>
        )}

        <p className="text-xs text-red-400/80 mb-4 font-mono">This cannot be undone.</p>

        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={pin}
          onChange={onChange}
          disabled={busy}
          maxLength={1}
          placeholder="•"
          className="w-full text-center text-4xl tracking-[0.5em] font-mono rounded-xl border border-white/10 bg-black py-4 text-white outline-none focus:border-red-500/60 disabled:opacity-40"
        />

        {error && <p className="mt-3 text-xs text-red-400 font-mono">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="text-xs font-mono text-neutral-400 hover:text-neutral-200 px-3 py-1.5"
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  )
}
