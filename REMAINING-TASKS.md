# 🎯 Remaining Tasks — DevSchool Cleanup (Post-Refactor)

> **Status:** 🚀 Ready for execution
> **Created:** 2026-10-18
> **Owner:** DevSchool Team
> **Prerequisite:** `REFACTOR-ANY-TYPES.md` is COMPLETE (Phases 0–4b done, `app/api/**` + `lib/**` + UI 100% `: any`/`as any`-free, `tsc` & build pass, pushed to `7e10236`).
> **Scope:** 2 tasks — Lint fixes (high priority, risky), Scripts `: any` cleanup (low priority, safe)
> **Estimated Time:** 3–4 hours total (spread over multiple sessions)

---

## 🤖 NEW CHAT HANDOFF — paste this to start

If you are a fresh AI session, **copy the prompt below** and paste it into a new chat:

```
I'm continuing the DevSchool cleanup work in a new chat.

STEP 1 — Read both files fully before doing anything:
  - `REFACTOR-ANY-TYPES.md` (context: what's already done)
  - `REMAINING-TASKS.md` (this file — what's left)

STEP 2 — Confirm understanding briefly:
  - What was completed in `REFACTOR-ANY-TYPES.md`
  - What the 2 remaining tasks are
  - The 7 strict rules below

STEP 3 — Start with Task 1 (Lint fixes). Task 2 (Scripts) only after
         Task 1 is fully done and committed.

STRICT RULES (each earned from prior failures in REFACTOR-ANY-TYPES):
1. `files.edit_multiple_files` can silently drop edits even when
   returning "success" — ALWAYS run `files.search_code` immediately
   after every batch edit to verify.
2. When editing the SAME file multiple times, use ONE edit per call
   (never multiple edits to the same file in a batch).
3. Use whitespace-independent substrings in `oldContent` (no leading
   indentation) to survive CRLF/LF/indent mismatches.
4. Read every target file fully before editing — never edit blind.
5. After each batch: ask user to run `npx tsc --noEmit`, then verify
   with `files.search_code`.
6. Commit after each batch:
   `git add -A && git commit -m "<type>: <scope> — <description>"`
7. Update `REMAINING-TASKS.md` after each batch (status + tracker +
   progress log).

QUALITY BAR: Top-level senior developer. No shortcuts, no "probably
works" — verify every step. If uncertain, STOP and ask.

SAFETY FIRST: Task 1 (lint) touches LIVE app components — a wrong fix
can break production UI. Task 2 (scripts) is safe — dev-only tools.

Current state:
- `REFACTOR-ANY-TYPES.md` COMPLETE (18+ commits, all pushed)
- `app/api/**`, `lib/**`, UI layer: 0 `: any`, 0 `as any`
- `npx tsc --noEmit`: 0 errors
- `npm run build`: 97/97 pages
- Branch: clean, pushed to `7e10236`

Now: read the files, confirm understanding, then start Task 1 audit.

For Task 1: FIRST show me the full lint error list (grouped by rule
+ file), propose a phased plan (which errors in which batch), and
wait for approval BEFORE editing. Lint fixes can change behavior —
never batch-edit without my explicit go-ahead.
```

---

## 📊 Context: What Was Already Done

From `REFACTOR-ANY-TYPES.md`:

| Phase | Scope | Result |
|---|---|---|
| Phase 0 | `lib/api-error.ts` helper | ✅ |
| Phase 1 | `catch (e: any)` → `unknown` + `serverError()` | ✅ 25 files |
| Phase 2 | Callback `any` → proper types | ✅ 13 files |
| Phase 3 | Zod `validateBody()` on admin routes | ✅ 5 batches |
| Phase 4 | Hidden `as any` in settings, AI, sandbox | ✅ 19 instances |
| Phase 4b | UI layer `as any` | ✅ 2 instances |

**Production state:** `app/api/**`, `lib/**`, UI = 100% free of `: any` and `as any`. `tsc` + build pass. Pushed to remote.

**Not touched (this session's scope):**
- Lint errors (112 pre-existing React hooks rules)
- `scripts/*.ts` + `prisma/seed.ts` `: any` (~20, dev-only)

---

## 📋 TASK 1: Fix 112 Lint Errors (HIGH PRIORITY, RISKY)

### Why This Matters

Lint errors here are **not cosmetic**. Most are `react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps` violations. These are **real bugs waiting to happen**:

| Lint Rule | Real Bug Risk |
|---|---|
| `rules-of-hooks` (conditional hook call) | **Runtime crash** — hook order violated |
| `exhaustive-deps` (missing dep) | **Stale closure bug** — UI shows old state |
| `no-unused-vars` | **Dead code** — maintenance debt |
| `jsx-key` | **React re-render bug** — state lost on list update |
| `no-unstable-nested-components` | **Performance** — remount on every render |

**Some of these 112 errors are actual latent bugs.** Fixing them = fixing real issues, not just satisfying the linter.

### Why This is Risky

Every fix has three possible outcomes:
1. **Pure lint satisfaction** — no behavior change (safe)
2. **Bug fix** — corrects broken behavior (good, but changes behavior)
3. **Regression** — over-tightens or misinterprets the rule (bad)

**Example of dangerous fix:**
```tsx
// BEFORE (lint error: exhaustive-deps)
useEffect(() => {
  fetchData(userId)
}, [])  // ← missing userId dependency

// DANGEROUS FIX (regression):
useEffect(() => {
  fetchData(userId)
}, [userId])  // ← now re-fetches on every userId change — could break caching, double-fetch, etc.

// CORRECT FIX (needs thinking):
useEffect(() => {
  fetchData(userId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])  // ← if this is intentional (mount-only), document WHY
```

**This is why Task 1 needs phased execution with explicit approval per batch.**

### Phase 1A: Audit (NO EDITS)

**Goal:** Complete picture of what needs fixing before touching anything.

**Steps:**

1. Run `npm run lint` and capture the FULL output. Save it to a file:
   ```bash
   npm run lint > lint-report.txt 2>&1
   ```

2. Categorize by rule:
   - How many `react-hooks/rules-of-hooks`?
   - How many `react-hooks/exhaustive-deps`?
   - How many `@typescript-eslint/no-unused-vars`?
   - How many other rules?

3. Categorize by file:
   - Which files have 5+ errors? (batch candidates)
   - Which files have 1–2 errors? (individual fixes)
   - Which are in `app/(admin)/**` vs `app/[locale]/**` vs `components/**`?

4. For each **distinct rule**, pick 1 representative example and classify:
   - Is the fix **mechanical** (e.g., `no-unused-vars` → delete)?
   - Is the fix **requires-thinking** (e.g., `exhaustive-deps` → decide if intentional)?
   - Is the fix **behavior-changing** (e.g., adding a dep that causes re-fetch)?

5. Propose a batch plan:
   - **Batch A:** Low-risk mechanical rules (`no-unused-vars`, `jsx-key` where obvious)
   - **Batch B:** `rules-of-hooks` (order violations — always real bugs)
   - **Batch C:** `exhaustive-deps` — **CRITICAL: one file at a time**, decide per-effect whether to add dep or add eslint-disable comment with justification
   - **Batch D:** Remaining edge cases

6. Present the plan + 3 examples per batch (before/after) for approval.

**Output:** A structured report like:

```
LINT AUDIT REPORT
=================

Total errors: 112

By rule:
- react-hooks/exhaustive-deps: 68
- react-hooks/rules-of-hooks: 12
- @typescript-eslint/no-unused-vars: 20
- react/jsx-key: 8
- other: 4

By risk:
- LOW (mechanical): 28 (no-unused-vars, jsx-key)
- MEDIUM (needs review): 12 (rules-of-hooks)
- HIGH (behavior change): 68 (exhaustive-deps) + 4 other

Proposed batches:
- Batch A: 28 LOW-risk (unused vars, keys)
- Batch B: 12 rules-of-hooks (real bugs, fix carefully)
- Batch C: 68 exhaustive-deps — grouped into ~15 files, one file per commit
```

**⚠️ Do NOT edit anything during Phase 1A. Just report.**

### Phase 1B: Batch A — Low-Risk Mechanical (28 errors)

**Scope:** `no-unused-vars`, `jsx-key` where the fix is obvious.

**Safe patterns:**

```tsx
// no-unused-vars: prefix with _ if intentional
const _unused = something  // ← mark as intentional

// Or just remove if truly unused
// (verify with `files.search_code` first!)

// jsx-key: add key prop in .map
{items.map((item, idx) => (
  <div key={item.id /* or idx if no id */}>{item.name}</div>
))}
```

**Process:**
1. Group by file (max 5 files per batch commit)
2. For each: read file → verify var is truly unused → edit → verify
3. `npx tsc --noEmit` after each batch
4. Run `npm run lint` — confirm error count decreased by expected amount
5. Commit: `chore(lint): remove unused vars and add jsx keys`

**Do NOT touch `exhaustive-deps` or `rules-of-hooks` in this batch.**

### Phase 1C: Batch B — rules-of-hooks (12 errors)

**Scope:** Conditional hook calls, hook order violations.

**These are always real bugs.** Example:

```tsx
// BEFORE (rules-of-hooks error):
function Component({ showData }) {
  if (showData) {
    const [data, setData] = useState(null)  // ❌ illegal
  }
  // ...
}

// CORRECT FIX:
function Component({ showData }) {
  const [data, setData] = useState(null)  // always called
  if (!showData) return null  // conditional render after hooks
  // ...
}
```

**Process:**
1. For each file: read fully, understand the hook call structure
2. Propose the fix (show BEFORE + AFTER to user before editing)
3. **Every fix must preserve the component's behavior for the "normal" case**
4. `npx tsc --noEmit` after each file
5. Smoke test: open the affected page, verify it still renders
6. Commit per file: `fix(hooks): restore hook order in <component>`

**Never batch multiple files in Batch B.** One file, one commit, one smoke test.

### Phase 1D: Batch C — exhaustive-deps (68 errors, MOST RISKY)

**This is the dangerous batch.** Every fix needs human judgment.

**Decision tree per `useEffect`:**

1. **Does the effect read state/props not in the dep array?**
   - YES → missing dep is a **real bug** (stale closure)
   - NO → dep array may be correct, investigate further

2. **If we add the dep, does the effect re-run too often?**
   - YES → maybe needs `useMemo` / `useCallback` on the dep
   - MAYBE → maybe should use `useRef` for latest value
   - NO → safe to add dep

3. **Is the effect intentionally mount-only?**
   - YES (e.g., analytics on mount) → add `// eslint-disable-next-line react-hooks/exhaustive-deps` with a comment explaining WHY
   - NO → must fix properly

**Never blanket-add deps.** That's how you get:
- Double-fetch bugs
- Infinite loops (effect mutates state that triggers effect)
- Broken caching
- Timing bugs

**Process per file:**
1. Read the full file
2. List every `useEffect` (with line number)
3. For each, classify as: `add-dep`, `eslint-disable-intentional`, `refactor-to-useCallback`, `refactor-to-useRef`, or `needs-more-context (ask user)`
4. Show the user a table before editing:
   ```
   File: components/HeroSection.tsx
   ─────────────────────────────────
   Line 45: useEffect(() => { ... }, [a, b])
     Missing: c
     c comes from: props
     c changes when: parent re-renders
     Decision: add-dep (safe — c rarely changes)
     
   Line 78: useEffect(() => { ... }, [])
     Missing: onMount (function prop)
     onMount comes from: props
     Decision: eslint-disable (intentional — must run once on mount only)
     Justification: analytics tracking, should not re-fire
   ```
5. User approves decision table
6. Apply edits one at a time (not batch — one useEffect = one edit)
7. `npx tsc --noEmit` after each file
8. Smoke test the affected page thoroughly (open, interact, verify no console errors)
9. Commit per file: `fix(hooks): resolve exhaustive-deps in <file>`

**If uncertain about ANY effect:**
- **STOP**
- Show the user the code
- Ask: "Should this re-run on X change, or is it intentional mount-only?"
- Do NOT guess

### Phase 1E: Verify Complete

1. `npm run lint` → 0 errors (or only `warnings` if user allows)
2. `npx tsc --noEmit` → 0 errors
3. `npm run build` → success
4. **Full smoke test:**
   - Home page (`/en`, `/bn`)
   - Challenges (`/en/challenges`, `/en/challenges/[id]`)
   - Playground (`/en/playground`)
   - Tutorials (`/en/tutorials`, `/en/tutorials/[slug]`)
   - Quiz (any tutorial with quiz)
   - Admin (login, dashboard, create quiz, create challenge, settings)
   - Theme toggle (dark/light)
   - Language switch (`/bn` ↔ `/en`)
5. Update `REMAINING-TASKS.md` (this file) — mark Task 1 complete
6. Commit: `chore(lint): resolve all 112 lint errors`

---

## 📋 TASK 2: Scripts `: any` Cleanup (LOW PRIORITY, SAFE)

### Scope

~20 `: any` in `scripts/*.ts` and `prisma/seed.ts`.

**These are dev-only tools** — not shipped to production. Fixing them is optional but improves codebase consistency.

### Files to Fix

Run to get exact list:
```bash
# Not runnable — use files.search_code instead
# searchTerm: ": any", fileExtensions: ["ts"], scope: scripts/ and prisma/
```

Known files (from prior audit):
- `scripts/diagnose-db.ts` — 8 instances
- `scripts/fix-search-vec-triggers.ts` — 2 instances (plus 2 in comments — those are fine)
- `scripts/test-remote-db.ts` — 1 instance
- `scripts/db-inspect-tutorial.ts` — 1 instance
- Others — discover with search

### Patterns to Fix

**Pattern 1: `catch (e: any)`**
```ts
// BEFORE:
try { ... } catch (e: any) { console.log(e.message) }

// AFTER (scripts aren't NextResponse-based, so use getErrorMessage):
import { getErrorMessage } from '@/lib/api-error'
try { ... } catch (e: unknown) { console.log(getErrorMessage(e)) }
```

**Pattern 2: `let x: any = null`**
```ts
// BEFORE:
let rows: any = null

// AFTER (define local type):
type Row = { id: string; name: string }
let rows: Row | null = null
```

**Pattern 3: `forEach((x: any) => ...)`**
```ts
// BEFORE:
result.forEach((x: any) => console.log(x.name))

// AFTER:
type ResultRow = { name: string; value?: unknown }
result.forEach((x: ResultRow) => console.log(x.name))
```

**Pattern 4: `const x: any[] = ...` (from `$queryRawUnsafe`)**
```ts
// BEFORE:
const cols: any[] = await p.$queryRawUnsafe(...)

// AFTER:
const cols: Array<{ column_name: string; data_type: string }> = 
  await p.$queryRawUnsafe<Array<{ column_name: string; data_type: string }>>(...)
```

### Process

1. Run `files.search_code` for `: any` in `scripts/` and `prisma/seed.ts`
2. For each file: read fully, understand what the `any` represents
3. Define a local type (or reuse from `@prisma/client` or `lib/api-error`)
4. Apply edit
5. `npx tsc --noEmit` after each batch
6. **Verify script still runs:** `npx tsx scripts/<file>.ts` — if it's a safe read-only diagnostic, run it. If it mutates DB, DON'T run it — rely on `tsc`.
7. Commit: `chore(scripts): replace any with local types`

### Batch Plan

All mechanical. Suggested:
- **Batch A:** `catch (e: any)` → `unknown` + `getErrorMessage` (5-6 files)
- **Batch B:** `let x: any`, `x: any[]` → local types (3-4 files)
- **Batch C:** callback `x: any` → local types (2-3 files)

---

## 🚨 CRITICAL WARNINGS

### 1. Lint fixes CAN break production

Unlike Phase 1/2 (which were pure type changes), **lint fixes change runtime behavior**. Every fix must be smoke-tested on the actual UI.

### 2. `exhaustive-deps` is the trap

The linter says "add the dep". But adding the dep can cause:
- Infinite loops
- Double-fetches
- Stale-then-fresh UI flicker
- Analytics over-counting

**Always decide per-effect whether to add the dep OR add an `eslint-disable` with justification.**

### 3. Some lint errors should be `eslint-disable`, not fixed

Example — intentional mount-only effect:
```tsx
useEffect(() => {
  trackPageView()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])  // ← intentional, document WHY
```

### 4. Do NOT add `// @ts-ignore` or `// eslint-disable` without user approval

Every disable comment is a claim that the code is correct despite the warning. The user must approve each one.

### 5. Verify after every batch

- `npx tsc --noEmit` — ask user
- `npm run lint` — count should decrease
- Smoke test affected pages
- `git diff` — review changes before commit

---

## 📊 Progress Tracker

Update this table as work progresses:

### Task 1: Lint Fixes

| Batch | Scope | Files | Status | Committed |
|---|---|---|---|---|
| 1A | Audit | — | ⬜ Pending | — |
| 1B | Unused vars + jsx-key | TBD | ⬜ Pending | — |
| 1C | rules-of-hooks | TBD | ⬜ Pending | — |
| 1D | exhaustive-deps | TBD | ⬜ Pending | — |
| 1E | Verify complete | — | ⬜ Pending | — |

### Task 2: Scripts Cleanup

| Batch | Scope | Files | Status | Committed |
|---|---|---|---|---|
| 2A | `catch (e: any)` | TBD | ⬜ Pending | — |
| 2B | `let x: any` | TBD | ⬜ Pending | — |
| 2C | Callback `x: any` | TBD | ⬜ Pending | — |

**Status legend:** ⬜ Pending | 🔄 In Progress | ✅ Done | ⚠️ Blocked

---

## 🔄 How to Resume

If you pick this up mid-way:

1. Read this file + `REFACTOR-ANY-TYPES.md` fully.
2. Check the Progress Tracker — find first ⬜ Pending.
3. Check `git log --oneline -20` — see recent commits.
4. Run `npm run lint` — see current error count (should match where you left off).
5. Run `npx tsc --noEmit` — must be 0 before starting.
6. Continue from the first pending batch.

---

## 🚨 Rollback Plan

If a lint fix breaks production:

```bash
# Revert just the last commit
git revert HEAD

# Or reset (DANGER — loses uncommitted work)
git reset --hard HEAD~1

# Or checkout a specific file
 git checkout HEAD~1 -- components/SomeFile.tsx
```

Always commit after each batch so rollback is granular.

---

## 📝 Progress Log

Append entries here as work completes.

### 2026-10-18 — Handoff created
- ✅ Documented both tasks with full context
- ✅ Defined phased execution plan
- ✅ Added strict rules + safety warnings
- ⏳ Awaiting user to start Task 1 (Lint audit)

_(Add new entries below as you complete each phase.)_

---

## 🎯 Success Criteria

**Task 1 (Lint) complete when:**
- [ ] `npm run lint` returns 0 errors (or only user-approved warnings)
- [ ] `npx tsc --noEmit` returns 0 errors
- [ ] `npm run build` succeeds
- [ ] Full smoke test passes (all pages render, no console errors)
- [ ] All commits pushed

**Task 2 (Scripts) complete when:**
- [ ] `files.search_code ": any"` in `scripts/` and `prisma/` returns 0 results (except comments)
- [ ] `npx tsc --noEmit` passes
- [ ] Each modified script either runs successfully OR is a mutating script that only passes `tsc` (documented)
- [ ] All commits pushed

**Overall project complete when:**
- [ ] Task 1 done
- [ ] Task 2 done
- [ ] `REFACTOR-ANY-TYPES.md` still accurate (no new `: any` introduced)
- [ ] `REMAINING-TASKS.md` (this file) marked COMPLETE at top

---

## 🙋 Questions Before Starting?

If anything is unclear, STOP and ask. Specifically:

- If a lint error's correct fix is ambiguous (fix vs eslint-disable) → ask
- If a lint error's fix requires changing a function signature → ask
- If a lint error appears in a `.bak` file → ignore (they're gitignored)
- If `npm run lint` count differs from this file's claim of "112" → report the actual count and adjust the plan

**Better to ask than to break production.**

---

_End of document. Keep this file updated as you work._
