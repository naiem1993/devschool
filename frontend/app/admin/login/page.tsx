'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lines, setLines] = useState<string[]>([
    'root@devschool:~$ ./init_admin_session',
    '> awaiting credentials...',
  ])

  // HACKED state
  const [hacked, setHacked] = useState(false)
  const [hackLines, setHackLines] = useState<string[]>([])
  const hackTimers = useRef<NodeJS.Timeout[]>([])

  const router = useRouter()

  useEffect(() => {
    return () => {
      hackTimers.current.forEach((t) => clearTimeout(t))
    }
  }, [])

  const randIP = () =>
    `${Math.floor(Math.random() * 223 + 1)}.${Math.floor(Math.random() * 255)}.${Math.floor(
      Math.random() * 255
    )}.${Math.floor(Math.random() * 255)}`

  const triggerHackEffect = (userEmail: string) => {
    setHacked(true)
    setHackLines([])

    const ip = randIP()
    const mac = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
    ).join(':')
    const size = (Math.random() * 8 + 2).toFixed(1)
    const files = Math.floor(Math.random() * 8000 + 1200)

    const ua = typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 58) : 'UNKNOWN'
    const tz = (() => {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone
      } catch {
        return 'UTC'
      }
    })()
    const screen = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '0x0'

    const fakeLines = [
      '[!] !!! UNAUTHORIZED ACCESS DETECTED !!!',
      `[!] TARGET ACCOUNT: ${userEmail || 'unknown@device'} `,
      '[>] INITIATING COUNTER-INTRUSION PROTOCOL...',
      '[>] tracing source...',
      `[>] SOURCE IP    : ${ip}`,
      `[>] MAC ADDRESS  : ${mac}`,
      `[>] ISP          : Bangladesh Telecommunication Co.`,
      `[>] GEO-LOCATION : Dhaka, BD (accuracy 12m)`,
      `[>] USER-AGENT   : ${ua}`,
      `[>] SCREEN       : ${screen}`,
      `[>] TIMEZONE     : ${tz}`,
      `[>] LANGUAGE     : ${typeof navigator !== 'undefined' ? navigator.language : 'en'}`,
      '[!] REQUESTING CAMERA ACCESS...',
      '[✓] CAMERA FEED CAPTURED  ██████████ 100%',
      '[!] REQUESTING MICROPHONE ACCESS...',
      '[✓] AUDIO STREAM RECORDED  ██████████ 100%',
      '[!] SCANNING LOCAL FILESYSTEM...',
      `[✓] ${files.toLocaleString()} FILES INDEXED`,
      '[!] EXFILTRATING DATA TO C2 SERVER (185.220.xxx.xxx)...',
      `[✓] UPLOAD COMPLETE  (${size} GB)`,
      '[!] INSTALLING PERSISTENT BACKDOOR...',
      '[✓] BACKDOOR INSTALLED  [port 4444]',
      '[!] ENCRYPTING PERSONAL FILES (AES-256)...',
      '[✓] ENCRYPTION COMPLETE  ██████████ 100%',
      '[!] CLONING BROWSER SESSIONS...',
      '[✓] 14 SESSIONS STOLEN',
      '[!] ACQUIRING SAVED PASSWORDS...',
      '[✓] 87 CREDENTIALS CAPTURED',
      '',
      '╔══════════════════════════════════════════╗',
      '║   YOUR DEVICE HAS BEEN COMPROMISED       ║',
      '║   ALL YOUR FILES ARE NOW ENCRYPTED       ║',
      '╚══════════════════════════════════════════╝',
      '',
      '[!] TO RECOVER YOUR DATA, SEND 0.5 BTC TO:',
      '    bc1q' + Math.random().toString(36).slice(2, 12) + 'xyz' + Math.random().toString(36).slice(2, 6),
      '[!] YOU HAVE 48 HOURS BEFORE PERMANENT DELETION',
      '[>] do NOT close this window',
      '[>] do NOT restart your device',
      '',
      '[>] ...',
      '[>] ...',
      '[>] ...',
      '[SYSTEM] scan complete. it was fake. 😅',
      '[SYSTEM] wrong password only. try again.',
    ]

    fakeLines.forEach((line, i) => {
      const delay = i * 180 + Math.random() * 80
      const t = setTimeout(() => {
        setHackLines((prev) => [...prev, line])
      }, delay)
      hackTimers.current.push(t)
    })

    const endDelay = fakeLines.length * 180 + 1800
    const endT = setTimeout(() => {
      setHacked(false)
      setHackLines([])
      setError(
        "ACCESS DENIED — you came here to hack, but ended up getting hacked yourself. Better luck next time, hacker. 💀"
      )
      hackTimers.current = []
    }, endDelay)
    hackTimers.current.push(endT)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (hacked) return
    setLoading(true)
    setError('')
    setLines((p) => [...p, `> auth: ${email}`])

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      setLines((p) => [...p, '[OK] access granted. redirecting...'])
      router.push('/admin/dashboard')
    } else {
      // SCARY HACK EFFECT
      triggerHackEffect(email)
      setPassword('')
      setLines([])
    }
    setLoading(false)
  }

  return (
    <>
      {/* ================= HACKED OVERLAY ================= */}
      {hacked && (
        <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
          {/* red flash */}
          <div className="pointer-events-none absolute inset-0 animate-[redflash_0.25s_ease-in-out_infinite] bg-red-900/40" />
          {/* scanline glitch */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20 animate-[scan_6s_linear_infinite]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #ff0000 0px, #ff0000 2px, transparent 2px, transparent 4px)',
            }}
          />
          {/* warning banner */}
          <div className="absolute top-0 left-0 right-0 bg-red-600 text-black font-bold text-center py-2 text-sm tracking-widest animate-pulse">
            !! SECURITY BREACH — DO NOT CLOSE WINDOW !!
          </div>

          <div className="h-full w-full p-4 pt-14 sm:p-6 sm:pt-16 overflow-y-auto font-mono text-xs sm:text-sm text-red-500 leading-relaxed">
            <pre className="whitespace-pre-wrap">
              {hackLines.join('\n')}
              <span className="animate-pulse">█</span>
            </pre>
          </div>

          {/* fake webcam dot */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-red-500 text-xs">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
            REC ●
          </div>
        </div>
      )}

      {/* ================= NORMAL LOGIN ================= */}
      <div className="min-h-screen flex items-center justify-center bg-black px-4 font-mono relative overflow-hidden">
        {/* scanlines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #00ff88 0px, #00ff88 1px, transparent 1px, transparent 3px)',
          }}
        />
        <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-[#00ff88]/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

        <div className="relative w-full max-w-lg">
          {/* ASCII banner */}
          <pre className="text-[#00ff88] text-[10px] sm:text-xs leading-tight mb-4 drop-shadow-[0_0_8px_#00ff88]">
{String.raw`╔═══════════════════════════════════════╗
║   D E V S C H O O L   //  A D M I N   ║
║   [ s e c u r e   t e r m i n a l ]   ║
╚═══════════════════════════════════════╝`}
          </pre>

          {/* terminal log */}
          <div className="bg-[#0a0f0a] border border-[#00ff88]/40 rounded-md p-3 mb-4 text-xs text-[#00ff88]/80 min-h-[64px] shadow-[0_0_20px_-4px_#00ff88]">
            {lines.map((l, i) => (
              <div key={i} className="whitespace-pre-wrap">
                <span className="text-cyan-400">{l}</span>
              </div>
            ))}
            {loading && <span className="text-[#00ff88] animate-pulse">_</span>}
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-[#0a0f0a]/90 border border-[#00ff88]/40 rounded-md p-6 backdrop-blur shadow-[0_0_40px_-8px_#00ff88]"
          >
            <div className="text-[#00ff88] text-xs mb-4">
              <span className="text-cyan-400">root@devschool</span>
              <span className="text-gray-500">:</span>
              <span className="text-[#00ff88]">~</span>
              <span className="text-gray-500">$</span>{' '}
              <span className="text-gray-300">login --admin</span>
            </div>

            <label className="block text-[10px] uppercase tracking-widest text-[#00ff88]/70 mb-1">
              &gt; EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@devschool.local"
              className="w-full mb-4 px-3 py-2 bg-black border border-[#00ff88]/30 text-[#00ff88] placeholder-[#00ff88]/30 rounded focus:outline-none focus:border-[#00ff88] focus:shadow-[0_0_12px_-2px_#00ff88] transition"
              autoComplete="username"
              required
              disabled={hacked}
            />

            <label className="block text-[10px] uppercase tracking-widest text-[#00ff88]/70 mb-1">
              &gt; PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full mb-4 px-3 py-2 bg-black border border-[#00ff88]/30 text-[#00ff88] placeholder-[#00ff88]/30 rounded focus:outline-none focus:border-[#00ff88] focus:shadow-[0_0_12px_-2px_#00ff88] transition"
              autoComplete="current-password"
              required
              disabled={hacked}
            />

            {error && (
              <div className="mb-3 text-xs text-red-500 border border-red-500/40 bg-red-500/10 rounded px-3 py-2 leading-relaxed">
                <div className="font-bold mb-0.5">[!] INTRUSION ATTEMPT LOGGED</div>
                <div className="text-red-400/90">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || hacked}
              className="w-full py-2.5 bg-[#00ff88] text-black font-bold uppercase tracking-widest rounded hover:bg-cyan-400 hover:shadow-[0_0_20px_-2px_#00ff88] transition disabled:opacity-50"
            >
              {loading ? '> authenticating...' : '> execute login'}
            </button>

            <div className="mt-4 text-[10px] text-[#00ff88]/40 text-center">
              encrypted session · bcrypt · httpOnly cookie
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
