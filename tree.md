# 📁 devschool — Project Tree

> Auto-generated from MCP `get_project_tree`
> Stack: Next.js (App Router) + TypeScript + Prisma (SQLite) + Tailwind

```text
devschool/
├── 📄 .env
├── 📄 .gitignore
├── 📄 .mcp-dev-3000.log
├── 📄 AGENTS.md
├── 📄 CLAUDE.md
├── 📄 custom_command.md
├── 📄 project-tree.md
├── 📄 README.md
├── 📄 run-proxy.js
├── 📄 start-next-devtools-proxy.cmd
├── 📄 proxy.ts
├── 📄 package.json
├── 📄 package.json.bak
├── 📄 next.config.ts
├── 📄 tsconfig.json
├── 📄 tsconfig.tsbuildinfo
├── 📄 postcss.config.mjs
├── 📄 eslint.config.mjs
├── 📄 tsc-out.txt
├── 📄 tsc_errors.txt
│
├── 📁 .vscode/
│   └── 📄 settings.json
│
├── 📁 app/
│   ├── 📄 layout.tsx
│   ├── 📄 globals.css
│   ├── 📄 favicon.ico
│   ├── 📁 (site)/
│   │   ├── 📄 layout.tsx
│   │   ├── 📄 page.tsx
│   │   ├── 📁 categories/
│   │   │   ├── 📄 page.tsx
│   │   │   ├── 📄 loading.tsx
│   │   │   ├── 📄 error.tsx
│   │   │   ├── 📄 CategoriesFilter.tsx
│   │   │   └── 📁 [slug]/
│   │   │       ├── 📄 page.tsx
│   │   │       ├── 📄 loading.tsx
│   │   │       └── 📄 not-found.tsx
│   │   ├── 📁 challenges/
│   │   │   ├── 📄 page.tsx
│   │   │   ├── 📄 loading.tsx
│   │   │   ├── 📄 error.tsx
│   │   │   ├── 📄 ChallengeFilter.tsx
│   │   │   └── 📁 [id]/
│   │   │       ├── 📄 page.tsx
│   │   │       ├── 📄 loading.tsx
│   │   │       ├── 📄 not-found.tsx
│   │   │       └── 📄 ChallengeWorkspace.tsx
│   │   ├── 📁 playground/
│   │   │   ├── 📄 page.tsx
│   │   │   ├── 📄 loading.tsx
│   │   │   └── 📄 PlaygroundClient.tsx
│   │   ├── 📁 progress/
│   │   │   ├── 📄 page.tsx
│   │   │   ├── 📄 loading.tsx
│   │   │   └── 📄 ProgressClient.tsx
│   │   ├── 📁 references/
│   │   │   ├── 📄 page.tsx
│   │   │   ├── 📄 loading.tsx
│   │   │   ├── 📄 error.tsx
│   │   │   ├── 📄 ReferencesFilter.tsx
│   │   │   └── 📁 [slug]/
│   │   │       ├── 📄 page.tsx
│   │   │       ├── 📄 loading.tsx
│   │   │       ├── 📄 not-found.tsx
│   │   │       └── 📄 CopyButton.tsx
│   │   ├── 📁 search/
│   │   │   ├── 📄 page.tsx
│   │   │   ├── 📄 loading.tsx
│   │   │   ├── 📄 error.tsx
│   │   │   └── 📄 SearchClient.tsx
│   │   └── 📁 tutorials/
│   │       └── 📁 [slug]/
│   │           ├── 📄 page.tsx
│   │           ├── 📄 loading.tsx
│   │           └── 📄 not-found.tsx
│   │
│   ├── 📁 actions/            (empty)
│   │
│   ├── 📁 admin/
│   │   ├── 📄 layout.tsx
│   │   ├── 📄 page.tsx
│   │   ├── 📁 login/
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 dashboard/
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 donations/
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 categories/
│   │   │   ├── 📄 page.tsx
│   │   │   ├── 📁 new/
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📁 [id]/edit/
│   │   ├── 📁 challenges/
│   │   │   ├── 📄 page.tsx
│   │   │   ├── 📁 new/
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📁 [id]/edit/
│   │   ├── 📁 quizzes/
│   │   │   ├── 📄 page.tsx
│   │   │   ├── 📁 new/
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📁 [id]/edit/
│   │   ├── 📁 references/
│   │   │   ├── 📄 page.tsx
│   │   │   ├── 📁 new/
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📁 [id]/edit/
│   │   └── 📁 tutorials/
│   │       ├── 📄 page.tsx
│   │       ├── 📁 new/
│   │       │   └── 📄 page.tsx
│   │       └── 📁 [id]/edit/
│   │
│   └── 📁 api/
│       ├── 📁 admin/
│       │   ├── 📁 categories/
│       │   │   ├── 📄 route.ts
│       │   │   └── 📁 [id]/
│       │   ├── 📁 challenges/
│       │   │   ├── 📄 route.ts
│       │   │   └── 📁 [id]/
│       │   ├── 📁 login/
│       │   │   └── 📄 route.ts
│       │   ├── 📁 quiz/
│       │   │   ├── 📄 route.ts
│       │   │   └── 📁 [id]/
│       │   ├── 📁 references/
│       │   │   ├── 📄 route.ts
│       │   │   └── 📁 [id]/
│       │   └── 📁 tutorials/
│       │       ├── 📄 route.ts
│       │       └── 📁 [id]/
│       ├── 📁 attempts/
│       │   ├── 📄 route.ts
│       │   └── 📁 [deviceId]/
│       │       └── 📄 route.ts
│       ├── 📁 categories/
│       │   └── 📄 route.ts
│       ├── 📁 challenges/
│       │   └── 📁 [id]/
│       │       └── 📄 route.ts
│       ├── 📁 hello/
│       ├── 📁 quizzes/
│       │   └── 📁 [id]/
│       │       └── 📄 route.ts
│       ├── 📁 references/
│       │   ├── 📄 route.ts
│       │   └── 📁 [slug]/
│       │       └── 📄 route.ts
│       ├── 📁 search/
│       │   └── 📄 route.ts
│       └── 📁 tutorials/
│           ├── 📄 route.ts
│           └── 📁 [slug]/
│               └── 📄 route.ts
│
├── 📁 components/
│   ├── 📄 ErrorBoundary.tsx
│   ├── 📄 Footer.tsx
│   ├── 📄 Header.tsx
│   ├── 📄 HeroSection.tsx
│   ├── 📄 HomeSearch.tsx
│   ├── 📄 LessonSidebar.tsx
│   ├── 📄 LoadMoreTutorials.tsx
│   ├── 📄 ThemeToggle.tsx
│   └── 📁 admin/
│       ├── 📄 AdminHeader.tsx
│       ├── 📄 AdminShell.tsx
│       ├── 📄 AdminSidebar.tsx
│       ├── 📄 CategoryForm.tsx
│       ├── 📄 ChallengeForm.tsx
│       ├── 📄 DeleteButton.tsx
│       ├── 📄 LogoutButton.tsx
│       ├── 📄 QuizForm.tsx
│       ├── 📄 ReferenceForm.tsx
│       ├── 📄 TerminalCard.tsx
│       └── 📄 TutorialForm.tsx
│
├── 📁 lib/
│   ├── 📄 auth.ts
│   ├── 📄 auth-token.ts
│   ├── 📄 device.ts
│   ├── 📄 prisma.ts
│   ├── 📄 sandbox-runner.ts
│   └── 📄 validators.ts
│
├── 📁 prisma/
│   ├── 📄 schema.prisma
│   ├── 📄 dev.db
│   ├── 📄 seed.ts
│   ├── 📄 seed-admin.ts
│   ├── 📄 seed-challenge.ts
│   └── 📁 migrations/
│       ├── 📁 001_init/
│       │   └── 📄 migration.sql
│       └── 📁 002_fts_and_attempts/
│           └── 📄 migration.sql
│
├── 📁 plan/
│   └── 📄 full_documantion.md
│
├── 📁 plans/                 (empty)
│
├── 📁 mcp-utils-test/        (empty)
│
└── 📁 public/
    ├── 📄 file.svg
    ├── 📄 globe.svg
    ├── 📄 next.svg
    ├── 📄 vercel.svg
    └── 📄 window.svg
```
