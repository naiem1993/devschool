import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import DataCard, { EmptyRow, thClass, trClass, tdClass } from '@/components/admin/DataCard'
import DeleteButton from '@/components/admin/DeleteButton'
import { prisma } from '@/lib/prisma'

export default async function DonationsPage() {
  const [items, totals] = await Promise.all([
    prisma.donation.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.donation.aggregate({
      _sum: { amount: true },
      _count: true,
      where: { status: 'completed' },
    }),
  ])

  return (
    <div className='space-y-6'>
      <AdminHeader
        title='Donations'
        subtitle={`${items.length} records`}
        action={
          <Link href='/admin/donations/new' className='admin-btn'>+ New donation</Link>
        }
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5'>
          <div className='text-sm text-slate-500 dark:text-slate-400'>Total received</div>
          <div className='mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
            {(totals._sum.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
            <span className='text-base font-medium text-slate-500 dark:text-slate-400'>BDT</span>
          </div>
        </div>
        <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5'>
          <div className='text-sm text-slate-500 dark:text-slate-400'>Completed donations</div>
          <div className='mt-2 text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400'>
            {totals._count.toLocaleString()}
          </div>
        </div>
      </div>

      <DataCard title='All donations' count={items.length}>
        <table className='w-full text-sm'>
          <thead className='border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30'>
            <tr>
              <th className={thClass}>Date</th>
              <th className={thClass}>Donor</th>
              <th className={thClass}>Amount</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Transaction</th>
              <th className={thClass + ' text-right'}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className={trClass}>
                <td className={tdClass + ' whitespace-nowrap'}>
                  {new Date(it.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className={tdClass + ' font-medium text-slate-900 dark:text-white'}>{it.donorName || 'Anonymous'}</td>
                <td className={tdClass + ' font-semibold text-slate-900 dark:text-white whitespace-nowrap'}>
                  {it.amount.toLocaleString()} {it.currency}
                </td>
                <td className={tdClass}>
                  <span
                    className={
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ' +
                      (it.status === 'completed'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400')
                    }
                  >
                    <span className={'w-1.5 h-1.5 rounded-full ' + (it.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500')} />
                    {it.status}
                  </span>
                </td>
                <td className={tdClass + ' text-slate-500 dark:text-slate-400 truncate max-w-[140px]'}>{it.transactionId || '\u2014'}</td>
                <td className={tdClass + ' text-right whitespace-nowrap'}>
                  <div className='flex items-center justify-end gap-1'>
                    <Link
                      href={`/admin/donations/${it.id}/edit`}
                      className='inline-flex items-center text-xs font-medium px-2 py-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors'
                    >
                      Edit
                    </Link>
                    <DeleteButton endpoint={`/api/admin/donations/${it.id}`} itemLabel={it.donorName || 'Anonymous'} />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <EmptyRow colSpan={6} message='No donations yet.' />}
          </tbody>
        </table>
      </DataCard>
    </div>
  )
}
