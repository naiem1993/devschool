import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { ADMIN_COOKIE, signToken } from '@/lib/auth-token'
import { rateLimit } from '@/lib/auth'

export async function POST(req: NextRequest) {
  // ---- Rate limiting: প্রতি IP-তে ৫ বার/মিনিট ----
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  const rl = rateLimit(`login:${ip}`, 5, 60_000)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'TOO MANY ATTEMPTS. TRY AGAIN LATER.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      }
    )
  }

  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'email and password required' }, { status: 400 })
    }

    const user = await prisma.adminUser.findUnique({
      where: { email: String(email).toLowerCase().trim() },
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'ACCESS DENIED' }, { status: 401 })
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: 'ACCESS DENIED' }, { status: 401 })
    }

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // signed + HMAC টোকেন (plain user.id নয়)
    const token = await signToken(user.id)

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    })

    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
      sameSite: 'lax',
    })
    return response
  } catch (err) {
    console.error('[admin/login]', err)
    return NextResponse.json({ error: 'SERVER ERROR' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(ADMIN_COOKIE)
  return response
}
