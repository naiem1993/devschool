import { notFound } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'
import AffiliateCategoryForm from '@/components/admin/AffiliateCategoryForm'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function EditShopCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cat = await prisma.affiliateCategory.findUnique({ where: { id } })
  if (!cat) notFound()

  return (
    <div>
      <AdminHeader title='Edit Shop Category' subtitle={cat.nameBn} />
      <AffiliateCategoryForm
        mode='edit'
        initial={{
          id: cat.id,
          slug: cat.slug,
          nameBn: cat.nameBn,
          nameEn: cat.nameEn,
          icon: cat.icon,
          description: cat.description,
          sortOrder: cat.sortOrder,
          isActive: cat.isActive,
        }}
      />
    </div>
  )
}
