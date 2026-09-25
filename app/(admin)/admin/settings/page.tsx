import SiteSettingsForm from '@/components/admin/SiteSettingsForm'
import { getSiteSettings } from '@/lib/site-settings'

export const metadata = { title: 'Site Settings — DevSchool Admin' }

export default async function AdminSettingsPage() {
  const { hero, heroEn, footer, reviews, faq } = await getSiteSettings()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Site Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          হোমপেজের হিরো সেকশন, সাইট ফুটার, রিভিউ ও FAQ সেকশন এখান থেকে কন্ট্রোল করুন। Save করলে সাথে সাথে লাইভ সাইটে আপডেট হয়ে যাবে।
        </p>
      </div>
      <SiteSettingsForm initialHero={hero} initialHeroEn={heroEn} initialFooter={footer} initialReviews={reviews} initialFaq={faq} />
    </div>
  )
}
