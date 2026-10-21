import Link from 'next/link'

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2fbf4] dark:bg-[#050806] text-slate-900 dark:text-white font-sans px-4 text-center">
      <div className="text-[120px] font-black leading-none text-slate-200 dark:text-slate-800 select-none">
        404
      </div>
      <h2 className="mt-4 text-2xl font-bold">পেজটি খুঁজে পাওয়া যায়নি</h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        আপনি যে লিংকে গেছেন সেটি ভুল অথবা সরিয়ে ফেলা হয়েছে।
      </p>
      <Link 
        href="/"
        className="mt-8 px-6 py-3 rounded-2xl bg-[#22C55E] text-[#04140a] font-bold hover:bg-[#4ADE80] transition shadow-lg shadow-[#22C55E]/20"
      >
        হোমপেজে ফিরে যান
      </Link>
    </div>
  )
}
