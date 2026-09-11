import AdminHeader from '@/components/admin/AdminHeader'
import TerminalCard from '@/components/admin/TerminalCard'
import LogoutButton from '@/components/admin/LogoutButton'
import { prisma } from '@/lib/prisma'

const SQL_SUM = "psql devschool -c \"SELECT SUM(amount) FROM donations WHERE status='completed'\""
const SQL_LIST = 'psql devschool -c "SELECT * FROM donations ORDER BY created_at DESC"'

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
    <div>
      <AdminHeader
        title="Donations"
        subtitle={`${items.length} records`}
        action={<LogoutButton />}
      />

      <TerminalCard cmd={SQL_SUM} className="p-4 mb-6">
        <div className="text-xs text-[#00ff88]/70 space-y-1 pt-2">
          <div>
            <span className="text-[#00ff88]">total_received</span> ={' '}
            <span className="text-cyan-400 font-bold">
              {totals._sum.amount?.toFixed(2) || '0.00'} BDT
            </span>
          </div>
          <div>
            <span className="text-[#00ff88]">completed_count</span> ={' '}
            <span className="text-cyan-400">{totals._count}</span>
          </div>
        </div>
      </TerminalCard>

      <TerminalCard cmd={SQL_LIST}>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#00ff88]/20 text-[#00ff88]/60 uppercase tracking-widest text-[10px]">
              <th className="text-left px-4 py-2">date</th>
              <th className="text-left px-4 py-2">donor</th>
              <th className="text-left px-4 py-2">amount</th>
              <th className="text-left px-4 py-2">status</th>
              <th className="text-left px-4 py-2">tx</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b border-[#00ff88]/10 hover:bg-[#00ff88]/5 transition">
                <td className="px-4 py-2 text-[#00ff88]/40">{it.createdAt.toISOString().slice(0, 10)}</td>
                <td className="px-4 py-2 text-[#00ff88]">{it.donorName || 'anonymous'}</td>
                <td className="px-4 py-2 text-cyan-400">{it.amount} {it.currency}</td>
                <td className="px-4 py-2">
                  {it.status === 'completed' ? (
                    <span className="text-[#00ff88]">● {it.status}</span>
                  ) : (
                    <span className="text-yellow-500/80">○ {it.status}</span>
                  )}
                </td>
                <td className="px-4 py-2 text-[#00ff88]/40 truncate max-w-[120px]">{it.transactionId || '—'}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[#00ff88]/40">-- no records found --</td></tr>
            )}
          </tbody>
        </table>
      </TerminalCard>
    </div>
  )
}
