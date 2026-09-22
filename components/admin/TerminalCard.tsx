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
      className={`bg-[#0a0f0a]/90 border border-[#22C55E]/30 rounded-md shadow-[0_0_30px_-12px_#22C55E] ${className}`}
    >
      {cmd && (
        <div className="px-4 py-2 border-b border-[#22C55E]/20 text-[10px] text-cyan-400">
          <span className="text-[#22C55E]">$</span> {cmd}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}
