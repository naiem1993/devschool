# Project Directory Tree

```
devschool/
├── project-tree.md
├── test.txt
├── backend/
│   ├── .env                          # ✅ DATABASE_URL (only here)
│   ├── package-lock.json
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma             # ✅ Full schema (users, tutorials, etc.)
│   │   └── migrations/
│   │       ├── migration_lock.toml
│   │       └── 20260906124430_full_schema_with_reference/
│   │           └── migration.sql
│   ├── scripts/
│   │   └── seed.js
│   └── src/
│       └── index.js
├── frontend/
│   ├── .env                          # ✅ Only NEXT_PUBLIC_API_URL (no DATABASE_URL)
│   ├── .gitignore
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md
│   ├── tsconfig.json
│   ├── .next/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/
│   │       ├── tutorials/
│   │       │   └── route.ts         # ✅ Proxies to backend API
│   │       └── users/
│   │           └── route.ts         # ✅ Proxies to backend API
│   ├── lib/
│   │   └── api.ts                   # ✅ Replaces prisma.ts (API client)
│   └── public/
│       ├── file.svg
│       ├── globe.svg
│       ├── next.svg
│       ├── vercel.svg
│       └── window.svg
```

## Key Changes Made

1. **Removed duplicate Prisma from frontend** — `frontend/prisma/` folder is deleted. Database access is now exclusively handled by the backend.

2. **Removed DATABASE_URL from frontend .env** — Security risk eliminated. Frontend now uses `NEXT_PUBLIC_API_URL` to communicate with the backend.

3. **Replaced `lib/prisma.ts` with `lib/api.ts`** — A clean API client that fetches from the backend instead of directly accessing the database.

4. **Updated all API routes** — `/api/tutorials` and `/api/users` now proxy to the backend API instead of using Prisma directly.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │ ──▶ │  Next.js    │ ──▶ │   Backend   │
│  (Next.js)  │     │  API Routes │     │  (Express)  │
│             │     │  (Proxy)    │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                                                 │
                                                 ▼
                                           ┌─────────────┐
                                           │  PostgreSQL │
                                           │  (Prisma)   │
                                           └─────────────┘
```
