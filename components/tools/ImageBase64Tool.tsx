'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDict } from '@/lib/i18n/I18nProvider'

// ─────────────────────────────────────────────────────────────
//  সীমা ও অনুমোদিত ফরম্যাট
// ─────────────────────────────────────────────────────────────

/** ফাইল সর্বোচ্চ সাইজ — Base64 ~33% বড় হয়, তাই এর বেশি নিলে ট্যাব হ্যাং করবে */
const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5 MB
/** ডিকোড মোডে Base64 স্ট্রিং-এর সর্বোচ্চ দৈর্ঘ্য */
const MAX_BASE64_CHARS = 8_000_000 // ~6 MB আসল ডেটা
/** একবারে কত byte → স্ট্রিং (stack overflow ঠেকাতে) */
const CHUNK_SIZE = 0x8000

/**
 * ফাইল ইনপুটের id — <label htmlFor> দিয়ে JS ছাড়াই ফাইল ডায়ালগ খোলে।
 * এটাই সবচেয়ে নির্ভরযোগ্য পথ: display:none ইনপুটে প্রোগ্রাম্যাটিক .click()
 * কিছু ব্রাউজারে (বিশেষত Safari) ব্লক হয়, কিন্তু label সব জায়গায় কাজ করে।
 */
const FILE_INPUT_ID = 'image-base64-file-input'

/** ⚠️ SVG ইচ্ছাকৃতভাবে বাদ — SVG-এর ভেতরে <script>/onload থাকতে পারে */
type AllowedMime = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp'
const MIME_LABEL: Record<AllowedMime, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'image/gif': 'GIF',
  'image/webp': 'WEBP',
}

type Mode = 'toBase64' | 'toImage'
type OutputKind = 'datauri' | 'raw'

// ─────────────────────────────────────────────────────────────
//  হেল্পার
// ─────────────────────────────────────────────────────────────

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * ফাইলের আসল ফরম্যাট magic number থেকে চেনে — file.type-এর উপর ভরসা নয়।
 * (কেউ .png নাম দিয়ে HTML/EXE পাঠালেও ধরা পড়বে)
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
  // GIF: 47 49 46 38 ("GIF8")
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return 'image/gif'
  // WEBP: "RIFF" .... "WEBP"
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return 'image/webp'
  return null
}

/** bytes → Base64 (টুকরো করে, যাতে বড় ফাইলে stack overflow না হয়) */
function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE))
  }
  return btoa(binary)
}

/** Base64 → bytes (ভ্যালিডেশন + প্যাডিং ঠিক করে) */
function base64ToBytes(input: string, msgs: { badLength: string; badChars: string }): Uint8Array {
  let normalized = input.replace(/\s+/g, '')

  // data URI হলে শুধু payload নাও
  const dataUriMatch = /^data:[^,]*;base64,(.*)$/i.exec(normalized)
  if (dataUriMatch) normalized = dataUriMatch[1]

  const remainder = normalized.length % 4
  if (remainder === 2) normalized += '=='
  else if (remainder === 3) normalized += '='
  else if (remainder === 1) throw new Error(msgs.badLength)

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
    throw new Error(msgs.badChars)
  }

  const binary = atob(normalized)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

// ─────────────────────────────────────────────────────────────
//  কম্পোনেন্ট
// ─────────────────────────────────────────────────────────────

const BTN =
  'rounded-xl border px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40 disabled:cursor-not-allowed disabled:opacity-40'
const BTN_GHOST = `${BTN} border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f0c] text-slate-700 dark:text-slate-200 hover:border-[#22C55E] hover:text-[#22C55E]`
const BTN_PRIMARY = `${BTN} border-[#22C55E] bg-[#22C55E] text-black hover:brightness-110`
const TOGGLE_BASE =
  'rounded-xl px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40'

export default function ImageBase64Tool() {
  const dict = useDict()
  const t = dict.toolUi.imageBase64
  const [mode, setMode] = useState<Mode>('toBase64')

  // toBase64 state
  const [file, setFile] = useState<File | null>(null)
  const [fileMime, setFileMime] = useState<AllowedMime | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [base64, setBase64] = useState('')
  const [outputKind, setOutputKind] = useState<OutputKind>('datauri')

  // toImage state
  const [base64Input, setBase64Input] = useState('')
  const [decodedUrl, setDecodedUrl] = useState('')
  const [decodedMime, setDecodedMime] = useState<AllowedMime | null>(null)
  const [decodedBytes, setDecodedBytes] = useState(0)

  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyTimer = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
    }
  }, [])

  // ── Image → Base64 ───────────────────────────────────────
  const handleFile = useCallback(async (picked: File) => {
    setError('')

    if (picked.size === 0) {
      setError(t.errEmptyFile)
      return
    }
    if (picked.size > MAX_FILE_BYTES) {
      setError(
        t.errTooBigTpl.replace('{size}', formatBytes(picked.size)).replace('{max}', formatBytes(MAX_FILE_BYTES))
      )
      return
    }

    setBusy(true)
    try {
      // ফাইল ব্রাউজারেই পড়া হয় — কোথাও পাঠানো হয় না
      const buffer = await picked.arrayBuffer()
      const bytes = new Uint8Array(buffer)

      // ⚠️ file.type-এর উপর ভরসা না করে আসল magic bytes যাচাই
      const sniffed = sniffImageType(bytes)
      if (!sniffed) {
        setError(
          t.errBadType
        )
        setFile(null)
        setFileMime(null)
        setPreviewUrl('')
        setBase64('')
        return
      }

      const dataUri = `data:${sniffed};base64,${bytesToBase64(bytes)}`

      setFile(picked)
      setFileMime(sniffed)
      setPreviewUrl(dataUri)
      setBase64(dataUri.split(',')[1] ?? '')
    } catch {
      setError(t.errReadFail)
    } finally {
      setBusy(false)
    }
  }, [])

  const clearImage = () => {
    setFile(null)
    setFileMime(null)
    setPreviewUrl('')
    setBase64('')
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  // ── Base64 → Image ───────────────────────────────────────
  const decodeInput = useCallback((raw: string) => {
    setError('')
    setDecodedUrl('')
    setDecodedMime(null)
    setDecodedBytes(0)

    const trimmed = raw.trim()
    if (!trimmed) return

    if (raw.length > MAX_BASE64_CHARS) {
      setError(t.errInputTooBigTpl.replace('{size}', formatBytes(raw.length)))
      return
    }

    try {
      const bytes = base64ToBytes(trimmed, { badLength: t.errBadLength, badChars: t.errBadChars })

      // ইউজারের দেওয়া MIME নয় — bytes থেকে নিজে চেনা হয়
      const sniffed = sniffImageType(bytes)
      if (!sniffed) {
        setError(t.errNotImageBase64)
        return
      }
      if (bytes.length > MAX_FILE_BYTES) {
        setError(t.errImageTooBigTpl.replace('{size}', formatBytes(bytes.length)))
        return
      }

      setDecodedUrl(`data:${sniffed};base64,${bytesToBase64(bytes)}`)
      setDecodedMime(sniffed)
      setDecodedBytes(bytes.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [])

  // ── কপি ─────────────────────────────────────────────────
  const copyText = async (text: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopied(false), 1500)
      setError('')
    } catch {
      setError(t.errClipboard)
    }
  }

  // ── ডেরাইভড ─────────────────────────────────────────────
  const outputText = useMemo(() => {
    if (!base64 || !fileMime) return ''
    return outputKind === 'datauri' ? `data:${fileMime};base64,${base64}` : base64
  }, [base64, fileMime, outputKind])

  const overhead = useMemo(() => {
    if (!file || !outputText) return 0
    return Math.round(((outputText.length - file.size) / file.size) * 100)
  }, [file, outputText])

  return (
    <div className="space-y-4">
      {/* ─── Mode toggle ─── */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-3">
        <div role="group" aria-label={t.modeAria} className="inline-flex rounded-xl border border-slate-200 dark:border-white/10 p-0.5">
          <button
            type="button"
            onClick={() => setMode('toBase64')}
            aria-pressed={mode === 'toBase64'}
            className={`${TOGGLE_BASE} ${mode === 'toBase64' ? 'bg-[#22C55E] text-black' : 'text-slate-600 dark:text-slate-300 hover:text-[#22C55E]'}`}
          >
            {t.tabToBase64}
          </button>
          <button
            type="button"
            onClick={() => setMode('toImage')}
            aria-pressed={mode === 'toImage'}
            className={`${TOGGLE_BASE} ${mode === 'toImage' ? 'bg-[#22C55E] text-black' : 'text-slate-600 dark:text-slate-300 hover:text-[#22C55E]'}`}
          >
            {t.tabToImage}
          </button>
        </div>

        {mode === 'toBase64' && fileMime && (
          <div role="group" aria-label={t.outputAria} className="inline-flex rounded-xl border border-slate-200 dark:border-white/10 p-0.5">
            <button
              type="button"
              onClick={() => setOutputKind('datauri')}
              aria-pressed={outputKind === 'datauri'}
              className={`${TOGGLE_BASE} ${outputKind === 'datauri' ? 'bg-[#22C55E] text-black' : 'text-slate-600 dark:text-slate-300 hover:text-[#22C55E]'}`}
            >
              Data URI
            </button>
            <button
              type="button"
              onClick={() => setOutputKind('raw')}
              aria-pressed={outputKind === 'raw'}
              className={`${TOGGLE_BASE} ${outputKind === 'raw' ? 'bg-[#22C55E] text-black' : 'text-slate-600 dark:text-slate-300 hover:text-[#22C55E]'}`}
            >
              Raw Base64
            </button>
          </div>
        )}

        <span className="hidden flex-1 sm:block" />

        {mode === 'toBase64' ? (
          <>
            <label
              htmlFor={FILE_INPUT_ID}
              aria-disabled={busy}
              className={`${BTN_PRIMARY} cursor-pointer ${busy ? 'pointer-events-none opacity-40' : ''}`}
            >
              {t.pickBtn}
            </label>
            <button
              type="button"
              onClick={() => copyText(outputText)}
              disabled={!outputText}
              className={BTN_GHOST}
            >
              {copied ? t.copiedDataUri : '⧉ Copy'}
            </button>
            <button type="button" onClick={clearImage} disabled={!file} className={BTN_GHOST}>
              {t.clearBtn}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => copyText(decodedUrl)}
              disabled={!decodedUrl}
              className={BTN_GHOST}
            >
              {copied ? t.copiedDataUri : t.copyDataUri}
            </button>
            <button
              type="button"
              onClick={() => {
                setBase64Input('')
                setDecodedUrl('')
                setDecodedMime(null)
                setDecodedBytes(0)
                setError('')
              }}
              disabled={!base64Input}
              className={BTN_GHOST}
            >
              {t.clearBtn}
            </button>
          </>
        )}

        {/*
          ফাইল ইনপুট — sr-only (display:none নয়), তাই Safari-তেও নিরাপদ।
          id-এর সাথে <label htmlFor> যুক্ত, তাই ব্রাউজার নিজেই ডায়ালগ খোলে।
        */}
        <input
          ref={inputRef}
          id={FILE_INPUT_ID}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          className="sr-only"
          onChange={(event) => {
            const picked = event.target.files?.[0]
            if (picked) void handleFile(picked)
            // একই ফাইল আবার বাছলেও যেন onChange আবার ফায়ার করে
            event.target.value = ''
          }}
        />
      </div>

      {/* ─── Panes ─── */}
      {mode === 'toBase64' ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Drop zone / preview */}
          <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c]">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 px-4 py-2.5">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]/60" />
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {fileMime ? MIME_LABEL[fileMime] : 'image'}
              </span>
            </div>

            {/* পুরো বক্সটাই label — তাই যেকোনো জায়গায় ক্লিক করলেই ফাইল ডায়ালগ খোলে */}
            <label
              htmlFor={FILE_INPUT_ID}
              onDragOver={(event) => {
                event.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault()
                setDragging(false)
                const dropped = event.dataTransfer.files?.[0]
                if (dropped) void handleFile(dropped)
              }}
              className={`flex h-[340px] cursor-pointer flex-col items-center justify-center gap-3 p-6 text-center transition ${
                dragging ? 'bg-[#22C55E]/10 ring-2 ring-inset ring-[#22C55E]' : ''
              }`}
            >
              {previewUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt={t.previewAlt}
                    className="max-h-[220px] max-w-full rounded-2xl border border-slate-200 object-contain dark:border-white/10"
                  />
                  {file && (
                    <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {file.name} · {formatBytes(file.size)}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <span className="text-5xl" aria-hidden>🖼️</span>
                  <p className="text-sm font-semibold">{t.dragTitle}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.dragOrClick}{' '}
                    <span className="font-semibold text-[#22C55E]">{t.pickLink}</span>
                  </p>
                  <p className="font-mono text-[10px] text-slate-400">
                    {t.formatsHintTpl.replace('{max}', formatBytes(MAX_FILE_BYTES))}
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Output */}
          <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c]">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 px-4 py-2.5">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]/60" />
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {outputKind === 'datauri' ? 'data-uri.txt' : 'base64.txt'}
              </span>
            </div>
            <pre className="h-[340px] overflow-auto whitespace-pre-wrap break-all p-4 font-mono text-[12px] leading-relaxed text-slate-900 dark:text-slate-100">
              {outputText || <span className="text-slate-400">{t.outPlaceholder}</span>}
            </pre>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Base64 input */}
          <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c]">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 px-4 py-2.5">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]/60" />
              </span>
              <span className="font-mono text-[10px] text-slate-400">base64.txt</span>
            </div>
            <textarea
              value={base64Input}
              onChange={(event) => {
                setBase64Input(event.target.value)
                decodeInput(event.target.value)
              }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              aria-label={t.decodeInputAria}
              placeholder={t.decodePlaceholder}
              className="h-[340px] w-full resize-y bg-transparent p-4 font-mono text-[12px] leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
          </div>

          {/* Decoded preview */}
          <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c]">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 px-4 py-2.5">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]/60" />
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {decodedMime ? MIME_LABEL[decodedMime] : 'preview'}
              </span>
            </div>
            <div className="flex h-[340px] flex-col items-center justify-center gap-3 p-6 text-center">
              {decodedUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={decodedUrl}
                    alt={t.decodedAlt}
                    className="max-h-[220px] max-w-full rounded-2xl border border-slate-200 object-contain dark:border-white/10"
                  />
                  <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {formatBytes(decodedBytes)} · {decodedMime ? MIME_LABEL[decodedMime] : ''}
                  </p>
                  <a
                    href={decodedUrl}
                    download={`decoded.${decodedMime === 'image/jpeg' ? 'jpg' : (decodedMime?.split('/')[1] ?? 'png')}`}
                    className="rounded-xl border border-[#22C55E] bg-[#22C55E]/10 px-4 py-2 text-xs font-semibold text-[#15803d] transition hover:bg-[#22C55E]/20 dark:text-[#22C55E]"
                  >
                    {t.downloadBtn}
                  </a>
                </>
              ) : (
                <>
                  <span className="text-5xl" aria-hidden>🖼️</span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.decodedPlaceholder}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Status ─── */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f0c] p-3.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span
            role="status"
            aria-live="polite"
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${
              error
                ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                : mode === 'toBase64'
                  ? fileMime
                    ? 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#15803d] dark:text-[#22C55E]'
                    : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                  : decodedUrl
                    ? 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#15803d] dark:text-[#22C55E]'
                    : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
            }`}
          >
            {error
              ? t.statusError
              : mode === 'toBase64'
                ? fileMime
                  ? '✓ রূপান্তর হয়েছে'
                  : 'অপেক্ষায়'
                : decodedUrl
                  ? '✓ ছবি পাওয়া গেছে'
                  : 'অপেক্ষায়'}
          </span>

          {mode === 'toBase64' && file && (
            <>
              <span className="text-slate-500 dark:text-slate-400">
                আসল <b className="text-slate-800 dark:text-slate-200">{formatBytes(file.size)}</b>
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Base64 <b className="text-slate-800 dark:text-slate-200">{formatBytes(outputText.length)}</b>
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                বাড়তি <b className="text-slate-800 dark:text-slate-200">+{overhead}%</b>
              </span>
            </>
          )}

          <span className="ml-auto hidden text-[11px] text-slate-400 sm:block">
            {t.privacyNote}
          </span>
        </div>

        {error && (
          <p className="mt-2.5 break-words font-mono text-[12px] text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </div>
  )
}
