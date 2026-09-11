'use client'

import { motion, type Transition } from 'framer-motion'
import Link from 'next/link'
import HomeSearch from './HomeSearch'

const transition: Transition = { duration: 0.6, ease: 'easeOut' }

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

interface HeroSectionProps {
  tutorials: any[]
  stats: {
    languageCount: number
    tutorialCount: number
    quizCount: number
    challengeCount: number
  }
}

export default function HeroSection({ tutorials, stats }: HeroSectionProps) {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-[#0b0f19] text-white py-20 lg:py-28 text-center border-b border-slate-800"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6"
        >
          ✨ আপনামার প্োরোগ্রামিং ক্যারিয়া গড়া বিশ্বস্তু প্ল্যাটফর্ম
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-6xl font-black tracking-tight leading-tight"
        >
          আধুনিক প্রযুক্তি শিখুন, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            নিজের গতিকে মাস্টার হন
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal"
        >
          ইনটরঅ্যাকটিভ টিউটোরিয়াল, রিয়াল-ওয়ার্ল্ড প্রজেক্ট, কোড চ্যালেঞ্জ ও কুইজের মাধ্যমে হাতে-কলমে কোডিং শিখুন।
        </motion.p>

        <motion.div variants={fadeUp}>
          <HomeSearch tutorials={tutorials} />
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/categories"
            className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all duration-200"
          >
            🚀 টিউটোরিয়াল ব্রাউজ করুন
          </Link>
          <Link
            href="/challenges"
            className="px-7 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-2xl font-bold border border-slate-700 hover:scale-105 transition-all duration-200"
          >
            ⚡ কোড চ্যালেঞ্জ ট্রাই করুন
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-800/80 pt-8"
        >
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-4">
            <div className="text-3xl font-extrabold text-indigo-400">{stats.languageCount}+</div>
            <div className="text-xs text-slate-400 mt-1">প্রোগ্রামিং ভাষা ও তেকনোলজি</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-4">
            <div className="text-3xl font-extrabold text-purple-400">{stats.tutorialCount}+</div>
            <div className="text-xs text-slate-400 mt-1">ডিটেইলড টিউটোরিয়াল</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-4">
            <div className="text-3xl font-extrabold text-pink-400">{stats.quizCount}+</div>
            <div className="text-xs text-slate-400 mt-1">ইনটরঅ্যাকটিভ কুইজ</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-4">
            <div className="text-3xl font-extrabold text-emerald-400">{stats.challengeCount}+</div>
            <div className="text-xs text-slate-400 mt-1">প্র্যাকটিস চ্যালেঞ্জ</div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
