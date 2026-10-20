import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site-url";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeInit from "@/components/ThemeInit";
import ThemeSync from "@/components/ThemeSync";
import "../globals.css";

// ============================================================
//  PUBLIC SITE ROOT LAYOUT (locale-aware)
//  `lang` আসে URL-এর [locale] থেকে (/bn/... → bn, /en/... → en)
//
//  Theming:
//   - Pre-hydration script runs via <ThemeInit> (server-only, no
//     React 19 script warning) → applies .dark class + background
//     before first paint, so no FOUC.
//   - <ThemeProvider> keeps React state in sync with that script.
// ============================================================

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Reads the persisted theme and applies it to <html> before first paint.
// 'light' → no .dark, everything else (incl. missing) → .dark.
const THEME_SCRIPT = `
try {
  var t = localStorage.getItem('theme');
  var isDark = t !== 'light';
  var root = document.documentElement;
  if (isDark) root.classList.add('dark');
  else root.classList.remove('dark');
  root.style.backgroundColor = isDark ? '#050806' : '#f2fbf4';
  root.style.colorScheme = isDark ? 'dark' : 'light';
  // Mirror localStorage → cookie so server-render on next navigation
  // already has the correct .dark class (no flash on locale switch).
  if (t) {
    document.cookie = 'theme=' + t + '; path=/; max-age=31536000; samesite=lax';
  }
} catch (e) {}
`;

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
    // NOTE (audit #12): `alternates.canonical` was intentionally removed here.
    // A root-layout canonical applies to every sub-page, so each route was
    // advertising `/{locale}` as its canonical. Canonical URLs are now declared
    // per-page (see each page.tsx generateMetadata).
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

  // ── Theme from cookie (server-render-এই .dark class বসাই) ──
  // localStorage শুধু client-এ পড়া যায়, তাই soft navigation (locale switch)
  // -এ React <html> re-render করলে class wipe হয়ে flash হতো। Cookie দিয়ে
  // server-এই .dark class ধরে রাখি → flash সম্পূর্ণ বন্ধ।
  const themeCookie = (await cookies()).get("theme")?.value;
  const isDark = themeCookie !== "light";

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased${isDark ? " dark" : ""}`}
      suppressHydrationWarning
    >
      <head>
        {/* Critical inline CSS — CSS file লোড হওয়ার আগেই background ঠিক করে দেয় */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              'html,body{background:#050806;color-scheme:dark}' +
              'html:not(.dark),html:not(.dark) body{background:#f2fbf4;color-scheme:light}',
          }}
        />
        <meta name="color-scheme" content="dark light" />
        <meta name="theme-color" content="#050806" />
        {/* Theme restore script — server-rendered only, no React warning */}
        <ThemeInit id="theme-init" html={THEME_SCRIPT} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <I18nProvider locale={locale} dict={dict}>
            <ThemeSync />
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
