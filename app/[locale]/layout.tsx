import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site-url";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n/config";
import "../globals.css";

// ============================================================
//  PUBLIC SITE ROOT LAYOUT (locale-aware)
//  `lang` আসে URL-এর [locale] থেকে (/bn/... → bn, /en/... → en)
// ============================================================

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
  description:
    "HTML, CSS, JavaScript, Python সহ ২০+ টি ভাষায় টিউটোরিয়াল, কুইজ ও কোড চ্যালেঞ্জ",
  metadataBase: new URL(SITE_URL),
};

// দুই ভাষার পেজ build-time-এ pre-render করার জন্য
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "bn";

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
