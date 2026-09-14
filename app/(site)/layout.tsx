import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import CategoryNav from '@/components/CategoryNav'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 📂 Auto-load categories from database — admin panel থেকে add করলে নিজে থেকেই nav-এ আসবে
  let categories: { name: string; slug: string }[] = []
  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { name: true, slug: true },
      orderBy: { sortOrder: 'asc' },
    })
  } catch {
    categories = []
  }

  return (
    <>
      <Header />
      <CategoryNav categories={categories} />
      <ErrorBoundary>
        <main className="flex-1">{children}</main>
      </ErrorBoundary>
      <Footer />
    </>
  )
}
