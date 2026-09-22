import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { ADMIN_COOKIE, verifyToken } from '@/lib/auth-token'
import AdminHeader from '@/components/admin/AdminHeader'
import ReviewModeration from '@/components/admin/ReviewModeration'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  const adminId = await verifyToken(token)
  if (!adminId) redirect('/admin/login')

  const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } })
  const pending = reviews.filter((r) => r.status === 'pending').length

  return (
    <div>
      <AdminHeader
        title="Reviews"
        subtitle={pending > 0 ? `${pending} টি রিভিউ অনুমোদনের অপেক্ষায়` : 'সব রিভিউ দেখা হচ্ছে'}
      />
      <ReviewModeration reviews={reviews} />
    </div>
  )
}
