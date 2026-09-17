import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import DeleteButton from '@/components/admin/DeleteButton'
import LogoutButton from '@/components/admin/LogoutButton'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function SponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <div>
      <AdminHeader
        title="Sponsors"
        subtitle={`${sponsors.length} sponsors`}
        action={
          <div className="flex items-center gap-3">
            <Link href="/admin/sponsors/new" className="admin-btn">
              + New Sponsor
            </Link>
            <LogoutButton />
          </div>
        }
      />

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0f151c]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3">logo</th>
              <th className="text-left px-4 py-3">name</th>
              <th className="text-left px-4 py-3">tier</th>
              <th className="text-left px-4 py-3">priority</th>
              <th className="text-left px-4 py-3">clicks</th>
              <th className="text-left px-4 py-3">status</th>
              <th className="text-right px-4 py-3">actions</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map((s) => (
              <tr
                key={s.id}
                className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition"
              >
                <td className="px-4 py-3">
                  {s.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.logoUrl} alt={s.name} className="h-8 w-auto max-w-[80px] object-contain" />
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 capitalize">
                    {s.tier}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{s.priority}</td>
                <td className="px-4 py-3 text-slate-500">{s.clicks}</td>
                <td className="px-4 py-3">
                  {s.isActive ? (
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs">● active</span>
                  ) : (
                    <span className="text-slate-400 text-xs">○ off</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/sponsors/${s.id}/edit`}
                      className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      edit
                    </Link>
                    <DeleteButton endpoint={`/api/admin/sponsors/${s.id}`} itemLabel={s.name} />
                  </div>
                </td>
              </tr>
            ))}
            {sponsors.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                  -- no sponsors yet --{' '}
                  <Link href="/admin/sponsors/new" className="text-emerald-500 hover:underline">
                    add one
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
