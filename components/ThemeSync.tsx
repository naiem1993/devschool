'use client'

import { useEffect, useLayoutEffect } from 'react'
import { useLocale } from '@/lib/i18n/I18nProvider'

// useLayoutEffect runs BEFORE paint (fixes the flash), but warns on SSR.
// Fall back to useEffect on the server where effects don't run anyway.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * OPTIONAL defensive theme re-sync on locale change.
 *
 * Normally not needed because:
 *   - The pre-hydration script (see <ThemeInit>) already applied the theme.
 *   - Client navigation between /bn and /en keeps the <html> element —
 *     and therefore the `.dark` class — untouched.
 *
 * But if you ever see the `.dark` class getting out of sync after a
 * locale switch, drop `<ThemeSync />` anywhere inside <I18nProvider>:
 *
 *     <ThemeProvider>
 *       <I18nProvider locale={locale} dict={dict}>
 *         <ThemeSync />
 *         {children}
 *       </I18nProvider>
 *     </ThemeProvider>
 */
export default function ThemeSync() {
  const locale = useLocale()

  useIsoLayoutEffect(() => {
    try {
      const saved = localStorage.getItem('theme')
      const root = document.documentElement
      const isDark = saved !== 'light'
      root.classList.toggle('dark', isDark)
      root.style.backgroundColor = isDark ? '#050806' : '#f2fbf4'
      root.style.colorScheme = isDark ? 'dark' : 'light'
    } catch {
      // localStorage unavailable (private mode) — nothing to do
    }
  }, [locale])

  return null
}
