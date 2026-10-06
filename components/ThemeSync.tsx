'use client'

import { useEffect, useLayoutEffect } from 'react'
import { useLocale } from '@/lib/i18n/I18nProvider'

// Server-এ useLayoutEffect চালানো যায় না, তাই client-এ layout effect, server-এ useEffect।
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * ভাষা বদলালে (/bn → /en) root layout client-এ আবার render হয়, আর
 * <html>-এ server-এর hardcoded `dark` class ফিরে আসে — কিন্তু layout-এর
 * inline theme script তখন আর চলে না। তাই এখানে localStorage-এর 'theme'
 * দেখে আবার সঠিক class বসাই। যুক্তি layout-এর inline script-এর সাথে হুবহু এক:
 * 'light' হলে dark নেই, বাকি সব ক্ষেত্রে dark।
 */
export default function ThemeSync() {
  const locale = useLocale()

  useIsoLayoutEffect(() => {
    try {
      const t = localStorage.getItem('theme')
      document.documentElement.classList.toggle('dark', t !== 'light')
    } catch {
      // localStorage না থাকলে (private mode ইত্যাদি) কিছু করার নেই — ignore।
    }
  }, [locale])

  return null
}
