'use client'

import { useEffect } from 'react'
import { useLocale } from '@/lib/i18n/I18nProvider'

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme')
      document.documentElement.classList.toggle('dark', saved !== 'light')
    } catch {
      // localStorage unavailable (private mode) — nothing to do
    }
  }, [locale])

  return null
}
