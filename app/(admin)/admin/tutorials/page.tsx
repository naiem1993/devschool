import AdminHeader from '@/components/admin/AdminHeader'
import DataCard, { EmptyRow, thClass, trClass, tdClass } from '@/components/admin/DataCard'
import DeleteButton from '@/components/admin/DeleteButton'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function TutorialsPage() {
  const items = await prisma.tutorial.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      _count: { select: { chapters: true, groups: true } },
    },
  })

  return (
    <div className='space-y-6'>
      <AdminHeader
        title='Tutorials'
        subtitle={`${items.length} records`}
        action={
          <div className='flex items-center gap-2 flex-wrap'>
            <Link href='/admin/tutorials/new' className='admin-btn'>+ New tutorial</Link>
          </div>
        }
      />

      <DataCard title='All tutorials' count={items.length}>
        <table className='w-full text-sm'>
          <thead className='border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30'>
            <tr>
              <th className={thClass}>Title</th>
              <th className={thClass}>Difficulty</th>
              <th className={thClass}>Chapters</th>
              <th className={thClass}>Groups</th>
              <th className={thClass}>Status</th>
              <th className={thClass + ' text-right'}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const chapterCount = it._count.chapters
              const groupCount = it._count.groups
              return (
                <tr key={it.id} className={trClass}>
                  <td className={tdClass + ' font-medium text-slate-900 dark:text-white'}>{it.titleBn}</td>
                  <td className={tdClass}>
                    <span className='inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300 capitalize'>
                      {it.difficulty}
                    </span>
                  </td>
                  <td className={tdClass}>
                    <Link
                      href={`/admin/tutorials/${it.id}/chapters`}
                      className={
                        'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md transition-colors ' +
                        (chapterCount > 0
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/15'
                          : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/15')
                      }
                      title='Manage chapters'
                    >
                      {chapterCount > 0 ? chapterCount : '0 (add)'}
                    </Link>
                  </td>
                  <td className={tdClass}>
                    <Link
                      href={`/admin/tutorials/${it.id}/chapters`}
                      className='text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'
                      title='Manage groups'
                    >
                      {groupCount}
                    </Link>
                  </td>
                  <td className={tdClass}>
                    {it.isPublished ? (
                      <span className='inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400'>
                        <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
                        Live
                      </span>
                    ) : (
                      <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400'>
                        <span className='w-1.5 h-1.5 rounded-full bg-slate-400' />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className={tdClass + ' text-right whitespace-nowrap'}>
                    <div className='flex items-center justify-end gap-1'>
                      <Link
                        href={`/admin/tutorials/${it.id}/chapters`}
                        className='inline-flex items-center text-xs font-medium px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                      >
                        Chapters
                      </Link>
                      <Link
                        href={`/admin/tutorials/${it.id}/edit`}
                        className='inline-flex items-center text-xs font-medium px-2 py-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors'
                      >
                        Edit
                      </Link>
                      <DeleteButton endpoint={`/api/admin/tutorials/${it.id}`} />
                    </div>
                  </td>
                </tr>
              )
            })}
            {items.length === 0 && <EmptyRow colSpan={6} message='No tutorials yet. Create your first one.' />}
          </tbody>
        </table>
      </DataCard>
    </div>
  )
}
