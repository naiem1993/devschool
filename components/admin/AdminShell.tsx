'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/admin/login'

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

  // ---- DASHBOARD (login-এর পর): simple, clean + dark mode ----
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-slate-100">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 min-w-0">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
