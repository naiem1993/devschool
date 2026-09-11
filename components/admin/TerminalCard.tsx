export default function TerminalCard({
  children,
  className = '',
  cmd,
}: {
  children: React.ReactNode
  className?: string
  cmd?: string
}) {
  return (
    <div
      className={`bg-[#0a0f0a]/90 border border-[#00ff88]/30 rounded-md shadow-[0_0_30px_-12px_#00ff88] ${className}`}
    >
      {cmd && (
        <div className="px-4 py-2 border-b border-[#00ff88]/20 text-[10px] text-cyan-400">
          <span className="text-[#00ff88]">$</span> {cmd}
        </div>
      )}
      {children}
    </div>
  )
}
