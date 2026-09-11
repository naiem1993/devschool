import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifyToken } from '@/lib/auth-token'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // কুকি থেকে signed টোকেন নিয়ে HMAC verify (ভ্যালু DB-তে চেক করা proxy-এ
  // সম্ভব নয় কারণ এটা Edge runtime; তবে signature ছাড়া টোকেন বানানো অসম্ভব)
  const token = request.cookies.get(ADMIN_COOKIE)?.value
  const userId = await verifyToken(token)

  // (১) API protection → /api/admin/* (login ছাড়া) সব 401 JSON
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
    if (!userId) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }
  }

  // (২) Page protection → /admin/* (login ছাড়া) সব login-এ redirect
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!userId) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  return response
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
