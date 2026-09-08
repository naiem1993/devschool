import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevSchool — বিনামূল্যে প্রোগ্রামিং শিখুন",
  description: "HTML, CSS, JavaScript, Python সহ ২০+ টি ভাষায় টিউটোরিয়াল, কুইজ ও কোড চ্যালেঞ্জ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900 dark:bg-[#0a0a0a] dark:text-gray-100 transition-colors duration-300">
        {/* ===== প্রফেশনাল নেভবার ===== */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* লোগো */}
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  DevSchool
                </span>
                <span className="hidden sm:inline text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  v1.0
                </span>
              </Link>

              {/* ডেস্কটপ মেনু */}
              <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                <Link
                  href="/categories"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                >
                  টিউটোরিয়াল
                </Link>
                <Link
                  href="/references"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                >
                  রেফারেন্স
                </Link>
                <Link
                  href="/playground"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                >
                  প্লেগ্রাউন্ড
                </Link>
                <Link
                  href="/challenges"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                >
                  চ্যালেঞ্জ
                </Link>
                {/* ডোনেট বাটন */}
                <Link
                  href="/donate"
                  className="ml-2 px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  ❤️ দান করুন
                </Link>
              </nav>

              {/* ডান দিক: থিম টগল + মোবাইল মেনু */}
              <div className="flex items-center gap-2">
                <ThemeToggle />
                {/* মোবাইল হ্যাম্বার্গার (ডেমো) */}
                <button
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  aria-label="Menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ===== কন্টেন্ট ===== */}
        <main className="flex-1">{children}</main>

        {/* ===== ফুটার ===== */}
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p className="font-medium">
              © {new Date().getFullYear()} DevSchool — ১০০% ফ্রি লার্নিং প্ল্যাটফর্ম
            </p>
            <p className="mt-1 text-xs">
              ❤️ দান করতে চান?{' '}
              <Link href="/donate" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                এখানে ক্লিক করুন
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}