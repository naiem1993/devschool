'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDark(dark)
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const setMode = (dark: boolean) => {
    setIsDark(dark)
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1 gap-1 shadow-sm">
      <button
        onClick={() => setMode(false)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          !isDark
            ? 'bg-white text-slate-900 shadow-md scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-label="Light Mode"
      >
        <span>☀️</span>
        <span className="hidden sm:inline">লাইট</span>
      </button>
      <button
        onClick={() => setMode(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          isDark
            ? 'bg-slate-800 text-indigo-400 shadow-md scale-105'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-label="Dark Mode"
      >
        <span>🌙</span>
        <span className="hidden sm:inline">ডার্ক</span>
      </button>
    </div>
  )
}
