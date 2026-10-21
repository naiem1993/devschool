import AdminHeader from '@/components/admin/AdminHeader'
import AffiliateCategoryForm from '@/components/admin/AffiliateCategoryForm'

export default function NewShopCategoryPage() {
  return (
    <div>
      <AdminHeader title='New Shop Category' subtitle='add a category for shop products' />
      <AffiliateCategoryForm mode='create' />
    </div>
  )
}
