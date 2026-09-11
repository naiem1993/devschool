/**
 * Node-runtime admin helpers (Prisma + rate limiting).
 *
 * এখানে দুটো জিনিস:
 *  1. requireAdmin(req)  → admin API route-এ auth গার্ড (defense-in-depth)
 *  2. rateLimit(key)      → সরল in-memory rate limiter
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ADMIN_COOKIE, verifyToken } from '@/lib/auth-token'

export { ADMIN_COOKIE, signToken, verifyToken } from '@/lib/auth-token'

/**
 * কুকি verify + DB-তে admin আসলেই আছে কি না ও active কি না — দুটোই চেক করে।
 * @returns userId অথবা null
 */
export async function getAdminId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value
  const userId = await verifyToken(token)
  if (!userId) return null

  const user = await prisma.adminUser.findUnique({
    where: { id: userId },
    select: { id: true, isActive: true },
  })
  if (!user || !user.isActive) return null
  return user.id
}

/**
 * API route-এ ব্যবহার করুন:
 *   const denied = await requireAdmin(req)
 *   if (denied) return denied
 * অথরাইজড না হলে 401 JSON রিটার্ন করে, নাহলে null।
 */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const id = await getAdminId(req)
  if (!id) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  return null
}

// ---------------- সরল in-memory rate limiter ----------------
type Bucket = { count: number; resetAt: number }

// dev hot-reload-এ একাধিক bucket/interval তৈরি হওয়া ঠেকাতে globalThis-এ রাখা হলো।
// (module reload হলেও এরা singleton থাকে)
const g = globalThis as unknown as {
  __rateLimitBuckets?: Map<string, Bucket>
  __rateLimitCleanup?: ReturnType<typeof setInterval>
}

const buckets = g.__rateLimitBuckets ?? (g.__rateLimitBuckets = new Map<string, Bucket>())

// প্রতি ৫ মিনিটে expired entries মুছে দাও, যাতে Map অসীমভাবে বড় না হয়।
if (!g.__rateLimitCleanup) {
  g.__rateLimitCleanup = setInterval(() => {
    const now = Date.now()
    for (const [key, bucket] of buckets.entries()) {
      if (bucket.resetAt < now) buckets.delete(key)
    }
  }, 5 * 60 * 1000)
  // Node-এ interval যেন process exit আটকে না রাখে (Edge-এ number, তাই optional chaining)
  ;(g.__rateLimitCleanup as { unref?: () => void }).unref?.()
}

/**
 * key অনুযায়ী limit বার অনুমতি দেয় প্রতি windowMs-এ।
 * উদাহরণ: rateLimit(`login:${ip}`, 5, 60_000) → প্রতি মিনিটে ৫ বার।
 */
export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const b = buckets.get(key)

  if (!b || b.resetAt < now) {
    const resetAt = now + windowMs
    buckets.set(key, { count: 1, resetAt })
    return { ok: true, remaining: limit - 1, resetAt }
  }

  b.count += 1
  if (b.count > limit) return { ok: false, remaining: 0, resetAt: b.resetAt }
  return { ok: true, remaining: limit - b.count, resetAt: b.resetAt }
}
