import AdminHeader from '@/components/admin/AdminHeader'
import TerminalCard from '@/components/admin/TerminalCard'
import LogoutButton from '@/components/admin/LogoutButton'
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
    <div>
      <AdminHeader
        title="Tutorials"
        subtitle={`${items.length} records`}
        action={
          <div className="flex gap-2">
            <Link href="/admin/tutorials/new" className="admin-btn">
              + new
            </Link>
            <LogoutButton />
          </div>
        }
      />

      <TerminalCard cmd='psql devschool -c "SELECT * FROM tutorials"'>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#22C55E]/20 text-[#22C55E]/60 uppercase tracking-widest text-[10px]">
              <th className="text-left px-4 py-2">title</th>
              <th className="text-left px-4 py-2">difficulty</th>
              <th className="text-left px-4 py-2">chapters</th>
              <th className="text-left px-4 py-2">groups</th>
              <th className="text-left px-4 py-2">published</th>
              <th className="text-right px-4 py-2">actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const chapterCount = it._count.chapters
              const groupCount = it._count.groups
              return (
                <tr key={it.id} className="border-b border-[#22C55E]/10 hover:bg-[#22C55E]/5 transition">
                  <td className="px-4 py-2 text-[#22C55E]">{it.titleBn}</td>
                  <td className="px-4 py-2 text-[#22C55E]/60">{it.difficulty}</td>

                  <td className="px-4 py-2">
                    {chapterCount > 0 ? (
                      <Link
                        href={`/admin/tutorials/${it.id}/chapters`}
                        className="text-[#22C55E]/80 hover:text-[#4ADE80] transition"
                        title="Chapters manage করো"
                      >
                        📚 {chapterCount}
                      </Link>
                    ) : (
                      <Link
                        href={`/admin/tutorials/${it.id}/chapters`}
                        className="text-amber-500 hover:text-amber-400 transition"
                        title="এখনো কোনো chapter নেই — যোগ করো"
                      >
                        ⚠ 0
                      </Link>
                    )}
                  </td>

                  <td className="px-4 py-2 text-[#22C55E]/60">
                    <Link
                      href={`/admin/tutorials/${it.id}/chapters`}
                      className="hover:text-[#4ADE80] transition"
                      title="Groups manage করো"
                    >
                      {groupCount}
                    </Link>
                  </td>

                  <td className="px-4 py-2">
                    {it.isPublished ? (
                      <span className="text-[#22C55E]">● live</span>
                    ) : (
                      <span className="text-red-500/70">○ draft</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right space-x-3 whitespace-nowrap">
                    <Link
                      href={`/admin/tutorials/${it.id}/chapters`}
                      className="text-[#22C55E]/70 hover:text-[#4ADE80]"
                    >
                      📚 chapters
                    </Link>
                    <Link
                      href={`/admin/tutorials/${it.id}/edit`}
                      className="text-cyan-400 hover:text-[#22C55E]"
                    >
                      ✎ edit
                    </Link>
                    <DeleteButton endpoint={`/api/admin/tutorials/${it.id}`} />
                  </td>
                </tr>
              )
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#22C55E]/40">
                  -- no records found --
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TerminalCard>
    </div>
  )
}
