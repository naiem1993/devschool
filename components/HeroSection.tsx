'use client'

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
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

interface HeroSectionProps {
  /** Admin → Site Settings থেকে আসা content। না পেলে default। */
  hero?: HeroContent
  tutorials: any[]
  stats: {
    languageCount: number
    tutorialCount: number
    quizCount: number
    challengeCount: number
  }
}

export default function HeroSection({ hero = DEFAULT_HERO, tutorials, stats }: HeroSectionProps) {
  const statValues = [
    `${stats.languageCount}+`,
    `${stats.tutorialCount}+`,
    `${stats.quizCount}+`,
    `${stats.challengeCount}+`,
  ]

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative overflow-hidden bg-gradient-to-b from-[#F2FBF4] via-[#F2FBF4] to-[#E8F7ED] dark:from-[#050806] dark:via-[#050806] dark:to-[#050806] text-slate-900 dark:text-white py-20 lg:py-28 text-center border-b border-emerald-200/70 dark:border-slate-800"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#22C55E]/25 dark:from-[#22C55E]/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#15803D] dark:text-[#4ADE80] text-xs font-semibold mb-6"
        >
          {hero.badge}
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-6xl font-black tracking-tight leading-tight"
        >
          {hero.heading} <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#15803D] dark:from-[#86EFAC] dark:via-[#4ADE80] dark:to-[#22C55E] bg-clip-text text-transparent">
            {hero.headingHighlight}
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div variants={fadeUp}>
          <HomeSearch tutorials={tutorials} placeholder={hero.searchPlaceholder} />
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link
            href={hero.cta1Href}
            className="px-7 py-3.5 bg-[#22C55E] hover:bg-[#4ADE80] text-[#04140a] rounded-2xl font-bold shadow-lg shadow-[#22C55E]/30 hover:scale-105 transition-all duration-200"
          >
            {hero.cta1Label}
          </Link>
          <Link
            href={hero.cta2Href}
            className="px-7 py-3.5 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all duration-200"
          >
            {hero.cta2Label}
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800/80 pt-8"
        >
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="text-3xl font-extrabold text-[#16A34A] dark:text-[#4ADE80]">{statValues[0]}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hero.statLabels[0]}</div>
          </div>
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="text-3xl font-extrabold text-[#15803D] dark:text-[#34D399]">{statValues[1]}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hero.statLabels[1]}</div>
          </div>
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="text-3xl font-extrabold text-[#22C55E] dark:text-[#22C55E]">{statValues[2]}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hero.statLabels[2]}</div>
          </div>
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{statValues[3]}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hero.statLabels[3]}</div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
