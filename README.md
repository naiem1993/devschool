# DevSchool Frontend

[Next.js 16](https://nextjs.org) + [Prisma](https://prisma.io) + PostgreSQL

## Prerequisites

- **Node.js** 20+
- **PostgreSQL** 15+ (with `pg_trgm` extension support)
- **npm** / pnpm / yarn

---

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env   # Update DATABASE_URL with your credentials

# Run migrations
npx prisma migrate dev --name init

# Seed demo data
npm run seed

# Start dev server
npm run dev
```

Open http://localhost:3000

---

## Database Setup

### Migration Commands

```bash
# Create and apply migration (development)
npx prisma migrate dev --name init

# Apply pending migrations (production)
npx prisma migrate deploy

# Reset database (WARNING: drops all data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

### Prisma Studio (GUI)

```bash
npx prisma studio
```

Opens http://localhost:5555 — browse and edit all models visually.

### Schema Design

The database follows an ERD with these models:

| Model | Bangla | Purpose |
|-------|--------|---------|
| `Category` | বিষয় | Learning topics (Web Dev, Programming, etc.) |
| `Tutorial` | টিউটোরিয়াল | Individual lessons |
| `TutorialContent` | অধ্যায়ভিত্তিক কন্টেন্ট | Chapter-level content per tutorial |
| `QuizQuestion` | কুইজ প্রশ্ন | MCQ questions per tutorial |
| `QuizOption` | বিকল্প | Multiple-choice options |
| `CodeChallenge` | কোড চ্যালেঞ্জ | Programming challenges |
| `TestCase` | টেস্টকেস | Test inputs/outputs for challenges |
| `Reference` | রেফারেন্স | Documentation links & syntax cheat sheets |
| `Donation` | দান | Support donations |
| `SiteSettings` | সাইট সেটিংস | Admin configuration (JSONB) |

Full schema: [`prisma/schema.prisma`](prisma/schema.prisma)

---

## API Routes

All routes are Server Components calling Prisma directly.

| Route | Method | Description |
|-------|--------|-------------|
| `/api/tutorials` | GET | List tutorials with pagination & search |
| `/api/tutorials/[slug]` | GET | Single tutorial with contents, quiz, challenges |
| `/api/categories` | GET | All active categories with tutorial counts |
| `/api/references/[slug]` | GET | References for a category |
| `/api/challenges/[id]` | GET | Code challenge with hidden test cases |
| `/api/challenges/[id]/run` | POST | Run challenge code against test cases |
| `/api/quizzes/[id]` | GET | Quiz questions (correct answers hidden) |
| `/api/quizzes/[id]/submit` | POST | Submit quiz answers, get score |

### Query Parameters

**Tutorials list** (`/api/tutorials`):
```
? page=1&limit=6          # Pagination (default: 1, 6)
& sort=createdAt           # Sort field: createdAt, title, viewCount, updatedAt
& order=desc               # Sort direction: asc, desc
& q=javascript             # Full-text search (PostgreSQL FTS)
& category=web-development # Filter by category slug
& difficulty=beginner      # Filter: beginner, intermediate, advanced
```

**Examples:**
```bash
# Popular tutorials
GET /api/tutorials?sort=viewCount&order=desc&limit=6

# Search tutorials
GET /api/tutorials?q=react+hooks

# Beginner web development tutorials
GET /api/tutorials?category=web-development&difficulty=beginner
```

---

## Validation (Zod)

All API routes use Zod schemas defined in [`lib/validators.ts`](lib/validators.ts):

| Schema | Used For |
|--------|----------|
| `createTutorialSchema` | POST /api/tutorials body |
| `searchSchema` | GET /api/tutorials query params |
| `paginationSchema` | Pagination across all list endpoints |
| `slugParamSchema` | Route parameter validation (`[slug]`) |
| `idParamSchema` | Route parameter validation (`[id]`) |
| `createQuizQuestionSchema` | Creating quiz questions |
| `createChallengeSchema` | Creating code challenges |

---

## Query Optimization Patterns

### 1. Select Only Needed Fields

```typescript
// ❌ Bad — fetches all columns
const tutorials = await prisma.tutorial.findMany({ where: { isPublished: true } })

// ✅ Good — only fetch what's needed
const tutorials = await prisma.tutorial.findMany({
  select: { id: true, title: true, slug: true, viewCount: true },
  where: { isPublished: true },
})
```

### 2. Parallel Queries

```typescript
const [tutorials, total] = await Promise.all([
  prisma.tutorial.findMany({ where, skip, take }),
  prisma.tutorial.count({ where }),
])
```

### 3. Atomic Increments

```typescript
// ❌ Bad — race condition prone
await prisma.tutorial.update({ where: { id }, data: { viewCount: current + 1 } })

// ✅ Good — atomic database operation
await prisma.tutorial.update({ where: { id }, data: { viewCount: { increment: 1 } } })
```

### 4. Hide Sensitive Data from Client

```typescript
// Don't expose quiz answers or test case outputs
const quiz = await prisma.quizQuestion.findMany({
  select: {
    id: true,
    question: true,
    options: {
      select: {
        id: true,
        text: true,
        isCorrect: false,  // Hidden!
      },
    },
  },
})
```

---

## Project Structure

```
frontend/
├── app/
│   ├── api/                    # API routes (Next.js Route Handlers)
│   │   ├── tutorials/
│   │   ├── categories/
│   │   ├── references/
│   │   ├── challenges/
│   │   └── quizzes/
│   ├── categories/[slug]/      # Category detail pages
│   ├── tutorials/[slug]/       # Tutorial detail pages
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/                 # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── HomeSearch.tsx
│   ├── LoadMoreTutorials.tsx
│   ├── LessonSidebar.tsx
│   └── ErrorBoundary.tsx
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   └── validators.ts           # Zod validation schemas
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Migration files
│   └── seed.ts                 # Demo data seeder
├── .env                        # Environment variables (NOT committed)
├── package.json
└── README.md
```

---

## Security Checklist

- [x] `.env` files excluded from git
- [x] Zod input validation on all POST endpoints
- [x] Quiz answers (`isCorrect`) hidden from client
- [x] Test case outputs (`expectedOutput`) hidden from client
- [x] Challenge solutions not returned in GET responses
- [x] Rate limiting ready (add middleware when needed)
- [x] SQL injection protected by Prisma parameterized queries

---

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables (required)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/devschool` |
| `NEXT_PUBLIC_API_URL` | Backend API URL (optional) | `http://localhost:5000/api` |

### Post-Install Hook

The `postinstall` script automatically runs `prisma generate && prisma migrate deploy`.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot find module '@prisma/client'` | Run `npm install` in `frontend/` |
| `Invalid `prisma.Tutorial.findUnique()`` | Run `npx prisma generate` |
| `database "devschool" does not exist` | Create DB: `createdb devschool` |
| Migration fails | Check `.env` credentials, then `npx prisma migrate dev` |

---

## Professional Tips

- Use **Prisma Studio** (`npx prisma studio`) to browse and debug data visually
- Keep **migration folder names** as-is — they contain timestamps for rollback tracking
- Always test migrations on **staging** before applying to production
- Use `@default` and `@db.*` in Prisma schema for database-level validation
- Combine Prisma with **React `cache()`** and **ISR** (`revalidate`) for caching

---

## License

MIT
