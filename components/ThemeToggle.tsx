'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

export default function ThemeToggle() {
  // Server renders <html class="dark">, so default to dark to match SSR.
  const [isDark, setIsDark] = useState(true)

  // Sync with whatever the inline script in layout.tsx already applied,
  // so a returning visitor with saved 'light' sees the correct icon + color.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    setIsDark(saved ? saved === 'dark' : true)
  }, [])

  const toggle = () => {
    const next = !isDark
    const root = document.documentElement

    root.classList.toggle('dark', next)

    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
    } catch {
      // localStorage may be unavailable (private mode / disabled) — ignore.
    }

    setIsDark(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'লাইট মোডে যান' : 'ডার্ক মোডে যান'}
      aria-pressed={isDark}
      title={isDark ? 'লাইট মোডে যান' : 'ডার্ক মোডে যান'}
      className={[
        'group relative inline-flex h-10 w-10 items-center justify-center',
        'rounded-xl border transition-all duration-300 active:scale-95',
        // Dark mode button: brand neon-green gradient + green glow (matches dark bg)
        isDark
          ? 'border-emerald-300/50 bg-gradient-to-br from-[#4ADE80] via-[#22C55E] to-[#10B981] text-[#04140a] shadow-lg shadow-[#22C55E]/45 ring-1 ring-white/10 hover:shadow-[#22C55E]/70 hover:shadow-xl'
          // Light mode button: soft mint gradient + gentle green glow (matches light bg)
          : 'border-emerald-500/40 bg-gradient-to-br from-[#DCFCE7] via-[#BBF7D0] to-[#86EFAC] text-[#0F172A] shadow-lg shadow-[#22C55E]/30 ring-1 ring-emerald-900/5 hover:shadow-[#22C55E]/55 hover:shadow-xl',
      ].join(' ')}
    >
      <span
        className="text-lg leading-none transition-transform duration-500 group-hover:rotate-[20deg] group-hover:scale-110"
        aria-hidden="true"
      >
        {isDark ? '🌙' : '☀️'}
      </span>
      <span className="sr-only">Theme</span>
    </button>
  )
}
