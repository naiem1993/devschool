import { Metadata } from 'next'
import Link from 'next/link'
import ImageToPdfTool from '@/components/tools/ImageToPdfTool'

export const metadata: Metadata = {
  title: 'Image to PDF — DevSchool',
  description:
    'JPG, PNG, GIF বা WEBP ছবি থেকে এক ক্লিকে PDF বানান — A4 বা ছবির মাপে। সম্পূর্ণ ব্রাউজারে, কোনো ছবি কোথাও আপলোড হয় না।',
  keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'convert', 'merge images', 'DevSchool'],
  alternates: { canonical: '/tools/image-to-pdf' },
  openGraph: {
    title: 'Image to PDF | DevSchool',
    description: 'ছবি থেকে PDF — A4 বা ছবির মাপে, ব্রাউজারেই।',
    type: 'website',
    url: '/tools/image-to-pdf',
    siteName: 'DevSchool',
    locale: 'bn_BD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image to PDF | DevSchool',
    description: 'ছবি থেকে PDF — A4 বা ছবির মাপে, ব্রাউজারেই।',
  },
}

export default function ImageToPdfPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050806] text-slate-900 dark:text-slate-100">
      {/* ══════════ HERO — clean black + single green glow ══════════ */}
      <section className="relative overflow-hidden bg-[#f6f8f7] dark:bg-[#050806] border-b border-slate-200 dark:border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[820px] max-w-full"
          style={{
            background:
              'radial-gradient(ellipse at center top, rgba(34,197,94,0.18), rgba(34,197,94,0.06) 45%, transparent 72%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-[#22C55E] transition">
                  হোম
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/tools" className="hover:text-[#22C55E] transition">
                  টুলস
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-slate-800 dark:text-slate-200 font-medium">Image to PDF</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
              Image to PDF
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              একাধিক ছবি বেছে নিন, ক্রম সাজান, আর এক ক্লিকে PDF ডাউনলোড করুন — A4
              পেজে ফিট করে বা প্রতিটি ছবি নিজের মাপে। ছবি কখনো আপনার ব্রাউজার ছাড়ে না।
            </p>
          </div>
        </div>
      </section>

      {/* ══════════ TOOL ══════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <ImageToPdfTool />
      </div>
    </div>
  )
}
