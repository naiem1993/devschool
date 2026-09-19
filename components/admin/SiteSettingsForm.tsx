'use client'

import { useState } from 'react'
import type { HeroContent } from '@/lib/hero-content'
import type { FooterContent } from '@/lib/footer-content'

export default function SiteSettingsForm({
  initialHero,
  initialFooter,
}: {
  initialHero: HeroContent
  initialFooter: FooterContent
}) {
  const [hero, setHero] = useState<HeroContent>(initialHero)
  const [footer, setFooter] = useState<FooterContent>(initialFooter)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const updateHero = (patch: Partial<HeroContent>) => {
    setHero((f) => ({ ...f, ...patch }))
    setSaved(false)
  }

  const updateFooter = (patch: Partial<FooterContent>) => {
    setFooter((f) => ({ ...f, ...patch }))
    setSaved(false)
  }

  const updateStat = (i: number, v: string) => {
    setHero((f) => {
      const next = [...f.statLabels]
      next[i] = v
      return { ...f, statLabels: next }
    })
    setSaved(false)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero, footer }),
      })
      if (res.ok) {
        setSaved(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'save failed')
      }
    } catch (e: any) {
      setError(e?.message || 'network error')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-3xl">
      {/* ═══ HERO ═══ */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Hero Section</h2>

        <Field label="> Badge (উপরের ছোট pill text)">
          <input
            className="admin-input"
            value={hero.badge}
            onChange={(e) => updateHero({ badge: e.target.value })}
            required
          />
        </Field>

        <Field label="> Heading (সাদা line)">
          <input
            className="admin-input"
            value={hero.heading}
            onChange={(e) => updateHero({ heading: e.target.value })}
            required
          />
        </Field>

        <Field label="> Heading Highlight (সবুজ gradient line)">
          <input
            className="admin-input"
            value={hero.headingHighlight}
            onChange={(e) => updateHero({ headingHighlight: e.target.value })}
            required
          />
        </Field>

        <Field label="> Subtitle">
          <textarea
            className="admin-input"
            rows={3}
            value={hero.subtitle}
            onChange={(e) => updateHero({ subtitle: e.target.value })}
            required
          />
        </Field>

        <Field label="> Search box placeholder">
          <input
            className="admin-input"
            value={hero.searchPlaceholder}
            onChange={(e) => updateHero({ searchPlaceholder: e.target.value })}
            required
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Field label="> Primary CTA Label">
              <input
                className="admin-input"
                value={hero.cta1Label}
                onChange={(e) => updateHero({ cta1Label: e.target.value })}
                required
              />
            </Field>
            <Field label="> Primary CTA Href">
              <input
                className="admin-input"
                value={hero.cta1Href}
                onChange={(e) => updateHero({ cta1Href: e.target.value })}
                placeholder="/categories"
                required
              />
            </Field>
          </div>

          <div className="space-y-4">
            <Field label="> Secondary CTA Label">
              <input
                className="admin-input"
                value={hero.cta2Label}
                onChange={(e) => updateHero({ cta2Label: e.target.value })}
                required
              />
            </Field>
            <Field label="> Secondary CTA Href">
              <input
                className="admin-input"
                value={hero.cta2Href}
                onChange={(e) => updateHero({ cta2Href: e.target.value })}
                placeholder="/challenges"
                required
              />
            </Field>
          </div>
        </div>

        <fieldset className="space-y-3 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <legend className="px-2 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Stat Labels (৪টা)
          </legend>
          {hero.statLabels.map((label, i) => (
            <Field key={i} label={`> Stat ${i + 1} label`}>
              <input
                className="admin-input"
                value={label}
                onChange={(e) => updateStat(i, e.target.value)}
                required
              />
            </Field>
          ))}
        </fieldset>
      </section>

      {/* ═══ FOOTER ═══ */}
      <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Footer</h2>

        <Field label="> Copyright line ({'{year}'} দিলে current year বসবে)">
          <input
            className="admin-input"
            value={footer.copyright}
            onChange={(e) => updateFooter({ copyright: e.target.value })}
            required
          />
        </Field>

        <Field label="> Donate Prompt (লিংকের আগের text)">
          <input
            className="admin-input"
            value={footer.donatePrompt}
            onChange={(e) => updateFooter({ donatePrompt: e.target.value })}
            required
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="> Donate Link Label">
            <input
              className="admin-input"
              value={footer.donateLinkLabel}
              onChange={(e) => updateFooter({ donateLinkLabel: e.target.value })}
              required
            />
          </Field>
          <Field label="> Donate Link Href">
            <input
              className="admin-input"
              value={footer.donateLinkHref}
              onChange={(e) => updateFooter({ donateLinkHref: e.target.value })}
              placeholder="/donate"
              required
            />
          </Field>
        </div>
      </section>

      {error && <div className="admin-error">[!] {error}</div>}
      {saved && (
        <div className="text-sm text-emerald-600 dark:text-emerald-400">
          [✓] saved — cache invalidated, live site-এ আপডেট হয়ে গেছে
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">
          {loading ? '> saving...' : '$ save'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      {children}
    </div>
  )
}
