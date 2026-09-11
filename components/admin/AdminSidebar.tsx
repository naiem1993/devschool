'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin/dashboard', label: 'dashboard' },
  { href: '/admin/categories', label: 'categories' },
  { href: '/admin/tutorials', label: 'tutorials' },
  { href: '/admin/quizzes', label: 'quizzes' },
  { href: '/admin/challenges', label: 'challenges' },
  { href: '/admin/references', label: 'references' },
  { href: '/admin/donations', label: 'donations' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-black border-r border-[#00ff88]/30 min-h-screen p-4 hidden md:flex flex-col font-mono">
      <div className="mb-6">
        <pre className="text-[#00ff88] text-[9px] leading-tight drop-shadow-[0_0_6px_#00ff88]">
{String.raw`┌─────────────────────┐
│ DEV//ADMIN  v1.0    │
└─────────────────────┘`}
        </pre>
      </div>

      <div className="text-[10px] text-cyan-400 mb-3">
        <span className="text-[#00ff88]">root@devschool</span>
        <span className="text-gray-500">:~$</span> ls modules
      </div>

      <nav className="space-y-1 flex-1">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-2 py-1.5 text-xs rounded transition border ${
                active
                  ? 'text-[#00ff88] border-[#00ff88]/60 bg-[#00ff88]/5 shadow-[0_0_10px_-3px_#00ff88]'
                  : 'text-gray-500 border-transparent hover:text-[#00ff88] hover:border-[#00ff88]/30 hover:bg-[#00ff88]/5'
              }`}
            >
              <span className="text-cyan-400">{active ? '▶' : ' '}</span> ./{link.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-4 pt-4 border-t border-[#00ff88]/20 text-[10px] text-[#00ff88]/40">
        <div>uptime: {new Date().toLocaleDateString()}</div>
        <div className="text-cyan-400/50">secure channel active</div>
      </div>
    </aside>
  )
}
