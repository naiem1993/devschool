/**
 * Edge-safe admin session token helpers.
 *
 * কেন আলাদা ফাইল? Next.js middleware Edge runtime-এ চলে, সেখানে Prisma
 * import করা যায় না। তাই HMAC sign/verify এখানে রাখা হলো — এটা Web Crypto
 * ব্যবহার করে, যা Edge ও Node দুই জায়গাতেই কাজ করে।
 *
 * Token format: `${userId}.${expiresAt}.${hmacSignature}`
 * Signature = HMAC-SHA256(userId + '.' + expiresAt, ADMIN_SECRET_KEY)
 * সুতরাং টোকেন বানানো/বদলানো যাবে না (secret ছাড়া)।
 */

export const ADMIN_COOKIE = 'admin_session'
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000 // 24 ঘণ্টা

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET_KEY
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SECRET_KEY must be set and at least 32 chars')
  }
  return secret
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hmac(message: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return toHex(sig)
}

/** সাইন করা টোকেন তৈরি করে। */
export async function signToken(userId: string, ttlMs: number = SESSION_TTL_MS): Promise<string> {
  const exp = Date.now() + ttlMs
  const payload = `${userId}.${exp}`
  const sig = await hmac(payload)
  return `${payload}.${sig}`
}

/**
 * টোকেন যাচাই করে। সঠিক হলে userId ফেরত দেয়, নাহলে null।
 * (signature ভুল / মেয়াদ শেষ / format ভুল = null)
 */
export async function verifyToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [userId, expStr, sig] = parts
  if (!userId || !expStr || !sig) return null

  const exp = Number(expStr)
  if (!Number.isFinite(exp) || exp < Date.now()) return null // মেয়াদ শেষ

  const expected = await hmac(`${userId}.${expStr}`)
  if (expected.length !== sig.length) return null

  // constant-time compare (timing attack ঠেকাতে)
  let diff = 0
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0 ? userId : null
}
