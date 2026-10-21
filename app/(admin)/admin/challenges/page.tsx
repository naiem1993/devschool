import AdminHeader from '@/components/admin/AdminHeader'
import DataCard, { EmptyRow, thClass, trClass, tdClass } from '@/components/admin/DataCard'
import DeleteButton from '@/components/admin/DeleteButton'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function ChallengesPage() {
  const items = await prisma.codeChallenge.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { tutorial: { select: { titleBn: true } }, _count: { select: { testCases: true } } },
  })

  return (
    <div className='space-y-6'>
      <AdminHeader
        title='Challenges'
        subtitle={`${items.length} code challenges`}
        action={
          <div className='flex items-center gap-2 flex-wrap'>
            <Link href='/admin/challenges/bulk' className='admin-btn-ghost'>Bulk import</Link>
            <Link href='/admin/challenges/new' className='admin-btn'>+ New challenge</Link>
          </div>
        }
      />

      <DataCard title='All challenges' count={items.length}>
        <table className='w-full text-sm'>
          <thead className='border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30'>
            <tr>
              <th className={thClass}>Title</th>
              <th className={thClass}>Tutorial</th>
              <th className={thClass}>Difficulty</th>
              <th className={thClass}>Points</th>
              <th className={thClass + ' text-right'}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className={trClass}>
                <td className={tdClass + ' font-medium text-slate-900 dark:text-white'}>{it.titleBn}</td>
                <td className={tdClass}>{it.tutorial.titleBn}</td>
                <td className={tdClass}>
                  <span className='inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400'>
                    {it.difficulty}
                  </span>
                </td>
                <td className={tdClass + ' font-semibold text-slate-900 dark:text-white'}>{it.points}</td>
                <td className={tdClass + ' text-right whitespace-nowrap'}>
                  <div className='flex items-center justify-end gap-1'>
                    <Link
                      href={`/admin/challenges/${it.id}/edit`}
                      className='inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors'
                    >
                      Edit
                    </Link>
                    <DeleteButton endpoint={`/api/admin/challenges/${it.id}`} />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <EmptyRow colSpan={5} message='No challenges yet.' />}
          </tbody>
        </table>
      </DataCard>
    </div>
  )
}
