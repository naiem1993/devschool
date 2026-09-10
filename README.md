# DevSchool

[W3Schools](https://w3schools.com)-style free learning platform with Bangla content.

**Monorepo Structure:**
```
devschool/
├── frontend/    # Next.js 16 + Prisma + PostgreSQL
├── backend/     # Express.js + Prisma + PostgreSQL
├── plan/        # Project documentation
└── plans/       # Additional planning docs
```

---

## Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────┐
│   Frontend      │─────▶│    Backend       │─────▶│ PostgreSQL  │
│   (Next.js)     │  API │   (Express)      │  ORM │  (devschool)│
│   :3000         │      │   :5000          │      │             │
└─────────────────┘      └─────────────────┘      └─────────────┘
```

The frontend uses **Prisma directly** (Server Components) for data fetching, while the backend provides an **Express REST API** for mobile apps and external integrations.

---

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm / pnpm

### Setup Both Services

```bash
# 1. Frontend
cd frontend
npm install
cp .env.example .env   # Update DATABASE_URL
npx prisma migrate dev --name init
npm run seed
npm run dev

# 2. Backend
cd ../backend
npm install
cp .env.example .env   # Update DATABASE_URL
npx prisma migrate dev --name init
npm run seed
npm start
```

---

## Database Schema

| Model | Bangla | Description |
|-------|--------|-------------|
| `Category` | বিষয় | Learning categories (Web Dev, Programming, etc.) |
| `Tutorial` | টিউটোরিয়াল | Individual lessons with difficulty levels |
| `TutorialContent` | অধ্যায়ভিত্তিক কনটেন্ট | Chapter-level content per tutorial |
| `QuizQuestion` | কুইজ প্রশ্ন | MCQ questions linked to tutorials |
| `QuizOption` | বিকল্প | Multiple-choice options |
| `CodeChallenge` | কোড চ্যালেঞ্জ | Programming challenges with starter code |
| `TestCase` | টেস্টকেজ | Test inputs/outputs for challenges |
| `Reference` | রেফারেন্স | Documentation links & syntax cheat sheets |
| `Donation` | দান | Support donations |
| `SiteSettings` | সাইট সেটিংস | Admin configuration (JSONB) |

Full schema: [`frontend/prisma/schema.prisma`](frontend/prisma/schema.prisma)

---

## Features

- **Full-text search** with PostgreSQL `@@` operator
- **Pagination** with Zod validation
- **Quiz system** with hidden correct answers
- **Code challenges** with isolated test cases
- **Donation tracking** with transaction IDs
- **Admin settings** stored as JSONB

---

## Performance Optimizations

| Technique | Implementation |
|-----------|----------------|
| Field selection | `select: { id: true, title: true, ... }` |
| Parallel queries | `Promise.all([findMany(), count()])` |
| Atomic increments | `viewCount: { increment: 1 }` |
| Composite indexes | `@@index([categoryId, createdAt])` |
| Full-text search | `@@fulltext([title, description])` |
| GIN indexes | TSVector for search performance |

---

## Security

- `.env` files excluded from git
- Zod input validation on all endpoints
- Sensitive data (quiz answers, test outputs) hidden from clients
- Prisma parameterized queries (SQL injection protection)
- CORS configuration for production

---

## Commands Reference

### Frontend
```bash
npm run dev          # Start dev server (:3000)
npm run build        # Production build
npm run start        # Start production server
npm run seed         # Seed demo data
npx prisma studio    # Open database GUI
npx prisma migrate dev --name init  # Create & apply migration
npx prisma migrate deploy        # Apply migrations (production)
```

### Backend
```bash
npm start            # Start server (:5000)
npm run seed         # Seed demo data
npx prisma studio    # Open database GUI
npx prisma migrate dev --name init  # Create & apply migration
npx prisma migrate deploy        # Apply migrations (production)
```

---

## License

MIT
