import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-[#00ff88] font-mono flex relative">
      {/* scanlines overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #00ff88 0px, #00ff88 1px, transparent 1px, transparent 3px)',
        }}
      />
      <AdminSidebar />
      <main className="flex-1 overflow-x-auto relative">
        {/* subtle glow orbs */}
        <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="relative p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}
