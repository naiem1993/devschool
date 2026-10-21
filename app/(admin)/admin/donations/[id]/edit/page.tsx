import { notFound } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'
import DonationForm from '@/components/admin/DonationForm'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function EditDonationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const donation = await prisma.donation.findUnique({ where: { id } })
  if (!donation) notFound()

  return (
    <div>
      <AdminHeader title='Edit Donation' subtitle={donation.donorName || 'Anonymous'} />
      <DonationForm
        mode='edit'
        initial={{
          id: donation.id,
          donorName: donation.donorName,
          donorEmail: donation.donorEmail,
          amount: donation.amount,
          currency: donation.currency,
          transactionId: donation.transactionId,
          status: donation.status,
          message: donation.message,
          isPublic: donation.isPublic,
        }}
      />
    </div>
  )
}
