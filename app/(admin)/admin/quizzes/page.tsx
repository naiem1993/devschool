import AdminHeader from '@/components/admin/AdminHeader'
import TerminalCard from '@/components/admin/TerminalCard'
import LogoutButton from '@/components/admin/LogoutButton'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function QuizzesPage() {
  const items = await prisma.quizQuestion.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { tutorial: { select: { title: true } }, _count: { select: { options: true } } },
  })

  return (
    <div>
      <AdminHeader
        title="Quizzes"
        subtitle={`${items.length} questions`}
        action={
          <div className="flex gap-2">
            <Link href="/admin/quizzes/new" className="admin-btn">+ new</Link>
            <LogoutButton />
          </div>
        }
      />

      <TerminalCard cmd='psql devschool -c "SELECT * FROM quiz_questions"'>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#22C55E]/20 text-[#22C55E]/60 uppercase tracking-widest text-[10px]">
              <th className="text-left px-4 py-2">question</th>
              <th className="text-left px-4 py-2">tutorial</th>
              <th className="text-left px-4 py-2">options</th>
              <th className="text-right px-4 py-2">actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b border-[#22C55E]/10 hover:bg-[#22C55E]/5 transition">
                <td className="px-4 py-2 text-[#22C55E] max-w-md truncate">{it.question}</td>
                <td className="px-4 py-2 text-cyan-400/70">{it.tutorial.title}</td>
                <td className="px-4 py-2 text-[#22C55E]/60">{it._count.options}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/quizzes/${it.id}`} className="text-cyan-400 hover:text-[#22C55E]">edit →</Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-[#22C55E]/40">-- no records found --</td></tr>
            )}
          </tbody>
        </table>
      </TerminalCard>
    </div>
  )
}
