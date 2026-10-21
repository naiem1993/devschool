import AdminHeader from '@/components/admin/AdminHeader'
import DataCard, { EmptyRow, thClass, trClass, tdClass } from '@/components/admin/DataCard'
import DeleteButton from '@/components/admin/DeleteButton'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function QuizzesPage() {
  const items = await prisma.quizQuestion.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { tutorial: { select: { titleBn: true } }, _count: { select: { options: true } } },
  })

  return (
    <div className='space-y-6'>
      <AdminHeader
        title='Quizzes'
        subtitle={`${items.length} questions`}
        action={
          <div className='flex items-center gap-2 flex-wrap'>
            <Link href='/admin/quizzes/bulk' className='admin-btn-ghost'>Bulk import</Link>
            <Link href='/admin/quizzes/new' className='admin-btn'>+ New quiz</Link>
          </div>
        }
      />

      <DataCard title='All questions' count={items.length}>
        <table className='w-full text-sm'>
          <thead className='border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30'>
            <tr>
              <th className={thClass}>Question</th>
              <th className={thClass}>Tutorial</th>
              <th className={thClass}>Options</th>
              <th className={thClass + ' text-right'}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className={trClass}>
                <td className={tdClass + ' font-medium text-slate-900 dark:text-white max-w-md truncate'}>{it.questionBn}</td>
                <td className={tdClass}>{it.tutorial.titleBn}</td>
                <td className={tdClass}>
                  <span className='inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300'>
                    {it._count.options}
                  </span>
                </td>
                <td className={tdClass + ' text-right whitespace-nowrap'}>
                  <div className='flex items-center justify-end gap-1'>
                    <Link
                      href={`/admin/quizzes/${it.id}/edit`}
                      className='inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors'
                    >
                      Edit
                    </Link>
                    <DeleteButton endpoint={`/api/admin/quiz/${it.id}`} />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <EmptyRow colSpan={4} message='No quiz questions yet.' />}
          </tbody>
        </table>
      </DataCard>
    </div>
  )
}
