'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useDict } from '@/lib/i18n/I18nProvider'

// ─────────────────────────────────────────────────────────────
//  হেল্পার — রঙের গণিত (কোনো লাইব্রেরি ছাড়া)
// ─────────────────────────────────────────────────────────────

type RGB = { r: number; g: number; b: number }
type HSL = { h: number; s: number; l: number }

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

/** #abc / #aabbcc / aabbcc → #AABBCC ; অবৈধ হলে null */
function normalizeHex(input: string): string | null {
  let s = input.trim().replace(/^#/, '')
  if (/^[0-9a-fA-F]{3}$/.test(s)) {
    s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2)
  }
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return null
  return '#' + s.toUpperCase()
}

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

function rgbToHex(c: RGB): string {
  const part = (v: number) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')
  return ('#' + part(c.r) + part(c.g) + part(c.b)).toUpperCase()
}

function rgbToHsl(c: RGB): HSL {
  const rr = c.r / 255
  const gg = c.g / 255
  const bb = c.b / 255
  const max = Math.max(rr, gg, bb)
  const min = Math.min(rr, gg, bb)
  const l = (max + min) / 2
  const d = max - min
  let h = 0
  let s = 0
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) * 60
    else if (max === gg) h = ((bb - rr) / d + 2) * 60
    else h = ((rr - gg) / d + 4) * 60
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h: number, s: number, l: number): RGB {
  const hh = ((h % 360) + 360) % 360
  const ss = clamp(s, 0, 100) / 100
  const ll = clamp(l, 0, 100) / 100
  const c = (1 - Math.abs(2 * ll - 1)) * ss
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1))
  const m = ll - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (hh < 60) { r = c; g = x; b = 0 }
  else if (hh < 120) { r = x; g = c; b = 0 }
  else if (hh < 180) { r = 0; g = c; b = x }
  else if (hh < 240) { r = 0; g = x; b = c }
  else if (hh < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

function relativeLuminance(c: RGB): number {
  const f = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b)
}

function contrastRatio(a: RGB, b: RGB): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** WCAG অনুযায়ী রেটিং — AAA/AA/Fail টেকনিক্যাল টার্ম, ইংরেজিতেই থাকে */
function wcagLabel(ratio: number): { text: string; ok: boolean } {
  if (ratio >= 7) return { text: 'AAA', ok: true }
  if (ratio >= 4.5) return { text: 'AA', ok: true }
  if (ratio >= 3) return { text: 'AA Large', ok: false }
  return { text: 'Fail', ok: false }
}

const DEFAULT_HEX = '#22C55E'

// ─────────────────────────────────────────────────────────────
//  ছোট কম্পোনেন্ট
// ─────────────────────────────────────────────────────────────

function CopyChip({ value, label, copyAria }: { value: string; label: string; copyAria: string }) {
  const [done, setDone] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setDone(true)
      if (timer.current !== null) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setDone(false), 1500)
    } catch {
      /* ব্রাউজার অনুমতি দেয়নি — চুপচাপ */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copyAria.replace('{label}', label)}
      className="rounded-lg border border-slate-200 dark:border-white/10 px-2 py-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 transition hover:border-[#22C55E] hover:text-[#22C55E]"
    >
      {done ? '✓' : '⧉'}
    </button>
  )
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  suffix: string
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <label htmlFor={id} className="font-semibold text-slate-600 dark:text-slate-300">
          {label}
        </label>
        <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
          {value}{suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#22C55E] dark:bg-white/10"
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  মূল কম্পোনেন্ট
// ─────────────────────────────────────────────────────────────

export default function ColorPickerTool() {
  const dict = useDict()
  const t = dict.toolUi.color

  const [hex, setHex] = useState(DEFAULT_HEX)
  const [draft, setDraft] = useState(DEFAULT_HEX)
  const [draftBad, setDraftBad] = useState(false)

  const rgb = useMemo(() => hexToRgb(hex), [hex])
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb])

  const onWhite = useMemo(() => contrastRatio(rgb, { r: 255, g: 255, b: 255 }), [rgb])
  const onBlack = useMemo(() => contrastRatio(rgb, { r: 0, g: 0, b: 0 }), [rgb])
  const textOnColor = onBlack >= onWhite ? '#000000' : '#FFFFFF'

  const commitDraft = (raw: string) => {
    setDraft(raw)
    const norm = normalizeHex(raw)
    if (norm) {
      setHex(norm)
      setDraftBad(false)
    } else {
      setDraftBad(raw.trim().length > 0)
    }
  }

  const applyHex = (next: string) => {
    setHex(next)
    setDraft(next)
    setDraftBad(false)
  }

  const setChannel = (key: 'r' | 'g' | 'b', value: number) => {
    applyHex(rgbToHex({ ...rgb, [key]: value }))
  }

  const setHsl = (key: 'h' | 's' | 'l', value: number) => {
    const next = { ...hsl, [key]: value }
    applyHex(rgbToHex(hslToRgb(next.h, next.s, next.l)))
  }

  const shades = useMemo(() => {
    const list: string[] = []
    for (let l = 95; l >= 5; l -= 10) {
      list.push(rgbToHex(hslToRgb(hsl.h, hsl.s, l)))
    }
    return list
  }, [hsl.h, hsl.s])

  const harmony = useMemo(() => {
    const comp = rgbToHex(hslToRgb(hsl.h + 180, hsl.s, hsl.l))
    const a1 = rgbToHex(hslToRgb(hsl.h - 30, hsl.s, hsl.l))
    const a2 = rgbToHex(hslToRgb(hsl.h + 30, hsl.s, hsl.l))
    return { comp, a1, a2 }
  }, [hsl.h, hsl.s, hsl.l])

  const randomize = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    applyHex(rgbToHex({ r, g, b }))
  }

  const hexOut = hex
  const rgbOut = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')'
  const hslOut = 'hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)'

  const chipClass =
    'rounded-xl border border-slate-200 dark:border-white/10 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:border-[#22C55E] hover:text-[#22C55E]'

  return (
    <div className="space-y-4">
      {/* ─── Toolbar ─── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-3">
        <input
          type="color"
          value={hex}
          onChange={(e) => applyHex(e.target.value.toUpperCase())}
          aria-label={t.pickerAria}
          className="h-11 w-14 cursor-pointer rounded-xl border border-slate-200 bg-transparent p-0.5 dark:border-white/10"
        />

        <div className="flex items-center gap-2">
          <label htmlFor="hex-input" className="sr-only">HEX</label>
          <input
            id="hex-input"
            type="text"
            value={draft}
            onChange={(e) => commitDraft(e.target.value)}
            onBlur={() => { if (!normalizeHex(draft)) commitDraft(hex) }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            maxLength={7}
            placeholder="#22C55E"
            aria-invalid={draftBad}
            className={
              'w-32 rounded-xl border bg-white px-3 py-2 font-mono text-sm uppercase tracking-wider outline-none transition dark:bg-[#050806] ' +
              (draftBad
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-slate-200 text-slate-900 focus:border-[#22C55E] dark:border-white/10 dark:text-slate-100')
            }
          />
        </div>

        <button type="button" onClick={randomize} className={chipClass}>
          {t.randomBtn}
        </button>
        <button type="button" onClick={() => applyHex(DEFAULT_HEX)} className={chipClass}>
          {t.resetBtn}
        </button>

        <span className="hidden flex-1 sm:block" />

        <span className="font-mono text-[11px] text-slate-400">
          {draftBad ? t.invalidBadge : t.validBadge}
        </span>
      </div>

      {/* ─── Main grid ─── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Preview + sliders */}
        <div className="space-y-4">
          <div
            className="flex h-[180px] flex-col items-center justify-center gap-1 rounded-3xl border border-slate-200 dark:border-white/5"
            style={{ backgroundColor: hex, color: textOnColor }}
          >
            <span className="font-mono text-3xl font-bold tracking-wider">{hex}</span>
            <span className="font-mono text-xs opacity-80">{rgbOut}</span>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">RGB</p>
            <Slider id="rgb-r" label="Red" value={rgb.r} min={0} max={255} suffix="" onChange={(v) => setChannel('r', v)} />
            <Slider id="rgb-g" label="Green" value={rgb.g} min={0} max={255} suffix="" onChange={(v) => setChannel('g', v)} />
            <Slider id="rgb-b" label="Blue" value={rgb.b} min={0} max={255} suffix="" onChange={(v) => setChannel('b', v)} />
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">HSL</p>
            <Slider id="hsl-h" label="Hue" value={hsl.h} min={0} max={360} suffix="°" onChange={(v) => setHsl('h', v)} />
            <Slider id="hsl-s" label="Saturation" value={hsl.s} min={0} max={100} suffix="%" onChange={(v) => setHsl('s', v)} />
            <Slider id="hsl-l" label="Lightness" value={hsl.l} min={0} max={100} suffix="%" onChange={(v) => setHsl('l', v)} />
          </div>
        </div>

        {/* Formats + contrast + palette */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c]">
            <div className="border-b border-slate-200 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-white/5">
              {t.formatLabel}
            </div>
            <div className="divide-y divide-slate-200 dark:divide-white/5">
              {[{ k: 'HEX', v: hexOut }, { k: 'RGB', v: rgbOut }, { k: 'HSL', v: hslOut }].map((row) => (
                <div key={row.k} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{row.k}</p>
                    <p className="truncate font-mono text-sm text-slate-900 dark:text-slate-100">{row.v}</p>
                  </div>
                  <CopyChip value={row.v} label={row.k} copyAria={t.copyAriaTpl} />
                </div>
              ))}
            </div>
          </div>

          {/* Contrast */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.contrastLabel}</p>
            <div className="grid grid-cols-2 gap-3">
              {[{ id: 'white', name: t.contrastOnWhite, ratio: onWhite }, { id: 'black', name: t.contrastOnBlack, ratio: onBlack }].map((c) => {
                const badge = wcagLabel(c.ratio)
                return (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-slate-200 p-3 dark:border-white/10"
                    style={{
                      backgroundColor: c.id === 'white' ? '#FFFFFF' : '#000000',
                      color: hex,
                    }}
                  >
                    <p className="text-[10px] font-semibold opacity-70">{c.name}</p>
                    <p className="font-mono text-lg font-bold tabular-nums">{c.ratio.toFixed(2)}</p>
                    <p className="text-[10px] font-bold">{badge.text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Palette */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.shadesLabel}</p>
            <div className="flex overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
              {shades.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => applyHex(s)}
                  title={s}
                  aria-label={t.selectAriaTpl.replace('{v}', s)}
                  className="h-12 flex-1 transition hover:scale-y-110"
                  style={{ backgroundColor: s }}
                />
              ))}
            </div>

            <p className="mb-3 mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.harmonyLabel}</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: t.harmonyComp, value: harmony.comp },
                { label: t.harmonyA1, value: harmony.a1 },
                { label: t.harmonyA2, value: harmony.a2 },
              ].map((h) => (
                <button
                  key={h.label}
                  type="button"
                  onClick={() => applyHex(h.value)}
                  className="overflow-hidden rounded-2xl border border-slate-200 text-left transition hover:border-[#22C55E] dark:border-white/10"
                >
                  <span className="block h-10 w-full" style={{ backgroundColor: h.value }} />
                  <span className="block px-2 py-1.5">
                    <span className="block text-[9px] font-semibold text-slate-500 dark:text-slate-400">{h.label}</span>
                    <span className="block font-mono text-[11px] text-slate-900 dark:text-slate-100">{h.value}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
