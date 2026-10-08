# DevSchool — Project Directory Tree & Architecture Guide

> **Last updated:** 2026-10-08
> **Type:** Single Next.js (App Router) app — DB: Supabase (PostgreSQL) via Prisma
> **Languages:** Multi-language (i18n): English + Bengali
> **Repo:** https://github.com/naiem1993/devschool

---

## 📖 প্রজেক্ট এক নজরে (Project Overview)

**DevSchool** হলো একটি দ্বিভাষিক (English + বাংলা) **learning platform**, যেখানে:

- 📚 **Tutorials** — chapter + lesson ভিত্তিক learning content (nested chapter support)
- 🧩 **Quizzes** — MCQ প্রশ্ন + score tracking (anonymous deviceId ভিত্তিক)
- 💻 **Code Challenges** — sandbox-এ কোড চালিয়ে test case যাচাই
- 📗 **References** — syntax cheat sheet + code example + tags
- 🛠️ **Tools** (৬টি) — Base64, Color Picker, Image→Base64, Image→PDF, JSON Formatter, Lorem Ipsum
- 🔍 **Search** — PostgreSQL full-text search (FTS) দিয়ে tutorial/reference/challenge
- 📊 **Progress** — anonymous device-based tracking (কোনো login লাগে না)
- 💰 **Donations** — support donation record (BDT)
- 🤝 **Sponsors** — gold / silver / bronze / partner tier
- ⭐ **Reviews** — ইউজার feedback (admin approve করলে homepage-এ দেখায়)
- 🎛️ **Admin Panel** — সব content CRUD (PIN-protected delete + bcrypt login)

---

## 🧰 টেক স্ট্যাক (Tech Stack)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.3.4 |
| UI | React | 19.2.8 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| ORM | Prisma Client | 5.22.0 |
| Database | PostgreSQL (Supabase) | 15+ |
| Validation | Zod | 3.23.8 |
| Auth | bcryptjs + custom JWT token | — |
| Code Editor | @monaco-editor/react | 4.7.0 |
| Animation | framer-motion | 13.2.0 |
| PDF | jspdf | 4.2.1 |
| Utils | lodash | 4.18.1 |

---

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

## 🗄️ ডাটা মডেল (Prisma Models — `prisma/schema.prisma`)

**মোট ১৭টি মডেল** — provider: `postgresql`, env: `DATABASE_URL` + `DIRECT_URL`

### 📚 Content Models

| Model | বাংলা | কাজ | Key Fields |
|-------|--------|-----|-----------|
| `Tutorial` | টিউটোরিয়াল | top-level learning container (Category বাদ দেওয়া 2026-09-21) | `slug` (unique), `titleBn/En`, `icon`, `difficulty`, `viewCount`, `isPublished` |
| `ChapterGroup` | চ্যাপ্টার গ্রুপ | sidebar-এর non-clickable section header (e.g. "HTML Forms") | `tutorialId`, `titleBn/En`, `sortOrder` |
| `Chapter` | চ্যাপ্টার | single-page (নিজের content) অথবা nested (lessons[] আছে) | `tutorialId`, `groupId?`, `slug`, `contentBn/En`, `codeExampleBn/En` |
| `Lesson` | লেসন | nested chapter-এর ভেতরের item | `chapterId`, `slug`, `contentBn/En`, `codeExampleBn/En` |
| `QuizQuestion` | কুইজ প্রশ্ন | MCQ per tutorial | `tutorialId`, `questionBn/En`, `explanationBn/En` |
| `QuizOption` | কুইজ অপশন | multiple-choice options | `questionId`, `textBn/En`, `isCorrect` |
| `CodeChallenge` | কোড চ্যালেঞ্জ | programming challenges | `tutorialId`, `starterCode`, `solution`, `difficulty`, `points` |
| `TestCase` | টেস্টকেস | input/output pair (isHidden = client-এ যায় না) | `challengeId`, `input`, `expectedOutput`, `isHidden` |
| `Reference` | রেফারেন্স | syntax cheat sheet | `tutorialId`, `slug` (unique), `syntaxBn/En`, `exampleBn/En`, `tags[]`, `language` |

### 📊 Progress & User Models

| Model | বাংলা | কাজ | Key Fields |
|-------|--------|-----|-----------|
| `QuizAttempt` | কুইজ প্রচেষ্টা | anonymous tracking (deviceId) | `deviceId`, `questionId`, `selectedId`, `isCorrect`, `timeTakenSec` |
| `ChallengeAttempt` | চ্যালেঞ্জ প্রচেষ্টা | anonymous tracking | `deviceId`, `challengeId`, `passed`, `passedCount`, `totalCount`, `codeSubmitted` |
| `AdminUser` | অ্যাডমিন | email + password (bcrypt) | `email` (unique), `passwordHash`, `isActive`, `lastLoginAt` |
| `PinLockout` | PIN লক | singleton — delete-PIN lockout state (env-এ PIN, DB-তে lock state) | `id = "singleton"`, `failedAttempts`, `lockedUntil` |

### 🌐 Site Models

| Model | বাংলা | কাজ | Key Fields |
|-------|--------|-----|-----------|
| `Review` | রিভিউ | user feedback (admin approved only) | `name`, `role`, `stars`, `text`, `status: pending\|approved`, `deviceId` |
| `ReviewCooldown` | রিভিউ কুলডাউন | ১ device ৩০ দিনে মাত্র ১বার review | `deviceId` (unique), `lastSubmittedAt` |
| `Donation` | দান | support donation record | `amount`, `currency` (BDT), `donorName/Email`, `transactionId` (unique), `status` |
| `SiteSettings` | সাইট সেটিংস | admin config (JSONB value) | `key` (unique), `value: Json`, `description` |
| `SponsorImage` | স্পন্সর ছবি | DB-blob mode — hash দিয়ে dedup (একই ছবি ২বার save হয় না) | `hash` (unique), `mimeType`, `sizeBytes`, `data: Bytes` |
| `Sponsor` | স্পন্সর | sponsor listing | `name`, `logoUrl`, `imageId?`, `tier` (gold\|silver\|bronze\|partner), `priority`, `isActive`, `impressions`, `clicks` |

> ⚠️ **Note:** `Category` model **বাদ দেওয়া হয়েছে** (2026-09-21) — Tutorial এখন top-level entity।

---

## 🔌 API Routes (`app/api/`)

### 🌍 Public API

| Route | Method | কাজ |
|-------|--------|-----|
| `/api/tutorials` | GET | pagination + search + filter (category, difficulty, sort) |
| `/api/tutorials/[slug]` | GET | single tutorial + contents + quiz + challenges |
| `/api/challenges/[id]` | GET | challenge + hidden testcases (expected output client-এ যায় না) |
| `/api/quizzes/[id]` | GET | quiz questions (correct answers hidden) |
| `/api/references` | GET | reference list |
| `/api/references/[slug]` | GET | single reference by slug |
| `/api/search` | GET | full-text search (tutorial + reference + challenge) |
| `/api/reviews` | GET / POST | review list / নতুন review জমা |
| `/api/attempts` | POST | quiz/challenge attempt save |
| `/api/attempts/[deviceId]` | GET | device-এর attempt history |
| `/api/sponsors/[id]/click` | POST | sponsor click track |
| `/api/sponsors/image/[id]` | GET | sponsor image blob serve |

### 🔒 Admin API (`/api/admin/`)

| Route | Method | কাজ |
|-------|--------|-----|
| `/api/admin/login` | POST | admin login (bcrypt + token) |
| `/api/admin/verify-pin` | POST | delete-PIN যাচাই (env `ADMIN_PIN`) |
| `/api/admin/tutorials` | GET / POST | tutorial list / নতুন তৈরি |
| `/api/admin/tutorials/[id]` | GET / PATCH / DELETE | tutorial CRUD |
| `/api/admin/tutorials/[id]/chapters` | GET / POST / PATCH / DELETE | chapters manage |
| `/api/admin/tutorials/[id]/groups` | GET / POST / PATCH / DELETE | chapter groups manage |
| `/api/admin/challenges` | GET / POST | challenge list / create |
| `/api/admin/challenges/[id]` | GET / PATCH / DELETE | challenge CRUD |
| `/api/admin/quiz` | GET / POST | quiz list / create |
| `/api/admin/quiz/[id]` | GET / PATCH / DELETE | quiz CRUD |
| `/api/admin/references` | GET / POST | reference list / create |
| `/api/admin/references/[id]` | GET / PATCH / DELETE | reference CRUD |
| `/api/admin/reviews` | GET | review moderation list |
| `/api/admin/reviews/[id]` | PATCH / DELETE | approve/reject/delete review |
| `/api/admin/settings` | GET / PATCH | site settings |
| `/api/admin/sponsors` | GET / POST | sponsor list / create |
| `/api/admin/sponsors/[id]` | GET / PATCH / DELETE | sponsor CRUD |
| `/api/admin/sponsors/upload` | POST | sponsor image upload |

---

## 🏗️ আর্কিটেকচার (Architecture Overview)

### Route Groups (Next.js App Router)

```
app/
├── (admin)/admin/          ← 🔒 Admin panel (no locale prefix)
│   ├── dashboard/             — stats overview
│   ├── tutorials/             — CRUD + chapters builder
│   ├── chapters/[id]/builder/ — nested chapter/lesson builder
│   ├── quizzes/               — quiz CRUD
│   ├── challenges/            — challenge CRUD
│   ├── references/            — reference CRUD
│   ├── reviews/               — moderation
│   ├── sponsors/              — sponsor CRUD + image upload
│   ├── donations/             — donation list
│   ├── settings/              — site settings
│   └── login/                 — admin login (bcrypt)
│
├── [locale]/(site)/        ← 🌍 Public site (English + Bengali)
│   ├── page.tsx               — home (hero, featured, reviews)
│   ├── tutorials/             — tutorial list + [slug]/[chapter]
│   ├── challenges/            — challenges list + [id] workspace
│   ├── playground/            — code playground
│   ├── references/            — reference list + [slug]
│   ├── search/                — full-text search UI
│   ├── progress/              — user progress dashboard
│   ├── tools/                 — ৬টি utility tools
│   └── about/                 — about page
│
└── api/                    ← 🔌 REST endpoints (see above)
```

### i18n Strategy

- **Public pages** → `app/[locale]/(site)/` — `en` / `bn` dynamic segment
- **Admin panel** → `app/(admin)/admin/` — locale ছাড়া (single language)
- **Dictionaries:**
  - `lib/i18n/dictionaries/en.ts` (28.6 KB)
  - `lib/i18n/dictionaries/bn.ts` (49.0 KB) — বাংলা ভার্সন বড়
  - `lib/i18n/dictionaries/index.ts` — combiner
- **Locale switching:** `app/actions/setLocale.ts` (server action) + `components/LanguageSwitcher.tsx`
- **Helpers:** `lib/i18n/{config, link, locale, localize, pick}.ts`

---

## 📁 গুরুত্বপূর্ণ ফাইল (Key Files & Roles)

### 🏠 Root Files

| File | কাজ |
|------|-----|
| `package.json` | dependencies + scripts (dev, build, seed, db:*, typecheck) |
| `next.config.ts` | Next.js config |
| `tsconfig.json` | TypeScript config |
| `postcss.config.mjs` | Tailwind/PostCSS config |
| `eslint.config.mjs` | ESLint config |
| `README.md` | setup guide (migrations, seeding, API docs) |
| `must_read.md` | জরুরি নির্দেশনা |
| `AGENTS.md` | AI agent instructions |
| `SUPABASE-SETUP.sql` | Supabase schema setup SQL |
| `demo_content.md` | demo data |
| `enbn.md` | i18n notes |
| `proxy.ts` | dev proxy |
| `start-next-devtools-proxy.cmd` | Windows dev helper |

### 🧠 Core Logic (`lib/`)

| File | কাজ |
|------|-----|
| `prisma.ts` | Prisma client singleton |
| `auth.ts` | admin login (bcrypt) |
| `auth-token.ts` | token generation/verify |
| `pin.ts` | delete-PIN check + lockout logic |
| `validators.ts` | সব Zod schemas (14.2 KB) |
| `sandbox-runner.ts` | code challenge sandbox (8.9 KB) |
| `device.ts` | deviceId helper |
| `site-settings.ts` | settings cache |
| `revalidate-tutorial.ts` | ISR revalidation |
| `tutorial-data.ts` | tutorial query helpers |
| `tutorial-types.ts` | TS types |
| `sponsor-image.ts` | sponsor image handling |
| `tools.ts` | tools metadata |
| `hero-content.ts`, `faq-content.ts`, `footer-content.ts`, `reviews-content.ts` | static content |

### 🎛️ Admin Components (`components/admin/`)

| File | কাজ |
|------|-----|
| `AdminSidebar.tsx`, `AdminShell.tsx`, `AdminHeader.tsx` | layout |
| `TutorialForm.tsx` | tutorial create/edit |
| `ChaptersManager.tsx` (21.4 KB) | chapter CRUD + ordering |
| `LessonsManager.tsx` (19.5 KB) | lesson CRUD |
| `GroupsManager.tsx` | chapter group CRUD |
| `RichEditor.tsx` | content editor (markdown/rich) |
| `ChallengeForm.tsx`, `QuizForm.tsx`, `ReferenceForm.tsx` | forms |
| `SiteSettingsForm.tsx` (29.2 KB) | settings UI |
| `SponsorForm.tsx`, `SponsorImageControl.tsx` | sponsor management |
| `PinModal.tsx` | delete-PIN modal |
| `ReviewModeration.tsx` | review approve/reject |
| `TerminalCard.tsx`, `DeleteButton.tsx`, `LogoutButton.tsx` | UI helpers |

### 🌍 Public Components (`components/`)

| File | কাজ |
|------|-----|
| `Header.tsx`, `Footer.tsx`, `HeroSection.tsx` (14.8 KB), `HomeExtras.tsx` (20.5 KB) | home layout |
| `HomeSearch.tsx` | home search box |
| `LessonSidebar.tsx` | tutorial sidebar (auto-update) |
| `LessonContent.tsx`, `LessonLink.tsx` | lesson render |
| `TutorialShell.tsx`, `TutorialPromo.tsx` | tutorial UI |
| `LanguageSwitcher.tsx`, `LanguageTabs.tsx`, `LanguageTabsServer.tsx` | i18n |
| `TryIt.tsx`, `TryItFullClient.tsx` | live code try |
| `ReviewForm.tsx` | review submit form |
| `SponsorRail.tsx` | sponsor list |
| `ThemeToggle.tsx`, `ThemeSync.tsx` | dark/light mode |
| `CalloutBox.tsx`, `ErrorBoundary.tsx`, `NotFoundContent.tsx`, `ContentComingSoon.tsx` | UI helpers |

### 🛠️ Tools (`components/tools/`)

| File | কাজ |
|------|-----|
| `Base64Tool.tsx` (14.7 KB) | encode/decode Base64 |
| `ColorPickerTool.tsx` (16.6 KB) | color picker |
| `ImageBase64Tool.tsx` (25.3 KB) | image → Base64 |
| `ImageToPdfTool.tsx` (23.8 KB) | image → PDF (jspdf) |
| `JsonFormatter.tsx` (17.5 KB) | JSON beautify/validate |
| `LoremIpsumTool.tsx` (13.6 KB) | dummy text generator |

---

## ⚙️ Setup & Dev Commands

### 🚀 Initial Setup

```bash
# 1. Install dependencies
npm install

# 2. Environment variables (.env)
cp .env.example .env
# .env-এ সেট করুন:
#   DATABASE_URL       — Supabase PostgreSQL URL
#   DIRECT_URL         — Supabase direct URL
#   ADMIN_PIN          — delete-PIN (numeric)
#   ADMIN_TOKEN_SECRET — JWT secret

# 3. Supabase schema setup (SQL Editor-এ run)
#   → SUPABASE-SETUP.sql run করুন

# 4. Prisma client generate + DB push
npm run db:generate
npm run db:push        # অথবা: npx prisma migrate dev --name init

# 5. Seed demo data
npm run seed           # main seed
npm run seed:admin     # admin user
npm run seed:html      # HTML course data
npm run seed:course    # course data

# 6. Dev server
npm run dev            # → http://localhost:3000
```

### 📜 Useful Scripts

| Script | কাজ |
|--------|-----|
| `npm run dev` | dev server (next dev) |
| `npm run build` | production build |
| `npm run start` | production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run db:generate` | Prisma client generate |
| `npm run db:push` | schema push (no migration) |
| `npm run db:migrate` | migration deploy |
| `npm run db:seed` | `prisma db seed` |
| `npm run seed` | demo data seed |
| `npm run seed:admin` | admin user seed |
| `npm run seed:html` / `seed:course` | course data |
| `npm run inspect:tutorials` | tutorial inspect |
| `npm run diagnose:db` | DB diagnostic |
| `npm run reset:admin` | admin password reset |

### 🖥️ Prisma Studio (GUI)

```bash
npx prisma studio   # → http://localhost:5555
```

---

## 📝 Notes (মূল নিয়ম)

- **Architecture:** একটাই Next.js (App Router) অ্যাপ — DB = Supabase (PostgreSQL) via Prisma (`prisma/schema.prisma`, provider=postgresql)။
- **i18n:** সব পাবলিক পেজ `app/[locale]/(site)/`-এ (English + Bengali)। Dictionary: `lib/i18n/dictionaries/{en,bn}.ts`। Locale switch: `app/actions/setLocale.ts` + `components/LanguageSwitcher.tsx`।
- **Public site** `app/[locale]/(site)/` group-এ, **admin panel** `app/(admin)/admin/`-এ (locale ছাড়া), **API** `app/api/`-এ।
- **Admin delete protection:** `lib/pin.ts` + `components/admin/PinModal.tsx` + `app/api/admin/verify-pin/route.ts` (env `ADMIN_PIN`)।
- **Tools:** public টুল পেজ `app/[locale]/(site)/tools/*`, UI কম্পোনেন্ট `components/tools/*`।
- **Tutorial/chapter content:** `components/admin/TutorialForm.tsx`, `ChaptersManager.tsx`, `LessonsManager.tsx`, `GroupsManager.tsx`, `RichEditor.tsx` → `app/api/admin/tutorials/*`; sidebar auto-update `components/LessonSidebar.tsx` থেকে।
- **Sponsors:** `components/SponsorRail.tsx`, `app/api/sponsors/*`, admin CRUD `app/(admin)/admin/sponsors/*`।
- **Reviews:** `components/ReviewForm.tsx`, `ReviewModeration.tsx`, `app/api/reviews/*`।
- **Setup:** `SUPABASE-SETUP.sql` → Supabase SQL Editor-এ run → `.env`-এ `DATABASE_URL` সেট → `npx prisma db seed`।
//

✅ End of file.