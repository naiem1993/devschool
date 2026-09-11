import Link from 'next/link'

export default function TutorialNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19] px-4">
      <div className="max-w-md text-center">
        <div className="text-7xl mb-6">📭</div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
          টিউটোরিয়াল পাওয়া যায়নি
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          আপনি যে টিউটোরিয়ালটি খুঁজছেন তা নেই, মুছে ফেলা হয়েছে, অথবা এখনো প্রকাশ করা হয়নি।
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/categories"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition"
          >
            সব টিউটোরিয়াল দেখুন
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-semibold transition"
          >
            হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  )
}
