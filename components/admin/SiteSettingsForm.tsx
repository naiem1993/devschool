'use client'

import { useState } from 'react'
import type { HeroContent } from '@/lib/hero-content'
import type { FooterContent } from '@/lib/footer-content'
import type { ReviewsSettings } from '@/lib/reviews-content'
import type { FaqSettings, FaqItem } from '@/lib/faq-content'

export default function SiteSettingsForm({
  initialHero,
  initialFooter,
  initialReviews,
  initialFaq,
}: {
  initialHero: HeroContent
  initialFooter: FooterContent
  initialReviews: ReviewsSettings
  initialFaq: FaqSettings
}) {
  const [hero, setHero] = useState<HeroContent>(initialHero)
  const [footer, setFooter] = useState<FooterContent>(initialFooter)
  const [reviews, setReviews] = useState<ReviewsSettings>(initialReviews)
  const [faq, setFaq] = useState<FaqSettings>(initialFaq)
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

  const updateFaqItem = (i: number, patch: Partial<FaqItem>) => {
    setFaq((f) => {
      const next = [...f.items]
      next[i] = { ...next[i], ...patch }
      return { items: next }
    })
    setSaved(false)
  }

  const addFaqItem = () => {
    setFaq((f) => ({ items: [...f.items, { q: '', a: '' }] }))
    setSaved(false)
  }

  const removeFaqItem = (i: number) => {
    setFaq((f) => ({ items: f.items.filter((_, idx) => idx !== i) }))
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
        body: JSON.stringify({ hero, footer, reviews, faq }),
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
                placeholder="/courses"
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

      {/* ═══ REVIEWS SECTION ═══ */}
      <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Reviews Section</h2>

        <label className="flex items-start gap-3 cursor-pointer select-none rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-[#22C55E] transition">
          <input
            type="checkbox"
            checked={reviews.enabled}
            onChange={(e) => {
              setReviews({ enabled: e.target.checked })
              setSaved(false)
            }}
            className="mt-0.5 w-5 h-5 accent-[#22C55E] cursor-pointer"
          />
          <span>
            <span className="block text-sm font-semibold text-slate-900 dark:text-white">
              হোমপেজে রিভিউ সেকশন দেখাও
            </span>
            <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">
              বন্ধ করলে "লার্নাররা যা বলছেন" সেকশনটা (রেটিং সারসংক্ষেপ, স্লাইডার ও রিভিউ ফর্মসহ) হোমপেজ থেকে পুরোপুরি লুকিয়ে যাবে। ডেটা ডিলিট হবে না — আবার চালু করলে সব ফিরে আসবে।
            </span>
          </span>
        </label>
      </section>

      {/* ═══ FAQ SECTION ═══ */}
      <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">FAQ Section</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          এখানে যা থাকবে সেটাই homepage-এর FAQ সেকশনে দেখাবে (এই মুহূর্তে প্রশ্ন-উত্তর)। সব প্রশ্ন মুছে দিলে পুরো FAQ সেকশন homepage থেকে লুকিয়ে যাবে।
        </p>

        {faq.items.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400 italic">
            এখনো কোনো প্রশ্ন নেই — নিচের বাটন দিয়ে যোগ করুন।
          </p>
        )}

        <div className="space-y-4">
          {faq.items.map((item, i) => (
            <div
              key={i}
              className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  প্রশ্ন {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFaq((f) => ({ items: f.items.filter((_, idx) => idx !== i) }))
                    setSaved(false)
                  }}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline"
                  aria-label="প্রশ্ন মুছুন"
                >
                  🗑️ মুছুন
                </button>
              </div>

              <Field label="> প্রশ্ন">
                <input
                  className="admin-input"
                  value={item.q}
                  onChange={(e) => {
                    setFaq((f) => {
                      const items = [...f.items]
                      items[i] = { ...items[i], q: e.target.value }
                      return { items }
                    })
                    setSaved(false)
                  }}
                  placeholder="যেমন: DevSchool কি সত্যিই ফ্রি?"
                />
              </Field>

              <Field label="> উত্তর">
                <textarea
                  className="admin-input"
                  rows={3}
                  value={item.a}
                  onChange={(e) => {
                    setFaq((f) => {
                      const items = [...f.items]
                      items[i] = { ...items[i], a: e.target.value }
                      return { items }
                    })
                    setSaved(false)
                  }}
                  placeholder="যেমন: হ্যাঁ, ১০০% ফ্রি। কোনো কার্ড, ট্রায়াল বা লুকানো চার্জ নেই।"
                />
              </Field>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setFaq((f) => ({ items: [...f.items, { q: '', a: '' } as FaqItem] }))
            setSaved(false)
          }}
          className="text-sm font-semibold text-[#15803D] dark:text-[#4ADE80] border border-[#22C55E]/40 rounded-xl px-4 py-2 hover:bg-[#22C55E]/10 transition"
        >
          + নতুন প্রশ্ন যোগ করুন
        </button>
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
                data-href-anchor="1"
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
