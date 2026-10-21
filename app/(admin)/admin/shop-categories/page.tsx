import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import DataCard, { EmptyRow, thClass, trClass, tdClass } from '@/components/admin/DataCard'
import DeleteButton from '@/components/admin/DeleteButton'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ShopCategoriesPage() {
  const [cats, counts] = await Promise.all([
    prisma.affiliateCategory.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    }),
    prisma.affiliateLink.groupBy({ by: ['category'], _count: { _all: true } }),
  ])

  const countMap = new Map(counts.map((c) => [c.category, c._count._all]))

  return (
    <div className='space-y-6'>
      <AdminHeader
        title='Shop Categories'
        subtitle={`${cats.length} categories`}
        action={
          <div className='flex items-center gap-2 flex-wrap'>
            <Link href='/admin/shop-categories/new' className='admin-btn'>+ New category</Link>
          </div>
        }
      />

      <DataCard title='All categories' count={cats.length}>
        <table className='w-full text-sm'>
          <thead className='border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30'>
            <tr>
              <th className={thClass}>Icon</th>
              <th className={thClass}>Name</th>
              <th className={thClass}>Slug</th>
              <th className={thClass}>Products</th>
              <th className={thClass}>Order</th>
              <th className={thClass}>Status</th>
              <th className={thClass + ' text-right'}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id} className={trClass}>
                <td className={tdClass + ' text-xl'}>{c.icon || '📦'}</td>
                <td className={tdClass + ' font-medium text-slate-900 dark:text-white'}>
                  <div>{c.nameBn}</div>
                  {c.nameEn && <div className='text-xs text-slate-500 dark:text-slate-400'>{c.nameEn}</div>}
                </td>
                <td className={tdClass + ' font-mono text-xs text-slate-500 dark:text-slate-400'}>{c.slug}</td>
                <td className={tdClass}>{countMap.get(c.slug) ?? 0}</td>
                <td className={tdClass}>{c.sortOrder}</td>
                <td className={tdClass}>
                  {c.isActive ? (
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
                      href={`/admin/shop-categories/${c.id}/edit`}
                      className='inline-flex items-center text-xs font-medium px-2 py-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors'
                    >
                      Edit
                    </Link>
                    <DeleteButton endpoint={`/api/admin/affiliate-categories/${c.id}`} itemLabel={c.nameBn} />
                  </div>
                </td>
              </tr>
            ))}
            {cats.length === 0 && <EmptyRow colSpan={7} message='No categories yet. Add your first one.' />}
          </tbody>
        </table>
      </DataCard>
    </div>
  )
}
