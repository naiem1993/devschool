'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/admin/login'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Route change হলে drawer auto বন্ধ
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // ---- LOGIN PAGE: hacker / terminal style (আগের মতোই) ----
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-black text-[#22C55E] font-mono flex relative">
        <div
          className="pointer-events-none fixed inset-0 z-40 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #22C55E 0px, #22C55E 1px, transparent 1px, transparent 3px)',
          }}
        />
        <main className="flex-1 overflow-x-auto relative">
          <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="relative w-full">{children}</div>
        </main>
      </div>
    )
  }

  // ---- DASHBOARD (login-এর পর): simple, clean + dark mode + responsive ----
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-slate-100">
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0">
          {/* =========================================================
              📱 MOBILE TOPBAR — hamburger + logo (md নিচে দেখাবে)
              ========================================================= */}
          <div className="md:hidden sticky top-0 z-30 flex items-center gap-2 h-14 px-3 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0f151c]/90 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
              className="p-2 -ml-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <span className="text-base font-bold tracking-tight">
              <span className="bg-gradient-to-r from-[#86EFAC] to-[#22C55E] bg-clip-text text-transparent">Dev</span>
              <span className="text-slate-900 dark:text-white">School</span>
            </span>
            <span className="ml-1 text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Admin
            </span>
          </div>

          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
