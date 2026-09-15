import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, getAdminId, rateLimit } from '@/lib/auth'
import {
  getLockState,
  recordFailure,
  clearLockout,
  verifyPin,
  issuePinToken,
  PIN_TOKEN_TTL_MS,
  MAX_PIN_ATTEMPTS,
} from '@/lib/pin'

/**
 * GET → current lock state (used by modal to show "locked" / attempts left)
 * POST { pin } → verify PIN, return short-lived signed token on success
 */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const lock = await getLockState()
  return NextResponse.json(lock)
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const adminId = await getAdminId(req)
  if (!adminId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  // Extra rate-limit beyond the lockout, to slow down scripted attempts.
  const rl = rateLimit(`verify-pin:${adminId}`, 10, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 })
  }

  const lock = await getLockState()
  if (lock.locked) {
    return NextResponse.json(
      { error: 'LOCKED', lockedUntil: lock.lockedUntil, failedAttempts: lock.failedAttempts },
      { status: 423 }
    )
  }

  let pin = ''
  try {
    const body = await req.json()
    pin = String(body?.pin ?? '')
  } catch {
    return NextResponse.json({ error: 'BAD_BODY' }, { status: 400 })
  }

  if (!pin) return NextResponse.json({ error: 'EMPTY_PIN' }, { status: 400 })

  if (!verifyPin(pin)) {
    const { attempts, locked } = await recordFailure()
    if (locked) {
      return NextResponse.json(
        { error: 'LOCKED_NOW', failedAttempts: attempts, maxAttempts: MAX_PIN_ATTEMPTS },
        { status: 423 }
      )
    }
    return NextResponse.json(
      {
        error: 'WRONG_PIN',
        failedAttempts: attempts,
        attemptsLeft: Math.max(0, MAX_PIN_ATTEMPTS - attempts),
      },
      { status: 401 }
    )
  }

  // Success: reset attempts, issue token
  await clearLockout()
  const token = await issuePinToken(adminId)
  return NextResponse.json({ token, expiresInMs: PIN_TOKEN_TTL_MS })
}
