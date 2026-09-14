'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'টিউটোরিয়াল', href: '/categories' },
    { name: 'রেফারেন্স', href: '/references' },
    { name: 'প্লেগ্রাউন্ড', href: '/playground' },
    { name: 'চ্যালেঞ্জ', href: '/challenges' },
    { name: 'সার্চ', href: '/search' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F2FBF4]/90 dark:bg-[#050806]/90 backdrop-blur-md border-b border-emerald-200/70 dark:border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — D with animated > prompt */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform duration-200"
              aria-label="DevSchool logo"
            >
              <defs>
                <linearGradient id="dsLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#86EFAC" />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
              </defs>

              {/* D left bar */}
              <rect x="22" y="16" width="14" height="68" rx="7" fill="url(#dsLogoGrad)" />

              {/* D right arc */}
              <path
                d="M36,23 H52 C68,23 78,33 78,50 C78,67 68,77 52,77 H36"
                fill="none"
                stroke="url(#dsLogoGrad)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* > prompt — animated draw & erase (dark symbol) */}
              <path
                d="M46,42 L56,50 L46,58"
                fill="none"
                stroke="#0F172A"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ds-logo-symbol dark:hidden"
              />

              {/* > prompt — animated draw & erase (white symbol for dark mode) */}
              <path
                d="M46,42 L56,50 L46,58"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ds-logo-symbol hidden dark:block"
              />
            </svg>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight">
                <span className="text-dev-green">Dev</span>
                <span className="text-slate-900 dark:text-white">School</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono -mt-1">
                LEARN &amp; CODE
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F2FBF4] dark:bg-[#050806] border-b border-emerald-200/70 dark:border-emerald-900/40 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium transition ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
