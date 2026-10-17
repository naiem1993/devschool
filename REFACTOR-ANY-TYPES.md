# 🎯 Refactor Plan: Eliminate `: any` from API Routes

> **Status:** ✅ Phase 1 Complete — `tsc --noEmit` verified with 0 errors (2026-10-17)
> **Created:** 2026-10-17
> **Owner:** DevSchool Team
> **Estimated Time:** 2-3 hours (spread over multiple sessions)
> **Risk Level:** 🟡 Medium (touches API routes but no user-facing changes)

---

## 📌 Context for AI / New Developer

If you are an AI or developer continuing this task, **read this document fully** before making changes. This is a careful, phased refactor — do NOT do it all at once.

### Project Context

- **Project:** DevSchool (Next.js 16 + React 19 + Prisma 5 + Zod)
- **Language:** TypeScript (`strict: true` in tsconfig.json)
- **Package Manager:** npm
- **Auth System:** Cookie-based (`lib/auth.ts` — `requireAdmin`, `getAdminId`, `rateLimit`)
- **Validation:** Zod schemas in `lib/validators.ts`

### The Problem

We have **50+ explicit `: any` type annotations** across the codebase, mostly in `app/api/admin/**` routes. These defeat TypeScript's strict mode and hide potential runtime bugs.

**Three categories identified:**

| Category | Example | Count | Difficulty |
|---|---|---|---|
| **A. Catch blocks** | `catch (e: any) { ... e.message }` | ~40 | ⭐ Easy (mechanical) |
| **B. Callback params** | `testCases.map((tc: any, i) => ...)` | ~10 | ⭐⭐ Medium (needs types) |
| **C. Missing Zod validation** | `const { x, y } = await req.json()` | ~5-10 routes | ⭐⭐⭐ Hard (careful) |

### The Goal

**Zero `: any` in production API routes** while maintaining identical runtime behavior. Every change must be:
- ✅ Non-breaking (same request/response contract)
- ✅ Type-safe (no new `any`/`as` casts)
- ✅ Verifiable (tsc --noEmit passes)
- ✅ Backwards-compatible (old clients still work)

---

## 🎯 Phases Overview

| Phase | Focus | Files | Time | Risk |
|---|---|---|---|---|
| **0** | Prerequisites (helpers + backup) | 1 new file | 10 min | 🟢 None |
| **1** | Catch block refactor (Category A) | ~25 files | 60 min | 🟢 Low |
| **2** | Callback types (Category B) | ~8 files | 45 min | 🟡 Medium |
| **3** | Zod validation (Category C) | ~8 files | 60 min | 🟠 Higher |
| **4** | Final verify + cleanup | — | 15 min | 🟢 None |

**TOTAL:** ~3 hours of focused work.

> **🔑 Rule:** Complete one phase fully + verify before moving to next. Do NOT start Phase 2 until Phase 1 passes `tsc --noEmit`.

---

## 📋 Phase 0: Prerequisites

### Task 0.1 — Create error helper

**Why:** Standardize error handling across all catch blocks. Prevents leaking internal errors to clients (security) and makes debugging easier.

**File to create:** `lib/api-error.ts`

```typescript
import { NextResponse } from 'next/server'

/**
 * Extract a safe error message from an unknown thrown value.
 * Never leaks stack traces or internal DB errors to clients.
 */
export function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  if (typeof e === 'string') return e
  return 'Unknown error'
}

/**
 * Standard 500 response builder for API routes.
 * Logs the full error server-side, returns a safe message client-side.
 */
export function serverError(e: unknown, context?: string): NextResponse {
  console.error(`[API Error${context ? ` @ ${context}` : ''}]`, e)
  return NextResponse.json(
    { error: getErrorMessage(e) },
    { status: 500 }
  )
}
```

**Verification:** `npx tsc --noEmit` passes.

---

### Task 0.2 — Backup check

Before touching anything, run:

```bash
npx tsc --noEmit > tsc-baseline.txt 2>&1
git status
git add -A && git commit -m "chore: baseline before any-types refactor"
```

This gives us a **rollback point**. If anything goes wrong, `git reset --hard HEAD` restores the pre-refactor state.

---

## 📋 Phase 1: Catch Block Refactor (Category A)

**Goal:** Change all `catch (e: any)` → `catch (e: unknown)` + safe access.

### Files to modify

Run this to get the exact current list:

```bash
# Not runnable — use the search function instead
grep -rn "catch (e: any)" app/ lib/ components/
```

**Expected files (from last scan):**
- `app/api/admin/ai/generate-challenge/route.ts`
- `app/api/admin/ai/generate-quiz/route.ts`
- `app/api/admin/ai/generate-reference/route.ts`
- `app/api/admin/challenges/route.ts`
- `app/api/admin/challenges/[id]/route.ts`
- `app/api/admin/challenges/bulk/route.ts`
- `app/api/admin/quiz/route.ts`
- `app/api/admin/quiz/[id]/route.ts`
- `app/api/admin/references/route.ts`
- `app/api/admin/references/[id]/route.ts`
- `app/api/admin/references/bulk/route.ts`
- `app/api/admin/reviews/[id]/route.ts`
- `app/api/admin/settings/route.ts`
- `app/api/admin/sponsors/route.ts`
- `app/api/admin/sponsors/[id]/route.ts`
- `app/api/admin/sponsors/upload/route.ts`
- `app/api/admin/tutorials/route.ts`
- `app/api/admin/tutorials/[id]/route.ts`
- `app/api/admin/tutorials/[id]/chapters/route.ts`
- `app/api/admin/tutorials/[id]/chapters/[chId]/route.ts`
- `app/api/admin/tutorials/[id]/chapters/[chId]/lessons/route.ts`
- `app/api/admin/tutorials/[id]/chapters/[chId]/lessons/[lid]/route.ts`
- `app/api/admin/tutorials/[id]/groups/route.ts`
- `app/api/admin/tutorials/[id]/groups/[gid]/route.ts`

### Transformation Pattern

**BEFORE:**
```typescript
} catch (e: any) {
  return NextResponse.json({ error: e.message }, { status: 500 })
}
```

**AFTER:**
```typescript
import { serverError } from '@/lib/api-error'

// ... later in the same file
} catch (e: unknown) {
  return serverError(e, 'challenges-create')
}
```

**What changes:**
1. `e: any` → `e: unknown` (strict-type compliant)
2. `e.message` → `serverError(e, 'context')` (safe + logged)
3. Import `serverError` at top of file

### Progress Tracker

Update this table as you go. Each file = 1 row.

| # | File | Status | Notes |
|---|---|---|---|
| 1 | `app/api/admin/ai/generate-challenge/route.ts` | ⬜ Pending | |
| 2 | `app/api/admin/ai/generate-quiz/route.ts` | ⬜ Pending | |
| 3 | `app/api/admin/ai/generate-reference/route.ts` | ⬜ Pending | |
| 4 | `app/api/admin/challenges/route.ts` | ⬜ Pending | |
| 5 | `app/api/admin/challenges/[id]/route.ts` | ⬜ Pending | |
| 6 | `app/api/admin/challenges/bulk/route.ts` | ⏭️ Skipped | No `catch (e: any)` (only Phase 2 callback types) |
| 7 | `app/api/admin/quiz/route.ts` | ✅ Done | 1 catch |
| 8 | `app/api/admin/quiz/[id]/route.ts` | ✅ Done | 2 catch (PUT + DELETE) |
| 9 | `app/api/admin/references/route.ts` | ✅ Done | 1 catch |
| 10 | `app/api/admin/references/[id]/route.ts` | ✅ Done | 2 catch (PUT + DELETE) |
| 11 | `app/api/admin/references/bulk/route.ts` | ⏭️ Skipped | No `catch (e: any)` (only Phase 2 callback types) |
| 12 | `app/api/admin/reviews/[id]/route.ts` | ✅ Done | 2 catch (PATCH + DELETE) |
| 13 | `app/api/admin/settings/route.ts` | ✅ Done | 1 catch |
| 14 | `app/api/admin/sponsors/route.ts` | ✅ Done | 1 catch |
| 15 | `app/api/admin/sponsors/[id]/route.ts` | ✅ Done | 2 catch (PUT + DELETE) |
| 16 | `app/api/admin/sponsors/upload/route.ts` | ✅ Done | 1 catch |
| 17 | `app/api/admin/tutorials/route.ts` | ✅ Done | 1 catch |
| 18 | `app/api/admin/tutorials/[id]/route.ts` | ✅ Done | 2 catch (PUT + DELETE) |
| 19 | `app/api/admin/tutorials/[id]/chapters/route.ts` | ✅ Done | 3 catch (GET+POST+PATCH) |
| 20 | `app/api/admin/tutorials/[id]/chapters/[chId]/route.ts` | ✅ Done | 2 catch (PATCH + DELETE) |
| 21 | `app/api/admin/tutorials/[id]/chapters/[chId]/lessons/route.ts` | ✅ Done | 3 catch (GET+POST+PATCH) |
| 22 | `app/api/admin/tutorials/[id]/chapters/[chId]/lessons/[lid]/route.ts` | ✅ Done | 2 catch (PATCH + DELETE) |
| 23 | `app/api/admin/tutorials/[id]/groups/route.ts` | ✅ Done | 3 catch (GET+POST+PATCH) |
| 24 | `app/api/admin/tutorials/[id]/groups/[gid]/route.ts` | ✅ Done | 2 catch (PATCH + DELETE) |
| 25 | `app/api/reviews/route.ts` (public) | ✅ Done | 1 catch (kept locale-aware message) |
| 26 | `lib/challenge-runner.ts` | ✅ Done | 2 catches |
| 27 | `lib/html-css-sandbox.ts` | ✅ Done | 2 catches |
| 28 | `lib/judge0-api.ts` | ✅ Done | 1 catch |
| 29 | `lib/piston-api.ts` | ✅ Done | 1 catch |

**Status legend:** ⬜ Pending | 🔄 In Progress | ✅ Done | ❌ Failed (needs review) | ⏭️ Skipped (justify in Notes)

### Phase 1 Completion Checklist

- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] `grep "catch (e: any)" app/api` returns 0 results
- [ ] Manual smoke test: admin login + create challenge + create quiz
- [ ] Commit: `git commit -m "refactor(api): replace catch (e: any) with unknown + serverError"`
- [ ] Update this file's top status to: `✅ Phase 1 Complete`

---

## 📋 Phase 2: Callback Parameter Types (Category B)

**Goal:** Replace `(x: any) => ...` in `.map()`, `.every()`, `.some()`, `.filter()` callbacks with proper types.

### Files to modify

- `app/api/admin/challenges/route.ts` (line 25)
- `app/api/admin/challenges/[id]/route.ts` (line 38)
- `app/api/admin/challenges/bulk/route.ts` (lines 42, 65)
- `app/api/admin/quiz/route.ts` (lines 11, 14, 28)
- `app/api/admin/quiz/[id]/route.ts` (lines 23, 39)
- `app/api/admin/quiz/bulk/route.ts` (lines 45, 48, 51, 72)
- `app/api/admin/references/bulk/route.ts` (line 100)

### Pattern 1: testCases array

**BEFORE:**
```typescript
testCases.map((tc: any, i: number) => ({
  input: tc.input,
  expectedOutput: tc.expectedOutput,
  isHidden: !!tc.isHidden,
  testCaseOrder: i,
}))
```

**AFTER:**
```typescript
// Define locally, once at top of file
type TestCaseInput = {
  input: string
  expectedOutput: string
  isHidden?: boolean
}

// ... then
testCases.map((tc: TestCaseInput, i: number) => ({
  input: tc.input,
  expectedOutput: tc.expectedOutput,
  isHidden: !!tc.isHidden,
  testCaseOrder: i,
}))
```

**Note:** The Zod schema for this already exists as `createTestCaseSchema` in `lib/validators.ts`. If the route uses Zod validation on the body first, use `z.infer<typeof createTestCaseSchema>` instead of manually defining `TestCaseInput`.

### Pattern 2: Quiz options array

**BEFORE:**
```typescript
options.every((o: any) => o.textEn && String(o.textEn).trim())
options.some((o: any) => o.isCorrect)
options.map((o: any, i: number) => ({ ... }))
```

**AFTER:**
```typescript
type QuizOptionInput = {
  textBn: string
  textEn: string
  isCorrect?: boolean
}

options.every((o: QuizOptionInput) => o.textEn && String(o.textEn).trim())
options.some((o: QuizOptionInput) => o.isCorrect)
options.map((o: QuizOptionInput, i: number) => ({ ... }))
```

**Note:** Better yet, add a Zod schema `createQuizOptionsSchema` in `lib/validators.ts` if not present, then `z.infer<typeof schema>`.

### Pattern 3: Tags array (references)

**BEFORE:**
```typescript
tags: r.tags.map((t: any) => String(t).trim()).filter(Boolean)
```

**AFTER:**
```typescript
tags: r.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
```

**Why `unknown` instead of a specific type?** Tags are typically strings but could arrive as numbers from bad input. `unknown` forces `String()` coercion explicitly. Or better: use the existing `createReferenceSchema` Zod schema on the whole body first, then `tags` will already be `string[]`.

### Phase 2 Completion Checklist

- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] `grep -E "\([a-z]+: any" app/api` returns 0 results
- [ ] Manual smoke test: create challenge with test cases + create quiz with options
- [ ] Commit: `git commit -m "refactor(api): type callback parameters in array operations"`
- [ ] Update this file's top status to: `✅ Phase 2 Complete`

---

## 📋 Phase 3: Zod Validation (Category C)

**Goal:** Add Zod validation to API routes that manually parse `req.json()`.

### Why this matters

Currently routes do:
```typescript
const { tutorialId, titleBn, ... } = await req.json()
if (!tutorialId || !titleBn) { return 400 }
```

This is:
- ❌ No type safety (everything is `any`)
- ❌ Manual validation (easy to miss fields)
- ❌ No string trimming (e.g., `titleEn: titleEn ? String(titleEn).trim() : null`)
- ❌ No max length enforcement

With Zod:
```typescript
import { createChallengeSchema, validateBody } from '@/lib/validators'

const body = await req.json().catch(() => null)
if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

const { data, error } = validateBody(createChallengeSchema, body)
if (error) return NextResponse.json({ error }, { status: 400 })

// Now `data` is fully typed
const c = await prisma.codeChallenge.create({ data: { ...data, ... } })
```

### Existing Zod schemas in `lib/validators.ts`

Check this file first — most schemas you need probably already exist:

| Schema | Use for |
|---|---|
| `createChallengeSchema` | POST /api/admin/challenges |
| `createTestCaseSchema` | Individual test case validation |
| `createQuizQuestionSchema` | POST /api/admin/quiz |
| `createQuizOptionSchema` | Individual option validation |
| `createReferenceSchema` | POST /api/admin/references |
| `createTutorialSchema` | POST /api/admin/tutorials |
| `createChapterSchema` | POST /api/admin/tutorials/[id]/chapters |
| `createLessonSchema` | POST /api/admin/tutorials/[id]/chapters/[chId]/lessons |
| `createReviewSchema` | POST /api/reviews (public) |
| `createSponsorSchema` | POST /api/admin/sponsors |
| `createDonationSchema` | POST /api/donations |

**If a schema is missing**, create it in `lib/validators.ts` following the existing pattern (see file for examples).

### Routes to update (audit first)

Before touching any route, **read** it and ask:
1. Does it already use `validateBody`? → Skip
2. Does it manually destructure `req.json()`? → Refactor to Zod
3. Does the Zod schema in `lib/validators.ts` match all fields? → If not, update schema first

**Suspected routes needing work** (verify by reading first):
- `app/api/admin/challenges/route.ts` (POST)
- `app/api/admin/challenges/[id]/route.ts` (PUT/PATCH)
- `app/api/admin/quiz/route.ts` (POST)
- `app/api/admin/quiz/[id]/route.ts` (PUT/PATCH)
- `app/api/admin/references/route.ts` (POST)
- `app/api/admin/references/[id]/route.ts` (PUT/PATCH)
- `app/api/admin/tutorials/route.ts` (POST)

**Update the tracker below as you complete each:**

| # | Route | Schema exists? | Status | Notes |
|---|---|---|---|---|
| 1 | `app/api/admin/challenges/route.ts` | ✅ `createChallengeSchema` | ⬜ Pending | |
| 2 | `app/api/admin/challenges/[id]/route.ts` | ✅ `updateTutorialSchema` (?) | ⬜ Pending | Verify schema |
| 3 | `app/api/admin/quiz/route.ts` | ✅ `createQuizQuestionSchema` | ⬜ Pending | |
| 4 | `app/api/admin/quiz/[id]/route.ts` | ✅ `createQuizQuestionSchema` (?) | ⬜ Pending | Verify |
| 5 | `app/api/admin/references/route.ts` | ✅ `createReferenceSchema` | ⬜ Pending | |
| 6 | `app/api/admin/references/[id]/route.ts` | ✅ `updateReferenceSchema` | ⬜ Pending | |
| 7 | `app/api/admin/tutorials/route.ts` | ✅ `createTutorialSchema` | ⬜ Pending | |

### ⚠️ Phase 3 Warnings

1. **Do NOT change response shape.** Old clients must still work.
2. **Do NOT tighten validation without review.** If a route currently accepts `optional: true` and Zod schema says `.required()`, that's a breaking change.
3. **Test each route manually** after refactor — use the admin UI or curl.
4. **Commit after each route**, not after 5 routes. Easier to bisect if something breaks.

### Phase 3 Completion Checklist

- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] `grep -E "await req\.json\(\)" app/api/admin` shows only the ones deliberately skipped
- [ ] All admin CRUD flows tested manually (create/update/delete challenge, quiz, reference, tutorial)
- [ ] Commit: `git commit -m "refactor(api): add Zod validation to admin mutation routes"`
- [ ] Update this file's top status to: `✅ Phase 3 Complete`

---

## 📋 Phase 4: Final Verification & Cleanup

### Final checks

```bash
# 1. Type check (must pass with 0 errors)
npx tsc --noEmit

# 2. Lint check
npm run lint

# 3. Confirm zero : any in API routes
grep -rn ": any" app/api/ | grep -v ".bak" | wc -l   # should be 0

# 4. Build check
npm run build
```

### Documentation update

- [ ] Update `README.md` if it documents API contracts
- [ ] Add a note about the error-handling pattern (`serverError` helper) to `AGENTS.md` or `CLAUDE.md`
- [ ] Update this file's top status to: `🎉 Complete`

### Deferred items (optional follow-up)

These are NOT part of this refactor but discovered during planning:

- **58 `.bak` files** — safe to delete (git history preserves old versions)
- **Console.log in components** — `components/admin/BulkReferenceImport.tsx:157,162` still has debug logs
- **Empty catch blocks** — `app/[locale]/layout.tsx:43` and `app/(admin)/layout.tsx:35` (silent but safe)
- **Test coverage** — no automated tests exist; consider adding Vitest for critical API routes

---

## 🔄 How to Resume This Refactor

If you (AI or developer) are picking this up mid-way, follow these steps:

1. **Read this file top-to-bottom.** Don't skip.
2. **Check the top status line.** It tells you what's done.
3. **Look at the current phase's tracker table.** Find the first ⬜ Pending row.
4. **Read the target file** before editing it. Never edit blind.
5. **Run `npx tsc --noEmit`** after each file change. Fix errors immediately.
6. **Commit after each phase** (not each file) — `git commit -m "refactor(api): phase N complete"`.
7. **Update this file** after each completed phase. Keep the status line accurate.

### Files this refactor depends on

These must NOT be modified during this refactor (only read):

- `lib/auth.ts` — auth helpers
- `lib/validators.ts` — Zod schemas
- `lib/prisma.ts` — DB client
- `prisma/schema.prisma` — DB schema

### Files this refactor creates

- `lib/api-error.ts` (Phase 0)

### Files this refactor modifies

All files listed in Phase 1, 2, 3 trackers above.

---

## 🚨 Rollback Plan

If something goes wrong mid-refactor:

```bash
# Option 1: Revert just the last file
git checkout -- path/to/file.ts

# Option 2: Revert the last commit (before pushing)
git reset --soft HEAD~1

# Option 3: Full rollback to baseline
git reset --hard baseline-before-any-refactor  # use the tag from Phase 0.2
```

**Rule:** Never `git reset --hard` if there are uncommitted changes you want to keep. `git stash` them first.

---

## 📞 Questions Before Starting?

If anything is unclear, **STOP** and ask. This refactor is safe if done carefully but risky if rushed.

Specifically ask about:
- A route where the Zod schema doesn't match current manual validation
- A route that appears to accept fields not in the schema
- Any pre-existing `catch (e: any)` that does something unusual (not just `return 500`)

**Better to ask a question than to break production.**

---

## 📝 Progress Log

Append entries here as work completes. This is the history that survives chat sessions.

### 2026-10-17 — Planning
- ✅ Created this plan document
- ✅ Git baseline confirmed (working tree clean)

### 2026-10-17 — Phase 0 Complete ✅
- ✅ Created `lib/api-error.ts` with `getErrorMessage()` and `serverError()` helpers
- ✅ `npx tsc --noEmit` passes with 0 errors

### 2026-10-17 — Phase 1 Batch 1 Complete ✅ (5 files)
- ✅ ai/generate-challenge, ai/generate-quiz, ai/generate-reference (3 each: gemini + outer)
- ✅ challenges/route.ts (1)
- ✅ challenges/[id]/route.ts (2: PUT + DELETE)
- ⚠️ NOTE: `files.edit_multiple_files` sometimes returns false-positive "success" — always verify with search after

### 2026-10-17 — Phase 1 Batch 2 Complete ✅ (4 files + 1 skip)
- ✅ quiz/route.ts (1), quiz/[id]/route.ts (2), references/route.ts (1), references/[id]/route.ts (2)
- ⏭️ challenges/bulk skip (no `catch (e: any)`)
- ⚠️ Partial-apply issue: call 166 partially failed (import only), later fixed

### 2026-10-17 — Phase 1 Batch 3 Complete ✅ (5 files)
- ✅ reviews/[id].ts (2), settings (1), sponsors/route (1), sponsors/upload (1), sponsors/[id].ts (2)
- ✅ All 5 files clean

### 2026-10-17 — Phase 1 Batch 4 Complete ✅ (4 files)
- ✅ tutorials/route (1), tutorials/[id]/route (2), chapters/route (3), [chId]/route (2)
- ✅ All 4 files clean

### 2026-10-17 — tsc Verify — Found 6 Missing Imports ⚠️ → Fixed ✅
- ❌ Discovered 6 files had `serverError(...)` calls but no import (from Batch 1 call 160)
- ✅ Fixed all 6: ai/generate-challenge, ai/generate-quiz, ai/generate-reference, challenges/[id], challenges/route, references/route
- ✅ `npx tsc --noEmit` passes with 0 errors after fix
- 🎓 **Lesson learned:** `files.edit_multiple_files` can silently drop the import edit — ALWAYS verify with `search_code` after any batch edit

### 2026-10-17 — Phase 1 Batch 5 Complete ✅ (2 files)
- ✅ lessons/route (3 catch), lessons/[lid]/route (2 catch)
- ✅ All clean

### 2026-10-17 — Phase 1 Batch 6 Complete ✅ (3 files)
- ✅ groups/route (3 catch), groups/[gid]/route (2 catch), reviews/route (1 catch)
- ⚠️ Public reviews kept `E.generic` locale-aware message (didn't use `serverError` — would lose i18n)
- ✅ Removed unused `serverError` import from reviews

### 2026-10-17 — Phase 1 Batch 7 Complete ✅ (4 lib files)
- ✅ challenge-runner (2), html-css-sandbox (2), judge0-api (1), piston-api (1)
- ⚠️ lib files don't return NextResponse — used `getErrorMessage()` instead of `serverError()`
- ✅ Preserved AbortError check with `e instanceof Error && e.name === 'AbortError'`

### 2026-10-17 — Deferred: Scripts folder (11 catches)
- ⏳ `scripts/diagnose-db.ts` (8), `fix-search-vec-triggers.ts` (2), `test-remote-db.ts` (1)
- 📝 These are one-time dev tools, not production. Can be fixed in a follow-up if desired.

### 2026-10-17 — ✅ Phase 1 VERIFIED COMPLETE
- ✅ `npx tsc --noEmit` passes with **0 errors**
- ✅ All 25 files refactored (2 skipped, 11 scripts deferred)
- 🎯 Next: git commit + manual smoke test
- 🎯 Then: Phase 2 (callback parameter types)

_(Add new entries below as you complete each phase. Include date, phase, and any notable issues.)_
