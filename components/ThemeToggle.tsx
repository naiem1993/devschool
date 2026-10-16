'use client'

import { useEffect, useState } from 'react'
import { useDict } from '@/lib/i18n/I18nProvider'

const STORAGE_KEY = 'theme'

export default function ThemeToggle() {
  const t = useDict().themeToggle
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

    // থিম বদলের সময় সব transition/animation সাময়িক বন্ধ → flash নেই
    root.classList.add('theme-changing')
    root.classList.toggle('dark', next)

    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
    } catch {
      // localStorage may be unavailable (private mode / disabled) — ignore.
    }

    // synchronous event — HeroSection-এর iframe সাথে সাথেই রঙ বদলাবে
    window.dispatchEvent(new CustomEvent('ds-theme-toggle', { detail: { dark: next } }))

    setIsDark(next)

    // পরের frame-এ ক্লাস সরাই — ততক্ষণে রঙ বদলে গেছে, transition আবার চালু
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.remove('theme-changing'))
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? t.toLight : t.toDark}
      aria-pressed={isDark}
      title={isDark ? t.toLight : t.toDark}
      className="group inline-flex h-10 w-10 items-center justify-center rounded-xl bg-transparent border-0 transition-all duration-300 active:scale-90 hover:scale-110"
    >
      <span
        className="text-lg leading-none transition-transform duration-500 group-hover:rotate-[20deg] group-hover:scale-110"
        aria-hidden="true"
      >
        {isDark ? '🌙' : '☀️'}
      </span>
      <span className="sr-only">{t.srLabel}</span>
    </button>
  )
}
