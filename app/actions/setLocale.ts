'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  isLocale,
} from '@/lib/i18n/config';
import { localeHref } from '@/lib/i18n/link';

/**
 * হেডারে EN | বাং সুইচে ক্লিক করলে এই server action চলে।
 * ১) locale যাচাই
 * ২) cookie সেট (path=/ বাধ্যতামূলক)
 * ৩) নতুন locale-এ redirect
 *
 * ⚠️ redirect() special error throw করে — তাই cookie সেট করা
 *    redirect()-এর আগে থাকতেই হবে, আর redirect() try/catch-এ
 *    রাখা যাবে না।
 */
export async function setLocale(formData: FormData) {
  const rawLocale = formData.get('locale');
  const rawPath = formData.get('path');
  const rawSearch = formData.get('search');

  // locale যাচাই — typeof চেক বাধ্যতামূলক (FormDataEntryValue হতে পারে File)
  if (typeof rawLocale !== 'string' || !isLocale(rawLocale)) return;

  // path যাচাই
  const safePath =
    typeof rawPath === 'string' && rawPath.startsWith('/') ? rawPath : '/';

  // search যাচাই
  const safeSearch =
    typeof rawSearch === 'string' && rawSearch.startsWith('?') ? rawSearch : '';

  // cookies() Next.js 15+ এ async — await বাধ্যতামূলক
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, rawLocale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',    // ⚠️ proxy.ts-এর সাথে হুবহু মিল
    // secure: false ইচ্ছাকৃত — http://localhost-এ secure:true দিলে
    // cookie সেটই হবে না; production-এ HTTPS হলে ব্রাউজার নিজে মানবে
  });

  // redirect() throw করে — এর পরে আর কিছু লেখা যাবে না
  redirect(localeHref(rawLocale, safePath) + safeSearch);
}
