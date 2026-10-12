'use client'

import { useState } from 'react'
import { useDict } from '@/lib/i18n/I18nProvider'

export default function CopyButton({ text }: { text: string }) {
  const t = useDict().references
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
      aria-label={t.copyAria}
      className={`text-[10px] font-mono px-2 py-0.5 rounded transition ${
        copied
          ? 'bg-emerald-500/20 text-emerald-400'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
      }`}
    >
      {copied ? t.copiedBtn : t.copyBtn}
    </button>
  )
}
