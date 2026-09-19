'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, type Transition } from 'framer-motion'
import Link from 'next/link'
import HomeSearch from './HomeSearch'
import { DEFAULT_HERO, type HeroContent } from '@/lib/hero-content'

const transition: Transition = { duration: 0.6, ease: 'easeOut' }
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition },
}
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

interface HeroSectionProps {
  hero?: HeroContent
  tutorials: any[]
  stats: {
    languageCount: number
    tutorialCount: number
    quizCount: number
    challengeCount: number
  }
}

type FileKey = 'html' | 'css' | 'js'

const INITIAL_CODE: Record<FileKey, string> = {
  html: '<h1>হ্যালো, DevSchool! 👋</h1>\n<p>আমি কোডিং শিখছি।</p>',
  css: 'body { background:#0b0f0d; color:#e6edf3; font-family:Hind Siliguri,system-ui,sans-serif; padding:14px; margin:0 }\nh1 { color:#4ADE80; font-size:26px; margin:0 0 8px }\np { color:#94a3b8; margin:0 }',
  js: 'console.log("Hello, DevSchool!");',
}

/** Live preview iframe — নিরাপদে HTML doc build করে, output always dark */
function buildDoc(html: string, css: string, js: string) {
  const closing = '</scr' + 'ipt>'
  const opening = '<scr' + 'ipt>'
  return (
    '<!doctype html><html><head><meta charset="utf-8">' +
    '<style>html,body{background:#0b0f0d;color:#e6edf3}' +
    'body{font-family:Hind Siliguri,system-ui,-apple-system,sans-serif;padding:14px;margin:0}' +
    css +
    '</style></head><body>' +
    html +
    opening + js + closing +
    '</body></html>'
  )
}

export default function HeroSection({ hero = DEFAULT_HERO, tutorials, stats }: HeroSectionProps) {
  const statValues = [
    `${stats.languageCount}+`,
    `${stats.tutorialCount}+`,
    `${stats.quizCount}+`,
    `${stats.challengeCount}+`,
  ]

  const [activeTab, setActiveTab] = useState<FileKey>('html')
  const [code, setCode] = useState<Record<FileKey, string>>(INITIAL_CODE)
  const [docSrc, setDocSrc] = useState('')
  const [typedText, setTypedText] = useState('')
  const [prefersReduced, setPrefersReduced] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // 1) Live preview — টাইপ করলে সাথে সাথে আপডেট
  useEffect(() => {
    setDocSrc(buildDoc(code.html, code.css, code.js))
  }, [code])

  // 2) motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const h = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  // 3) typing terminal — শুধু motion allowed হলে
  useEffect(() => {
    if (prefersReduced) { setTypedText('npm create devschool@latest'); return }
    const lines = ['npm create devschool@latest', 'শেখা শুরু হোক 🚀']
    let li = 0, ci = 0, del = false
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      const cur = lines[li]
      setTypedText(cur.slice(0, ci))
      if (!del && ci < cur.length) ci++
      else if (!del && ci === cur.length) { del = true; timer = setTimeout(tick, 1700); return }
      else if (del && ci > 0) ci--
      else { del = false; li = (li + 1) % lines.length }
      timer = setTimeout(tick, del ? 38 : 72)
    }
    tick()
    return () => clearTimeout(timer)
  }, [prefersReduced])

  // 4) particle canvas — hero-র মধ্যে সীমাবদ্ধ, mobile-friendly
  useEffect(() => {
    if (prefersReduced) return
    const c = canvasRef.current
    if (!c) return
    const x = c.getContext('2d')
    if (!x) return

    const isDark = () => document.documentElement.classList.contains('dark')
    const dotRGB = () => (isDark() ? '34,197,94' : '22,163,74')
    let w = 0, h = 0
    let ps: { x: number; y: number; vx: number; vy: number; r: number }[] = []
    const COUNT = window.innerWidth < 768 ? 14 : 36

    const size = () => {
      const parent = c.parentElement
      if (!parent) return
      w = c.width = parent.clientWidth
      h = c.height = parent.clientHeight
    }
    const make = () => {
      ps = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.8 + 0.7,
      }))
    }
    size(); make()

    let rt: ReturnType<typeof setTimeout>
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { size(); make() }, 150) }
    window.addEventListener('resize', onResize)

    let raf = 0
    const loop = () => {
      x.clearRect(0, 0, w, h)
      const rgb = dotRGB()
      ps.forEach((p) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7)
        x.fillStyle = 'rgba(' + rgb + ',.55)'; x.fill()
      })
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j]
          const dx = a.x - b.x, dy = a.y - b.y
          if (Math.abs(dx) > 130 || Math.abs(dy) > 130) continue
          const d = Math.hypot(dx, dy)
          if (d < 130) {
            x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y)
            x.strokeStyle = 'rgba(' + rgb + ',' + (0.14 * (1 - d / 130)).toFixed(3) + ')'
            x.lineWidth = 1; x.stroke()
          }
        }
      }
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [prefersReduced])

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative overflow-hidden bg-gradient-to-b from-[#F2FBF4] via-[#F2FBF4] to-[#E8F7ED] dark:from-[#050806] dark:via-[#050806] dark:to-[#050806] text-slate-900 dark:text-white pt-28 pb-20 lg:pt-32 lg:pb-28 border-b border-emerald-200/70 dark:border-slate-800"
    >
      {/* aurora orbs */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {/* top-center glow — pill nav-এর ঠিক পেছনে, যাতে nav-এ blend করে */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[820px] max-w-[110vw] h-[260px] rounded-full bg-[#22C55E]/10 dark:bg-[#22C55E]/18 blur-[100px]" />
        <span className="aurora-orb aurora-orb-1" />
        <span className="aurora-orb aurora-orb-2" />
        <span className="aurora-orb aurora-orb-3" />
      </div>

      {/* particle canvas */}
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" />

      {/* radial glow */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#22C55E]/25 dark:from-[#22C55E]/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
        {/* ---------- LEFT: copy ---------- */}
        <div className="text-center lg:text-left">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#15803D] dark:text-[#4ADE80] text-xs font-semibold mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            {hero.badge}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"
          >
            {hero.heading}{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#15803D] via-[#16A34A] to-[#15803D] dark:from-[#86EFAC] dark:via-[#4ADE80] dark:to-[#22C55E] bg-clip-text text-transparent">
              {hero.headingHighlight}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div variants={fadeUp}>
            <HomeSearch tutorials={tutorials} placeholder={hero.searchPlaceholder} />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
            <Link
              href={hero.cta1Href}
              className="px-6 py-3.5 bg-[#22C55E] hover:bg-[#4ADE80] text-[#04140a] rounded-2xl font-bold shadow-lg shadow-[#22C55E]/30 hover:scale-[1.04] transition-all duration-200"
            >
              {hero.cta1Label}
            </Link>
            <Link
              href={hero.cta2Href}
              className="px-6 py-3.5 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold border border-slate-200 dark:border-slate-700 hover:scale-[1.04] transition-all duration-200"
            >
              {hero.cta2Label}
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex -space-x-2">
              <span className="w-8 h-8 rounded-full bg-[#22C55E]/25 ring-2 ring-[#F2FBF4] dark:ring-[#050806] grid place-items-center text-xs">👨‍💻</span>
              <span className="w-8 h-8 rounded-full bg-sky-500/25 ring-2 ring-[#F2FBF4] dark:ring-[#050806] grid place-items-center text-xs">👩‍💻</span>
              <span className="w-8 h-8 rounded-full bg-purple-500/25 ring-2 ring-[#F2FBF4] dark:ring-[#050806] grid place-items-center text-xs">🧑‍💻</span>
            </div>
            <span className="text-slate-700 dark:text-slate-200 font-semibold">DevSchool কমিউনিটি</span>
          </motion.div>
        </div>

        {/* ---------- RIGHT: live editor ---------- */}
        <motion.div variants={fadeUp} className="relative w-full">
          {/* terminal strip */}
          <div className="rounded-2xl overflow-hidden mb-4 bg-[#0b0f0d] border border-white/10">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[.02]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/80" />
              <span className="ml-2 text-[11px] font-mono text-[#5c6b7a]">devschool — bash</span>
            </div>
            <div className="px-4 py-3 font-mono text-[12.5px] text-[#4ADE80]">
              <span className="text-[#22C55E]">➜</span>{' '}
              <span className="caret">{typedText}</span>
            </div>
          </div>

          {/* live editor panel */}
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-[#22C55E]/10 bg-[#0b0f0d] border border-white/10">
            <div className="flex items-center justify-between px-3 pt-3 pb-2 gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                {(['html', 'css', 'js'] as FileKey[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setActiveTab(f)}
                    className={
                      'font-semibold text-[11px] font-mono px-2.5 py-1.5 rounded-lg border transition ' +
                      (activeTab === f
                        ? 'bg-[#22C55E]/15 text-[#4ADE80] border-[#22C55E]/40'
                        : 'border-white/10 text-[#5c6b7a] hover:text-[#8b98a5]')
                    }
                  >
                    {f === 'html' ? 'index.html' : f === 'css' ? 'style.css' : 'app.js'}
                  </button>
                ))}
              </div>
              <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-[#5c6b7a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> লাইভ
              </span>
            </div>

            <div className="px-4 pb-2">
              <textarea
                value={code[activeTab]}
                onChange={(e) => setCode({ ...code, [activeTab]: e.target.value })}
                spellCheck={false}
                className="w-full h-[150px] resize-none outline-none bg-transparent border-0 text-[#c9d5e1] font-mono text-[12.5px] leading-relaxed"
              />
            </div>

            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono text-[#5c6b7a]">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#22C55E]">▸</span> OUTPUT
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]/70" />
                </span>
              </div>
              <iframe
                title="Live preview"
                sandbox="allow-scripts"
                srcDoc={docSrc}
                className="w-full h-[140px] rounded-xl bg-[#0b0f0d] border border-white/5"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ---------- STATS ---------- */}
      <motion.div
        variants={fadeUp}
        className="relative z-10 mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {statValues.map((v, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center"
          >
            <div className="text-3xl font-extrabold text-[#15803D] dark:text-[#4ADE80]">{v}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hero.statLabels[i]}</div>
          </div>
        ))}
      </motion.div>

      {/* ---------- SEARCH (below hero, above stats? we keep under CTA area) ---------- */}

    </motion.section>
  )
}
