import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site-url";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, getDictionarySync } from "@/lib/i18n/dictionaries";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
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

// URL-এর ভাষা অনুযায়ী SEO title/description — bn পেজে বাংলা, en পেজে ইংরেজি
const META_BY_LOCALE: Record<Locale, { title: string; description: string }> = {
  bn: {
    title: "DevSchool — বিনামূল্যে প্রোগ্রামিং শিখুন",
    description:
      "HTML, CSS, JavaScript, Python সহ ২০+ টি ভাষায় টিউটোরিয়াল, কুইজ ও কোড চ্যালেঞ্জ",
  },
  en: {
    title: "DevSchool — Learn programming for free",
    description:
      "Tutorials, quizzes and coding challenges in 20+ languages including HTML, CSS, JavaScript and Python",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "bn";
  const m = META_BY_LOCALE[locale];

  return {
    title: m.title,
    description: m.description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        bn: "/bn",
        en: "/en",
        "x-default": "/bn",
      },
    },
  };
}

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
  // এই ভাষার সব UI লেখা লোড করি — নিচে client component-দের মধ্যে ছড়িয়ে দেব
  const dict = await getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <I18nProvider locale={locale} dict={dict}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
