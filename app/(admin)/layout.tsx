import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site-url";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeInit from "@/components/ThemeInit";
import "../globals.css";

// ============================================================
//  ADMIN ROOT LAYOUT
//  Admin panel সবসময় বাংলায় — তাই lang="bn" hardcoded।
//  এটা admin-এর নিজের root (public site-এর থেকে আলাদা)।
//
//  Theming: admin panel is always dark. The <ThemeInit> script sets
//  the .dark class + background before first paint, and ThemeProvider
//  is locked with forcedTheme="dark" so user toggles are ignored.
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

// Admin is always dark — this script forces it before first paint.
const ADMIN_THEME_SCRIPT = `
try {
  var root = document.documentElement;
  root.classList.add('dark');
  root.style.backgroundColor = '#050806';
  root.style.colorScheme = 'dark';
} catch (e) {}
`;

export const metadata: Metadata = {
  title: "DevSchool — অ্যাডমিন প্যানেল",
  description: "DevSchool সাইটের অ্যাডমিন প্যানেল",
  metadataBase: new URL(SITE_URL),
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="dark" />
        <ThemeInit id="admin-theme-init" html={ADMIN_THEME_SCRIPT} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider forcedTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  );
}
