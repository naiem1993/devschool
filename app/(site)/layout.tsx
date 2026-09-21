import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import SponsorRail, { type PublicSponsor } from '@/components/SponsorRail'
import { getFooterSettings } from '@/lib/site-settings'
import prisma from '@/lib/prisma'

// ISR: ৫ মিনিট cache। Categories + sponsors ঘনঘন বদলায় না —
// তাই static-safe, প্রতিটা request-এ DB hit হবে না → many-x fast।
// যেসব child page dynamic দরকার (search/progress/playground),
// তারা নিজেরাই force-dynamic declare করবে।
export const revalidate = 300

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ⭐ Sponsors — active, date-window-valid, priority sorted
  let sponsors: PublicSponsor[] = []
  try {
    const now = new Date()
    const rows = await prisma.sponsor.findMany({
      where: {
        isActive: true,
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: now } }] },
          { OR: [{ endDate: null }, { endDate: { gte: now } }] },
        ],
      },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        websiteUrl: true,
        tier: true,
        description: true,
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      take: 12,
    })
    sponsors = rows
  } catch {
    sponsors = []
  }

  const footer = await getFooterSettings()

  return (
    <>
      <Header />
      <ErrorBoundary>
        <main className="flex-1">{children}</main>
      </ErrorBoundary>
      <SponsorRail sponsors={sponsors} />
      <Footer footer={footer} />
    </>
  )
}
