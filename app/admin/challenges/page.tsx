import AdminHeader from '@/components/admin/AdminHeader'
import TerminalCard from '@/components/admin/TerminalCard'
import LogoutButton from '@/components/admin/LogoutButton'
import DeleteButton from '@/components/admin/DeleteButton'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function ChallengesPage() {
  const items = await prisma.codeChallenge.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { tutorial: { select: { title: true } }, _count: { select: { testCases: true } } },
  })

  return (
    <div>
      <AdminHeader
        title="Challenges"
        subtitle={`${items.length} code challenges`}
        action={
          <div className="flex gap-2">
            <Link href="/admin/challenges/new" className="admin-btn">+ new</Link>
            <LogoutButton />
          </div>
        }
      />

      <TerminalCard cmd='psql devschool -c "SELECT * FROM code_challenges"'>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#00ff88]/20 text-[#00ff88]/60 uppercase tracking-widest text-[10px]">
              <th className="text-left px-4 py-2">title</th>
              <th className="text-left px-4 py-2">tutorial</th>
              <th className="text-left px-4 py-2">difficulty</th>
              <th className="text-left px-4 py-2">points</th>
              <th className="text-right px-4 py-2">actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b border-[#00ff88]/10 hover:bg-[#00ff88]/5 transition">
                <td className="px-4 py-2 text-[#00ff88]">{it.title}</td>
                <td className="px-4 py-2 text-cyan-400/70">{it.tutorial.title}</td>
                <td className="px-4 py-2 text-[#00ff88]/60">{it.difficulty}</td>
                <td className="px-4 py-2 text-cyan-400">{it.points}</td>
                <td className="px-4 py-2 text-right space-x-3">
                  <Link href={`/admin/challenges/${it.id}`} className="text-cyan-400 hover:text-[#00ff88]">edit →</Link>
                  <DeleteButton endpoint={`/api/admin/challenges/${it.id}`} />
                </td>
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
