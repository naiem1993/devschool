'use client'

import { useEffect, useRef, useState } from 'react'
import ReviewForm from './ReviewForm'

/** ================================================================
 *  HomeExtras — home page-এর নতুন সেকশনগুলো
 *  (HeroSection-এর পরে বসে; Categories/Popular/Latest অপরিবর্তিত থাকে)
 *  header/menu কোনোভাবেই touch করে না।
 * ================================================================ */

const ROADMAP = [
  { num: '১', title: 'ভিত্তি গড়ুন', desc: 'HTML, CSS, JavaScript — একদম শুরু থেকে।' },
  { num: '২', title: 'ফ্রেমওয়ার্ক শিখুন', desc: 'React ও Next.js দিয়ে মডার্ন অ্যাপ বানান।' },
  { num: '৩', title: 'ব্যাকএন্ড ও ডেটাবেজ', desc: 'API, Node.js, SQL — পূর্ণ স্ট্যাক দক্ষতা।' },
  { num: '৪', title: 'পোর্টফোলিও + ইন্টারভিউ', desc: 'প্রজেক্ট বানিয়ে জব-রেডি পোর্টফোলিও সাজান।' },
]

export type ReviewItem = {
  id: string
  name: string
  role: string | null
  stars: number
  text: string
}

// FAQ items এখন admin panel থেকে আসে (SiteSettings key='faq') — এখানে কোনো hardcoded data নেই।

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.querySelectorAll<HTMLElement>('.reveal').forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.12 },
    )
    node.querySelectorAll<HTMLElement>('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}

export default function HomeExtras({
  reviews = [],
  reviewsCount = 0,
  reviewsAvg = 0,
  reviewsEnabled = true,
  faqItems = [],
  techItems = [],
}: {
  reviews?: ReviewItem[]
  reviewsCount?: number
  reviewsAvg?: number
  reviewsEnabled?: boolean
  faqItems?: { q: string; a: string }[]
  techItems?: string[]
}) {
  const wrapRef = useReveal()
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  // reviews সেকশন admin থেকে বন্ধ থাকলে পুরো block render হবে না (হুকস সব উপরে, তাই নিরাপদ)
  const reviewsOff = !reviewsEnabled
  // FAQ items খালি হলে পুরো FAQ সেকশন লুকাবে
  const faqOff = faqItems.length === 0
  // techItems (Category থেকে আসা) খালি হলে marquee লুকাবে
  const techOff = techItems.length === 0

  // ---- Reviews slider state ----
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const cardStep = () => {
    const el = trackRef.current
    if (!el) return 0
    const card = el.querySelector('figure')
    const w = card ? (card as HTMLElement).getBoundingClientRect().width + 14 : 0
    return w * 2
  }

  const syncSlider = () => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('figure')
    const w = card ? (card as HTMLElement).getBoundingClientRect().width + 14 : 0
    const step = w * 2
    const cols = w > 0 ? Math.max(1, Math.floor((el.clientWidth + 14) / w)) : 1
    const perPage = cols * 2
    setPageCount(Math.max(1, Math.ceil((reviews.length || 1) / perPage)))
    setPage(step > 0 ? Math.round(el.scrollLeft / step) : 0)
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    syncSlider()
    const ro = new ResizeObserver(() => syncSlider())
    ro.observe(el)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews.length])

  const scrollPrev = () => trackRef.current?.scrollBy({ left: -cardStep(), behavior: 'smooth' })
  const scrollNext = () => trackRef.current?.scrollBy({ left: cardStep(), behavior: 'smooth' })
  const scrollToPage = (i: number) =>
    trackRef.current?.scrollTo({ left: i * cardStep(), behavior: 'smooth' })

  return (
    <div ref={wrapRef}>
      {/* ================= MARQUEE ================= */}
      {!techOff && (
      <section className="border-y border-slate-200/70 dark:border-slate-800 py-8 marquee-wrap">
        <p className="text-center text-[10px] uppercase tracking-[.25em] text-slate-500 dark:text-slate-400 mb-6">
          যা শিখতে পারবেন
        </p>
        <div className="marquee-fade overflow-hidden">
          <div className="marquee-track text-lg font-bold text-slate-500 dark:text-slate-400">
            {techItems.map((t) => <span key={'a' + t}>{t}</span>)}
            {techItems.map((t) => <span key={'b' + t}>{t}</span>)}
          </div>
        </div>
      </section>
      )}

      {/* ================= BENTO — কেন DevSchool ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 reveal">
          <span className="text-[#15803D] dark:text-[#4ADE80] text-sm font-bold uppercase tracking-wider">কেন DevSchool</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">শেখার পুরো অভিজ্ঞতাটাই আলাদা</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">শুধু ভিডিও না — লিখুন, চালান, ভুল করুন, শিখুন।</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Featured */}
          <div className="md:col-span-2 gradient-border bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between reveal">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/15 text-[#15803D] dark:text-[#4ADE80] grid place-items-center mb-4">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m8 6-6 6 6 6M16 6l6 6-6 6" /></svg>
              </div>
              <h3 className="text-2xl font-bold">ব্রাউজারেই কোড চালান</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-md">
                কিছু ইনস্টল করার দরকার নেই। Try It Yourself-এ ক্লিক করে সাথে সাথে HTML, CSS, JS চালিয়ে ফলাফল দেখুন।
              </p>
            </div>
            <div className="mt-6 rounded-xl bg-[#0b0f0d] border border-white/10 p-4 font-mono text-sm text-[#4ADE80]">
              console.log(&quot;Hello!&quot;); <span className="text-slate-500">→ Hello!</span>
            </div>
          </div>

          {/* Small 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 reveal">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/15 text-amber-600 dark:text-amber-300 grid place-items-center mb-4">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" /></svg>
            </div>
            <h3 className="text-xl font-bold">প্রতিটা লেসনের কুইজ</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">পড়া শেষে ছোট কুইজ — যা শিখেছেন তা মাথায় গেঁথে যাবে।</p>
          </div>

          {/* Small 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 reveal">
            <div className="w-12 h-12 rounded-2xl bg-sky-400/15 text-sky-600 dark:text-sky-300 grid place-items-center mb-4">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2 4 7l8 5 8-5-8-5ZM4 17l8 5 8-5M4 12l8 5 8-5" /></svg>
            </div>
            <h3 className="text-xl font-bold">স্টেপ-বাই-স্টেপ ট্র্যাক</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">শূন্য থেকে জব-রেডি — সাজানো রোডম্যাপ ফলো করুন।</p>
          </div>

          {/* Small 3 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 reveal">
            <div className="w-12 h-12 rounded-2xl bg-purple-400/15 text-purple-600 dark:text-purple-300 grid place-items-center mb-4">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <h3 className="text-xl font-bold">প্রগ্রেস ট্র্যাকিং</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">কতদূর এগোলেন, কোথায় আটকে আছেন — সব এক জায়গায়।</p>
          </div>
        </div>
      </section>

      {/* ================= TIMELINE — ৪ ধাপে জব-রেডি ================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12 reveal">
          <span className="text-[#15803D] dark:text-[#4ADE80] text-sm font-bold uppercase tracking-wider">রোডম্যাপ</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">৪ ধাপে জব-রেডি</h2>
        </div>
        <div className="relative">
          <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#22C55E]/60 via-[#22C55E]/25 to-transparent" />
          <div className="space-y-8">
            {ROADMAP.map((step, i) => {
              const isRight = i % 2 === 1
              return (
                <div key={step.num} className={'relative flex reveal ' + (isRight ? 'md:justify-end' : 'md:justify-start')}>
                  <div className={'flex items-start gap-5 md:w-1/2 ' + (isRight ? 'md:flex-row-reverse md:text-right' : '')}>
                    <span
                      className={
                        'relative z-10 w-10 h-10 shrink-0 rounded-full grid place-items-center font-black ' +
                        (i === 0 || i === 3
                          ? 'bg-[#22C55E] text-[#04140a]'
                          : 'bg-[#22C55E]/20 text-[#15803D] dark:text-[#4ADE80]')
                      }
                    >
                      {step.num}
                    </span>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex-1">
                      <h3 className="font-bold">{step.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{step.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      {!reviewsOff && (
      <section className="border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 reveal">
            লার্নাররা যা বলছেন
          </h2>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-10 reveal">
            {reviewsCount} জন শিক্ষার্থীর অভিজ্ঞতা
          </p>

          {reviews.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-10">
              এখনো কোনো অনুমোদিত রিভিউ নেই — প্রথম রিভিউটি আপনিই দিন! ✍️
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-5 items-stretch">
              {/* বাম: রেটিং সারসংক্ষেপ */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-center h-full reveal">
                <div className="text-5xl font-extrabold tracking-tight leading-none">
                  {reviewsAvg.toFixed(1)}
                </div>
                <div className="text-[#22C55E] text-lg tracking-wide mt-2">
                  {'★'.repeat(Math.round(reviewsAvg))}
                  {'☆'.repeat(5 - Math.round(reviewsAvg))}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {reviewsCount} জনের রিভিউ
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const cnt = reviews.filter((r) => r.stars === star).length
                    const pct = reviews.length ? (cnt / reviews.length) * 100 : 0
                    return (
                      <div key={star} className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="w-5 tabular-nums">{star}★</span>
                        <span className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <span className="block h-full bg-[#22C55E]" style={{ width: pct + '%' }} />
                        </span>
                        <span className="w-6 text-right tabular-nums">{cnt}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  🛡️ সব রিভিউ যাচাই করা হয়েছে
                </div>
              </div>

              {/* ডান: স্লাইডার */}
              <div className="relative min-w-0 h-full flex flex-col reveal">
                <div className="flex justify-end gap-2 mb-3">
                  <button
                    type="button"
                    onClick={scrollPrev}
                    disabled={atStart}
                    aria-label="আগের রিভিউ"
                    className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid place-items-center text-slate-600 dark:text-slate-300 hover:border-[#22C55E] hover:text-[#22C55E] disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={scrollNext}
                    disabled={atEnd}
                    aria-label="পরের রিভিউ"
                    className="w-10 h-10 rounded-full border-2 border-[#22C55E]/50 bg-white dark:bg-slate-800 grid place-items-center text-xl font-bold text-[#22C55E] hover:bg-[#22C55E] hover:text-[#050806] hover:border-[#22C55E] disabled:opacity-25 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    ›
                  </button>
                </div>

                <div
                  ref={trackRef}
                  onScroll={syncSlider}
                  className="flex-1 min-w-0 grid grid-rows-2 grid-flow-col auto-cols-[calc(50%-7px)] gap-3.5 overflow-x-auto overflow-y-hidden [scroll-snap-type:x_mandatory] [scroll-behavior:smooth] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {reviews.map((r) => (
                    <figure
                      key={r.id}
                      className="min-w-0 scroll-snap-align-start bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-2.5 hover:border-[#22C55E] transition"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[#22C55E] text-2xl leading-none opacity-50 font-serif">&ldquo;</span>
                        <span className="text-[#22C55E] text-xs tracking-wide">
                          {'★'.repeat(r.stars)}
                          {'☆'.repeat(5 - r.stars)}
                        </span>
                      </div>
                      <blockquote className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-4">
                        {r.text}
                      </blockquote>
                      <figcaption className="mt-auto flex items-center gap-2.5 pt-1">
                        <span className="w-8 h-8 rounded-full bg-[#22C55E]/15 text-[#22C55E] grid place-items-center font-bold text-xs shrink-0">
                          {r.name.trim().charAt(0).toUpperCase()}
                        </span>
                        <span className="min-w-0">
                          <span className="font-bold text-sm block truncate">
                            {r.name} <span className="text-[#22C55E]">✓</span>
                          </span>
                          {r.role && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                              {r.role}
                            </span>
                          )}
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>

                {pageCount > 1 && (
                  <div className="flex justify-center gap-1.5 mt-3.5">
                    {Array.from({ length: pageCount }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={'পেজ ' + (i + 1)}
                        onClick={() => scrollToPage(i)}
                        className={
                          'h-1.5 rounded-full transition-all ' +
                          (i === page ? 'w-5 bg-[#22C55E]' : 'w-1.5 bg-slate-300 dark:bg-slate-700')
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= REVIEW FORM (CTA) — রিভিউয়ের সাথেই ================= */}
        <div className="max-w-3xl mx-auto mt-2 mb-2 reveal">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-3">
            এখনো আপনার মতামত দেননি?
          </p>
          <ReviewForm />
        </div>
      </section>
      )}

      {/* ================= FAQ ================= */}
      {!faqOff && (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight mb-10 reveal">সাধারণ প্রশ্ন</h2>
        <div className="space-y-3">
          {faqItems.map((item, i) => {
            const open = openIdx === i
            return (
              <div
                key={item.q}
                className={'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden ' + (open ? 'acc-open' : '')}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold"
                >
                  {item.q}
                  <span className="acc-icon text-[#15803D] dark:text-[#4ADE80] text-xl">+</span>
                </button>
                <div className="acc-body px-5 text-sm text-slate-600 dark:text-slate-400">
                  <p className="pb-5">{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
      )}

      {/* ================= FINAL CTA ================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <div className="gradient-border bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 reveal">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">আজই শুরু করুন — একদম ফ্রি</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3">কোনো কার্ড লাগবে না, কোনো ট্রায়াল নেই। শুধু শেখা।</p>
          <a
            href="/courses"
            className="inline-block mt-7 px-8 py-4 rounded-2xl bg-[#22C55E] text-[#04140a] font-bold hover:scale-105 hover:bg-[#4ADE80] transition"
          >
            🚀 এখনই শুরু করুন
          </a>
        </div>
      </section>
    </div>
  )
}
