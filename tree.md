# DevSchool — Project Directory Tree

> Last updated: 2026-10-06
> Single Next.js (App Router) app — DB: Supabase (PostgreSQL) via Prisma
> Multi-language (i18n): English + Bengali

```
devschool/
├── .browser-screenshots/
├── .vscode/
│   └── settings.json
├── app/
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── challenges/
│   │   │   │   ├── [id]/edit/
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── chapters/
│   │   │   │   └── [id]/builder/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── donations/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── quizzes/
│   │   │   │   ├── [id]/edit/
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── references/
│   │   │   │   ├── [id]/edit/
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── reviews/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   ├── sponsors/
│   │   │   │   ├── [id]/edit/
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── tutorials/
│   │   │   │   ├── [id]/chapters/
│   │   │   │   ├── [id]/edit/
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── [locale]/
│   │   ├── (site)/
│   │   │   ├── about/page.tsx
│   │   │   ├── challenges/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── ChallengeWorkspace.tsx
│   │   │   │   │   ├── error.tsx
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   ├── not-found.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── ChallengeFilter.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── playground/
│   │   │   │   ├── PlaygroundClient.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── progress/
│   │   │   │   ├── ProgressClient.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── references/
│   │   │   │   ├── [slug]/
│   │   │   │   │   ├── CopyButton.tsx
│   │   │   │   │   ├── error.tsx
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   ├── not-found.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── ReferencesFilter.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── search/
│   │   │   │   ├── SearchClient.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── tools/
│   │   │   │   ├── base64/page.tsx
│   │   │   │   ├── color-picker/page.tsx
│   │   │   │   ├── image-base64/page.tsx
│   │   │   │   ├── image-to-pdf/page.tsx
│   │   │   │   ├── json-formatter/page.tsx
│   │   │   │   ├── lorem-ipsum/
│   │   │   │   │   ├── page.tsx
│   │   │   │   ├── ToolsGrid.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── tutorials/
│   │   │   │   ├── [slug]/
│   │   │   │   │   ├── [chapter]/
│   │   │   │   │   ├── error.tsx
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   ├── not-found.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── TutorialsFilter.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── about/                        # (empty)
│   │   ├── layout.tsx
│   ├── actions/
│   │   └── setLocale.ts
│   ├── api/
│   │   ├── admin/
│   │   │   ├── challenges/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── quiz/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── references/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── reviews/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── settings/route.ts
│   │   │   ├── sponsors/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   ├── upload/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── tutorials/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── chapters/
│   │   │   │   │   ├── groups/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── verify-pin/route.ts
│   │   ├── attempts/
│   │   │   ├── [deviceId]/route.ts
│   │   │   └── route.ts
│   │   ├── challenges/
│   │   │   └── [id]/route.ts
│   │   ├── hello/                        # (empty)
│   │   ├── quizzes/
│   │   │   └── [id]/route.ts
│   │   ├── references/
│   │   │   ├── [slug]/route.ts
│   │   │   └── route.ts
│   │   ├── reviews/route.ts
│   │   ├── search/route.ts
│   │   ├── sponsors/
│   │   │   ├── [id]/click/route.ts
│   │   │   └── image/[id]/route.ts
│   │   └── tutorials/
│   │       ├── [slug]/route.ts
│   │       └── route.ts
│   ├── global-error.tsx
│   ├── globals.css
│   ├── icon.svg
│   ├── not-found.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── admin/
│   │   ├── AdminHeader.tsx
│   │   ├── AdminShell.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── ChallengeForm.tsx
│   │   ├── ChaptersManager.tsx
│   │   ├── DeleteButton.tsx
│   │   ├── GroupsManager.tsx
│   │   ├── LessonsManager.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── PinModal.tsx
│   │   ├── QuizForm.tsx
│   │   ├── ReferenceForm.tsx
│   │   ├── ReviewModeration.tsx
│   │   ├── RichEditor.tsx
│   │   ├── SiteSettingsForm.tsx
│   │   ├── SponsorForm.tsx
│   │   ├── SponsorImageControl.tsx
│   │   ├── TerminalCard.tsx
│   │   └── TutorialForm.tsx
│   ├── tools/
│   │   ├── Base64Tool.tsx
│   │   ├── ColorPickerTool.tsx
│   │   ├── ImageBase64Tool.tsx
│   │   ├── ImageToPdfTool.tsx
│   │   ├── JsonFormatter.tsx
│   │   └── LoremIpsumTool.tsx
│   ├── CalloutBox.tsx
│   ├── ContentComingSoon.tsx
│   ├── ErrorBoundary.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── HomeErrorPanel.tsx
│   ├── HomeExtras.tsx
│   ├── HomeSearch.tsx
│   ├── LanguageSwitcher.tsx
│   ├── LanguageTabs.tsx
│   ├── LanguageTabsServer.tsx
│   ├── LessonContent.tsx
│   ├── LessonLink.tsx
│   ├── LessonSidebar.tsx
│   ├── LoadMoreTutorials.tsx
│   ├── NotFoundContent.tsx
│   ├── ReviewForm.tsx
│   ├── SponsorRail.tsx
│   ├── ThemeSync.tsx
│   ├── ThemeToggle.tsx
│   ├── TryIt.tsx
│   ├── TryItFullClient.tsx
│   ├── TutorialPromo.tsx
│   └── TutorialShell.tsx
├── content/
│   ├── css/
│   └── html/
├── lib/
│   ├── i18n/
│   │   ├── dictionaries/
│   │   │   ├── bn.ts
│   │   │   ├── en.ts
│   │   │   └── index.ts
│   │   ├── I18nProvider.tsx
│   │   ├── config.ts
│   │   ├── link.ts
│   │   ├── locale.ts
│   │   ├── localize.ts
│   │   └── pick.ts
│   ├── auth-token.ts
│   ├── auth.ts
│   ├── device.ts
│   ├── faq-content.ts
│   ├── footer-content.ts
│   ├── hero-content.ts
│   ├── pin.ts
│   ├── prisma.ts
│   ├── revalidate-tutorial.ts
│   ├── reviews-content.ts
│   ├── sandbox-runner.ts
│   ├── site-settings.ts
│   ├── site-url.ts
│   ├── sponsor-image.ts
│   ├── tools.ts
│   ├── tutorial-data.ts
│   ├── tutorial-types.ts
│   └── validators.ts
├── prisma/
│   ├── migrations/
│   ├── dev.db
│   ├── reset-admin.ts
│   ├── schema.prisma
│   ├── seed-admin.ts
│   ├── seed-challenge.ts
│   ├── seed-reviews.ts
│   └── seed.ts
├── public/
│   ├── ds-logo.svg
│   ├── favicon.svg
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── scripts/
│   ├── add-pin-env.mjs
│   ├── cleanup2.mjs
│   ├── db-inspect-tutorial.ts
│   ├── diagnose-db.ts
│   ├── fix-colors.mjs
│   ├── fix-search-vec-triggers.ts
│   ├── reset-tutorial-content.ts
│   ├── seed-course.ts
│   ├── seed-html-course.ts
│   ├── test-remote-db.ts
│   └── verify-html-seed.ts
├── .env
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── SUPABASE-SETUP.sql
├── demo_content.md
├── enbn.md
├── eslint.config.mjs
├── must_read.md
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── proxy.ts
├── start-next-devtools-proxy.cmd
├── tree.md
├── tsconfig.json
└── tsconfig.tsbuildinfo
```

## Notes

- **Architecture:** একটাই Next.js (App Router) অ্যাপ — DB = Supabase (PostgreSQL) via Prisma (`prisma/schema.prisma`, provider=postgresql)।
- **i18n:** সব পাবলিক পেজ `app/[locale]/(site)/`-এ (English + Bengali)। Dictionary: `lib/i18n/dictionaries/{en,bn}.ts`। Locale switch: `app/actions/setLocale.ts` + `components/LanguageSwitcher.tsx`।
- **Public site** `app/[locale]/(site)/` group-এ, **admin panel** `app/(admin)/admin/`-এ (locale ছাড়া), **API** `app/api/`-এ।
- **Admin delete protection:** `lib/pin.ts` + `components/admin/PinModal.tsx` + `app/api/admin/verify-pin/route.ts` (env `ADMIN_PIN`)।
- **Tools:** public টুল পেজ `app/[locale]/(site)/tools/*`, UI কম্পোনেন্ট `components/tools/*`।
- **Tutorial/chapter content:** `components/admin/TutorialForm.tsx`, `ChaptersManager.tsx`, `LessonsManager.tsx`, `GroupsManager.tsx`, `RichEditor.tsx` → `app/api/admin/tutorials/*`; sidebar auto-update `components/LessonSidebar.tsx` থেকে।
- **Sponsors:** `components/SponsorRail.tsx`, `app/api/sponsors/*`, admin CRUD `app/(admin)/admin/sponsors/*`।
- **Reviews:** `components/ReviewForm.tsx`, `ReviewModeration.tsx`, `app/api/reviews/*`।
- **Setup:** `SUPABASE-SETUP.sql` → Supabase SQL Editor-এ run → `.env`-এ `DATABASE_URL` সেট → `npx prisma db seed`।
