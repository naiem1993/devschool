import Link from "next/link";
import {
  DEFAULT_FOOTER,
  type FooterContent,
  type SocialLink,
  type SocialPlatform,
} from "@/lib/footer-content";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localeHref } from "@/lib/i18n/link";

/**
 * Design 05 — Two-tier + Watermark (final)
 *
 * • top green accent glow
 * • 4-column grid (brand + socials | Product | Resources | Company)
 * • giant outlined "DevSchool" watermark
 * • bottom strip (copyright · sitemap/robots · donate · Made with 💚 <credit>)
 *
 * Theme: server-rendered. Dark/light come from `.dark` class on <html>.
 * Watermark colors from `.ds-footer-watermark` rules in app/globals.css.
 *
 * Social links admin panel (/admin/settings) থেকে manage করা যায়।
 * `creditText` admin থেকে set — default 'Black_Zone'।
 */
export default function Footer({
  footer = DEFAULT_FOOTER,
  locale,
  dict,
}: {
  footer?: FooterContent;
  locale: Locale;
  dict: Dictionary;
}) {
  const year = new Date().getFullYear();
  const copyright = footer.copyright.replace(/\{year\}/g, String(year));
  const socials = footer.socialLinks ?? [];
  const t = dict.footer;

  return (
    <footer className="relative overflow-hidden border-t border-gray-200 bg-[#f2fbf4] dark:border-white/[0.08] dark:bg-[#050806]">
      {/* top green accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-3/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#22C55E]/40 to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-12">
          {/* brand + tagline + socials */}
          <div>
            <Link href={localeHref(locale, "/")} className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.55)]"
              />
              <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
                DevSchool
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-gray-600 dark:text-gray-400">
              {t.tagline}
            </p>

            {socials.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {socials.map((s, i) => (
                  <SocialIcon key={`${s.platform}-${i}`} link={s} />
                ))}
              </div>
            )}
          </div>

          <FooterCol title={t.colLearn}>
            <FooterLink href={localeHref(locale, "/tutorials")}>{t.linkTutorials}</FooterLink>
            <FooterLink href={localeHref(locale, "/challenges")}>{t.linkChallenges}</FooterLink>
            <FooterLink href={localeHref(locale, "/references")}>{t.linkReferences}</FooterLink>
            <FooterLink href={localeHref(locale, "/search")}>{t.linkSearch}</FooterLink>
          </FooterCol>

          <FooterCol title={t.colTools}>
            <FooterLink href={localeHref(locale, "/tools")}>{t.linkAllTools}</FooterLink>
            <FooterLink href={localeHref(locale, "/playground")}>{t.linkPlayground}</FooterLink>
            <FooterLink href={localeHref(locale, "/progress")}>{t.linkProgress}</FooterLink>
            <FooterLink href={localeHref(locale, "/tools/json-formatter")}>{t.linkJsonFormatter}</FooterLink>
          </FooterCol>

          <FooterCol title={t.colSite}>
            <FooterLink href={localeHref(locale, "/about")}>{t.linkAbout}</FooterLink>
            <FooterLink href="/sitemap.xml">{t.linkSitemap}</FooterLink>
            <FooterLink href="/robots.txt">{t.linkRobots}</FooterLink>
            <FooterLink href={footer.donateLinkHref}>{footer.donateLinkLabel}</FooterLink>
          </FooterCol>
        </div>
      </div>

      {/* giant watermark */}
      <div
        aria-hidden="true"
        className="ds-footer-watermark select-none text-center text-[clamp(56px,13vw,170px)] font-black leading-[0.8] tracking-[-0.055em]"
      >
        DevSchool
      </div>

      {/* bottom strip */}
      <div className="relative z-10 border-t border-gray-200 bg-black/[0.015] px-6 py-6 dark:border-white/[0.08] dark:bg-white/[0.015] sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 font-mono text-[12.5px] text-gray-500 dark:text-gray-500 sm:flex-row sm:items-center">
          <div>{copyright}</div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-gray-400 dark:text-gray-600">
              {footer.donatePrompt}{" "}
              <Link
                href={footer.donateLinkHref}
                className="text-[#15803d] transition-colors hover:text-[#22C55E] dark:text-[#4ADE80]"
              >
                {footer.donateLinkLabel}
              </Link>
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {t.madeWith}
              {footer.creditText ? (
                <>
                  {" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {footer.creditText}
                  </span>
                </>
              ) : null}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- local subcomponents ---------- */

function SocialIcon({ link }: { link: SocialLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.platform}
      className="grid h-9 w-9 place-items-center rounded-[10px] border border-gray-200 text-gray-500 transition-all hover:-translate-y-0.5 hover:border-[#22C55E] hover:text-[#22C55E] hover:shadow-[0_0_14px_rgba(34,197,94,0.18)] dark:border-white/[0.08] dark:text-gray-400"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
        <PlatformPath platform={link.platform} />
      </svg>
    </a>
  );
}

function PlatformPath({ platform }: { platform: SocialPlatform }) {
  switch (platform) {
    case "github":
      return (
        <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.94 3.2 9.13 7.65 10.61.56.1.76-.24.76-.54v-1.9c-3.1.67-3.76-1.5-3.76-1.5-.5-1.29-1.24-1.63-1.24-1.63-1.01-.7.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.7 2.62 1.21 3.26.93.1-.72.39-1.21.71-1.49-2.48-.28-5.1-1.24-5.1-5.53 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.97 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.69.11 2.97.72.78 1.15 1.78 1.15 3 0 4.3-2.62 5.24-5.11 5.52.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.77.54 4.44-1.49 7.64-5.67 7.64-10.61C23.25 5.48 18.27.5 12 .5Z" />
      );
    case "twitter":
    case "x":
      return (
        <path d="M18.9 2H22l-7.5 8.6L23.3 22h-6.9l-5.4-7.1L4.8 22H1.7l8-9.2L1 2h7l4.9 6.5L18.9 2Zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20Z" />
      );
    case "youtube":
      return (
        <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.6 3.9 12 3.9 12 3.9s-7.6 0-9.4.5A3 3 0 0 0 .5 6.5C0 8.3 0 12 0 12s0 3.7.5 5.5a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.8.5-5.5.5-5.5s0-3.7-.5-5.5ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
      );
    case "discord":
      return (
        <path d="M20.3 4.6A19.8 19.8 0 0 0 15.4 3c-.2.4-.5.9-.6 1.3a18.3 18.3 0 0 0-5.5 0C9.2 3.9 8.9 3.4 8.7 3a19.7 19.7 0 0 0-5 1.6A20.4 20.4 0 0 0 .2 18a19.9 19.9 0 0 0 6 3c.5-.7.9-1.4 1.3-2.1-.7-.3-1.4-.6-2-1l.5-.4a14.2 14.2 0 0 0 12 0l.5.4c-.6.4-1.3.8-2 1 .4.7.8 1.4 1.3 2.1a19.8 19.8 0 0 0 6-3 20.3 20.3 0 0 0-3.5-13.4ZM8.3 15.3c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4Zm7.4 0c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4Z" />
      );
    case "linkedin":
      return (
        <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5v-9h3v9ZM6.5 8.25A1.75 1.75 0 1 1 6.5 4.75a1.75 1.75 0 0 1 0 3.5ZM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66Z" />
      );
    case "facebook":
      return (
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
      );
    case "instagram":
      return (
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.84-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
      );
    case "tiktok":
      return (
        <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1 0-5.18c.27 0 .53.04.77.12V9.66a5.76 5.76 0 0 0-.77-.05A5.76 5.76 0 1 0 15.63 15V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.29 4.29 0 0 1-3.33-1.48Z" />
      );
    case "telegram":
      return (
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42Z" />
      );
    default:
      return null;
  }
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 text-[11.5px] font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-500">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="inline-block text-[13.5px] text-gray-600 transition-all hover:pl-1 hover:text-[#22C55E] dark:text-gray-400"
      >
        {children}
      </Link>
    </li>
  );
}
