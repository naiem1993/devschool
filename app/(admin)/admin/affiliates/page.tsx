import Link from 'next/link'
import Image from 'next/image'
import AdminHeader from '@/components/admin/AdminHeader'
import DataCard, { EmptyRow, thClass, trClass, tdClass } from '@/components/admin/DataCard'
import DeleteButton from '@/components/admin/DeleteButton'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AffiliatesPage() {
  const links = await prisma.affiliateLink.findMany({
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  })

  const total = links.length
  const active = links.filter((l) => l.isActive).length
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0)

  return (
    <div className='space-y-6'>
      <AdminHeader
        title='Affiliate Links'
        subtitle={`${total} links`}
        action={
          <div className='flex items-center gap-2 flex-wrap'>
            <Link href='/admin/affiliates/new' className='admin-btn'>+ New link</Link>
          </div>
        }
      />

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5'>
          <div className='text-sm text-slate-500 dark:text-slate-400'>Total links</div>
          <div className='mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>{total}</div>
        </div>
        <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5'>
          <div className='text-sm text-slate-500 dark:text-slate-400'>Active</div>
          <div className='mt-2 text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400'>{active}</div>
        </div>
        <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f151c] p-5'>
          <div className='text-sm text-slate-500 dark:text-slate-400'>Total clicks</div>
          <div className='mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>{totalClicks.toLocaleString()}</div>
        </div>
      </div>

      <DataCard title='All affiliate links' count={links.length}>
        <table className='w-full text-sm'>
          <thead className='border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30'>
            <tr>
              <th className={thClass}>Image</th>
              <th className={thClass}>Title</th>
              <th className={thClass}>Category</th>
              <th className={thClass}>Priority</th>
              <th className={thClass}>Clicks</th>
              <th className={thClass}>Status</th>
              <th className={thClass + ' text-right'}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((l) => (
              <tr key={l.id} className={trClass}>
                <td className={tdClass}>
                  {l.imageUrl ? (
                    <Image
                      src={l.imageUrl}
                      alt={l.titleBn}
                      width={80}
                      height={32}
                      unoptimized
                      className='h-8 w-auto max-w-[80px] object-contain'
                    />
                  ) : (
                    <span className='text-slate-400 dark:text-slate-600'>&mdash;</span>
                  )}
                </td>
                <td className={tdClass + ' font-medium text-slate-900 dark:text-white'}>
                  <div>{l.titleBn}</div>
                  {l.titleEn && <div className='text-xs text-slate-500 dark:text-slate-400'>{l.titleEn}</div>}
                </td>
                <td className={tdClass}>
                  <span className='inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300 capitalize'>
                    {l.category}
                  </span>
                </td>
                <td className={tdClass}>{l.priority}</td>
                <td className={tdClass}>{l.clicks}</td>
                <td className={tdClass}>
                  {l.isActive ? (
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
                      href={`/admin/affiliates/${l.id}/edit`}
                      className='inline-flex items-center text-xs font-medium px-2 py-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors'
                    >
                      Edit
                    </Link>
                    <DeleteButton endpoint={`/api/admin/affiliates/${l.id}`} itemLabel={l.titleBn} />
                  </div>
                </td>
              </tr>
            ))}
            {links.length === 0 && <EmptyRow colSpan={7} message='No affiliate links yet. Add your first one.' />}
          </tbody>
        </table>
      </DataCard>
    </div>
  )
}
