'use client'

import { useState } from 'react'
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
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      setError('ACCESS DENIED — ভুল email বা password')
      setLines((p) => [...p, '[FAIL] access denied.'])
    }
    setLoading(false)
  }

  return (
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
          />

          {error && (
            <div className="mb-3 text-xs text-red-500 border border-red-500/40 bg-red-500/10 rounded px-3 py-2">
              [!] {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
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
  )
}
