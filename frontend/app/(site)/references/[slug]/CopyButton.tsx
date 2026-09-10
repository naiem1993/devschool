'use client'

import { useState } from 'react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      onClick={copy}
      aria-label="কপি করুন"
      className={`text-[10px] font-mono px-2 py-0.5 rounded transition ${
        copied
          ? 'bg-emerald-500/20 text-emerald-400'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
      }`}
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  )
}
