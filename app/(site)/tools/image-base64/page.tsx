import { Metadata } from 'next'
import Link from 'next/link'
import ImageBase64Tool from '@/components/tools/ImageBase64Tool'

export const metadata: Metadata = {
  title: 'Image to Base64 — DevSchool',
  description:
    'ছবি থেকে Base64 / Data URI বানান, আর Base64 থেকে ছবি দেখুন — সম্পূর্ণ ব্রাউজারে, কোনো ছবি কোথাও আপলোড হয় না।',
  keywords: ['image to base64', 'base64 to image', 'data uri', 'png', 'jpeg', 'convert', 'DevSchool'],
  alternates: { canonical: '/tools/image-base64' },
  openGraph: {
    title: 'Image to Base64 | DevSchool',
    description: 'ছবি ↔ Base64 — ব্রাউজারেই, ছবি কোথাও আপলোড হয় না।',
    type: 'website',
    url: '/tools/image-base64',
    siteName: 'DevSchool',
    locale: 'bn_BD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image to Base64 | DevSchool',
    description: 'ছবি ↔ Base64 — ব্রাউজারেই, ছবি কোথাও আপলোড হয় না।',
  },
}

export default function ImageBase64Page() {
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
              <li className="text-slate-800 dark:text-slate-200 font-medium">Image to Base64</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
              Image to Base64
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              ছবিকে Base64 বা Data URI-তে বদলান — CSS/HTML-এ সরাসরি বসানোর জন্য। উল্টোটাও
              করা যায়: Base64 পেস্ট করে ছবি দেখুন ও ডাউনলোড করুন। ছবি কখনো আপনার ব্রাউজার ছাড়ে না।
            </p>
          </div>
        </div>
      </section>

      {/* ══════════ TOOL ══════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <ImageBase64Tool />
      </div>
    </div>
  )
}
