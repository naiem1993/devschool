# DevSchool — Project Directory Tree

> Last updated: 2026-09-17
> Single Next.js (App Router) app — DB: Supabase (PostgreSQL) via Prisma

```
devschool/
├── .browser-screenshots/
│   ├── 1789563951839.png
│   └── 1789572195586.png
├── .vscode/
│   └── settings.json
├── app/
│   ├── (site)/
│   │   ├── categories/
│   │   │   ├── [slug]/
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── not-found.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── CategoriesFilter.tsx
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── challenges/
│   │   │   ├── [id]/
│   │   │   │   ├── ChallengeWorkspace.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── not-found.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── ChallengeFilter.tsx
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── playground/
│   │   │   ├── loading.tsx
│   │   │   ├── page.tsx
│   │   │   └── PlaygroundClient.tsx
│   │   ├── progress/
│   │   │   ├── loading.tsx
│   │   │   ├── page.tsx
│   │   │   └── ProgressClient.tsx
│   │   ├── references/
│   │   │   ├── [slug]/
│   │   │   │   ├── CopyButton.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── not-found.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── page.tsx
│   │   │   └── ReferencesFilter.tsx
│   │   ├── search/
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── page.tsx
│   │   │   └── SearchClient.tsx
│   │   ├── tools/
│   │   │   ├── page.tsx
│   │   │   └── ToolsGrid.tsx
│   │   ├── tutorials/
│   │   │   └── [slug]/
│   │   │       ├── [chapter]/
│   │   │       ├── loading.tsx
│   │   │       ├── not-found.tsx
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── actions/                          # (empty)
│   ├── admin/
│   │   ├── categories/
│   │   │   ├── [id]/edit/
│   │   │   ├── new/page.tsx
│   │   │   └── page.tsx
│   │   ├── challenges/
│   │   │   ├── [id]/edit/
│   │   │   ├── new/page.tsx
│   │   │   └── page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── donations/page.tsx
│   │   ├── login/page.tsx
│   │   ├── quizzes/
│   │   │   ├── [id]/edit/
│   │   │   ├── new/page.tsx
│   │   │   └── page.tsx
│   │   ├── references/
│   │   │   ├── [id]/edit/
│   │   │   ├── new/page.tsx
│   │   │   └── page.tsx
│   │   ├── tutorials/
│   │   │   ├── [id]/chapters/
│   │   │   ├── [id]/edit/
│   │   │   ├── new/page.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   ├── admin/
│   │   │   ├── categories/
│   │   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   ├── challenges/
│   │   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── quiz/
│   │   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   ├── references/
│   │   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   ├── tutorials/
│   │   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── verify-pin/route.ts
│   │   ├── attempts/
│   │   │   ├── [deviceId]/route.ts
│   │   │   └── route.ts
│   │   ├── categories/route.ts
│   │   ├── challenges/
│   │   │   └── [id]/route.ts
│   │   ├── hello/                        # (empty)
│   │   ├── quizzes/
│   │   │   └── [id]/route.ts
│   │   ├── references/
│   │   │   ├── [slug]/route.ts
│   │   │   └── route.ts
│   │   ├── search/route.ts
│   │   └── tutorials/
│   │       ├── [slug]/route.ts
│   │       └── route.ts
│   ├── globals.css
│   ├── icon.svg
│   ├── layout.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── admin/
│   │   ├── AdminHeader.tsx
│   │   ├── AdminShell.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── CategoryForm.tsx
│   │   ├── ChallengeForm.tsx
│   │   ├── ChaptersManager.tsx
│   │   ├── DeleteButton.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── PinModal.tsx
│   │   ├── QuizForm.tsx
│   │   ├── ReferenceForm.tsx
│   │   ├── RichEditor.tsx
│   │   ├── TerminalCard.tsx
│   │   └── TutorialForm.tsx
│   ├── CalloutBox.tsx
│   ├── CategoryNav.tsx
│   ├── ErrorBoundary.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── HomeSearch.tsx
│   ├── LessonContent.tsx
│   ├── LessonLink.tsx
│   ├── LessonSidebar.tsx
│   ├── LoadMoreTutorials.tsx
│   ├── ThemeToggle.tsx
│   ├── TryIt.tsx
│   ├── TryItFullClient.tsx
│   ├── TutorialPromo.tsx
│   └── TutorialShell.tsx
├── lib/
│   ├── auth-token.ts
│   ├── auth.ts
│   ├── device.ts
│   ├── pin.ts
│   ├── prisma.ts
│   ├── sandbox-runner.ts
│   ├── tools.ts
│   └── validators.ts
├── prisma/
│   ├── migrations/
│   │   ├── 001_init/migration.sql
│   │   ├── 002_fts_and_attempts/migration.sql
│   │   └── migration_lock.toml
│   ├── dev.db
│   ├── reset-admin.ts
│   ├── schema.prisma
│   ├── seed-admin.ts
│   ├── seed-challenge.ts
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
│   ├── add-html-paragraphs.ts
│   ├── add-pin-env.mjs
│   ├── fix-colors.mjs
│   ├── inspect-tutorials.ts
│   └── merge-html-lessons.ts
├── .env
├── .env.bak
├── .gitignore
├── .mcp-dev-3000.log
├── AGENTS.md
├── CLAUDE.md
├── PROGRESS.md
├── README.md
├── eslint.config.mjs
├── must_read.md
├── next-env.d.ts
├── next.config.ts
├── next.config.ts.bak
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── proxy.ts
├── start-next-devtools-proxy.cmd
├── SUPABASE-SETUP.sql
├── tree.md
├── tsconfig.json
└── tsconfig.tsbuildinfo
```

## Notes

- **Architecture:** একটাই Next.js (App Router) অ্যাপ — পুরনো `backend/` + `frontend/` স্প্লিট আর নেই। DB = Supabase (PostgreSQL) via Prisma (`prisma/schema.prisma`, provider=postgresql)।
- **Public site** `app/(site)/` group-এ, **admin panel** `app/admin/`-এ, **API** `app/api/`-এ।
- **Admin delete protection:** `lib/pin.ts` + `components/admin/PinModal.tsx` + `app/api/admin/verify-pin/route.ts` (env `ADMIN_PIN`)।
- **Tutorial/chapter content:** `components/admin/TutorialForm.tsx`, `ChaptersManager.tsx`, `RichEditor.tsx` → `app/api/admin/tutorials/route.ts`; sidebar auto-update `components/LessonSidebar.tsx` থেকে।
- **Setup:** `SUPABASE-SETUP.sql` → Supabase SQL Editor-এ run → `.env`-এ `DATABASE_URL` সেট → `npx prisma db seed`।
