# 🎯 Remaining Tasks — DevSchool Cleanup (Post-Refactor)

> **Status:** 🔄 IN PROGRESS — Task 1 Batch 1A-1 + 1A-2 done (8 files, commits `15c432a`+`2b42f66`). Next: Batch 1A-3.
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

STEP 3 — Check the Progress Tracker for the first pending batch. Continue from there.

STRICT RULES (each earned from prior failures in REFACTOR-ANY-TYPES):
1. `files.edit_multiple_files` can silently drop edits even when
   returning "success" — ALWAYS run `files.search_code` immediately
   after every batch edit to verify.
2. When editing the SAME file multiple times, use ONE edit per call
   (never multiple edits to the same file in a batch).
3. Use whitespace-independent substrings in `oldContent` (no leading
   indentation) to survive CRLF/LF/indent mismatches. Multi-line
   oldContent is unreliable on CRLF files — prefer single-line anchors.
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

Current state (as of 2026-10-18 after Batch 1A-1/1A-2):
- `REFACTOR-ANY-TYPES.md` COMPLETE (18+ commits, pushed)
- `app/api/**`, `lib/**`, UI layer: 0 `: any`, 0 `as any`
- `npx tsc --noEmit`: 0 errors
- `npm run build`: 97/97 pages
- Lint baseline: 116 problems (90 errors, 26 warnings) — see REAL BREAKDOWN below
- Task 1 Batch 1A-1 + 1A-2 done: 8 files, 9 problems fixed

Now: read the files, confirm understanding, then continue Task 1 from the first pending batch.

For EVERY batch: show me the BEFORE/AFTER for risky fixes and wait for approval.
Lint fixes can change behavior — never batch-edit without my explicit go-ahead.
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
- Lint errors — see REAL BREAKDOWN below (actual: 116 problems = 90 errors + 26 warnings)
- `scripts/*.ts` + `prisma/seed.ts` `: any` (~26 instances, dev-only — Task 2)

---

## 🚨 REAL LINT BREAKDOWN (ground truth from `lint-report-utf8.txt`)

> ⚠️ **The original doc guessed "112 errors, mostly 68 exhaustive-deps / 12 rules-of-hooks". This was WRONG.** The actual lint run on 2026-10-18 gave:

**Total: 116 problems = 90 errors + 26 warnings**

| Rule | Type | Count | Scope | Risk |
|---|---|---|---|---|
| `@typescript-eslint/no-explicit-any` | error | **52** | 26 in `app/`+`components/`, 26 in `scripts/`+`prisma/` | 🟢 Runtime zero (type-only) |
| `react-hooks/set-state-in-effect` | error | **26** | all in `app/`+`components/` | 🔴 HIGH (React 19 rule — behavior) |
| `@typescript-eslint/no-unused-vars` | warning | **18** | mixed | 🟢 Low |
| `react-hooks/exhaustive-deps` | warning | **7** | mixed | 🟡 Medium |
| `@next/next/no-html-link-for-pages` | error | **6** | 1 file (`global-error.tsx:141`, repeated) | 🟠 Medium |
| `react/no-unescaped-entities` | error | **2** | 1 file | 🟢 Low |
| `react-hooks/static-components` | error | **1** | `components/Header.tsx` | 🟠 Medium |
| `react-hooks/immutability` | error | **1** | `components/LessonContent.tsx` | 🔴 HIGH |
| `react-hooks/use-memo` | error | **1** | `components/HomeSearch.tsx` | 🟡 Medium |
| `prefer-const` | error | **1** | 1 API route | 🟢 Low |
| unused eslint-disable directive | warning | **1** | `components/tools/LoremIpsumTool.tsx` | 🟢 Low |

### 🔎 Key corrections vs. the original plan

1. **`rules-of-hooks` = 0** (doc claimed 12). The dangerous rule is actually **`set-state-in-effect`** — a new React 19 rule the doc didn't even mention.
2. **`exhaustive-deps` = 7 warnings**, not 68 errors.
3. **`no-explicit-any` = 52 errors** (26 UI-side + 26 scripts-side). UI-side belongs in Task 1; scripts-side belongs in Task 2.
4. **`jsx-key` = 0** (doc claimed 8). No occurrences found.
5. **`npm run lint` is repo-wide** — so 26 errors from `scripts/` + `prisma/seed.ts` appear in the count but are OUT of Task 1's success criteria. Task 1 success = **0 errors in `app/**` + `components/**`**; scripts/prisma errors get resolved in Task 2.

---

## 📋 TASK 1: Fix Lint Errors in `app/` + `components/` (HIGH PRIORITY, RISKY)

### Why This Matters

Lint errors here are **not cosmetic**. The two rules that actually fire are:

| Lint Rule | Real Bug Risk |
|---|---|
| `react-hooks/set-state-in-effect` | **Cascading renders** — performance + stale UI |
| `react-hooks/immutability` | **Render inconsistency** — variable mutated after render |
| `react-hooks/static-components` | **State loss** — component remounted every render |
| `@typescript-eslint/no-explicit-any` | **Type erasure** — silent runtime mismatches |
| `react-hooks/exhaustive-deps` | **Stale closure bug** — UI shows old state |
| `no-unused-vars` | **Dead code** — maintenance debt |

**Many of these are actual latent bugs.** Fixing them = fixing real issues.

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

### Batch Plan (real, approved 2026-10-18)

| Batch | Scope | Count | Risk | Approach |
|---|---|---|---|---|
| **1A** | `no-unused-vars` + `prefer-const` + `no-unescaped-entities` + unused disable | ~22 | 🟢 None | Read → verify unused → delete/prefix/escape. 5 files/commit. |
| **1B** | UI `no-explicit-any` (26 in `app/` + `components/`) | 26 | 🟢 Zero runtime | Read → define/reuse type → edit. 3–4 files/commit. |
| **1C** | Special: `global-error` (Link), `Header` static-components, `LessonContent` immutability, `HomeSearch` use-memo | 4 unique | 🟠 Medium | **One file at a time**, BEFORE/AFTER approve. |
| **1D** | `set-state-in-effect` | 26 | 🔴 **Highest** | **One file at a time**, per-effect decision table. User approval per file. |
| **1E** | `exhaustive-deps` warnings (7) | 7 warn | 🟡 Medium | Fix-or-disable per-effect. |
| **1F** | Final verify + doc update | — | — | tsc + lint (app/components only) + build + smoke test. |

### Phase 1A: Mechanical Rules (LOW RISK) — IN PROGRESS

**Scope:** `no-unused-vars`, `prefer-const`, `no-unescaped-entities`, unused disable directive.

**Safe patterns:**

```tsx
// no-unused-vars: prefix with _ if intentional
const _unused = something  // ← mark as intentional

// Or just remove if truly unused
// (verify with `files.search_code` first!)

// no-unescaped-entities: escape " → &quot;
<p>Use &quot;quoted&quot; text</p>
```

**Process:**
1. Group by file (max 5 files per batch commit)
2. For each: read file → verify var is truly unused → edit → verify with `search_in_file`
3. `npx tsc --noEmit` after each sub-batch
4. Commit: `chore(lint): remove unused vars/imports + prefer-const`

### Phase 1B: UI `no-explicit-any` (ZERO RUNTIME RISK)

**Scope:** 26 `any` types in `app/[locale]/**` + `components/**`.

**Process per file:** Read → understand what the `any` represents → define or reuse a real type → edit → tsc → verify.

**Approach:** 3–4 files per commit.

### Phase 1C: Special Cases (MEDIUM RISK, per-file approve)

- **`app/global-error.tsx:141`** — `<a href="/">` → **justified eslint-disable** (global-error React boundary cannot use `<Link>` for full reload navigation)
- **`components/Header.tsx:108–127`** — `BurgerIcon`/`MobileBurger` created during render → move to module scope (pure refactor, no behavior change)
- **`components/LessonContent.tsx:151`** — `quizMarkerIndex += 1` after render → `useRef` or precompute; **behavior review needed**
- **`components/HomeSearch.tsx:56`** — `useCallback(debounce(...))` shape → refactor per React 19 hooks rules

### Phase 1D: `set-state-in-effect` (HIGHEST RISK, per-file + per-effect approve)

**This is the dangerous batch.** Every fix needs human judgment.

**26 instances, one file at a time, decision table per effect.**

Categories:
- **localStorage-on-mount** (ThemeProvider, QuizWidget best score, PlaygroundClient, TryItFullClient) → typically justified disable (server-render mismatch risk)
- **Prop→state sync** (ChaptersManager, GroupsManager, LessonsManager) → typically `key={id}` on parent OR `useEffect` refactored away
- **Route-change reset** (AdminShell drawer) → safe to keep, disable with comment
- **Format/copy derived state** (JsonFormatter, LoremIpsumTool) → compute-in-render or disable

**Never blanket-add deps.** Decision per effect, user approves each.

### Phase 1E: `exhaustive-deps` warnings (MEDIUM RISK)

7 warnings. Per-effect decision (add-dep / useMemo / useCallback / justified disable). User approves each.

### Phase 1F: Verify Complete

1. `npm run lint` → 0 errors in `app/**` + `components/**`; scripts/prisma errors deferred to Task 2
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
6. Commit: `chore(lint): resolve Task 1 lint errors in app/ + components/`

---

## 📋 TASK 2: Scripts `: any` Cleanup (LOW PRIORITY, SAFE)

### Scope

26 `: any` in `scripts/*.ts` and `prisma/seed.ts`:
- `scripts/diagnose-db.ts` — 19 instances
- `scripts/fix-search-vec-triggers.ts` — 4 instances
- `scripts/db-inspect-tutorial.ts` — 1 instance
- `scripts/test-remote-db.ts` — 1 instance
- `prisma/seed.ts` — 1 instance

**These are dev-only tools** — not shipped to production. Fixing them improves consistency + drops the lint count to 0.

### Patterns to Fix

**Pattern 1: `catch (e: any)`**
```ts
import { getErrorMessage } from '@/lib/api-error'
try { ... } catch (e: unknown) { console.log(getErrorMessage(e)) }
```

**Pattern 2: `let x: any = null`**
```ts
type Row = { id: string; name: string }
let rows: Row | null = null
```

**Pattern 3: `forEach((x: any) => ...)`**
```ts
type ResultRow = { name: string; value?: unknown }
result.forEach((x: ResultRow) => console.log(x.name))
```

**Pattern 4: `const x: any[] = ...` (from `$queryRawUnsafe`)**
```ts
const cols: Array<{ column_name: string; data_type: string }> =
  await p.$queryRawUnsafe<Array<{ column_name: string; data_type: string }>>(...)
```

### Process

1. `files.search_code` for `: any` in `scripts/` and `prisma/seed.ts`
2. For each file: read fully, understand what `any` represents
3. Define a local type (or reuse from `@prisma/client`)
4. Apply edit, verify
5. `npx tsc --noEmit` after each batch
6. **Verify script still runs:** `npx tsx scripts/<file>.ts` — safe read-only diagnostics only. Mutating scripts: rely on `tsc` only.
7. Commit: `chore(scripts): replace any with local types`

### Batch Plan

- **Batch 2A:** `diagnose-db.ts` (19) + `db-inspect-tutorial.ts` (1) + `test-remote-db.ts` (1) = 21
- **Batch 2B:** `fix-search-vec-triggers.ts` (4) + `prisma/seed.ts` (1) = 5

---

## 🚨 CRITICAL WARNINGS

### 1. Lint fixes CAN break production

Unlike Phase 1/2 (which were pure type changes), **lint fixes change runtime behavior**. Every fix must be smoke-tested on the actual UI.

### 2. `set-state-in-effect` is the real trap (not exhaustive-deps)

26 instances of `setState` called synchronously inside `useEffect`. Some are legitimate (localStorage hydration on mount). Converting them can reintroduce SSR hydration mismatches. **One file at a time, approve each.**

### 3. Some lint errors should be `eslint-disable`, not fixed

Example — global-error page must use `<a>` not `<Link>` for full reload:
```tsx
// eslint-disable-next-line @next/next/no-html-link-for-pages
<a href="/">Home</a>
```

### 4. Do NOT add `// @ts-ignore` or `// eslint-disable` without user approval

Every disable comment is a claim that the code is correct despite the warning. The user must approve each one.

### 5. Verify after every batch

- `npx tsc --noEmit` — ask user
- `npm run lint` — count should decrease
- Smoke test affected pages
- `git diff` — review changes before commit

### 6. CRLF files

`components/LessonSidebar.tsx` is CRLF. Multi-line `oldContent` failed. **Single-line anchors are safer.** If `oldContent not found`, retry with a single-line substring.

---

## 📊 Progress Tracker

Update this table as work progresses:

### Task 1: Lint Fixes

| Batch | Scope | Files | Status | Committed |
|---|---|---|---|---|
| 1A-1 | API imports (unused + prefer-const) | 3 | ✅ Done | `15c432a` |
| 1A-2 | Unused vars (lesson-sidebar, base64, image-to-pdf) | 5 | ✅ Done | `15c432a` |
| 1A-3 | Remaining unused vars + unescaped entities | ~7 | ⬜ Pending | — |
| 1B | UI `no-explicit-any` | 17 | ⬜ Pending | — |
| 1C | Special cases (4 unique) | 4 | ⬜ Pending | — |
| 1D | `set-state-in-effect` | 18 | ⬜ Pending | — |
| 1E | `exhaustive-deps` warnings | ~6 | ⬜ Pending | — |
| 1F | Final verify + build + smoke | — | ⬜ Pending | — |

### Task 2: Scripts Cleanup

| Batch | Scope | Files | Status | Committed |
|---|---|---|---|---|
| 2A | diagnose-db + db-inspect + test-remote-db | 3 | ⬜ Pending | — |
| 2B | fix-search-vec + prisma/seed | 2 | ⬜ Pending | — |

**Status legend:** ⬜ Pending | 🔄 In Progress | ✅ Done | ⚠️ Blocked

---

## 🔄 How to Resume

If you pick this up mid-way:

1. Read this file + `REFACTOR-ANY-TYPES.md` fully.
2. Check the Progress Tracker — find first ⬜ Pending.
3. Check `git log --oneline -20` — see recent commits.
4. Run `npm run lint > lint-report.txt 2>&1` (then UTF-8 convert if needed). Compare to REAL LINT BREAKDOWN above.
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

### 2026-10-18 — Lint audit run + doc correction
- 🔍 Ran `npm run lint > lint-report.txt 2>&1` and converted to `lint-report-utf8.txt`.
- 📊 **Ground truth: 116 problems (90 errors, 26 warnings).**
- ⚠️ **Original doc's "112 errors, 68 exhaustive-deps, 12 rules-of-hooks, 8 jsx-key" was wrong.** Real rules discovered:
  - `no-explicit-any` = 52 (split 26 UI + 26 scripts/prisma)
  - `set-state-in-effect` = 26 (React 19 rule, undocumented in original plan)
  - `no-unused-vars` = 18 (warnings)
  - `exhaustive-deps` = 7 (warnings)
  - `no-html-link-for-pages` = 6 (single file, repeated)
  - `no-unescaped-entities` = 2
  - `static-components`, `immutability`, `use-memo`, `prefer-const`, unused-disable = 1 each
- ✅ Replaced the batch plan with a real one (1A → 1F) aligned to actual rules.
- ✅ Scoped Task 1 success = 0 errors in `app/**` + `components/**`; scripts/prisma lint errors deferred to Task 2.
- 🔧 Fixed `.gitignore` to exclude `lint-report*.txt`; removed accidentally-committed lint reports from git history tip (commit `2b42f66`).

### 2026-10-18 — Batch 1A-1 Complete ✅ (3 API files)
- `app/api/reviews/route.ts` — removed unused `revalidatePath` import
- `app/api/tutorials/route.ts` — removed unused `paginationSchema` import
- `app/api/admin/references/bulk/route.ts` — `let slug` → `const slug`
- ✅ All 3 verified with `search_in_file` (0 matches)
- ✅ `npx tsc --noEmit` — 0 errors
- 📝 Commit: `chore(lint): batch 1A — remove unused vars/imports + prefer-const (8 files)` `15c432a`

### 2026-10-18 — Batch 1A-2 Complete ✅ (5 files)
- `app/(admin)/admin/tutorials/new/page.tsx` — removed unused `prisma` import
- `app/[locale]/(site)/playground/page.tsx` — removed dead `locale` calculation from `PlaygroundPage` body (metadata kept intact)
- `components/LessonSidebar.tsx` — removed unused `tutorialTitle` from destructure (kept type contract to avoid breaking 5+ parent usages); removed unused `isHome` var. ⚠️ CRLF file — first multi-line edit failed, single-line anchor succeeded.
- `components/tools/Base64Tool.tsx` — removed dead `tooBig` + `busy` vars
- `components/tools/ImageToPdfTool.tsx` — removed unused `JPEG_QUALITY` const
- ✅ All 5 verified with `search_in_file` (0 matches)
- ✅ `npx tsc --noEmit` — 0 errors
- 🎓 **Lesson:** CRLF files can reject multi-line `oldContent`. Prefer single-line anchors. Already added to STRICT RULE 3.
- 📝 Commit: `15c432a`

_(Add new entries below as you complete each batch.)_

---

## 🎯 Success Criteria

**Task 1 (Lint) complete when:**
- [ ] `npm run lint` returns 0 errors in `app/**` + `components/**` (scripts/prisma lint deferred to Task 2)
- [ ] `npx tsc --noEmit` returns 0 errors
- [ ] `npm run build` succeeds
- [ ] Full smoke test passes (all pages render, no console errors)
- [ ] All commits pushed

**Task 2 (Scripts) complete when:**
- [ ] `files.search_code ": any"` in `scripts/` and `prisma/` returns 0 results (except comments)
- [ ] `npm run lint` returns **0 problems** total (combined with Task 1)
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
- If `npm run lint` count differs from REAL LINT BREAKDOWN above → report the actual count and update this file

**Better to ask than to break production.**

---

_End of document. Keep this file updated as you work._
