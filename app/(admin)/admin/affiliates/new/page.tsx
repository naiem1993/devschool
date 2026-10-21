import AdminHeader from '@/components/admin/AdminHeader'
import AffiliateForm from '@/components/admin/AffiliateForm'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function NewAffiliatePage() {
  const cats = await prisma.affiliateCategory.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: { slug: true, nameBn: true, icon: true },
  })

  return (
    <div>
      <AdminHeader title='New Affiliate Link' subtitle='add an affiliate product' />
      <AffiliateForm
        mode='create'
        categories={cats.map((c) => ({ slug: c.slug, label: `${c.icon || '📦'} ${c.nameBn}` }))}
      />
    </div>
  )
}
