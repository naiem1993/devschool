import AdminHeader from '@/components/admin/AdminHeader'
import DonationForm from '@/components/admin/DonationForm'

export default function NewDonationPage() {
  return (
    <div>
      <AdminHeader title='New Donation' subtitle='add a donation record manually' />
      <DonationForm mode='create' />
    </div>
  )
}
