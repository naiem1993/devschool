#!/usr/bin/env node
/**
 * DevSchool brand-color migration script
 * ─────────────────────────────────────────
 * একবার চালালেই পুরো codebase-এ:
 *   1. indigo/*  → Neon Green #22C55E (brand)
 *   2. purple/*  → Neon Green #22C55E
 *   3. #00ff88   → #22C55E  (admin hacker-login বাদে)
 *
 * নিরাপদ কারণ:
 *   • compound rule আগে, generic পরে — তাই `bg-indigo-600 text-white` →
 *     `bg-[#22C55E] text-[#050806]` (white text সবুজে অদৃশ্য হবে না)
 *   • .bak ফাইল ও node_modules skip
 *   • app/admin/login/page.tsx ছোঁবে না (hacker terminal theme)
 *
 * চালাও:  npm run fix:colors
 * শুকনো রান: npm run fix:colors -- --dry
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, extname, relative } from 'node:path'

const ROOT = process.cwd()
const DRY = process.argv.includes('--dry')

const TARGET_DIRS = ['app', 'components']
const EXTS = new Set(['.tsx', '.ts', '.jsx', '.js', '.mjs', '.css'])
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build'])

// এই ফাইলে #00ff88 ইচ্ছাকৃত (hacker terminal theme) — ছোঁব না
const HACKER_FILES = ['app/admin/login/page.tsx']

/* ────────────────────────────────────────────────
   RULES — ক্রম গুরুত্বপূর্ণ (compound আগে)
   ──────────────────────────────────────────────── */
const RULES = [
  /* ═══ SOLID BUTTONS — white text → dark text ═══ */
  [/bg-indigo-600 hover:bg-indigo-500 text-white/g, 'bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806]'],
  [/bg-indigo-600 text-white/g, 'bg-[#22C55E] text-[#050806]'],
  [/bg-indigo-500 text-white/g, 'bg-[#22C55E] text-[#050806]'],
  [/bg-indigo-600/g, 'bg-[#22C55E]'],
  [/hover:bg-indigo-500/g, 'hover:bg-[#4ADE80]'],
  [/hover:bg-indigo-600/g, 'hover:bg-[#4ADE80]'],

  /* ═══ SOFT CHIPS / TINTS ═══ */
  [/bg-indigo-50 dark:bg-indigo-950\/50/g, 'bg-[#22C55E]/10 dark:bg-[#22C55E]/10'],
  [/hover:bg-indigo-100 dark:hover:bg-indigo-950/g, 'hover:bg-[#22C55E]/20 dark:hover:bg-[#22C55E]/20'],
  [/hover:bg-indigo-100/g, 'hover:bg-[#22C55E]/20'],
  [/hover:bg-indigo-50/g, 'hover:bg-[#22C55E]/10'],
  [/bg-indigo-500\/10/g, 'bg-[#22C55E]/10'],
  [/bg-indigo-500\/5/g, 'bg-[#22C55E]/5'],
  [/bg-indigo-100/g, 'bg-[#22C55E]/15'],

  /* ═══ BORDERS ═══ */
  [/border-indigo-600/g, 'border-[#22C55E]'],
  [/border-indigo-500\/20/g, 'border-[#22C55E]/20'],
  [/hover:border-indigo-300 dark:hover:border-indigo-700/g, 'hover:border-[#22C55E]/60 dark:hover:border-[#22C55E]/60'],
  [/hover:border-indigo-400/g, 'hover:border-[#22C55E]'],
  [/hover:border-indigo-300/g, 'hover:border-[#22C55E]/60'],
  [/focus:border-indigo-500/g, 'focus:border-[#22C55E]'],
  [/focus:border-indigo-400/g, 'focus:border-[#22C55E]'],
  [/border-indigo-400/g, 'border-[#22C55E]'],

  /* ═══ RINGS ═══ */
  [/focus:ring-indigo-500\/20/g, 'focus:ring-[#22C55E]/20'],
  [/focus:ring-indigo-500\/10/g, 'focus:ring-[#22C55E]/10'],
  [/ring-indigo-500/g, 'ring-[#22C55E]'],

  /* ═══ TEXT (compound আগে, তারপর generic) ═══ */
  [/hover:text-indigo-600 dark:hover:text-indigo-400/g, 'hover:text-[#22C55E] dark:hover:text-[#4ADE80]'],
  [/group-hover:text-indigo-600 dark:group-hover:text-indigo-400/g, 'group-hover:text-[#22C55E] dark:group-hover:text-[#4ADE80]'],
  [/text-indigo-600 dark:text-indigo-400/g, 'text-[#15803d] dark:text-[#4ADE80]'],
  [/text-indigo-700 dark:text-indigo-400/g, 'text-[#15803d] dark:text-[#4ADE80]'],
  [/hover:text-indigo-600/g, 'hover:text-[#22C55E]'],
  [/group-hover:text-indigo-600/g, 'group-hover:text-[#22C55E]'],
  [/text-indigo-700/g, 'text-[#15803d]'],
  [/text-indigo-600/g, 'text-[#15803d]'],
  [/text-indigo-400/g, 'text-[#4ADE80]'],

  /* ═══ PURPLE ═══ */
  [/text-purple-600 dark:text-purple-400/g, 'text-[#15803d] dark:text-[#4ADE80]'],
  [/text-purple-600/g, 'text-[#15803d]'],
  [/text-purple-400/g, 'text-[#4ADE80]'],
  [/bg-purple-500\/10/g, 'bg-[#22C55E]/10'],
  [/bg-purple-500\/5/g, 'bg-[#22C55E]/5'],
  [/bg-purple-600/g, 'bg-[#22C55E]'],
  [/hover:bg-purple-500/g, 'hover:bg-[#4ADE80]'],
]

/* #00ff88 → brand green (login ছাড়া সবখানে) */
const OLD_GREEN = /#00ff88/gi
const NEW_GREEN = '#22C55E'

/* ────────────────────────────────────────────────
   WALK
   ──────────────────────────────────────────────── */
let scanned = 0
let touched = 0
const report = []

function walk(dir) {
  let entries
  try { entries = readdirSync(dir) } catch { return }
  for (const name of entries) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (SKIP_DIRS.has(name)) continue
      walk(full)
      continue
    }
    if (!EXTS.has(extname(name))) continue
    if (name.endsWith('.bak') || name.endsWith('.bak1') || name.endsWith('.bak2')) continue
    processFile(full)
  }
}

function processFile(file) {
  scanned++
  const rel = relative(ROOT, file).replace(/\\/g, '/')
  const isHacker = HACKER_FILES.some((f) => rel.endsWith(f))

  const before = readFileSync(file, 'utf8')
  let after = before

  for (const [re, to] of RULES) after = after.replace(re, to)

  if (!isHacker) after = after.replace(OLD_GREEN, NEW_GREEN)

  if (after !== before) {
    const n = countDiff(before, after)
    touched++
    report.push(`  ✔ ${rel}  (${n} change${n === 1 ? '' : 's'})`)
    if (!DRY) writeFileSync(file, after, 'utf8')
  }
}

function countDiff(a, b) {
  // মোটামুটি: কতগুলো লাইনে পার্থক্য
  const la = a.split('\n'), lb = b.split('\n')
  const max = Math.max(la.length, lb.length)
  let d = 0
  for (let i = 0; i < max; i++) if (la[i] !== lb[i]) d++
  return d
}

/* ────────────────────────────────────────────────
   RUN
   ──────────────────────────────────────────────── */
console.log('\n🎨 DevSchool brand-color migration')
console.log(DRY ? '   (dry run — কিছুই লেখা হবে না)\n' : '\n')

for (const d of TARGET_DIRS) walk(join(ROOT, d))

if (report.length) {
  console.log('পরিবর্তিত ফাইল:')
  console.log(report.join('\n'))
} else {
  console.log('  — কিছু বদলানোর নেই, সব আগেই ঠিক আছে ✓')
}

console.log(
  `\n📊 স্ক্যান: ${scanned} ফাইল | পরিবর্তিত: ${touched} ফাইল`
)
if (DRY) console.log('   (dry run — চালাতে: npm run fix:colors)')
console.log('')
