import AdminHeader from '@/components/admin/AdminHeader'
import TerminalCard from '@/components/admin/TerminalCard'
import LogoutButton from '@/components/admin/LogoutButton'
import DeleteButton from '@/components/admin/DeleteButton'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function CategoriesPage() {
  const items = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div>
      <AdminHeader
        title="Categories"
        subtitle={`${items.length} records`}
        action={
          <div className="flex gap-2">
            <Link href="/admin/categories/new" className="admin-btn">
              + new
            </Link>
            <LogoutButton />
          </div>
        }
      />

      <TerminalCard cmd='psql devschool -c "SELECT * FROM categories"'>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#22C55E]/20 text-[#22C55E]/60 uppercase tracking-widest text-[10px]">
              <th className="text-left px-4 py-2">id</th>
              <th className="text-left px-4 py-2">name</th>
              <th className="text-left px-4 py-2">slug</th>
              <th className="text-left px-4 py-2">active</th>
              <th className="text-right px-4 py-2">actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b border-[#22C55E]/10 hover:bg-[#22C55E]/5 transition">
                <td className="px-4 py-2 text-[#22C55E]/40">{it.id.slice(0, 8)}</td>
                <td className="px-4 py-2 text-[#22C55E]">
                  {it.icon && <span className="mr-1">{it.icon}</span>}
                  {it.name}
                </td>
                <td className="px-4 py-2 text-cyan-400/70">{it.slug}</td>
                <td className="px-4 py-2">
                  {it.isActive ? (
                    <span className="text-[#22C55E]">● true</span>
                  ) : (
                    <span className="text-red-500/70">○ false</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right space-x-3">
                  <Link href={`/admin/categories/${it.id}/edit`} className="text-cyan-400 hover:text-[#22C55E]">
                    edit →
                  </Link>
                  <DeleteButton endpoint={`/api/admin/categories/${it.id}`} />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#22C55E]/40">
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
