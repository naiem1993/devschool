'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'

type ThemeContextValue = {
  /** Currently active theme. */
  theme: Theme
  /** Always equals `theme` — kept for API parity with next-themes. */
  resolvedTheme: Theme
  /** Change the theme (no-op when the provider is forced). */
  setTheme: (next: Theme) => void
  /** True once the provider has read the persisted value from the client. */
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme() must be used inside <ThemeProvider>')
  return ctx
}

type Props = {
  children: ReactNode
  /** When set, the theme is locked (e.g. admin panel = always dark). */
  forcedTheme?: Theme
}

/**
 * Client-side theme state for DevSchool.
 *
 * The visible theme (the `.dark` class on <html>) is applied *before*
 * first paint by an inline <script> rendered through <ThemeInit> inside
 * the layout's <head>. This provider simply keeps React state in sync
 * with what that script already did, so components like <ThemeToggle>
 * render the correct icon and the UI stays consistent with the DOM.
 *
 * Replaces `next-themes` because that library renders a <script> during
 * client-side render, which React 19 warns about. Our approach:
 *   - pre-hydration script  → <ThemeInit> (server-only, no warning)
 *   - React state           → this provider (reads localStorage on mount)
 */
export default function ThemeProvider({ children, forcedTheme }: Props) {
  const [theme, setThemeState] = useState<Theme>(forcedTheme ?? 'dark')
  const [mounted, setMounted] = useState(false)

  // Read persisted theme once after mount (skip when forced).
  // `setState` here is INTENTIONAL — it hydrates React state from
  // localStorage after first paint so the SSR-rendered <html class="dark">
  // (applied by ThemeInit) and React stay in sync. Removing it would
  // cause the toggle icon to be wrong and `mounted` to stay false forever.
   
  useEffect(() => {
    setMounted(true)
    if (forcedTheme) return
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const initial: Theme = saved === 'light' ? 'light' : 'dark'
      setThemeState(initial)
    } catch {
      // localStorage unavailable (private mode) — keep SSR default
    }
  }, [forcedTheme])

  const setTheme = useCallback(
    (next: Theme) => {
      if (forcedTheme) return
      const root = document.documentElement
      // Suppress transitions during the swap → no colour flash.
      root.classList.add('theme-changing')
      root.classList.toggle('dark', next === 'dark')
      try {
        localStorage.setItem(STORAGE_KEY, next)
        // Also mirror to cookie so the server-rendered <html> on the next
        // navigation already has the correct `.dark` class → no flash.
        document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
      } catch {
        // ignore
      }
      setThemeState(next)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => root.classList.remove('theme-changing'))
      })
    },
    [forcedTheme]
  )

  const value: ThemeContextValue = {
    theme: forcedTheme ?? theme,
    resolvedTheme: forcedTheme ?? theme,
    setTheme,
    mounted,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
