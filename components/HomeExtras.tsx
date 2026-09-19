'use client'

import { useEffect, useRef, useState } from 'react'

/** ================================================================
 *  HomeExtras — home page-এর নতুন সেকশনগুলো
 *  (HeroSection-এর পরে বসে; Categories/Popular/Latest অপরিবর্তিত থাকে)
 *  header/menu কোনোভাবেই touch করে না।
 * ================================================================ */

const TECH = ['HTML5', 'CSS3', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Python', 'SQL', 'Tailwind', 'Git']

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

const FAQ = [
  { q: 'DevSchool কি সত্যিই ফ্রি?', a: 'হ্যাঁ, ১০০% ফ্রি। কোনো কার্ড, কোনো ট্রায়াল, কোনো লুকানো চার্জ নেই।' },
  { q: 'একদম নতুন, তাও পারব?', a: 'অবশ্যই। কোর্স একদম শূন্য থেকে — HTML-এর নামও না জানলেও চলবে।' },
  { q: 'কিছু ইনস্টল করতে হবে?', a: 'না। ব্রাউজারের ভেতরেই লাইভ এডিটর আছে — লিখুন আর সাথে সাথে ফলাফল দেখুন।' },
]

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

export default function HomeExtras({ reviews = [] }: { reviews?: ReviewItem[] }) {
  const wrapRef = useReveal()
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div ref={wrapRef}>
      {/* ================= MARQUEE ================= */}
      <section className="border-y border-slate-200/70 dark:border-slate-800 py-8 marquee-wrap">
        <p className="text-center text-[10px] uppercase tracking-[.25em] text-slate-500 dark:text-slate-400 mb-6">
          যা শিখতে পারবেন
        </p>
        <div className="marquee-fade overflow-hidden">
          <div className="marquee-track text-lg font-bold text-slate-500 dark:text-slate-400">
            {TECH.map((t) => <span key={'a' + t}>{t}</span>)}
            {TECH.map((t) => <span key={'b' + t}>{t}</span>)}
          </div>
        </div>
      </section>

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
      <section className="border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight mb-12 reveal">
            লার্নাররা যা বলছেন
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <figure
                key={r.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 reveal"
              >
                <div className="text-[#15803D] dark:text-[#4ADE80]">{'★'.repeat(r.stars)}</div>
                <blockquote className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">&quot;{r.text}&quot;</blockquote>
                <figcaption className="mt-4 text-sm">
                  <b>{r.name}</b>
                  <span className="text-slate-500 dark:text-slate-400"> · {r.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight mb-10 reveal">সাধারণ প্রশ্ন</h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => {
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

      {/* ================= FINAL CTA ================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <div className="gradient-border bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 reveal">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">আজই শুরু করুন — একদম ফ্রি</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3">কোনো কার্ড লাগবে না, কোনো ট্রায়াল নেই। শুধু শেখা।</p>
          <a
            href="/categories"
            className="inline-block mt-7 px-8 py-4 rounded-2xl bg-[#22C55E] text-[#04140a] font-bold hover:scale-105 hover:bg-[#4ADE80] transition"
          >
            🚀 এখনই শুরু করুন
          </a>
        </div>
      </section>
    </div>
  )
}
