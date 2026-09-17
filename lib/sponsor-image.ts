import { createHash } from 'crypto'

/**
 * Sponsor image storage adapter.
 *
 * এখন default mode = DB-blob: ছবি byte আকারে Postgres-এ (SponsorImage টেবিল)।
 * ভবিষ্যতে Supabase Storage / S3 যোগ করতে চাইলে শুধু এখানে নতুন function
 * যোগ করলেই হবে — বাকি কোড unchanged থাকবে (adapter pattern)।
 */

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 // 2 MB hard cap (client resize এর পর সাধারণত <200KB)
export const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'] as const

export type DetectedImage = {
  mimeType: string
  ext: string
}

/** Magic-byte (file signature) দেখে আসল টাইপ বের করে — ভুয়া extension ঠেকাতে। */
export function detectImageType(buf: Buffer): DetectedImage | null {
  if (buf.length < 4) return null

  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { mimeType: 'image/png', ext: 'png' }
  }
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { mimeType: 'image/jpeg', ext: 'jpg' }
  }
  // GIF: 47 49 46 38 (GIF8)
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) {
    return { mimeType: 'image/gif', ext: 'gif' }
  }
  // WEBP: RIFF....WEBP
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) {
    return { mimeType: 'image/webp', ext: 'webp' }
  }
  // SVG: text-based — শুরুতে '<' বা '<?xml' বা '<svg'
  const head = buf.subarray(0, 256).toString('utf8').trimStart().toLowerCase()
  if (head.startsWith('<svg') || head.startsWith('<?xml') || head.startsWith('<!doctype svg')) {
    return { mimeType: 'image/svg+xml', ext: 'svg' }
  }
  return null
}

/** SHA-256 hash (dedup key)। একই ছবি → একই hash → DB-তে reuse। */
export function hashBuffer(buf: Buffer): string {
  return createHash('sha256').update(buf).digest('hex')
}

/** Sponsor record-এর জন্য public image URL বানায়। */
export function imageUrlFor(imageId: string): string {
  return `/api/sponsors/image/${imageId}`
}

/** URL internal path নাকি external link তা বোঝে। */
export function isExternalUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return /^https?:\/\//i.test(url)
}

/** Google Drive link কিনা চেক — unreliable, তাই warning। */
export function isGoogleDriveUrl(url: string): boolean {
  return /drive\.google\.com|docs\.google\.com/i.test(url)
}
