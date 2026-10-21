import Link from 'next/link'

type StatCardProps = {
  label: string
  value: number
  href: string
  icon: React.ReactNode
  trend?: number
  accent?: 'emerald' | 'blue' | 'violet' | 'amber' | 'rose' | 'cyan'
}

const accents = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', ring: 'group-hover:ring-emerald-500/30', glow: 'group-hover:shadow-emerald-500/10' },
  blue:    { bg: 'bg-blue-500/10',    text: 'text-blue-600 dark:text-blue-400',       ring: 'group-hover:ring-blue-500/30',    glow: 'group-hover:shadow-blue-500/10' },
  violet:  { bg: 'bg-violet-500/10',  text: 'text-violet-600 dark:text-violet-400',   ring: 'group-hover:ring-violet-500/30',  glow: 'group-hover:shadow-violet-500/10' },
  amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-600 dark:text-amber-400',     ring: 'group-hover:ring-amber-500/30',   glow: 'group-hover:shadow-amber-500/10' },
  rose:    { bg: 'bg-rose-500/10',    text: 'text-rose-600 dark:text-rose-400',       ring: 'group-hover:ring-rose-500/30',    glow: 'group-hover:shadow-rose-500/10' },
  cyan:    { bg: 'bg-cyan-500/10',    text: 'text-cyan-600 dark:text-cyan-400',       ring: 'group-hover:ring-cyan-500/30',    glow: 'group-hover:shadow-cyan-500/10' },
} as const

export default function StatCard({ label, value, href, icon, trend, accent = 'emerald' }: StatCardProps) {
  const a = accents[accent]
  return (
    <Link
      href={href}
      className={
        'group relative block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5 ' +
        'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ring-1 ring-transparent ' +
        a.ring + ' ' + a.glow
      }
    >
      <div className='flex items-start justify-between gap-3'>
        <div className={'flex items-center justify-center w-11 h-11 rounded-xl ' + a.bg + ' ' + a.text}>
          {icon}
        </div>
        {typeof trend === 'number' && (
          <span
            className={
              'inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ' +
              (trend >= 0
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400')
            }
          >
            {trend >= 0 ? '\u2191' : '\u2193'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className='mt-4'>
        <div className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
          {value.toLocaleString()}
        </div>
        <div className='mt-1 text-sm text-slate-500 dark:text-slate-400 capitalize'>{label}</div>
      </div>
    </Link>
  )
}
