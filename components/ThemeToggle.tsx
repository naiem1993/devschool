'use client'

import { useDict } from '@/lib/i18n/I18nProvider'
import { useTheme } from '@/components/ThemeProvider'

/**
 * Theme toggle button.
 *
 * All persisted state + DOM class updates live in ThemeProvider.
 * This component just flips the theme and notifies any custom listeners
 * (HeroSection's iframe listens to `ds-theme-toggle` for live preview).
 *
 * The `mounted` flag from the provider prevents a hydration mismatch:
 * on the server we don't know the saved theme, so we render the SSR
 * default (dark) until the client has read localStorage.
 */
export default function ThemeToggle() {
  const t = useDict().themeToggle
  const { theme, setTheme, mounted } = useTheme()

  // SSR-এ unknown → dark ধরে নিই (public layout default-ও dark)
  const isDark = mounted ? theme === 'dark' : true

  const toggle = () => {
    const next = isDark ? 'light' : 'dark'

    // provider handles .dark class + localStorage + theme-changing
    setTheme(next)

    // synchronous event — HeroSection-এর iframe সাথে সাথেই রঙ বদলাবে
    window.dispatchEvent(
      new CustomEvent('ds-theme-toggle', { detail: { dark: next === 'dark' } })
    )
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
