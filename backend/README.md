# DevSchool Backend

[Node.js](https://nodejs.org) + [Express](https://expressjs.com) + [Prisma](https://prisma.io) + PostgreSQL

## Prerequisites

- **Node.js** 20+
- **PostgreSQL** 15+
- **npm**

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

# Start server
npm start
```

Server runs on http://localhost:5000

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

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all active categories |
| GET | `/api/tutorials` | List tutorials (with search/filter) |
| GET | `/api/tutorials/:slug` | Get single tutorial |
| GET | `/api/references/:slug` | Get references by category |
| GET | `/api/challenges/:id` | Get code challenge |
| POST | `/api/challenges/:id/run` | Run challenge code |
| GET | `/api/quizzes/:id` | Get quiz questions |
| POST | `/api/quizzes/:id/submit` | Submit quiz answers |
| POST | `/api/donations` | Create donation |
| GET | `/api/settings` | Get site settings |

### Query Parameters

```
# Tutorials
GET /api/tutorials?page=1&limit=10&sort=createdAt&order=desc&q=javascript

# Categories
GET /api/categories?includeCounts=true
```

---

## Project Structure

```
backend/
├── src/
│   └── index.js          # Express server entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Migration files
│   └── seed.js           # Demo data seeder
├── scripts/
│   └── seed.js           # Alternative seed script
├── .env                  # Environment variables (NOT committed)
├── package.json
└── README.md
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `PORT` | Server port | No (default: 5000) |
| `CORS_ORIGIN` | Allowed origins | No (default: *) |

Example `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/devschool?schema=public"
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

---

## Security Checklist

- [x] `.env` files excluded from git
- [x] Zod input validation on all POST endpoints
- [x] CORS configuration
- [x] SQL injection protected by Prisma parameterized queries
- [x] Sensitive fields (quiz answers, test outputs) never exposed

---

## Deployment

### Production Build

```bash
npm start
```

### Docker (optional)

```bash
docker-compose up -d
```

---

## License

MIT
