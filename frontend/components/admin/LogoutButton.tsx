'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <button
      onClick={logout}
      className="text-xs px-3 py-1.5 border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 rounded font-mono transition"
    >
      $ logout
    </button>
  )
}
