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
      className="group inline-flex h-10 w-10 items-center justify-center rounded-xl bg-transparent border-0 transition-all duration-300 active:scale-90 hover:scale-110"
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
