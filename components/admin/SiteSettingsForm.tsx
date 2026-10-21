'use client'

import { useState } from 'react'
import { DEFAULT_HERO_EN, type HeroContent } from '@/lib/hero-content'
import { DEFAULT_FOOTER_EN, type FooterContent } from '@/lib/footer-content'
import type { ReviewsSettings } from '@/lib/reviews-content'
import type { DonationSettings } from '@/lib/donation-content'
import type { ShopSettings } from '@/lib/shop-content'
import type { FaqSettings, FaqItem } from '@/lib/faq-content'
import type { SocialPlatform } from '@/lib/footer-content'
const SOCIAL_PLATFORMS = [
  'github',
  'twitter',
  'x',
  'youtube',
  'discord',
  'facebook',
  'linkedin',
  'instagram',
  'tiktok',
  'telegram',
] as const


export default function SiteSettingsForm({
  initialHero,
  initialHeroEn,
  initialFooter,
  initialFooterEn,
  initialReviews,
  initialDonation,
  initialShop,
  initialFaq,
}: {
  initialHero: HeroContent
  initialHeroEn: HeroContent | null
  initialFooter: FooterContent
  initialFooterEn: FooterContent | null
  initialReviews: ReviewsSettings
  initialDonation: DonationSettings
  initialShop: ShopSettings
  initialFaq: FaqSettings
}) {
  const [hero, setHero] = useState<HeroContent>(initialHero)
  // DB-তে 'hero_en' না থাকলে ডিফল্ট ইংরেজি hero বসিয়ে দিচ্ছি (কড়া required নিয়মে
  // ইউজারকে প্রতি বার টাইপ করতে না হয়)
  const [heroEn, setHeroEn] = useState<HeroContent>(initialHeroEn ?? DEFAULT_HERO_EN)
  const [footer, setFooter] = useState<FooterContent>(initialFooter)
  // ইংরেজি footer — DB-তে 'footer_en' না থাকলে ডিফল্ট (socialLinks bn থেকেই দেখাবে, এখানে এডিট করব না)
  const [footerEn, setFooterEn] = useState<FooterContent>(initialFooterEn ?? DEFAULT_FOOTER_EN)
  const [reviews, setReviews] = useState<ReviewsSettings>(initialReviews)
  const [donation, setDonation] = useState<DonationSettings>(initialDonation)
  const [shop, setShop] = useState<ShopSettings>(initialShop)
  const [faq, setFaq] = useState<FaqSettings>(initialFaq)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const updateHero = (patch: Partial<HeroContent>) => {
    setHero((f) => ({ ...f, ...patch }))
    setSaved(false)
  }

  const updateHeroEn = (patch: Partial<HeroContent>) => {
    setHeroEn((f) => ({ ...f, ...patch }))
    setSaved(false)
  }

  const updateFooter = (patch: Partial<FooterContent>) => {
    setFooter((f) => ({ ...f, ...patch }))
    setSaved(false)
  }

  const updateFooterEn = (patch: Partial<FooterContent>) => {
    setFooterEn((f) => ({ ...f, ...patch }))
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

  const updateStatEn = (i: number, v: string) => {
    setHeroEn((f) => {
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
        body: JSON.stringify({ hero, heroEn, footer, footerEn, reviews, donation, shop, faq }),
      })
      if (res.ok) {
        setSaved(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'save failed')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'network error')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ═══ HERO (BN + EN side by side) ═══ */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Hero Section</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            বাম পাশে বাংলা, ডান পাশে ইংরেজি — দুটোই required।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Badge (বাংলা)</label>
            <input className="admin-input" value={hero.badge} onChange={(e) => updateHero({ badge: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Badge (English)</label>
            <input className="admin-input" value={heroEn.badge} onChange={(e) => updateHeroEn({ badge: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Heading (বাংলা)</label>
            <input className="admin-input" value={hero.heading} onChange={(e) => updateHero({ heading: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Heading (English)</label>
            <input className="admin-input" value={heroEn.heading} onChange={(e) => updateHeroEn({ heading: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Heading Highlight (বাংলা)</label>
            <input className="admin-input" value={hero.headingHighlight} onChange={(e) => updateHero({ headingHighlight: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Heading Highlight (English)</label>
            <input className="admin-input" value={heroEn.headingHighlight} onChange={(e) => updateHeroEn({ headingHighlight: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Subtitle (বাংলা)</label>
            <textarea className="admin-input" rows={3} value={hero.subtitle} onChange={(e) => updateHero({ subtitle: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Subtitle (English)</label>
            <textarea className="admin-input" rows={3} value={heroEn.subtitle} onChange={(e) => updateHeroEn({ subtitle: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Search placeholder (বাংলা)</label>
            <input className="admin-input" value={hero.searchPlaceholder} onChange={(e) => updateHero({ searchPlaceholder: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Search placeholder (English)</label>
            <input className="admin-input" value={heroEn.searchPlaceholder} onChange={(e) => updateHeroEn({ searchPlaceholder: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 space-y-3">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Primary CTA</p>
            <div>
              <label className="admin-label">Label (বাংলা)</label>
              <input className="admin-input" value={hero.cta1Label} onChange={(e) => updateHero({ cta1Label: e.target.value })} required />
            </div>
            <div>
              <label className="admin-label">Label (English)</label>
              <input className="admin-input" value={heroEn.cta1Label} onChange={(e) => updateHeroEn({ cta1Label: e.target.value })} required />
            </div>
            <div>
              <label className="admin-label">Href</label>
              <input className="admin-input font-mono text-sm" value={hero.cta1Href} onChange={(e) => updateHero({ cta1Href: e.target.value })} placeholder="/tutorials" required />
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 space-y-3">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Secondary CTA</p>
            <div>
              <label className="admin-label">Label (বাংলা)</label>
              <input className="admin-input" value={hero.cta2Label} onChange={(e) => updateHero({ cta2Label: e.target.value })} required />
            </div>
            <div>
              <label className="admin-label">Label (English)</label>
              <input className="admin-input" value={heroEn.cta2Label} onChange={(e) => updateHeroEn({ cta2Label: e.target.value })} required />
            </div>
            <div>
              <label className="admin-label">Href</label>
              <input className="admin-input font-mono text-sm" value={hero.cta2Href} onChange={(e) => updateHero({ cta2Href: e.target.value })} placeholder="/challenges" required />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 space-y-3">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Stat Labels (৪টা) — BN | EN</p>
          {hero.statLabels.map((label, i) => (
            <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <label className="admin-label">Stat {i + 1} (বাংলা)</label>
                <input className="admin-input" value={label} onChange={(e) => updateStat(i, e.target.value)} required />
              </div>
              <div>
                <label className="admin-label">Stat {i + 1} (English)</label>
                <input className="admin-input" value={heroEn.statLabels[i] ?? ''} onChange={(e) => updateStatEn(i, e.target.value)} required />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ REVIEWS SECTION ═══ */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Reviews Section</h2>

        <label className="flex items-start gap-3 cursor-pointer select-none rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-emerald-500 transition-colors">
          <input
            type="checkbox"
            checked={reviews.enabled}
            onChange={(e) => {
              setReviews({ enabled: e.target.checked })
              setSaved(false)
            }}
            className="mt-0.5 w-5 h-5 accent-emerald-500 cursor-pointer"
          />
          <span>
            <span className="block text-sm font-semibold text-slate-900 dark:text-white">
              হোমপেজে রিভিউ সেকশন দেখাও
            </span>
            <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">
              বন্ধ করলে &quot;লার্নাররা যা বলছেন&quot; সেকশনটা (রেটিং সারসংক্ষেপ, স্লাইডার ও রিভিউ ফর্মসহ) হোমপেজ থেকে পুরোপুরি লুকিয়ে যাবে। ডেটা ডিলিট হবে না — আবার চালু করলে সব ফিরে আসবে।
            </span>
          </span>
        </label>
      </section>

      {/* ═══ DONATION SECTION ═══ */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Donation Section</h2>

        <label className="flex items-start gap-3 cursor-pointer select-none rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-emerald-500 transition-colors">
          <input
            type="checkbox"
            checked={donation.enabled}
            onChange={(e) => {
              setDonation({ enabled: e.target.checked })
              setSaved(false)
            }}
            className="mt-0.5 w-5 h-5 accent-emerald-500 cursor-pointer"
          />
          <span>
            <span className="block text-sm font-semibold text-slate-900 dark:text-white">
              ডোনেট পেজে donation সেকশন দেখাও
            </span>
            <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">
              বন্ধ করলে donate পেজ থেকে bKash/Nagad/Rocket কার্ডগুলো (এবং সাথে Donate ট্যাব) লুকিয়ে যাবে। Shop ট্যাব আলাদা — সেটা আগের মতোই থাকবে। ডেটা ডিলিট হবে না।
            </span>
          </span>
        </label>
      </section>

      {/* ═══ SHOP SECTION ═══ */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Shop Section</h2>

        <label className="flex items-start gap-3 cursor-pointer select-none rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-emerald-500 transition-colors">
          <input
            type="checkbox"
            checked={shop.enabled}
            onChange={(e) => {
              setShop({ enabled: e.target.checked })
              setSaved(false)
            }}
            className="mt-0.5 w-5 h-5 accent-emerald-500 cursor-pointer"
          />
          <span>
            <span className="block text-sm font-semibold text-slate-900 dark:text-white">
              donate পেজে Shop সেকশন দেখাও
            </span>
            <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">
              বন্ধ করলে donate পেজ থেকে Shop ট্যাব ও affiliate products লুকিয়ে যাবে। Donation ট্যাব আলাদা — সেটা আগের মতোই থাকবে। ডেটা ডিলিট হবে না।
            </span>
          </span>
        </label>
      </section>

      {/* ═══ FAQ SECTION ═══ */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">FAQ Section</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              এখানে যা থাকবে সেটাই homepage-এর FAQ সেকশনে দেখাবে। সব প্রশ্ন মুছলে FAQ সেকশন homepage থেকে লুকাবে।
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFaq((f) => ({
                items: [...f.items, { q: '', a: '', qEn: '', aEn: '' } as FaqItem],
              }))
              setSaved(false)
            }}
            className="admin-btn-ghost shrink-0"
          >
            + Add FAQ
          </button>
        </div>

        {faq.items.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400 italic py-4 text-center">
            এখনো কোনো প্রশ্ন নেই।
          </p>
        )}

        <div className="space-y-3">
          {faq.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/20 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Question #{i + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFaq((f) => ({ items: f.items.filter((_, idx) => idx !== i) }))
                    setSaved(false)
                  }}
                  className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline"
                  aria-label="প্রশ্ন মুছুন"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">Question (বাংলা)</label>
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
                </div>
                <div>
                  <label className="admin-label">Question (English)</label>
                  <input
                    className="admin-input"
                    value={item.qEn ?? ''}
                    onChange={(e) => {
                      setFaq((f) => {
                        const items = [...f.items]
                        items[i] = { ...items[i], qEn: e.target.value }
                        return { items }
                      })
                      setSaved(false)
                    }}
                    placeholder="e.g. Is DevSchool really free?"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">Answer (বাংলা)</label>
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
                    placeholder="যেমন: হ্যাঁ, ১০০% ফ্রি।"
                    required
                  />
                </div>
                <div>
                  <label className="admin-label">Answer (English)</label>
                  <textarea
                    className="admin-input"
                    rows={3}
                    value={item.aEn ?? ''}
                    onChange={(e) => {
                      setFaq((f) => {
                        const items = [...f.items]
                        items[i] = { ...items[i], aEn: e.target.value }
                        return { items }
                      })
                      setSaved(false)
                    }}
                    placeholder="e.g. Yes, 100% free."
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Footer</h2>

        {/* Social links editor — DB array-driven */}
        <fieldset className="space-y-3 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <legend className="px-2 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Social Links (order / add / remove)
          </legend>
          <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1 mb-2">
            ↑↓ দিয়ে order বদলাও, × দিয়ে remove করো, নিচের dropdown থেকে নতুন platform যোগ করো।
          </p>

          {footer.socialLinks.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              এখনো কোনো social link নেই — নিচের dropdown থেকে যোগ করুন।
            </p>
          )}

          <div className="space-y-2">
            {footer.socialLinks.map((link, i) => (
              <div
                key={link.platform}
                className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2"
              >
                <span className="text-sm font-mono text-slate-700 dark:text-slate-300 capitalize w-24 shrink-0">
                  {link.platform}
                </span>
                <input
                  className="admin-input flex-1"
                  value={link.url}
                  placeholder={'https://' + link.platform + '.com/your-profile'}
                  onChange={(e) => {
                    const v = e.target.value
                    setFooter((f) => {
                      const links = [...f.socialLinks]
                      links[i] = { ...links[i], url: v }
                      return { ...f, socialLinks: links }
                    })
                    setSaved(false)
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setFooter((f) => {
                      if (i <= 0) return f
                      const links = [...f.socialLinks]
                      const tmp = links[i - 1]
                      links[i - 1] = links[i]
                      links[i] = tmp
                      return { ...f, socialLinks: links }
                    })
                    setSaved(false)
                  }}
                  disabled={i === 0}
                  aria-label="move up"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition shrink-0"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFooter((f) => {
                      if (i >= f.socialLinks.length - 1) return f
                      const links = [...f.socialLinks]
                      const tmp = links[i + 1]
                      links[i + 1] = links[i]
                      links[i] = tmp
                      return { ...f, socialLinks: links }
                    })
                    setSaved(false)
                  }}
                  disabled={i === footer.socialLinks.length - 1}
                  aria-label="move down"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition shrink-0"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFooter((f) => ({
                      ...f,
                      socialLinks: f.socialLinks.filter((_, idx) => idx !== i),
                    }))
                    setSaved(false)
                  }}
                  aria-label="remove"
                  className="p-1.5 rounded-lg text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-500/10 transition shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {(() => {
            const used = new Set(footer.socialLinks.map((s) => s.platform))
            const available = SOCIAL_PLATFORMS.filter((p) => !used.has(p))
            return (
              <div className="flex items-center gap-2 pt-1">
                <select
                  className="admin-input flex-1"
                  value=""
                  onChange={(e) => {
                    const platform = e.target.value as SocialPlatform
                    if (!platform) return
                    setFooter((f) => ({
                      ...f,
                      socialLinks: [
                        ...f.socialLinks,
                        { platform, url: 'https://' + platform + '.com' },
                      ],
                    }))
                    setSaved(false)
                  }}
                  disabled={available.length === 0}
                >
                  <option value="">
                    {available.length === 0 ? '— All platforms added —' : '+ Add platform...'}
                  </option>
                  {available.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )
          })()}
        </fieldset>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Copyright line (বাংলা, {'{year}'} = current year)</label>
            <input className="admin-input" value={footer.copyright} onChange={(e) => updateFooter({ copyright: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Copyright line (English)</label>
            <input className="admin-input" value={footerEn.copyright} onChange={(e) => updateFooterEn({ copyright: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Donate prompt (বাংলা)</label>
            <input className="admin-input" value={footer.donatePrompt} onChange={(e) => updateFooter({ donatePrompt: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Donate prompt (English)</label>
            <input className="admin-input" value={footerEn.donatePrompt} onChange={(e) => updateFooterEn({ donatePrompt: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="admin-label">Donate link label (বাংলা)</label>
            <input className="admin-input" value={footer.donateLinkLabel} onChange={(e) => updateFooter({ donateLinkLabel: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Donate link label (English)</label>
            <input className="admin-input" value={footerEn.donateLinkLabel} onChange={(e) => updateFooterEn({ donateLinkLabel: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="admin-label">Donate link href (shared)</label>
            <input className="admin-input font-mono text-sm" value={footer.donateLinkHref} onChange={(e) => updateFooter({ donateLinkHref: e.target.value })} data-href-anchor="1" placeholder="/donate" required />
          </div>
          <div>
            <label className="admin-label">Credit text (English, bottom strip)</label>
            <input className="admin-input" value={footerEn.creditText} onChange={(e) => updateFooterEn({ creditText: e.target.value })} />
          </div>
        </div>
      </section>

      {error && <div className="admin-error">{error}</div>}
      {saved && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Saved — cache invalidated, live site-এ আপডেট হয়ে গেছে
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="admin-btn">
          {loading ? 'Saving...' : 'Save settings'}
        </button>
      </div>
    </form>
  )
}
