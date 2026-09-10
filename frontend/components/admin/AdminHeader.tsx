export default function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <div className="text-[10px] text-cyan-400 mb-1">
          <span className="text-[#00ff88]">root@devschool</span>
          <span className="text-gray-500">:~$</span> cd ./{title.toLowerCase().replace(/\s+/g, '_')}
        </div>
        <h1 className="text-2xl font-bold text-[#00ff88] drop-shadow-[0_0_8px_#00ff88]">
          <span className="text-cyan-400">&gt;</span> {title}
        </h1>
        {subtitle && <p className="text-xs text-[#00ff88]/50 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
