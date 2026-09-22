'use client';

// ============================================================
//  I18N PROVIDER — client component দের জন্য dictionary-র ব্যাগ
// ============================================================
//  সার্ভার layout dictionary লোড করে, তারপর এই provider
//  সেটা client component-দের মধ্যে ছড়িয়ে দেয়।
//
//  ব্যবহার (client component-এ):
//    const dict = useDict();
//    <h1>{dict.nav.tutorials}</h1>

import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from './config';
import type { Dictionary } from './dictionaries';

// ----------------------------------------
//  দুটো জিনিস একসাথে রাখছি: ভাষা + dictionary
// ----------------------------------------
interface I18nContextValue {
  locale: Locale;
  dict: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ----------------------------------------
//  Provider — server layout এইটা ব্যবহার করে
// ----------------------------------------
export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

// ----------------------------------------
//  দুটো hook — client component-এ ব্যবহার হবে
// ----------------------------------------

/**
 * dictionary (UI লেখা) পেতে hook.
 * ব্যবহার: const dict = useDict();
 */
export function useDict(): Dictionary {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error(
      'useDict() ব্যবহার করতে হলে আপনাকে <I18nProvider> দিয়ে wrap করতে হবে।'
    );
  }
  return ctx.dict;
}

/**
 * বর্তমান ভাষা (bn/en) পেতে hook.
 * ব্যবহার: const locale = useLocale();
 */
export function useLocale(): Locale {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error(
      'useLocale() ব্যবহার করতে হলে আপনাকে <I18nProvider> দিয়ে wrap করতে হবে।'
    );
  }
  return ctx.locale;
}
