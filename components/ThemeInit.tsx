'use client'

import { useSyncExternalStore } from 'react'

/**
 * React 19.3+ (Next.js 16) dev-only warning fix:
 * "Encountered a script tag while rendering React component"
 *
 * React warns whenever a <script> is created during a *client* render,
 * because such scripts never execute. But our theme script MUST run in
 * the server-rendered HTML, before first paint (to prevent FOUC).
 *
 * Fix: render the script only on the server render and the matching
 * hydration render, then render null on every later client render.
 * useSyncExternalStore with serverSnapshot=true / clientSnapshot=false
 * stays stable across the hydration boundary (no mismatch).
 *
 * Reference: MUI material-ui PR #48671 (same pattern).
 */

const emptySubscribe = () => () => {}

export default function ThemeInit({
  id,
  html,
}: {
  id?: string
  html: string
}) {
  const isServer = useSyncExternalStore(
    emptySubscribe,
    () => false, // client snapshot
    () => true   // server snapshot (SSR + hydration)
  )

  if (!isServer) return null

  return (
    <script
      id={id}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
