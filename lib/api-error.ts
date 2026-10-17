/**
 * Standardized error handling for API routes.
 *
 * Two problems this solves:
 *
 *   1. TypeScript: `catch (e: any)` defeats strict typing. We prefer
 *      `catch (e: unknown)` and then narrow the type safely.
 *
 *   2. Security: Raw `e.message` can leak internal details (SQL errors,
 *      stack traces, file paths) to the client. This helper logs the
 *      full error server-side and returns only a safe message.
 *
 * Usage:
 *
 *   import { serverError } from '@/lib/api-error'
 *
 *   try {
 *     // ...
 *   } catch (e: unknown) {
 *     return serverError(e, 'challenges-create')
 *   }
 */

import { NextResponse } from 'next/server'

/**
 * Extract a safe, human-readable message from an unknown thrown value.
 *
 * - `Error` instance → use its `.message`
 * - string → use as-is
 * - anything else → generic fallback
 *
 * Never throws. Never returns undefined.
 */
export function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  if (typeof e === 'string') return e
  if (e && typeof e === 'object' && 'message' in e && typeof (e as { message: unknown }).message === 'string') {
    return (e as { message: string }).message
  }
  return 'Unknown error'
}

/**
 * Build a standardized 500 response for API routes.
 *
 * @param e       The thrown value (typed as `unknown` for strictness).
 * @param context A short label for the log line (e.g. 'challenges-create').
 *                Helps identify which route failed in the server logs.
 *
 * @returns NextResponse.json({ error }, { status: 500 })
 */
export function serverError(e: unknown, context?: string): NextResponse {
  const label = context ? `[API Error @ ${context}]` : '[API Error]'
  // Full error (incl. stack) goes to the server console, not the client.
  console.error(label, e)
  return NextResponse.json(
    { error: getErrorMessage(e) },
    { status: 500 }
  )
}
