'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { setLocale } from '@/app/actions/setLocale';
import { useDict, useLocale } from '@/lib/i18n/I18nProvider';
import { stripLocale } from '@/lib/i18n/link';

/**
 * হেডারে 'বাং | EN' ভাষা টগল।
 *
 * দুইটা আলাদা <form> — একটা 'bn', একটা 'en'।
 * JS বন্ধ থাকলেও form submit হয়ে server action চলবে।
 * JS চালু থাকলে useEffect window.location.search পড়ে query ধরে রাখে;
 * JS বন্ধ থাকলে শুধু path নিয়ে যাবে (গ্রহণযোগ্য ফলব্যাক)।
 *
 * ⚠️ useSearchParams() ব্যবহার করা হয়নি — Next.js build-এ
 *    Suspense boundary error দেয়। বদলে window.location.search।
 */
export default function LanguageSwitcher() {
  const locale = useLocale();          // 'bn' | 'en'
  const dict = useDict();
  const pathname = usePathname();      // '/bn/tutorials'
  const { path } = stripLocale(pathname || '/');  // '/tutorials'

  // JS চালু থাকলে query ধরে রাখি
  const [search, setSearch] = useState('');
  useEffect(() => {
    setSearch(window.location.search || '');
  }, [pathname]);

  const isBn = locale === 'bn';
  const isEn = locale === 'en';

  const btnBase =
    'px-2 sm:px-2.5 py-1.5 text-xs sm:text-sm rounded-full font-medium ' +
    'transition-colors focus:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-emerald-500/40';
  const btnActive =
    'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold';
  const btnIdle =
    'text-slate-600 dark:text-slate-300 ' +
    'hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300';

  return (
    <div
      className="flex items-center gap-0.5 select-none"
      role="group"
      aria-label={dict.language.switchTo}
    >
      {/* ── বাংলা ── */}
      <form action={setLocale} className="contents">
        <input type="hidden" name="locale" value="bn" />
        <input type="hidden" name="path" value={path} />
        <input type="hidden" name="search" value={search} />
        <button
          type="submit"
          disabled={isBn}
          aria-label="ভাষা বাংলায় বদলান"
          aria-current={isBn ? 'true' : undefined}
          className={`${btnBase} ${isBn ? btnActive : btnIdle} ${
            isBn ? 'cursor-default' : ''
          }`}
        >
          বাং
        </button>
      </form>

      <span
        aria-hidden="true"
        className="text-slate-300 dark:text-slate-600 text-xs"
      >
        |
      </span>

      {/* ── English ── */}
      <form action={setLocale} className="contents">
        <input type="hidden" name="locale" value="en" />
        <input type="hidden" name="path" value={path} />
        <input type="hidden" name="search" value={search} />
        <button
          type="submit"
          disabled={isEn}
          aria-label="Switch to English"
          aria-current={isEn ? 'true' : undefined}
          className={`${btnBase} ${isEn ? btnActive : btnIdle} ${
            isEn ? 'cursor-default' : ''
          }`}
        >
          EN
        </button>
      </form>
    </div>
  );
}
