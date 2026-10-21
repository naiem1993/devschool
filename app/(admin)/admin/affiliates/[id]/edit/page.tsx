import { notFound } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'
import AffiliateForm from '@/components/admin/AffiliateForm'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function EditAffiliatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [link, cats] = await Promise.all([
    prisma.affiliateLink.findUnique({ where: { id } }),
    prisma.affiliateCategory.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: { slug: true, nameBn: true, icon: true },
    }),
  ])
  if (!link) notFound()

  return (
    <div>
      <AdminHeader title='Edit Affiliate Link' subtitle={link.titleBn} />
      <AffiliateForm
        mode='edit'
        categories={cats.map((c) => ({ slug: c.slug, label: `${c.icon || '📦'} ${c.nameBn}` }))}
        initial={{
          id: link.id,
          titleBn: link.titleBn,
          titleEn: link.titleEn,
          descriptionBn: link.descriptionBn,
          descriptionEn: link.descriptionEn,
          url: link.url,
          imageUrl: link.imageUrl,
          category: link.category,
          priceLabel: link.priceLabel,
          badge: link.badge,
          isActive: link.isActive,
          priority: link.priority,
        }}
      />
    </div>
  )
}
