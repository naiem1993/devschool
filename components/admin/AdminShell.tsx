'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import LogoutButton from './LogoutButton'

const I = (d: string) => (
  <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} strokeLinecap='round' strokeLinejoin='round'>
    <path d={d} />
  </svg>
)

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: I('M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z') },
  { href: '/admin/tutorials', label: 'Tutorials', icon: I('M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z') },
  { href: '/admin/quizzes', label: 'Quizzes', icon: I('M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01') },
  { href: '/admin/challenges', label: 'Challenges', icon: I('M13 2 3 14h9l-1 8 10-12h-9l1-8z') },
  { href: '/admin/references', label: 'References', icon: I('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M8 13h8M8 17h5') },
  { href: '/admin/reviews', label: 'Reviews', icon: I('M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z') },
  { href: '/admin/sponsors', label: 'Sponsors', icon: I('M12 2a6 6 0 0 0-6 6c0 4 6 12 6 12s6-8 6-12a6 6 0 0 0-6-6z') },
  { href: '/admin/affiliates', label: 'Affiliates', icon: I('M20.59 13.41 11 3.83V3H3v8h.83l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83zM7 7h.01') },
  { href: '/admin/shop-categories', label: 'Shop Categories', icon: I('M4 4h6l2 6h8l-2 6H8L4 4zM6 20h.01M18 20h.01') },
  { href: '/admin/donations', label: 'Donations', icon: I('M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z') },
  { href: '/admin/settings', label: 'Settings', icon: I('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z') },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/admin/login'
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const prev = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // ---- LOGIN PAGE: hacker / terminal style (UNCHANGED) ----
  if (isAuthPage) {
    return (
      <div className='min-h-screen bg-black text-[#22C55E] font-mono flex relative'>
        <div
          className='pointer-events-none fixed inset-0 z-40 opacity-[0.04]'
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, #22C55E 0px, #22C55E 1px, transparent 1px, transparent 3px)' }}
        />
        <main className='flex-1 overflow-x-auto relative'>
          <div className='pointer-events-none absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl' />
          <div className='relative w-full'>{children}</div>
        </main>
      </div>
    )
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  // ---- ADMIN PANEL: top navbar + full-width content ----
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-slate-100'>
      <header className='sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0f151c]/90 backdrop-blur-xl'>
        <div className='w-full px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between gap-4 h-14 sm:h-16'>
            <div className='flex items-center gap-2 sm:gap-3'>
              <button type='button' onClick={() => setOpen(true)} aria-label='Open menu' className='lg:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
                <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2.2} strokeLinecap='round'><line x1='4' y1='7' x2='20' y2='7' /><line x1='4' y1='12' x2='20' y2='12' /><line x1='4' y1='17' x2='20' y2='17' /></svg>
              </button>
              <Link href='/admin/dashboard' className='flex items-center gap-2 shrink-0'>
                <span className='text-lg font-bold tracking-tight'>
                  <span className='bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent'>Dev</span>
                  <span className='text-slate-900 dark:text-white'>School</span>
                </span>
                <span className='text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500'>Admin</span>
              </Link>
            </div>

            <nav className='hidden lg:flex items-center gap-0.5 flex-1 justify-center'>
              {links.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={'group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ' + (active ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200')}
                  >
                    {link.icon}
                    <span className='hidden xl:inline'>{link.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className='flex items-center gap-2 shrink-0'>
              <div className='hidden sm:block'><LogoutButton /></div>
            </div>
          </div>
        </div>
      </header>

      <div className={'lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ' + (open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')} onClick={() => setOpen(false)} aria-hidden='true' />

      <aside className={'lg:hidden fixed inset-y-0 left-0 z-[60] w-72 max-w-[85%] bg-white dark:bg-[#0f151c] border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-out ' + (open ? 'translate-x-0' : '-translate-x-full')} aria-label='Admin menu' aria-hidden={!open}>
        <div className='flex items-center justify-between px-4 h-14 border-b border-slate-200 dark:border-slate-800'>
          <span className='font-bold tracking-tight'><span className='text-emerald-500'>Dev</span>School<span className='ml-2 text-[10px] uppercase tracking-widest text-slate-400'>Admin</span></span>
          <button type='button' onClick={() => setOpen(false)} aria-label='Close menu' className='p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition'>
            <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2.2} strokeLinecap='round'><line x1='6' y1='6' x2='18' y2='18' /><line x1='18' y1='6' x2='6' y2='18' /></svg>
          </button>
        </div>
        <nav className='flex-1 overflow-y-auto p-3 space-y-1'>
          {links.map((link) => {
            const active = isActive(link.href)
            return (
              <Link key={link.href} href={link.href} className={'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ' + (active ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60')}>
                {link.icon}
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className='p-3 border-t border-slate-200 dark:border-slate-800'><LogoutButton /></div>
      </aside>

      <main className='w-full'>
        <div className='w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
          {children}
        </div>
      </main>
    </div>
  )
}
