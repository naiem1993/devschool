'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ─────────────────────────────────────────────────────────────
//  সীমা
// ─────────────────────────────────────────────────────────────

/** প্রতি ছবির সর্বোচ্চ সাইজ */
const MAX_FILE_BYTES = 12 * 1024 * 1024 // 12 MB
/** সব ছবি মিলিয়ে সর্বোচ্চ সাইজ */
const MAX_TOTAL_BYTES = 60 * 1024 * 1024 // 60 MB
/** একবারে সর্বোচ্চ কতটি ছবি */
const MAX_FILES = 50
/** এর চেয়ে বড় মাপ হলে ছোট করে আনা হবে (মেমরি রক্ষা) */
const MAX_DIMENSION = 5000 // px
/** JPEG কম্প্রেশন কোয়ালিটি */
const JPEG_QUALITY = 0.92

/** ⚠️ SVG ইচ্ছাকৃতভাবে বাদ — ভেতরে <script>/onload থাকতে পারে */
type AllowedMime = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp'

const MIME_LABEL: Record<AllowedMime, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'image/gif': 'GIF',
  'image/webp': 'WEBP',
}

type PageMode = 'image' | 'a4'

type Item = {
  id: string
  name: string
  sizeBytes: number
  mime: AllowedMime
  /** object URL — unmount বা remove-এ revoke করতে হবে */
  previewUrl: string
  width: number
  height: number
}

// A4 (points, 72 dpi)
const A4_W = 595.28
const A4_H = 841.89
const A4_MARGIN = 24

const FILE_INPUT_ID = 'image-to-pdf-file-input'

// ─────────────────────────────────────────────────────────────
//  হেল্পার
// ─────────────────────────────────────────────────────────────

function formatBytes(n: number): string {
  if (n < 1024) return n + ' B'
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB'
  return (n / (1024 * 1024)).toFixed(2) + ' MB'
}

/**
 * ফাইলের আসল ফরম্যাট magic number থেকে চেনে — file.type-এর উপর ভরসা নয়।
 * কেউ .png নাম দিয়ে HTML/EXE পাঠালেও ধরা পড়বে।
 */
function sniffImageType(bytes: Uint8Array): AllowedMime | null {
  if (bytes.length < 12) return null
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) return 'image/png'
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg'
  // GIF: 47 49 46 38 (GIF8)
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return 'image/gif'
  // WEBP: RIFF .... WEBP
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return 'image/webp'
  return null
}

function makeId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch {
    /* ignore */
  }
  return Math.random().toString(36).slice(2) + '-' + Date.now().toString(36)
}

/** ডাউনলোড ফাইলের নাম নিরাপদ করা — path traversal / অবৈধ অক্ষর বাদ */
function sanitizeBaseName(name: string): string {
  const withoutExt = name.replace(/\.[^.]+$/, '')
  const cleaned = withoutExt.replace(/[^a-zA-Z0-9\u0980-\u09FF _-]/g, '').trim().slice(0, 60)
  return cleaned || 'converted'
}

/** object URL থেকে ছবি লোড — onerror হ্যান্ডেল করা, নইলে প্রমিস আটকে থাকত */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('ছবিটি পড়া গেল না (ক্ষতিগ্রস্ত বা অসমর্থিত)'))
    img.src = src
  })
}

/**
 * 🔒 নিরাপত্তার মূল ধাপ: ছবিটা Canvas-এ আবার আঁকা হয়।
 * এতে EXIF মেটাডেটা ও ছবির ভেতরে লুকানো যেকোনো পেলোড মুছে যায় —
 * PDF-এ শুধু বিশুদ্ধ পিক্সেল যায়। বড় মাপ হলে এখানেই ছোট করা হয়।
 */
function rasterize(img: HTMLImageElement): HTMLCanvasElement {
  let w = img.naturalWidth || img.width
  let h = img.naturalHeight || img.height
  if (!w || !h) throw new Error('ছবির মাপ পাওয়া যায়নি')

  if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(w, h)
    w = Math.max(1, Math.round(w * scale))
    h = Math.max(1, Math.round(h * scale))
  }

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas সমর্থিত নয় — অন্য ব্রাউজারে চেষ্টা করুন')

  // স্বচ্ছ (transparent) অংশ সাদা করে দাও, নইলে JPEG-এ কালো হয়ে যায়
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)
  return canvas
}

// ─────────────────────────────────────────────────────────────
//  স্টাইল
// ─────────────────────────────────────────────────────────────

const BTN =
  'rounded-xl border px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40 disabled:cursor-not-allowed disabled:opacity-40'
const BTN_GHOST =
  BTN + ' border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f0c] text-slate-700 dark:text-slate-200 hover:border-[#22C55E] hover:text-[#22C55E]'
const BTN_PRIMARY =
  BTN + ' border-[#22C55E] bg-[#22C55E] text-black hover:brightness-110'
const TOGGLE_BASE =
  'rounded-xl px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40'

// ─────────────────────────────────────────────────────────────
//  কম্পোনেন্ট
// ─────────────────────────────────────────────────────────────

export default function ImageToPdfTool() {
  const [items, setItems] = useState<Item[]>([])
  const [mode, setMode] = useState<PageMode>('a4')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')
  const [dragging, setDragging] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)
  // সব object URL ট্র্যাক করি — unmount/remove-এ revoke করার জন্য (মেমরি লিক ঠেকাতে)
  const urlsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const urls = urlsRef.current
    return () => {
      urls.forEach((u) => {
        try {
          URL.revokeObjectURL(u)
        } catch {
          /* ignore */
        }
      })
      urls.clear()
    }
  }, [])

  const totalBytes = useMemo(
    () => items.reduce((sum, it) => sum + it.sizeBytes, 0),
    [items]
  )

  // ── ফাইল যোগ ─────────────────────────────────────────────
  const addFiles = useCallback(async (picked: File[]) => {
    setError('')
    setDone('')

    const room = MAX_FILES - items.length
    if (room <= 0) {
      setError('সর্বোচ্চ ' + MAX_FILES + ' টি ছবি যোগ করা যাবে।')
      return
    }

    const batch = picked.slice(0, room)
    if (picked.length > room) {
      setError('শুধু প্রথম ' + room + ' টি ছবি যোগ করা হলো (সর্বোচ্চ ' + MAX_FILES + ')।')
    }

    const accepted: Item[] = []
    let runningTotal = items.reduce((s, it) => s + it.sizeBytes, 0)

    for (const file of batch) {
      if (file.size === 0) continue

      if (file.size > MAX_FILE_BYTES) {
        setError('"' + file.name + '" অনেক বড় (' + formatBytes(file.size) + ')। সর্বোচ্চ ' + formatBytes(MAX_FILE_BYTES) + '।')
        continue
      }
      if (runningTotal + file.size > MAX_TOTAL_BYTES) {
        setError('মোট সাইজের সীমা (' + formatBytes(MAX_TOTAL_BYTES) + ') ছাড়িয়ে যাবে — বাকি ছবি বাদ দেওয়া হলো।')
        break
      }

      try {
        const buf = await file.arrayBuffer()
        const bytes = new Uint8Array(buf)

        // ⚠️ file.type-এর উপর ভরসা না করে আসল magic bytes যাচাই
        const sniffed = sniffImageType(bytes)
        if (!sniffed) {
          setError('"' + file.name + '" অনুমোদিত ছবি নয়। শুধু PNG, JPEG, GIF বা WEBP (SVG নিরাপত্তার কারণে বাদ)।')
          continue
        }

        const url = URL.createObjectURL(file)
        const img = await loadImage(url)

        urlsRef.current.add(url)
        accepted.push({
          id: makeId(),
          name: file.name,
          sizeBytes: file.size,
          mime: sniffed,
          previewUrl: url,
          width: img.naturalWidth || 0,
          height: img.naturalHeight || 0,
        })
        runningTotal += file.size
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      }
    }

    if (accepted.length > 0) {
      setItems((prev) => prev.concat(accepted))
    }
    if (inputRef.current) inputRef.current.value = ''
  }, [items])

  // ── সরানো / মুছে ফেলা ────────────────────────────────────
  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id)
      if (target) {
        try {
          URL.revokeObjectURL(target.previewUrl)
        } catch {
          /* ignore */
        }
        urlsRef.current.delete(target.previewUrl)
      }
      return prev.filter((it) => it.id !== id)
    })
    setDone('')
  }

  const moveItem = (index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = prev.slice()
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      const tmp = next[index]
      next[index] = next[target]
      next[target] = tmp
      return next
    })
    setDone('')
  }

  const clearAll = () => {
    items.forEach((it) => {
      try {
        URL.revokeObjectURL(it.previewUrl)
      } catch {
        /* ignore */
      }
      urlsRef.current.delete(it.previewUrl)
    })
    setItems([])
    setError('')
    setDone('')
    setProgress(0)
  }

  // ── PDF তৈরি ─────────────────────────────────────────────
  const buildPdf = useCallback(async () => {
    if (items.length === 0 || busy) return
    setBusy(true)
    setError('')
    setDone('')
    setProgress(0)

    try {
      // jspdf শুধু দরকারের সময় লোড হয় — বান্ডল হালকা থাকে
      const { jsPDF } = await import('jspdf')

      let pdf: InstanceType<typeof jsPDF> | null = null

      for (let i = 0; i < items.length; i++) {
        const it = items[i]
        const img = await loadImage(it.previewUrl)
        const canvas = rasterize(img) // 🔒 EXIF/পেলোড মুছে ফেলা হলো

        let pageW: number
        let pageH: number
        let imgW: number
        let imgH: number
        let x: number
        let y: number

        if (mode === 'image') {
          pageW = canvas.width
          pageH = canvas.height
          imgW = canvas.width
          imgH = canvas.height
          x = 0
          y = 0
        } else {
          pageW = A4_W
          pageH = A4_H
          const availW = pageW - A4_MARGIN * 2
          const availH = pageH - A4_MARGIN * 2
          const scale = Math.min(availW / canvas.width, availH / canvas.height)
          imgW = canvas.width * scale
          imgH = canvas.height * scale
          x = (pageW - imgW) / 2
          y = (pageH - imgH) / 2
        }

        if (!pdf) {
          pdf = new jsPDF({
            orientation: pageW > pageH ? 'landscape' : 'portrait',
            unit: 'pt',
            format: [pageW, pageH],
            compress: true,
          })
        } else {
          pdf.addPage([pageW, pageH], pageW > pageH ? 'landscape' : 'portrait')
        }

        pdf.addImage(canvas, 'JPEG', x, y, imgW, imgH, undefined, 'FAST')
        setProgress(Math.round(((i + 1) / items.length) * 100))
      }

      if (!pdf) throw new Error('কোনো পেজ তৈরি হয়নি')

      const base = items.length === 1 ? sanitizeBaseName(items[0].name) : 'images'
      pdf.save(base + '.pdf')
      setDone('✓ PDF ডাউনলোড হয়েছে (' + items.length + ' পেজ)')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
      setProgress(0)
    }
  }, [items, mode, busy])

  const atLimit = items.length >= MAX_FILES

  return (
    <div className="space-y-4">
      {/* ─── Toolbar ─── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-3">
        <label
          htmlFor={FILE_INPUT_ID}
          aria-disabled={busy || atLimit}
          className={
            BTN_PRIMARY + ' cursor-pointer ' + (busy || atLimit ? 'pointer-events-none opacity-40' : '')
          }
        >
          📁 ছবি বাছুন
        </label>

        <div
          role="group"
          aria-label="পেজের ধরন"
          className="inline-flex rounded-xl border border-slate-200 dark:border-white/10 p-0.5"
        >
          <button
            type="button"
            onClick={() => setMode('a4')}
            aria-pressed={mode === 'a4'}
            className={
              TOGGLE_BASE + ' ' + (mode === 'a4' ? 'bg-[#22C55E] text-black' : 'text-slate-600 dark:text-slate-300 hover:text-[#22C55E]')
            }
          >
            A4 পেজ
          </button>
          <button
            type="button"
            onClick={() => setMode('image')}
            aria-pressed={mode === 'image'}
            className={
              TOGGLE_BASE + ' ' + (mode === 'image' ? 'bg-[#22C55E] text-black' : 'text-slate-600 dark:text-slate-300 hover:text-[#22C55E]')
            }
          >
            ছবির মাপ
          </button>
        </div>

        <span className="hidden flex-1 sm:block" />

        <button
          type="button"
          onClick={buildPdf}
          disabled={items.length === 0 || busy}
          className={BTN_PRIMARY}
        >
          {busy ? '⏳ ' + progress + '%' : '📄 PDF বানান'}
        </button>
        <button type="button" onClick={clearAll} disabled={items.length === 0 || busy} className={BTN_GHOST}>
          ✕ Clear
        </button>

        <input
          ref={inputRef}
          id={FILE_INPUT_ID}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          multiple
          className="sr-only"
          onChange={(e) => {
            const picked = Array.from(e.target.files || [])
            if (picked.length) void addFiles(picked)
          }}
        />
      </div>

      {/* ─── Drop zone / list ─── */}
      {items.length === 0 ? (
        <label
          htmlFor={FILE_INPUT_ID}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            const dropped = Array.from(e.dataTransfer.files || [])
            if (dropped.length) void addFiles(dropped)
          }}
          className={
            'flex h-[300px] cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-6 text-center transition ' +
            (dragging
              ? 'border-[#22C55E] bg-[#22C55E]/10'
              : 'border-slate-300 bg-white dark:border-white/10 dark:bg-[#0a0f0c]')
          }
        >
          <span className="text-5xl" aria-hidden>
            🖼️➜📄
          </span>
          <p className="text-sm font-semibold">এখানে ছবি টেনে ছাড়ুন</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            অথবা এই বক্সে ক্লিক করে <span className="font-semibold text-[#22C55E]">ছবি বাছুন</span>
          </p>
          <p className="font-mono text-[10px] text-slate-400">
            PNG · JPEG · GIF · WEBP — প্রতিটি সর্বোচ্চ {formatBytes(MAX_FILE_BYTES)}, মোট {formatBytes(MAX_TOTAL_BYTES)}
          </p>
          <p className="font-mono text-[10px] text-slate-400">সর্বোচ্চ {MAX_FILES} টি ছবি · ক্রম অনুযায়ী PDF পেজ হবে</p>
        </label>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c]">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 px-4 py-2.5">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]/60" />
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {items.length} / {MAX_FILES} · {formatBytes(totalBytes)}
            </span>
          </div>

          <ul className="divide-y divide-slate-200 dark:divide-white/5">
            {items.map((it, i) => (
              <li key={it.id} className="flex items-center gap-3 p-3">
                <span className="w-6 shrink-0 text-center font-mono text-xs text-slate-400">{i + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.previewUrl}
                  alt={it.name}
                  className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 object-cover dark:border-white/10"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{it.name}</p>
                  <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                    {MIME_LABEL[it.mime]} · {it.width}×{it.height} · {formatBytes(it.sizeBytes)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(i, -1)}
                    disabled={i === 0 || busy}
                    aria-label="উপরে নাও"
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 transition hover:border-[#22C55E] hover:text-[#22C55E] disabled:opacity-30 dark:border-white/10 dark:text-slate-400"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(i, 1)}
                    disabled={i === items.length - 1 || busy}
                    aria-label="নিচে নাও"
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 transition hover:border-[#22C55E] hover:text-[#22C55E] disabled:opacity-30 dark:border-white/10 dark:text-slate-400"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    disabled={busy}
                    aria-label="মুছে ফেলো"
                    className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-500 transition hover:border-red-500 hover:bg-red-500/10 disabled:opacity-30 dark:border-red-500/30"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {items.length < MAX_FILES && (
            <label
              htmlFor={FILE_INPUT_ID}
              className="block cursor-pointer border-t border-dashed border-slate-200 px-4 py-3 text-center text-xs font-semibold text-slate-500 transition hover:text-[#22C55E] dark:border-white/10 dark:text-slate-400"
            >
              + আরও ছবি যোগ করুন
            </label>
          )}
        </div>
      )}

      {/* ─── Status ─── */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-3.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span
            role="status"
            aria-live="polite"
            className={
              'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ' +
              (error
                ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                : done
                  ? 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#15803d] dark:text-[#22C55E]'
                  : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400')
            }
          >
            {error ? '✕ সমস্যা' : done ? done : items.length ? 'প্রস্তুত' : 'অপেক্ষায়'}
          </span>

          <span className="text-slate-500 dark:text-slate-400">
            ছবি <b className="text-slate-800 dark:text-slate-200">{items.length}</b>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            মোট <b className="text-slate-800 dark:text-slate-200">{formatBytes(totalBytes)}</b>
          </span>

          <span className="ml-auto hidden text-[11px] text-slate-400 sm:block">
            🔒 ছবি আপনার ব্রাউজার ছাড়ে না · EXIF মেটাডেটা বাদ দেওয়া হয়
          </span>
        </div>

        {error && (
          <p className="mt-2.5 break-words font-mono text-[12px] text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </div>
  )
}
