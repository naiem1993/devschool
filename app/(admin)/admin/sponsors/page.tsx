import Link from 'next/link'
import Image from 'next/image'
import AdminHeader from '@/components/admin/AdminHeader'
import DataCard, { EmptyRow, thClass, trClass, tdClass } from '@/components/admin/DataCard'
import DeleteButton from '@/components/admin/DeleteButton'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function SponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <div className='space-y-6'>
      <AdminHeader
        title='Sponsors'
        subtitle={`${sponsors.length} sponsors`}
        action={
          <div className='flex items-center gap-2 flex-wrap'>
            <Link href='/admin/sponsors/new' className='admin-btn'>+ New sponsor</Link>
          </div>
        }
      />

      <DataCard title='All sponsors' count={sponsors.length}>
        <table className='w-full text-sm'>
          <thead className='border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30'>
            <tr>
              <th className={thClass}>Logo</th>
              <th className={thClass}>Name</th>
              <th className={thClass}>Tier</th>
              <th className={thClass}>Priority</th>
              <th className={thClass}>Clicks</th>
              <th className={thClass}>Status</th>
              <th className={thClass + ' text-right'}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map((s) => (
              <tr key={s.id} className={trClass}>
                <td className={tdClass}>
                  {s.logoUrl ? (
                    <Image
                      src={s.logoUrl}
                      alt={s.name}
                      width={80}
                      height={32}
                      unoptimized
                      className='h-8 w-auto max-w-[80px] object-contain'
                    />
                  ) : (
                    <span className='text-slate-400 dark:text-slate-600'>&mdash;</span>
                  )}
                </td>
                <td className={tdClass + ' font-medium text-slate-900 dark:text-white'}>{s.name}</td>
                <td className={tdClass}>
                  <span className='inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300 capitalize'>
                    {s.tier}
                  </span>
                </td>
                <td className={tdClass}>{s.priority}</td>
                <td className={tdClass}>{s.clicks}</td>
                <td className={tdClass}>
                  {s.isActive ? (
                    <span className='inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400'>
                      <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
                      Active
                    </span>
                  ) : (
                    <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-500 dark:text-slate-400'>
                      <span className='w-1.5 h-1.5 rounded-full bg-slate-400' />
                      Off
                    </span>
                  )}
                </td>
                <td className={tdClass + ' text-right whitespace-nowrap'}>
                  <div className='flex items-center justify-end gap-1'>
                    <Link
                      href={`/admin/sponsors/${s.id}/edit`}
                      className='inline-flex items-center text-xs font-medium px-2 py-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors'
                    >
                      Edit
                    </Link>
                    <DeleteButton endpoint={`/api/admin/sponsors/${s.id}`} itemLabel={s.name} />
                  </div>
                </td>
              </tr>
            ))}
            {sponsors.length === 0 && <EmptyRow colSpan={7} message='No sponsors yet. Add your first one.' />}
          </tbody>
        </table>
      </DataCard>
    </div>
  )
}
