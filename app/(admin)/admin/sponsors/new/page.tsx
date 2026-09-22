import AdminHeader from '@/components/admin/AdminHeader'
import SponsorForm from '@/components/admin/SponsorForm'

export default function NewSponsorPage() {
  return (
    <div>
      <AdminHeader title="New Sponsor" subtitle="add a sponsor" />
      <SponsorForm mode="create" />
    </div>
  )
}
