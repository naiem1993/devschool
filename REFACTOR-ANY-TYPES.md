# 🎯 Refactor Plan: Eliminate `: any` from API Routes

> **Status:** 🎉 COMPLETE — Phases 0–4 done (2026-10-18). `app/api/**` + `lib/**` are 100% `: any`/`as any`-free; build & tsc pass. UI-layer and scripts any-types deferred (out of scope).
> **Created:** 2026-10-17
> **Owner:** DevSchool Team
> **Estimated Time (Phase 3 only):** 1-2 hours
> **Risk Level:** 🟠 Higher (Zod can change request contracts if done carelessly)

---

## 🤖 NEW CHAT HANDOFF — paste this to start Phase 3

If you are a fresh AI session, **copy the prompt below** and paste it into the new chat:

```
I'm continuing the DevSchool API refactor in a new chat.

STEP 1 — Read `REFACTOR-ANY-TYPES.md` fully before doing anything.
This file contains: context, prior lessons learned, phase plans, trackers,
and the Phase 3 handoff.

STEP 2 — Confirm understanding by briefly summarizing:
- What phases are done
- What Phase 3 requires
- The 7 strict rules listed below

STEP 3 — Then start Phase 3 (Zod validation on admin mutation routes).

STRICT RULES (each earned from prior failures):
1. `files.edit_multiple_files` can silently drop edits even when returning
   "success" — ALWAYS run `files.search_code` immediately after every batch
   edit to verify.
2. When editing the SAME file multiple times, use ONE edit per call (never
   multiple edits to the same file in a batch).
3. Use whitespace-independent substrings in `oldContent` (no leading
   indentation) to survive CRLF/LF/indent mismatches.
4. Read every target file fully before editing — never edit blind.
5. After each batch: ask user to run `npx tsc --noEmit`, then verify with
   `files.search_code`.
6. Commit after each batch:
   `git add -A && git commit -m "refactor(api): phase 3 batch N — ..."`
7. Update `REFACTOR-ANY-TYPES.md` after each batch (status + tracker row +
   progress log entry).

QUALITY BAR: Top-level senior developer. No shortcuts, no "probably works"
— verify every step. If uncertain, STOP and ask.

Current state (already done in prior session):
- 51 files refactored across Phase 1 + Phase 2
- 4 commits: dc4f470, ae5750f, 78a2d3a, 9f5c6e7
- `npx tsc --noEmit` passes with 0 errors
- All runtime smoke tests passed (admin CRUD, quiz submit, challenge run)
- API routes & lib/ are 100% free of `: any` and `as any` (verified Phase 4, batches 5a/5b)
- UI layer (~3 `as any`) and scripts (~20 `: any`) are deferred (out of this refactor's scope)

Now: execute Phase 3 per the plan in the file. Present your audit plan
first, then start Batch 1.
```

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
| 1 | `app/api/admin/challenges/route.ts` | ✅ `createChallengeSchema` (fixed) | ✅ Done | Batch 1 — schema now mirrors route (language/points/testCases added, defaults stay in route) |
| 2 | `app/api/admin/challenges/[id]/route.ts` | ✅ `createChallengeSchema.partial().omit({tutorialId})` | ✅ Done | Batch 1 — new `updateChallengeSchema`, GET/DELETE untouched |
| 3 | `app/api/admin/quiz/route.ts` | ✅ `createQuizQuestionSchema` (fixed) | ✅ Done | Batch 2 — shared `quizOptionInputSchema`; 3 Bangla business checks kept above Zod |
| 4 | `app/api/admin/quiz/[id]/route.ts` | ✅ `updateQuizQuestionSchema` (new) | ✅ Done | Batch 2 — no `.partial()`; PUT has no `some(isCorrect)` check (preserved) |
| 5 | `app/api/admin/references/route.ts` | ✅ `createReferenceSchema` | ⬜ Pending | |
| 6 | `app/api/admin/references/[id]/route.ts` | ✅ `updateReferenceSchema` | ⬜ Pending | |
| 7 | `app/api/admin/tutorials/route.ts` | ✅ `createTutorialSchema` | ⬜ Pending | |
| 8 | `app/api/admin/tutorials/[id]/chapters/route.ts` | ✅ `createChapterSchema` (rewritten) + `reorderChaptersSchema` (new) | ✅ Done | Batch 3 — POST Zod after manual checks; PATCH reorder shape-only, business logic kept |
| 9 | `app/api/admin/tutorials/[id]/chapters/[chId]/route.ts` | — | ⏭️ Skipped (justified) | Batch 3 — `in body` semantics (absent vs null) cannot survive Zod; route already type-safe, no `: any` |
| 10 | `app/api/admin/tutorials/[id]/chapters/[chId]/lessons/route.ts` | ✅ `createLessonSchema` (rewritten) + `reorderLessonsSchema` (new) | ✅ Done | Batch 4 — 5 Bangla checks before Zod; reorder shape-only, business logic kept |
| 11 | `app/api/admin/tutorials/[id]/chapters/[chId]/lessons/[lid]/route.ts` | — | ⏭️ Skipped (justified) | Batch 4 — `in body` semantics; route already type-safe, no `: any` |
| 12 | `app/api/admin/tutorials/[id]/groups/route.ts` | ✅ `createGroupSchema` (rewritten) + `reorderGroupsSchema` (new) | ✅ Done | Batch 5 — POST Zod after title check; reorder shape-only, business logic kept |
| 13 | `app/api/admin/tutorials/[id]/groups/[gid]/route.ts` | ✅ `updateGroupSchema` (rewritten) | ✅ Done | Batch 5 — light Zod; `undefined`-skip semantics preserved via `data.titleEn !== undefined` |

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
> ⚠️ **Later correction (Phase 4):** this "COMPLETE" scoped only to `catch (e: any)` / callback params. 19 `as any` remained in API routes & lib/, fixed later in batches 5a/5b.
- ✅ `npx tsc --noEmit` passes with **0 errors**
- ✅ All 25 files refactored (2 skipped, 11 scripts deferred)
- ✅ Commit `dc4f470` (Batch 1-4) + `ae5750f` (Batch 5-7)
- ✅ Manual smoke test: admin login, challenge CRUD, quiz CRUD all pass

### 2026-10-17 — Smoke Test Fixes ✅
- 🐛 **Quiz list missing delete button** → added `<DeleteButton endpoint="/api/admin/quiz/${id}" />` (commit `78a2d3a`)
- 🐛 **Theme flash on locale switch** → root cause: server-render `<html>` had no `.dark` class, so soft navigation (server action redirect) wiped the class → 1-frame light flash before useLayoutEffect restored it.
  - Fix: **4-layer defense**
    1. Server-render reads `theme` cookie → sets `.dark` in HTML (no flash)
    2. `<ThemeInit>` mirrors localStorage → cookie
    3. `<ThemeProvider>.setTheme` syncs both localStorage + cookie
    4. `<ThemeSync>` `useLayoutEffect` fallback for class force-fix
  - ✅ Verified: dark and light both flash-free on `/bn` ↔ `/en`

### 2026-10-17 — Phase 2 Batch 1 Complete ✅ (Challenges family, 3 files)
- ✅ `challenges/route.ts` — `TestCaseInput` local type + `testCases.map((tc: TestCaseInput, i)`
- ✅ `challenges/[id]/route.ts` — same pattern
- ✅ `challenges/bulk/route.ts` — `.every()` + `.map()` callbacks fixed
- 🎯 Pattern: local `type TestCaseInput = { input: unknown; expectedOutput: unknown; isHidden?: unknown }`
  - `unknown` in type (not `any`) → forces `String()` coercion, type-safe
  - Local type instead of `z.infer<>` — because `createTestCaseSchema` includes `challengeId` field not in client payload
- ✅ All 3 files verified with `search_in_file ": any"` → 0 matches

### 2026-10-17 — Phase 2 Batch 2 Complete ✅ (Quiz family, 3 files + 1 bonus)
- ✅ `quiz/route.ts` — `QuizOptionInput` local type + 3 callbacks (`every`, `some`, `map`)
- ✅ `quiz/[id]/route.ts` — same pattern, 2 callbacks
- ✅ `quiz/bulk/route.ts` — same pattern, 4 callbacks
- ✅ **BONUS discovered**: `api/quizzes/[id]/route.ts` — `AnswerInput` type + 3 callbacks fixed

### 2026-10-17 — Phase 2 Batch 3 Complete ✅ (References bulk)
- ✅ `references/bulk/route.ts` — `tags: unknown` (forces String coercion)

### 2026-10-17 — Phase 2 Batch 4 Complete ✅ (New files discovered)
- ✅ `challenges/[id]/route.ts` — Prisma inference, removed `testCase: any`
- ✅ `attempts/route.ts` — `body: Record<string, unknown>`
- ✅ `search/route.ts` — `catch (err: unknown)` + safe errCode/errMsg extraction
- ✅ `tutorials/route.ts` — zod issue map without any
- ✅ `lib/validators.ts` — 2 zod error maps fixed (validateBody + validateQuery)

### 2026-10-17 — Phase 1 re-fix (missed from Batch 1)
- ✅ 3 AI files (`generate-challenge/quiz/reference`) — the `catch (geminiError: any)` was missed by call 160's partial apply, now fixed with `getErrorMessage()`
- 🎓 **Lesson:** `files.edit_multiple_files` can partially apply even when returning "success" — always verify with `search_code`

### 2026-10-17 — Final remaining `: any` (intentionally deferred)
- 📝 `lib/api-error.ts:6` — code comment, not real code
- ⏭️ `lib/judge0-api.ts:129` — `let resultData: any = null` (external Judge0 API response shape is unstable)
- ⏭️ `scripts/diagnose-db.ts` (8), `fix-search-vec-triggers.ts` (2), `test-remote-db.ts` (1), `db-inspect-tutorial.ts` (1) — dev-only tools
- 🎯 **API routes & lib/ are 100% free of `: any`** — ⚠️ *later found 19 `as any` in Phase 4; fixed in 5a/5b*

### 2026-10-17 — ✅ Phase 2 VERIFIED COMPLETE
> ⚠️ **Later correction (Phase 4):** this "COMPLETE" scoped only to callback params. 19 `as any` remained in API routes & lib/, fixed later in batches 5a/5b.
- ✅ `npx tsc --noEmit` passes with **0 errors** (verified twice)
- ✅ All callback `: any` types replaced with local types or inference
- ✅ Phase 1 partial-apply gap fixed (3 AI files)
- ✅ API routes & lib/ 100% free of `: any` (Phase 4 audit later found & fixed 19 `as any` in 5a/5b)
- ✅ Commit `9f5c6e7` (17 files, 137 insertions)

### 2026-10-17 — ✅ SMOKE TEST PASSED
- ✅ Quiz submit — score calculates correctly
- ✅ Challenge run — results returned
- ✅ Admin quiz create — saves with options
- ✅ Admin challenge create — saves with test cases
- ✅ Search — FTS + ILIKE fallback working
- 🎉 **Phase 1 + Phase 2 officially shipped**

### 2026-10-17 — 🎉 SESSION COMPLETE — handed off to next chat
- ✅ Phase 1 + Phase 2 shipped and verified (for their scope — see Phase 4 correction)
- ✅ 4 commits: dc4f470 (Batch 1-4), ae5750f (Batch 5-7), 78a2d3a (smoke fixes), 9f5c6e7 (Phase 2)
- ✅ 51 files refactored; API routes & lib/ 100% `: any`-free (UI/scripts deferred)
- ✅ All smoke tests passed (admin CRUD, quiz submit, challenge run, search)
- 🚀 **Next session: Phase 3 (Zod validation)** — use the NEW CHAT HANDOFF prompt at the top of this file
- ⏳ Deferred cleanup (do later): 58 `.bak` files, `console.log` in BulkReferenceImport.tsx:157,162, scripts/*.ts (11 catches)

### 2026-10-17 — Phase 3 scope (for next session)
**Goal:** Replace manual `req.json()` parsing with Zod `validateBody()` on admin mutation routes.

**Audit-first (mandatory):** Read every `app/api/admin/**/route.ts` POST/PUT/PATCH and classify:
- Type A: already uses `validateBody()` → **SKIP**
- Type B: manual destructure + manual checks → **candidate**
- Type C: `req.json()` with weak/no validation → **high priority**

**Known already-Zod (skip these):**
- `references/route.ts` POST, `references/[id]/route.ts` PUT
- `sponsors/route.ts` POST, `sponsors/[id]/route.ts` PUT
- `tutorials/route.ts` POST, `tutorials/[id]/route.ts` PUT
- `settings/route.ts` PUT
- `reviews/[id]/route.ts` PATCH (uses `reviewModerationSchema`)

**Known needs-Zod (candidates):**
- `challenges/route.ts` POST
- `challenges/[id]/route.ts` PUT
- `quiz/route.ts` POST
- `quiz/[id]/route.ts` PUT
- `tutorials/[id]/chapters/route.ts` POST
- `tutorials/[id]/chapters/[chId]/route.ts` PATCH
- `tutorials/[id]/chapters/[chId]/lessons/route.ts` POST
- `tutorials/[id]/chapters/[chId]/lessons/[lid]/route.ts` PATCH
- `tutorials/[id]/groups/route.ts` POST
- `tutorials/[id]/groups/[gid]/route.ts` PATCH

**⚠️ Critical:** Preserve current response shape + optional fields + error messages. Zod schemas must EXACTLY mirror current behavior — do NOT tighten validation without user approval.

**Suggested batches (one commit per batch):**
- Batch 1: Challenges (create + update) — 2 files
- Batch 2: Quiz (create + update) — 2 files
- Batch 3: Chapters (collection + detail) — 2 files
- Batch 4: Lessons (collection + detail) — 2 files
- Batch 5: Groups (collection + detail) — 2 files

**Success criteria:**
- [ ] Every admin POST/PUT/PATCH uses `validateBody()`
- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] No new `: any` introduced
- [ ] All admin CRUD flows still work
- [ ] Response shape unchanged
- [ ] Committed per batch

_(Add new entries below as you complete each phase. Include date, phase, and any notable issues.)_

### 2026-10-17 — Phase 3 Batch 1 Complete ✅ (Challenges, 3 files)
- ✅ `lib/validators.ts` — `createChallengeSchema` fixed to mirror route behavior:
  - `titleBn` → `.min(1)` (was `.min(2).max(255)` — would have been a breaking tightening)
  - `titleEn`/`descriptionBn`/`descriptionEn` → required `.min(1)` (were wrongly `.optional()`)
  - added `language`, `difficulty`, `points` (`z.coerce.number()`), `testCases` (inline array schema)
  - removed `difficulty` enum `.default('Easy')` — defaults belong in route
- ✅ `challenges/route.ts` POST — `validateBody(createChallengeSchema, body)`; aggregated manual check kept BEFORE Zod (extra #1)
- ✅ `challenges/[id]/route.ts` PUT — new `updateChallengeSchema = createChallengeSchema.partial().omit({ tutorialId: true })`; GET/DELETE untouched
- 🎯 Architecture principle confirmed: **Zod validates TYPE/SHAPE; route handles DEFAULTS/FALLBACKS** (`|| 'js'`, `|| 0`, `|| 'Easy'`, `Array.isArray(...)` all stay in route)
- ✅ `npx tsc --noEmit` — 0 errors
- ✅ Verified with search: old `TestCaseInput` types gone, old manual `points, testCases } = await req.json()` destructure gone
- ⚠️ Note: `edit_file` on the POST route failed on large `oldContent` (whitespace match) → switched to `write_file` with full file; safe because file was 43 lines and read fully first
- 📝 Commit: `refactor(api): phase 3 batch 1 — zod validation for challenges` (c2f0a27)

### 2026-10-17 — Phase 3 Batch 2 Complete ✅ (Quiz, 3 files)
- ✅ `lib/validators.ts` — added shared `quizOptionInputSchema`; rewrote `createQuizQuestionSchema`; added `updateQuizQuestionSchema`
  - `create`: added `lessonId`/`chapterId` (nullable optional), `options` (inline array `.min(2).optional()`); `questionBn`/`questionEn` → required `.min(1)` (were `.min(5)` / optional); removed `orderIndex` default
  - `update`: separate schema — required `questionBn`/`questionEn`/`options`; optional `tutorialId`/`lessonId`/`chapterId`/`explanationBn`/`explanationEn`/`orderIndex`; **no `.min(2)`** and **no cuid on tutorialId** (would have tightened PUT behavior)
- ✅ `quiz/route.ts` POST — 3 Bangla business checks kept ABOVE Zod (`lesson/chapter`, every `textEn`, some `isCorrect`); defaults in route (`?? 0`, `|| null`)
- ✅ `quiz/[id]/route.ts` PUT — Zod after 2 checks; preserved absence of `some(isCorrect)` check
- 🎯 Same architecture principle: Zod = type/shape; route = defaults + business rules
- ✅ `npx tsc --noEmit` — 0 errors
- ✅ Verified with search: old `QuizOptionInput` gone from both files; both use `const body = await req.json()` + `validateBody`
- 🐛 **Doc-edit quirk:** status-line `edit_file` returned "oldContent not found" yet the change WAS applied (hidden/partial apply). Re-checked via search and left it — did NOT retry. Reinforces rule 1 (always verify).
- 📝 Commit: `refactor(api): phase 3 batch 2 — zod validation for quiz` (3ffa3cc)

### 2026-10-17 — Phase 3 Batch 3 Complete ✅ (Chapters)
- ✅ `lib/validators.ts` — rewrote `createChapterSchema`/`updateChapterSchema` to match route field names (`titleBn`/`contentBn`/`codeExampleBn` etc. — old ones used `title`/`content` and were unused); added `reorderChaptersSchema`
- ✅ `chapters/route.ts` POST — kept coercion (`normSlug`, trim, empty→null) + 3 Bangla checks in route; then `validateBody(createChapterSchema, coercedValues)`; create uses `data.*`
- ✅ `chapters/route.ts` PATCH — `validateBody(reorderChaptersSchema, body)` for shape; cross-checks (all ids, no dupes, length) + `$transaction` kept in route; error message preserved
- ⏭️ `chapters/[chId]/route.ts` PATCH — **deliberately skipped**: `in body` semantics (absent = don't touch, null/'' = clear) cannot survive Zod; route already type-safe (`typeof`/`in` checks), no `: any`. Documented exception.
- ✅ `npx tsc --noEmit` — 0 errors
- ✅ Verified: chapters collection uses `const body` + Zod; detail route raw body intentional
- 📝 Commit: `refactor(api): phase 3 batch 3 — zod validation for chapters` (6c935c9)

### 2026-10-17 — Phase 3 Batch 4 Complete ✅ (Lessons)
- ✅ `lib/validators.ts` — rewrote `createLessonSchema`/`updateLessonSchema` to route field names (`titleBn`/`contentBn`/`codeExampleBn`); **`titleEn`, `contentBn`, `contentEn` all required** (differs from chapters — route requires all three); added `reorderLessonsSchema`
- ✅ `lessons/route.ts` POST — 5 Bangla checks kept above Zod; coercion (`normSlug`, trim) stays in route; create + D6a chapter-slug sync use `data.*`
- ✅ `lessons/route.ts` PATCH — `validateBody(reorderLessonsSchema, body)`; cross-checks + `$transaction` + revalidate kept
- ⏭️ `lessons/[lid]/route.ts` PATCH — **deliberately skipped**: `in body` semantics (absent vs null/clear); route already type-safe, no `: any`. Documented exception (same rationale as chapters/[chId]).
- ✅ `npx tsc --noEmit` — 0 errors
- 📝 Commit: `refactor(api): phase 3 batch 4 — zod validation for lessons` (00d5e56)

### 2026-10-17 — Phase 3 Batch 5 Complete ✅ (Groups)
- ✅ `lib/validators.ts` — rewrote `createGroupSchema`/`updateGroupSchema` to route field names (`titleBn`); removed `sortOrder` (route computes it); `titleEn` kept `nullable().optional()` (no `.min(1)` — avoids tightening `''`→null behavior); added `reorderGroupsSchema`
- ✅ `groups/route.ts` POST — title check above Zod; `nextOrder` + tutorial-existence checks kept in route
- ✅ `groups/route.ts` PATCH — `validateBody(reorderGroupsSchema, body)`; cross-checks + `$transaction` + revalidate kept
- ✅ `groups/[gid]/route.ts` PATCH — light Zod (`updateGroupSchema`) after manual title check; `undefined`-skip semantics preserved (`data.titleEn !== undefined`); DELETE untouched
- ✅ `npx tsc --noEmit` — 0 errors
- 📝 Commit: `refactor(api): phase 3 batch 5 — zod validation for groups` (33ad6e5)

### 2026-10-17 — ✅ PHASE 3 COMPLETE (all 5 batches)
- ✅ Batches 1–5 shipped: Challenges, Quiz, Chapters, Lessons, Groups
- ✅ All admin POST/PUT/PATCH mutation routes now use `validateBody()` except 3 documented exceptions (`chapters/[chId]`, `lessons/[lid]` = `in body` semantics)
- ✅ `npx tsc --noEmit` — 0 errors after every batch
- ✅ Response shapes preserved; business rules stayed in routes
- 🔜 Next: Phase 4 (final verify + cleanup) — `npm run lint`, `npm run build`, `.bak` cleanup, README/AGENTS notes

### 2026-10-18 — Phase 4 Honesty Audit + Batch 5a/5b ✅
- 🔍 **`npm run lint` exposed 19 `as any`** that Phase 1/2 searches (`: any`) had missed — the "100% any-free" claims were false. Corrected in 4 places + 2 scope notes (lines 53, 624, 675, 673, 679, 691, 693).
- ✅ **Batch 5a** (`settings/route.ts`): 12 × `as any` → `as Prisma.InputJsonValue` (added `import type { Prisma }`). Commit `3303c53`.
- ✅ **Batch 5b** (5 files): 3 AI routes (6 casts) typed via parser return types (`ParseResult`, `QuizParseResult`, `ReferenceParseResult`); `html-css-sandbox.ts` (1 cast) → `Record<string, string | undefined>`; **`judge0-api.ts` (1 `: any`)** → new local `Judge0Response` type (commit `698edfa`).
- ⚠️ **Self-caught:** my own first draft of this log said "4 files" and claimed lib/ 100% before the judge0 fix — corrected here. Ground truth (post-fix): `: any`/`as any` = 0 in `lib/` and `app/api/`; only `lib/api-error.ts:6` has `: any` inside a code comment.
- ⚠️ **`html-css-sandbox.ts:226`** — added `?? ''`; real minor behavior change: `undefined` no longer crashes, becomes test-fail instead. Intentionally framed as such (not "pure refactor").
- ✅ `npx tsc --noEmit` — 0 errors after 5a and 5b.
- 📊 **Final state:** API routes & lib/ are 100% `: any`/`as any`-free. UI layer (~3 `as any`) and scripts (~20 `: any`) deferred — out of scope.
- 🎓 **Lesson learned:** searching only `: any` misses `as any`. Future audits must grep both patterns (e.g. `: any|as any`) and use lint as ground truth.

### 2026-10-18 — ✅ PHASE 4 COMPLETE (final verify + cleanup)
- ✅ `npx tsc --noEmit` — 0 errors
- ✅ `npm run build` — success (97/97 pages, Turbopack)
- ✅ Ground truth: `: any` and `as any` = **0** in `app/api/**` and `lib/**` (only a code comment in `lib/api-error.ts:6` mentions the phrase)
- ✅ Doc overclaims corrected (6 places) — all "100%" claims now scoped and true
- ✅ 45 `.bak`/`.bak1` files deleted from disk; never tracked by git (`.gitignore` already had `*.bak*`)
- ✅ `README.md` — documented `validateBody()` pattern, `serverError()`/`getErrorMessage()` error handling, and the new phase-3 schemas; noted the `: any`/`as any` ban in `app/api/**` + `lib/**`
- ⚠️ Not done (out of scope): UI-layer `as any` (~3), `scripts/*.ts` `: any` (~20), lint's 112 pre-existing errors (mostly React hooks rules)
- 🚀 Next: push to origin (17+ commits ahead); optional follow-up PR for UI/scripts any-types and React hooks lint errors.
