<div align="center">

# 🎓 DevSchool

**A full-stack, bilingual programming education platform — built for Bangla-speaking developers who want to learn by doing.**

Tutorials · Code Challenges · Interactive Quizzes · Live Sandbox · Dev Tools

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-149eca?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](#-license)

</div>

---

## ✨ Overview

DevSchool is a production-grade learning platform for mastering programming — **in Bangla and English**. It ships with everything a beginner-to-intermediate developer needs: structured tutorials, hands-on coding challenges, interactive quizzes, a live in-browser sandbox, a growing reference library, and a curated set of developer tools — all inside a fast, accessible, dark/light UI.

Following a **W3Schools-style open-access model**, all public content is freely readable without authentication. Admin operations are protected by a layered security model (HMAC-signed sessions + per-route database checks + a PIN gate for destructive actions).

> **Built with an opinionated, zero-`any` TypeScript codebase.** Every route, component, and helper is strictly typed — no `any`, no `as any`, no `@ts-ignore`. `npm run lint` returns **0 problems** repo-wide.

---

## 🎯 Features

### 🧑‍🎓 For learners

| Feature | Description |
|---|---|
| **Bilingual content** | Every tutorial, chapter, lesson, quiz, and reference is available in Bangla and English |
| **Structured tutorials** | Grouped navigation: tutorials → chapter groups → chapters → lessons, with reading progress |
| **In-browser playground** | Full HTML/CSS/JS editor with live iframe preview, keyboard shortcuts, and theme sync |
| **Code challenges** | Execute against visible + hidden test cases; supports JS/TS/HTML/CSS (in-browser) and Python/Java/C++/etc. (remote sandbox) |
| **Interactive quizzes** | Anti-memorize option shuffle, per-question feedback, explanation, best-score persistence |
| **Progress page** | Accuracy stats, challenge pass rate, recent activity — device-bound (no login required) |
| **Reference library** | Quick syntax lookup with tags, language filter, and full-text search |
| **Dev tools (6)** | Base64 encoder/decoder, image → Base64, image → PDF, JSON formatter/minifier, Lorem Ipsum generator, color picker |
| **Search** | PostgreSQL full-text search with locale-aware ILIKE fallback (works without `searchVec` column) |
| **Dark / light theme** | Flash-free switching via server-rendered cookie sync |

### 🛠️ For admins

| Feature | Description |
|---|---|
| **Full CRUD** | Tutorials, chapters, groups, lessons, quizzes, challenges, references, sponsors, reviews, site settings |
| **Bulk import** | Paste-and-parse bulk creation for challenges, quizzes, and references |
| **AI content generation** | Gemini-powered generation of challenges, quizzes, and references |
| **Site settings** | Editable hero, footer, FAQ (paired BN/EN), reviews config |
| **PIN-gated deletes** | Destructive operations require a fresh 2-minute PIN token; 3 failed attempts = permanent lockout |
| **Review moderation** | Approve / reject user-submitted reviews with 30-day device cooldown |
| **Sponsor management** | Logo upload with client-side resize, drag-order priority, click tracking |

---

## 🏗️ Tech Stack

| Layer | Choice |
|---|---|
| **Framework** | Next.js 16.3.4 (App Router, Turbopack, RSC) |
| **UI** | React 19.2 · Tailwind CSS v4 · Framer Motion |
| **Language** | TypeScript 5 (strict mode) |
| **Database** | PostgreSQL (Supabase) via Prisma 5.22 |
| **Auth** | Custom HMAC-SHA256 signed cookies (Edge-safe) |
| **Validation** | Zod 3.23 on every mutation route |
| **Rich text** | TipTap 3 (admin lesson editor) |
| **Code editor** | Monaco Editor + iframe sandbox |
| **PDF** | jsPDF (client-side generation) |
| **AI** | Google Generative AI (Gemini) |
| **Markdown** | react-markdown + remark-gfm + rehype-raw |
| **Icons** | lucide-react |

---

## 🔐 Security Model

DevSchool uses **defense-in-depth** for its admin surface. No single layer is trusted on its own.

```
                  ┌──────────────────────────────────────────┐
                  │  1. proxy.ts (Edge middleware)           │
                  │     • /admin/*      → redirect if no auth│
                  │     • /api/admin/* → 401 JSON if no auth │
                  │     • HMAC verify of session cookie      │
                  └────────────────────┬─────────────────────┘
                                       ▼
                  ┌──────────────────────────────────────────┐
                  │  2. Per-route requireAdmin()             │
                  │     • Verifies HMAC again                │
                  │     • Loads AdminUser from DB            │
                  │     • Rejects if `isActive = false`      │
                  └────────────────────┬─────────────────────┘
                                       ▼
                  ┌──────────────────────────────────────────┐
                  │  3. PIN gate (destructive ops only)      │
                  │     • DELETE requires `x-pin-token` hdr  │
                  │     • Token TTL = 2 minutes              │
                  │     • 3 failed PINs → permanent lockout  │
                  └──────────────────────────────────────────┘
```

**Additional hardening:**

- **Login rate limit** — 5 attempts / minute / IP (in-memory, per-process)
- **Review cooldown** — 30-day device-bound cooldown to prevent spam
- **Security headers** — `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`
- **Constant-time comparison** — HMAC signatures compared in constant time (timing-attack resistant)
- **PIN stored in env** — never persisted to the DB

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** and **npm 10+**
- **PostgreSQL 15+** (local or Supabase)
- A **Google AI (Gemini)** API key (optional — only for AI generation features)

### 1. Install dependencies

```bash
npm install
```

`postinstall` runs `prisma generate` automatically.

### 2. Configure environment

Create a `.env` file in the project root:

```bash
# ── Database ─────────────────────────────────────────────
# Use the pooled URL for runtime, direct URL for migrations.
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"

# ── Admin auth ───────────────────────────────────────────
# Generate a random 32+ character secret:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ADMIN_SECRET_KEY="your-32-plus-char-random-string-here"

# Required for DELETE operations. Any short string works.
ADMIN_PIN="123456"

# ── AI (optional) ────────────────────────────────────────
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Set up the database

```bash
# Apply migrations
npm run db:migrate

# Seed the admin user (creates ADMIN_EMAIL + ADMIN_PASSWORD — check the script for defaults)
npm run seed:admin

# Optional: seed demo tutorials, challenges, reviews, and the HTML course
npm run seed
npm run seed:challenge
npm run seed:html
```

### 4. Run the dev server

```bash
npm run dev
```

Open **http://localhost:3000** — you should be redirected to `/bn` (locale guard). Admin panel lives at **/admin/login**.

---

## 📜 Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server (Turbopack, hot reload) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | ESLint (targeting 0 problems) |
| `npm run typecheck` | `tsc --noEmit` — must be 0 errors |
| `npm run seed` | Seed demo tutorials, references, quizzes |
| `npm run seed:admin` | Create / reset the admin user |
| `npm run seed:challenge` | Seed demo coding challenges |
| `npm run seed:html` | Seed the HTML course (15 chapters) |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:push` | Push schema directly (dev only) |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run diagnose:db` | One-off DB diagnostic (triggers, policies, columns) |
| `npm run fix:searchvec` | Drop stale `searchVec` triggers |
| `npm run reset:admin` | Force-reset the admin password |

---

## 📁 Project Structure

```
.
├── app/
│   ├── (admin)/admin/          # Admin panel (protected by proxy.ts)
│   ├── [locale]/(site)/        # Public site (bn + en)
│   ├── api/                    # Route handlers (search, auth, CRUD)
│   ├── global-error.tsx        # Root error boundary
│   └── layout.tsx              # Root layout with font + theme setup
│
├── components/
│   ├── admin/                  # Admin-only UI (forms, managers, modals)
│   ├── tools/                  # The 6 dev tools
│   ├── site/                   # Public site components
│   └── ui/                     # Shared UI primitives
│
├── lib/
│   ├── i18n/                   # Dictionaries, locale helpers, provider
│   ├── ai/                     # Gemini client + prompts
│   ├── api-error.ts            # getErrorMessage / serverError / getErrorCode
│   ├── auth.ts                 # Server-side auth (Prisma-backed)
│   ├── auth-token.ts           # Edge-safe HMAC sign/verify
│   ├── pin.ts                  # PIN gate + lockout logic
│   ├── validators.ts           # All Zod schemas
│   └── prisma.ts               # Prisma client singleton
│
├── prisma/
│   ├── schema.prisma           # Data model (17 models)
│   └── seed*.ts                # Seed scripts
│
├── scripts/                    # Dev-only diagnostics and one-off fixes
├── proxy.ts                    # Edge middleware (auth + locale guard)
└── next.config.ts              # Security headers, image optimization
```

---

## 🎨 Design System

- **Neo-brutalist + terminal-inspired** aesthetic — dark mode primary, emerald accent
- **Monospace typography** for code and labels, **sans-serif** for prose
- **Motion-aware** — respects `prefers-reduced-motion`
- **Fully responsive** — mobile-first drawer navigation, sticky desktop sidebar
- **Accessibility** — semantic HTML, ARIA labels on all interactive controls, `role="status"` live regions

---

## 🚢 Deployment

### Vercel (recommended)

1. Push the repo to GitHub
2. Import into Vercel
3. Add the same environment variables from `.env` (use **pooled** URLs from Supabase)
4. Deploy — Next.js will detect the project automatically

```bash
# Trigger a redeploy via CLI
vercel --prod
```

### Database

Use **Supabase** (recommended) or any managed PostgreSQL:
- `DATABASE_URL` → pooled connection (`:6543`, `pgbouncer=true`)
- `DIRECT_URL` → direct connection (`:5432`) — used only by migrations

---

## 🗺️ Roadmap

- [ ] Automated test suite — Vitest for unit + Playwright for E2E (smoke of the 4 critical flows)
- [ ] Strict Content-Security-Policy (nonce-based)
- [ ] Admin editor `key={id}` refactor (removes 3 `useEffect` prop→state syncs)
- [ ] Additional languages (Hindi, Spanish)
- [ ] Public user accounts with cross-device progress sync
- [ ] Interactive SQL / Python challenges in-browser (currently remote sandbox only)

---

## 🧪 Testing Status

The project currently has **no automated test suite** — this is intentional for the MVP phase. All code has been verified by:
- Strict TypeScript (`tsc --noEmit` — 0 errors)
- ESLint (0 problems, repo-wide)
- Production builds (97/97 pages)
- Manual smoke tests of every user flow (auth, CRUD, search, challenge execution)

Adding Vitest + Playwright is on the roadmap.

---

## 🤝 Contributing

This is a personal learning project, but issues and suggestions are welcome. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Ensure `npm run lint` and `npm run typecheck` both pass
4. Commit with a clear message (`feat:`, `fix:`, `chore:`, `docs:`)
5. Open a pull request

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- **[Next.js](https://nextjs.org/)** — the framework that makes all of this possible
- **[Supabase](https://supabase.com/)** — managed Postgres
- **[Prisma](https://www.prisma.io/)** — type-safe database access
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling
- **[Vercel](https://vercel.com/)** — deployment platform

---

<div align="center">

**Built with ❤️ for Bangla-speaking developers.**

[Report an issue](https://github.com/YOUR_USERNAME/devschool/issues) · [Request a feature](https://github.com/YOUR_USERNAME/devschool/issues)

</div>
