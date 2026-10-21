export default function DataCard({
  children,
  title,
  count,
}: {
  children: React.ReactNode
  title?: string
  count?: number
}) {
  return (
    <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] overflow-hidden'>
      {title && (
        <div className='flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800'>
          <h2 className='text-sm font-semibold text-slate-900 dark:text-white'>{title}</h2>
          {typeof count === 'number' && (
            <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>{count} {count === 1 ? 'item' : 'items'}</span>
          )}
        </div>
      )}
      <div className='overflow-x-auto'>{children}</div>
    </div>
  )
}

export function EmptyRow({ colSpan, message = 'No records found.' }: { colSpan: number; message?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className='px-5 py-14 text-center'>
        <div className='flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500'>
          <svg className='w-8 h-8 opacity-60' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round'>
            <path d='M21 12a9 9 0 1 1-6.219-8.56M9 12h6' />
          </svg>
          <span className='text-sm'>{message}</span>
        </div>
      </td>
    </tr>
  )
}

export const thClass =
  'text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap'

export const trClass =
  'border-b border-slate-100 dark:border-slate-800/70 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'

export const tdClass = 'px-5 py-3 text-sm text-slate-700 dark:text-slate-300 align-middle'
