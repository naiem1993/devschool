import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifyToken } from '@/lib/auth-token'
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from '@/lib/i18n/config'

// ============================================================
//  PROXY (Next.js 16-এ middleware-এর নতুন নাম)
// ============================================================
//  দুইটা কাজ একসাথে:
//   (১) Admin auth    → /admin/* আর /api/admin/* সুরক্ষিত
//   (২) Locale দারোয়ান → URL-এ ভাষা (/bn বা /en) না থাকলে যোগ করে
//                         দেয় (cookie → ব্রাউজার ভাষা → ডিফল্ট bn)
// ============================================================

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ----------------------------------------------------------
  // (১) ADMIN AUTH — আগের মতোই, অপরিবর্তিত
  // ----------------------------------------------------------
  //  কুকি থেকে signed টোকেন নিয়ে HMAC verify (ভ্যালু DB-তে চেক করা
  //  proxy-এ সম্ভব নয় কারণ এটা Edge runtime; তবে signature ছাড়া
  //  টোকেন বানানো অসম্ভব)
  const token = request.cookies.get(ADMIN_COOKIE)?.value
  const userId = await verifyToken(token)

  // (১ক) API protection → /api/admin/* (login ছাড়া) সব 401 JSON
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
    if (!userId) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }
  }

  // (১খ) Page protection → /admin/* (login ছাড়া) সব login-এ redirect
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!userId) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // ----------------------------------------------------------
  // admin বা api path হলে locale logic বাদ — সরাসরি নিরাপত্তা
  // header দিয়ে ফিরে যাই
  // ----------------------------------------------------------
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return withSecurityHeaders(NextResponse.next())
  }

  // ----------------------------------------------------------
  // (২) LOCALE দারোয়ান — শুধু পাবলিক পেজে
  // ----------------------------------------------------------
  const pathnameHasLocale =
    pathname === '/bn' ||
    pathname.startsWith('/bn/') ||
    pathname === '/en' ||
    pathname.startsWith('/en/')

  if (!pathnameHasLocale) {
    // ধাপ ১: cookie-তে পছন্দ আছে?
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
    let targetLocale: Locale = DEFAULT_LOCALE

    if (isLocale(cookieLocale)) {
      targetLocale = cookieLocale
    } else {
      // ধাপ ২: ব্রাউজারের Accept-Language header
      const acceptLanguage = request.headers.get('accept-language') ?? ''
      // বাংলার অগ্রাধিকার আগে (সাইটের আসল ভাষা বাংলা)
      if (/\bbn\b/i.test(acceptLanguage)) {
        targetLocale = 'bn'
      } else if (/\ben\b/i.test(acceptLanguage)) {
        targetLocale = 'en'
      }
      // ধাপ ৩: কিছুই না পেলে ডিফল্ট bn (উপরে সেট করা আছে)
    }

    // redirect করি → /{locale}{আগের path}?{আগের query}
    const url = request.nextUrl.clone()
    url.pathname = `/${targetLocale}${pathname === '/' ? '' : pathname}`

    const redirectResponse = NextResponse.redirect(url, 307)
    // ইউজারের পছন্দ cookie-তে সেভ করি — ১ বছর
    redirectResponse.cookies.set(LOCALE_COOKIE, targetLocale, {
      path: '/',
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: 'lax',
    })
    return redirectResponse
  }

  // ----------------------------------------------------------
  // (৩) নিরাপত্তা header যোগ করে এগিয়ে যেতে দিই
  // ----------------------------------------------------------
  return withSecurityHeaders(NextResponse.next())
}

// ছোট helper — নিরাপত্তা header দুটো যোগ করে
function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  return response
}

export const config = {
  matcher: [
    // (ক) admin auth পথ — locale logic বাদে
    '/admin/:path*',
    '/api/admin/:path*',
    // (খ) বাকি পাবলিক পেজ — _next, api, admin, স্ট্যাটিক ফাইল বাদে
    '/((?!_next|api|admin|.*\\..*).*)',
  ],
}
