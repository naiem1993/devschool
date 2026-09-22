'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '▦' },
  { href: '/admin/tutorials', label: 'Tutorials', icon: '▤' },
  { href: '/admin/quizzes', label: 'Quizzes', icon: '?' },
  { href: '/admin/challenges', label: 'Challenges', icon: '⚡' },
  { href: '/admin/references', label: 'References', icon: '⌘' },
  { href: '/admin/reviews', label: 'Reviews', icon: '✎' },
  { href: '/admin/sponsors', label: 'Sponsors', icon: '★' },
  { href: '/admin/donations', label: 'Donations', icon: '♥' },
  { href: '/admin/settings', label: 'Site Settings', icon: '⚙' },
]

type AdminSidebarProps = {
  isOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  // ESC চাপলে drawer বন্ধ
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Route change হলে auto বন্ধ (mobile এ লিংক ক্লিক করলে)
  useEffect(() => {
    onClose?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Body lock — drawer খোলা থাকলে background scroll বন্ধ
  useEffect(() => {
    if (typeof document === 'undefined') return
    const prev = document.body.style.overflow
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  const SidebarBody = (
    <>
      <Link href="/admin/dashboard" className="mb-6 block px-2">
        <span className="text-lg font-bold tracking-tight">
          <span className="bg-gradient-to-r from-[#86EFAC] to-[#22C55E] bg-clip-text text-transparent">Dev</span>
          <span className="text-slate-900 dark:text-white">School</span>
        </span>
        <span className="ml-2 text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Admin
        </span>
      </Link>

      <nav className="space-y-1 flex-1 overflow-y-auto">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition ${
                active
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span className="w-4 text-center text-xs opacity-80">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-600">
        DevSchool Admin v1.0
      </div>
    </>
  )

  return (
    <>
      {/* =========================================================
          💻 DESKTOP — sticky, fixed width, always visible (md+)
          ========================================================= */}
      <aside className="hidden md:flex w-64 shrink-0 bg-white dark:bg-[#0f151c] border-r border-slate-200 dark:border-slate-800 min-h-screen p-4 flex-col sticky top-0 h-screen">
        {SidebarBody}
      </aside>

      {/* =========================================================
          📱 MOBILE — backdrop (drawer বন্ধ থাকলে opacity-0, pointer-events-none)
          ========================================================= */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => onClose?.()}
        aria-hidden="true"
      />

      {/* =========================================================
          📱 MOBILE — slide-in drawer (left to right)
          ========================================================= */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-[60] w-64 max-w-[80%] bg-white dark:bg-[#0f151c] border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Admin sidebar"
        aria-hidden={!isOpen}
      >
        {/* Close (×) button — top right */}
        <button
          type="button"
          onClick={() => onClose?.()}
          aria-label="Close menu"
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {SidebarBody}
      </aside>
    </>
  )
}
