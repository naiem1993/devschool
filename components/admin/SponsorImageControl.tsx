'use client'

import { useCallback, useRef, useState } from 'react'

/**
 * SponsorImageControl — genius-level image control.
 *
 * ৩টি mode:
 *  1. 📁 Upload (drag&drop / browse) → client-side resize → /api/admin/sponsors/upload → imageId
 *  2. 🔗 URL paste → external link (Imgur/Cloudinary/...) সরাসরি logoUrl
 *  3. 🚫 Remove
 *
 * Google Drive লিংক দিলে warning দেখায় (unreliable)।
 */

const MAX_CLIENT_BYTES = 5 * 1024 * 1024 // 5MB (resize এর আগে)
const MAX_DIM = 400 // resize target (logo ছোট হয়)
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif']

type Mode = 'upload' | 'url'

export type SponsorImageValue = {
  imageId: string | null
  logoUrl: string
}

export default function SponsorImageControl({
  value,
  onChange,
}: {
  value: SponsorImageValue
  onChange: (v: SponsorImageValue) => void
}) {
  const [mode, setMode] = useState<Mode>(value.imageId ? 'upload' : value.logoUrl ? 'url' : 'upload')
  const [busy, setBusy] = useState(false)
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState(value.logoUrl || '')
  const fileRef = useRef<HTMLInputElement>(null)

  const previewUrl = value.imageId ? value.logoUrl : value.logoUrl

  const processFile = useCallback(
    async (file: File) => {
      setError(null)
      if (!ALLOWED.includes(file.type)) {
        setError('Unsupported type. Use PNG, JPG, WEBP, GIF, or SVG.')
        return
      }
      if (file.size > MAX_CLIENT_BYTES) {
        setError('File too large (max 5MB before resize).')
        return
      }
      setBusy(true)
      try {
        let blob: Blob = file
        let w: number | null = null
        let h: number | null = null

        // SVG/canvas resize skip — raster ছবির জন্য resize করি
        if (file.type !== 'image/svg+xml' && file.type !== 'image/gif') {
          const resized = await resizeImage(file, MAX_DIM)
          if (resized) {
            blob = resized.blob
            w = resized.width
            h = resized.height
          }
        }

        const fd = new FormData()
        fd.append('file', blob, file.name)
        if (w) fd.append('width', String(w))
        if (h) fd.append('height', String(h))

        const res = await fetch('/api/admin/sponsors/upload', { method: 'POST', body: fd })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Upload failed')

        onChange({ imageId: data.imageId, logoUrl: data.url })
      } catch (e: any) {
        setError(e?.message || 'Upload failed')
      } finally {
        setBusy(false)
      }
    },
    [onChange]
  )

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const applyUrl = () => {
    setError(null)
    const u = urlInput.trim()
    if (!u) {
      onChange({ imageId: null, logoUrl: '' })
      return
    }
    if (!/^https?:\/\//i.test(u) && !u.startsWith('/')) {
      setError('Enter a valid http(s) URL or internal path.')
      return
    }
    if (/drive\.google\.com|docs\.google\.com/i.test(u)) {
      setError('⚠️ Google Drive links are unreliable (they break). Use upload or Imgur/Cloudinary instead.')
      // তবুও allow করি — ইউজারের ইচ্ছা
    }
    onChange({ imageId: null, logoUrl: u })
  }

  const clear = () => {
    setUrlInput('')
    setError(null)
    onChange({ imageId: null, logoUrl: '' })
  }

  return (
    <div className="space-y-3">
      {/* Mode tabs */}
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            mode === 'upload'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          📁 Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            mode === 'url'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          🔗 Paste URL
        </button>
      </div>

      <div className="flex gap-4 items-start">
        {/* Preview */}
        <div className="w-28 h-28 shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden relative">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="preview" className="max-w-full max-h-full object-contain" />
          ) : (
            <span className="text-[10px] text-slate-400 text-center px-2">no image</span>
          )}
          {busy && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-[10px] text-white">
              uploading…
            </div>
          )}
        </div>

        {/* Dropzone / URL */}
        <div className="flex-1 min-w-0">
          {mode === 'upload' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDrag(true)
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition ${
                drag
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                  : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400'
              }`}
            >
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <div className="font-medium mb-1">Drag &amp; drop image here</div>
                <div>or click to browse</div>
                <div className="mt-1 text-[10px] opacity-70">PNG · JPG · WEBP · GIF · SVG (max 5MB)</div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept={ALLOWED.join(',')}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) processFile(f)
                  e.target.value = ''
                }}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <input
                className="admin-input"
                placeholder="https://i.imgur.com/abc.png"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onBlur={applyUrl}
              />
              <div className="flex gap-2">
                <button type="button" onClick={applyUrl} className="admin-btn text-xs">
                  Apply
                </button>
                <button type="button" onClick={clear} className="admin-btn-ghost text-xs">
                  Clear
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                ⚠️ Google Drive unreliable — use Imgur / Cloudinary / upload.
              </p>
            </div>
          )}

          {value.imageId && (
            <button
              type="button"
              onClick={clear}
              className="mt-2 text-[11px] font-mono text-red-500/70 hover:text-red-500"
            >
              ✕ remove image
            </button>
          )}
        </div>
      </div>

      {error && <div className="admin-error text-xs">{error}</div>}
    </div>
  )
}

/** Canvas-এ ছবি resize করে ছোট Blob বানায়। Raster ছাড়া কিছু হলে null। */
async function resizeImage(
  file: File,
  maxDim: number
): Promise<{ blob: Blob; width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      try {
        let { width, height } = img
        if (width <= maxDim && height <= maxDim) {
          URL.revokeObjectURL(url)
          resolve(null) // already small
          return
        }
        const scale = Math.min(maxDim / width, maxDim / height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          URL.revokeObjectURL(url)
          resolve(null)
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url)
            if (blob) resolve({ blob, width, height })
            else resolve(null)
          },
          'image/webp',
          0.9
        )
      } catch {
        URL.revokeObjectURL(url)
        resolve(null)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    img.src = url
  })
}
