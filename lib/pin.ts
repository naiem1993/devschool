/**
 * PIN-protection helpers for high-risk admin operations (currently: delete).
 *
 * Design:
 *  - PIN itself lives in env var `ADMIN_PIN` (never stored in DB).
 *  - Lockout state lives in the `PinLockout` singleton DB row so it can be
 *    manually cleared from Supabase/Prisma Studio when the user wants to
 *    unlock (per user's explicit choice — no auto-unlock).
 *  - After a correct PIN, we issue a short-lived signed token (2 min) using
 *    the same HMAC scheme as the admin session. Delete APIs require this
 *    token via the `x-pin-token` header, so bypassing the modal won't work.
 */

import prisma from '@/lib/prisma'
import { signToken, verifyToken } from '@/lib/auth-token'

export const PIN_TOKEN_TTL_MS = 2 * 60 * 1000 // 2 minutes
export const PIN_TOKEN_PREFIX = 'pin:'
export const MAX_PIN_ATTEMPTS = 3
// Manual-unlock-only: lockedUntil is set far into the future.
// User clears it manually from Supabase Studio → PinLockout table.
const FAR_FUTURE = new Date('9999-12-31T23:59:59.999Z')

const SINGLETON = 'singleton'

export type LockState = {
  locked: boolean
  lockedUntil: Date | null
  failedAttempts: number
  maxAttempts: number
}

async function ensureRow() {
  return prisma.pinLockout.upsert({
    where: { id: SINGLETON },
    create: { id: SINGLETON, failedAttempts: 0, lockedUntil: null },
    update: {},
  })
}

export async function getLockState(): Promise<LockState> {
  const row = await ensureRow()
  const locked = !!row.lockedUntil && row.lockedUntil.getTime() > Date.now()
  return {
    locked,
    lockedUntil: row.lockedUntil,
    failedAttempts: row.failedAttempts,
    maxAttempts: MAX_PIN_ATTEMPTS,
  }
}

export async function recordFailure(): Promise<{ attempts: number; locked: boolean }> {
  const row = await prisma.pinLockout.upsert({
    where: { id: SINGLETON },
    create: { id: SINGLETON, failedAttempts: 1, lockedUntil: null },
    update: { failedAttempts: { increment: 1 } },
  })
  if (row.failedAttempts >= MAX_PIN_ATTEMPTS) {
    await prisma.pinLockout.update({
      where: { id: SINGLETON },
      data: { lockedUntil: FAR_FUTURE },
    })
    return { attempts: row.failedAttempts, locked: true }
  }
  return { attempts: row.failedAttempts, locked: false }
}

export async function clearLockout(): Promise<void> {
  await prisma.pinLockout.upsert({
    where: { id: SINGLETON },
    create: { id: SINGLETON, failedAttempts: 0, lockedUntil: null },
    update: { failedAttempts: 0, lockedUntil: null },
  })
}

/** Plain string compare against ADMIN_PIN env var. Empty/missing env = never matches. */
export function verifyPin(pin: string): boolean {
  const expected = process.env.ADMIN_PIN
  if (!expected) return false
  return pin === expected
}

/** Issue a short-lived signed token proving PIN was just verified for this admin. */
export async function issuePinToken(adminId: string): Promise<string> {
  return signToken(`${PIN_TOKEN_PREFIX}${adminId}`, PIN_TOKEN_TTL_MS)
}

/** Verify the token came from a recent PIN success for the given admin. */
export async function verifyPinToken(
  token: string | undefined | null,
  adminId: string
): Promise<boolean> {
  const decoded = await verifyToken(token)
  return decoded === `${PIN_TOKEN_PREFIX}${adminId}`
}
