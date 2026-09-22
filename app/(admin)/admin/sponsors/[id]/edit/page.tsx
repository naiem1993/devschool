import { notFound } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'
import SponsorForm from '@/components/admin/SponsorForm'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function EditSponsorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sponsor = await prisma.sponsor.findUnique({ where: { id } })
  if (!sponsor) notFound()

  return (
    <div>
      <AdminHeader title="Edit Sponsor" subtitle={sponsor.name} />
      <SponsorForm
        mode="edit"
        initial={{
          ...sponsor,
          startDate: sponsor.startDate ? sponsor.startDate.toISOString() : null,
          endDate: sponsor.endDate ? sponsor.endDate.toISOString() : null,
        }}
      />
    </div>
  )
}
