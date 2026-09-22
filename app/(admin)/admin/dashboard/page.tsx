import AdminHeader from '@/components/admin/AdminHeader'
import TerminalCard from '@/components/admin/TerminalCard'
import LogoutButton from '@/components/admin/LogoutButton'
import { prisma } from '@/lib/prisma'

async function getStats() {
  const [tutorials, chapters, quizzes, challenges, references, donations] =
    await Promise.all([
      prisma.tutorial.count(),
      prisma.chapter.count(),
      prisma.quizQuestion.count(),
      prisma.codeChallenge.count(),
      prisma.reference.count(),
      prisma.donation.count(),
    ])
  return { tutorials, chapters, quizzes, challenges, references, donations }
}

export default async function DashboardPage() {
  const stats = await getStats()

  const cards = [
    { label: 'tutorials', value: stats.tutorials, cmd: 'ls ./tutorials', href: '/admin/tutorials' },
    { label: 'chapters', value: stats.chapters, cmd: 'ls ./chapters', href: '/admin/tutorials' },
    { label: 'quizzes', value: stats.quizzes, cmd: 'cat ./quizzes', href: '/admin/quizzes' },
    { label: 'challenges', value: stats.challenges, cmd: 'ls ./challenges', href: '/admin/challenges' },
    { label: 'references', value: stats.references, cmd: 'man ./references', href: '/admin/references' },
    { label: 'donations', value: stats.donations, cmd: 'tail ./donations', href: '/admin/donations' },
  ]

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        subtitle="system status · all modules"
        action={<LogoutButton />}
      />

      <TerminalCard className="p-4 mb-6">
        <div className="text-xs text-[#22C55E]/70 space-y-0.5">
          <div><span className="text-[#22C55E]">$</span> systemctl status devschool-admin</div>
          <div className="text-[#22C55E]">
            ● <span className="text-cyan-400">active (running)</span> · uptime OK
          </div>
          <div><span className="text-[#22C55E]">$</span> whoami → <span className="text-cyan-400">root@devschool</span></div>
        </div>
      </TerminalCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <a key={c.label} href={c.href} className="block">
            <TerminalCard
              cmd={c.cmd}
              className="p-4 hover:border-[#22C55E]/60 hover:shadow-[0_0_40px_-8px_#22C55E] transition"
            >
              <div className="flex items-baseline justify-between pt-2">
                <span className="text-3xl font-bold text-[#22C55E] drop-shadow-[0_0_8px_#22C55E]">
                  {String(c.value).padStart(3, '0')}
                </span>
                <span className="text-xs uppercase tracking-widest text-[#22C55E]/60">
                  {c.label}
                </span>
              </div>
            </TerminalCard>
          </a>
        ))}
      </div>
    </div>
  )
}
