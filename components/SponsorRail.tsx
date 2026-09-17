'use client'

import { useEffect, useRef } from 'react'

/**
 * SponsorRail — public sponsor display।
 * logo-তে ক্লিক → websiteUrl (new tab) + click tracking (fire-and-forget)।
 * impression tracking: rail viewport-এ এলে একবার increment।
 */

export type PublicSponsor = {
  id: string
  name: string
  logoUrl: string | null
  websiteUrl: string | null
  tier: string
  description: string | null
}

const tierStyle: Record<string, string> = {
  gold: 'ring-2 ring-amber-400/60',
  silver: 'ring-2 ring-slate-300/60',
  bronze: 'ring-2 ring-orange-400/50',
  partner: 'ring-1 ring-slate-200 dark:ring-slate-800',
}

export default function SponsorRail({ sponsors }: { sponsors: PublicSponsor[] }) {
  const railRef = useRef<HTMLDivElement>(null)
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current || !railRef.current || sponsors.length === 0) return
    const el = railRef.current
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !tracked.current) {
          tracked.current = true
          sponsors.forEach((s) => {
            fetch(`/api/sponsors/${s.id}/click?impression=1`, { method: 'POST' }).catch(() => {})
          })
          io.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [sponsors])

  if (sponsors.length === 0) return null

  const onClick = (s: PublicSponsor) => {
    fetch(`/api/sponsors/${s.id}/click`, { method: 'POST' }).catch(() => {})
  }

  return (
    <div ref={railRef} className="border-t border-slate-200 dark:border-slate-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 text-center">
          Sponsored by
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {sponsors.map((s) => {
            const content = s.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.logoUrl}
                alt={s.name}
                title={s.name}
                className="max-h-12 max-w-[140px] object-contain"
              />
            ) : (
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{s.name}</span>
            )

            const cls = `flex items-center justify-center px-4 py-2 rounded-xl bg-white dark:bg-[#0f151c] ${
              tierStyle[s.tier] || tierStyle.partner
            } hover:scale-105 transition`

            return s.websiteUrl ? (
              <a
                key={s.id}
                href={s.websiteUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={() => onClick(s)}
                className={cls}
              >
                {content}
              </a>
            ) : (
              <div key={s.id} className={cls}>
                {content}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
