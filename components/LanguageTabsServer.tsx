import 'server-only'
import prisma from '@/lib/prisma'
import LanguageTabs, { type LanguageTab } from './LanguageTabs'

/**
 * DB থেকে published tutorial গুলো এনে LanguageTabs-এ পাঠায়।
 * Admin থেকে নতুন tutorial (isPublished = true) যোগ করলেই nav tab-এ auto যোগ হবে।
 */
export default async function LanguageTabsServer() {
  let tabs: LanguageTab[] = []
  try {
    const rows = await prisma.tutorial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'asc' },
      select: { slug: true, title: true },
    })
    tabs = rows
  } catch {
    tabs = []
  }

  return <LanguageTabs tabs={tabs} />
}
