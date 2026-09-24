'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { useDict, useLocale } from '@/lib/i18n/I18nProvider';
import { localeHref, stripLocale } from '@/lib/i18n/link';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const pathname = usePathname();
  const dict = useDict();
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // pathname-এ এখন locale prefix আছে (/bn/... বা /en/...)।
  // prefix কেটে আসল path বের করি (যেমন /tutorials)।
  const { path } = stripLocale(pathname || '/');

  const navLinks = [
    { name: dict.nav.tutorials, href: localeHref(locale, '/tutorials') },
    { name: dict.nav.references, href: localeHref(locale, '/references') },
    { name: dict.nav.playground, href: localeHref(locale, '/playground') },
    { name: dict.nav.challenges, href: localeHref(locale, '/challenges') },
    { name: dict.nav.tools, href: localeHref(locale, '/tools') },
  ];

  const isHome = path === '/';

  /* ---------- Shared pieces ---------- */
  const Logo = (
    <Link href={localeHref(locale, '/')} className="flex items-center gap-2.5 group shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-9 h-9 rounded-xl group-hover:scale-105 transition-transform duration-200"
        aria-label="DevSchool logo"
      >
        <defs>
          <linearGradient id="dsLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
        <rect x="22" y="16" width="14" height="68" rx="7" fill="url(#dsLogoGrad)" />
        <path
          d="M36,23 H52 C68,23 78,33 78,50 C78,67 68,77 52,77 H36"
          fill="none"
          stroke="url(#dsLogoGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M46,42 L56,50 L46,58"
          fill="none"
          stroke="#0F172A"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ds-logo-symbol dark:hidden"
        />
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
        <span className="text-sm sm:text-base font-extrabold tracking-tight leading-tight">
          <span className="text-dev-green">Dev</span>
          <span className="text-slate-900 dark:text-white">School</span>
        </span>
        <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400 font-mono -mt-0.5">
          LEARN &amp; CODE
        </span>
      </div>
    </Link>
  );

  const DesktopNav = (
    <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
      {navLinks.map((link) => {
        const linkPath = stripLocale(link.href).path;
        const isActive = path === linkPath || path?.startsWith(linkPath + '/');
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );

  const BurgerIcon = ({ open }: { open: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  );

  /* 🍔 Mobile hamburger — header bar-এর ভেতরে, একদম বামে (logo-র আগে) */
  const MobileBurger = (
    <button
      type="button"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      aria-label="Toggle Menu"
      aria-expanded={mobileMenuOpen}
      className="md:hidden p-2 -ml-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-[#4ADE80] transition-colors shrink-0"
    >
      <BurgerIcon open={mobileMenuOpen} />
    </button>
  );

  const MobileMenuLinks = (
    <>
      {navLinks.map((link) => {
        const linkPath = stripLocale(link.href).path;
        const isActive = path === linkPath || path?.startsWith(linkPath + '/');
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-base font-medium transition ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'text-slate-700 dark:text-slate-200 hover:bg-emerald-500/10'
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );

  /* =========================================================
     🏠 HOME PAGE — floating pill nav
     Mobile: ☰ bame, logo tar por, tarpor 🌙 dane
     ========================================================= */
  if (isHome) {
    return (
      <header className="fixed top-0 left-0 right-0 z-[100] w-full pt-4 pb-2 pointer-events-none">
        <div className="relative mx-auto w-[92%] sm:w-[80%] pointer-events-auto">
          <div className="rounded-full border border-emerald-500/25 dark:border-emerald-500/25 bg-emerald-500/[0.06] dark:bg-emerald-500/[0.08] backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(34,197,94,0.25)]">
            <div className="flex items-center justify-between h-14 px-2 sm:px-4 lg:px-5 gap-2">
              {/* Left: mobile burger + logo */}
              <div className="flex items-center gap-2 shrink-0 min-w-0">
                {MobileBurger}
                {Logo}
              </div>

              {DesktopNav}

              <div className="flex items-center gap-2 shrink-0">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-2 rounded-2xl border border-emerald-200/70 dark:border-emerald-900/50 bg-[#F2FBF4]/95 dark:bg-[#050806]/95 backdrop-blur-xl shadow-lg p-2 space-y-1">
              {MobileMenuLinks}
            </div>
          )}
        </div>
      </header>
    );
  }

  /* =========================================================
     📄 INNER PAGES — FULL-WIDTH bar
     Mobile: ☰ bame, logo tar por, nav center, 🌙 dane
     ========================================================= */
  return (
    <header className="sticky top-0 z-[100] w-full border-b border-emerald-200/70 dark:border-emerald-900/40 bg-[#F2FBF4]/90 dark:bg-[#050806]/90 backdrop-blur-xl shadow-sm">
      <div className="w-full px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: mobile burger + logo */}
          <div className="flex items-center gap-2 shrink-0 min-w-0">
            {MobileBurger}
            {Logo}
          </div>

          <div className="flex-1 flex justify-center">
            {DesktopNav}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-200/70 dark:border-emerald-900/40 bg-[#F2FBF4]/95 dark:bg-[#050806]/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-1">
          {MobileMenuLinks}
        </div>
      )}
    </header>
  );
}
