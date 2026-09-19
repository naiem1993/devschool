'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '▦' },
  { href: '/admin/categories', label: 'Categories', icon: '◈' },
  { href: '/admin/tutorials', label: 'Tutorials', icon: '▤' },
  { href: '/admin/quizzes', label: 'Quizzes', icon: '?' },
  { href: '/admin/challenges', label: 'Challenges', icon: '⚡' },
  { href: '/admin/references', label: 'References', icon: '⌘' },
  { href: '/admin/reviews', label: 'Reviews', icon: '✎' },
  { href: '/admin/sponsors', label: 'Sponsors', icon: '★' },
  { href: '/admin/donations', label: 'Donations', icon: '♥' },
  { href: '/admin/settings', label: 'Site Settings', icon: '⚙' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-[#0f151c] border-r border-slate-200 dark:border-slate-800 min-h-screen p-4 hidden md:flex flex-col sticky top-0 h-screen">
      <Link href="/admin/dashboard" className="mb-6 block px-2">
        <span className="text-lg font-bold tracking-tight">
          <span className="bg-gradient-to-r from-[#86EFAC] to-[#22C55E] bg-clip-text text-transparent">Dev</span>
          <span className="text-slate-900 dark:text-white">School</span>
        </span>
        <span className="ml-2 text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Admin
        </span>
      </Link>

      <nav className="space-y-1 flex-1">
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
    </aside>
  )
}
