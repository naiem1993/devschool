/**
 * PIN-protection helpers for high-risk admin operations (currently: delete).
 *
 * Design:
 *  - PIN itself lives in env var `ADMIN_PIN` (never stored in DB).
 *  - Lockout state lives in the `PinLockout` singleton DB row. After
 *    MAX_PIN_ATTEMPTS wrong tries the lock is held for LOCKOUT_DURATION_MS
 *    (15 min) and then auto-expires on the next attempt. A correct PIN also
 *    clears the state immediately.
 *  - After a correct PIN, we issue a short-lived signed token (2 min) using
 *    the same HMAC scheme as the admin session. Delete APIs require this
 *    token via the `x-pin-token` header, so bypassing the modal won't work.
 */

import prisma from '@/lib/prisma'
import { signToken, verifyToken } from '@/lib/auth-token'

export const PIN_TOKEN_TTL_MS = 2 * 60 * 1000 // 2 minutes
export const PIN_TOKEN_PREFIX = 'pin:'
export const MAX_PIN_ATTEMPTS = 3
// Time-based lockout (audit #11). A permanent lockout was a DoS footgun: any
// user who could reach the PIN prompt (or a malicious actor) could lock the
// admin out until someone manually cleared the PinLockout row.
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutes

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
  const existing = await ensureRow()

  // If a previous lockout has already expired, the next wrong attempt starts a
  // fresh count. Without this reset an expired 3-attempt lock would immediately
  // re-lock on the very next failure.
  const expired = existing.lockedUntil !== null && existing.lockedUntil.getTime() <= Date.now()
  const attempts = expired ? 1 : existing.failedAttempts + 1

  if (attempts >= MAX_PIN_ATTEMPTS) {
    const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS)
    await prisma.pinLockout.update({
      where: { id: SINGLETON },
      data: { failedAttempts: attempts, lockedUntil },
    })
    return { attempts, locked: true }
  }

  await prisma.pinLockout.update({
    where: { id: SINGLETON },
    data: { failedAttempts: attempts, lockedUntil: null },
  })
  return { attempts, locked: false }
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
