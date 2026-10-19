# 🚨 PRE-LAUNCH AUDIT FIX PLAN — DevSchool

> **Status:** 🟢 ALL PHASES COMPLETE & VERIFIED (Batch 1–5, tsc+build green) — only GitHub push remains
> **Scope:** Fix 30 findings from the AI Security & Production Audit.
> **Rule:** One Batch at a time. Verify `tsc` and `build` after each batch. Commit per batch.

---

## 🤖 NEW CHAT HANDOFF — Paste this to start

```text
I am continuing the DevSchool pre-launch audit fixes. Read AUDIT-FIX-PLAN.md fully before doing anything.

CURRENT STATE: Phase 1 (Batch 1+2) and Phase 2 (Batch 3+4) are DONE and VERIFIED
(tsc + build pass). 14 of 19 findings fixed. What remains is Phase 3 / Batch 5
(items 15-19: cleanup + polish) and the final commit/push.

STRICT RULES:
1. DO NOT rewrite entire files unless necessary. Use targeted edits.
2. Read the target file fully before editing.
3. After EACH batch: run `npx tsc --noEmit` and `npm run build`, then commit.
4. Do not skip any rule or use `any` as a shortcut.
5. Make ONE edit per tool call per file (parallel edits to the SAME file overwrite).

Start with Phase 3, Batch 5. Ask for my approval before the final GitHub commit/push.
```

---

## 📋 PHASE 1: CRITICAL SECURITY (Pre-Launch Blockers)
*These are active vulnerabilities that could lead to data loss, XSS, or unauthorized access.*

### 🛠️ Batch 1: Broken Access Control & Error Leaks ✅ DONE

**1. ✅ FIXED — Unauthenticated Tutorial Creation (`app/api/tutorials/route.ts:87`)**
- **Issue:** POST route has no auth. Anyone can write to DB.
- **Fix:** Add at the top of the `POST` handler:
  ```typescript
  const denied = await requireAdmin(request)
  if (denied) return denied
  ```

**2. ✅ FIXED — Missing Admin Guard (`app/api/admin/settings/route.ts:19`)**
- **Issue:** PUT route lacks `requireAdmin()` (relies only on proxy).
- **Fix:** Add standard `requireAdmin(req)` guard at the top of `PUT`.

**3. ✅ FIXED — Server Error Leaks (`lib/api-error.ts:78`)**
- **Issue:** `serverError()` leaks raw `e.message` to the client.
- **Fix:** Change the `NextResponse.json` inside `serverError()` to:
  ```typescript
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  ```

**4. ✅ FIXED — Invalid Prisma Filter (`app/api/tutorials/route.ts:38`)**
- **Issue:** Uses `{ search: q }` which throws 500 on PostgreSQL.
- **Fix:** Change to `{ titleBn: { contains: q, mode: 'insensitive' } }`.

### 🛠️ Batch 2: XSS & Data Leaks ✅ DONE

**5. ✅ FIXED — SVG Stored XSS (`lib/sponsor-image.ts:14` & `app/api/sponsors/image/[id]/route.ts:33`)**
- **Issue:** Malicious SVG can execute JS.
- **Fix (applied):**
  1. Removed `'image/svg+xml'` from `ALLOWED_MIME` in `lib/sponsor-image.ts`.
  2. **Also removed the SVG branch from `detectImageType()`** — this is the real
     validation path used by the upload route, so removing the MIME entry alone
     was not enough. SVG/XML signatures now fall through to `null` (415 reject).
  3. In `app/api/sponsors/image/[id]/route.ts`, added headers:
     `'Content-Disposition': 'attachment'`, `'Content-Security-Policy': "default-src 'none'"`
     (defense-in-depth for any legacy SVG already stored in the DB).

**6. ✅ FIXED — Hidden Test Case Leak (`app/api/challenges/[id]/route.ts:36-44`)**
- **Issue:** Hidden test case inputs are sent to client.
- **Fix:** Modify the query to only fetch non-hidden tests:
  ```typescript
  testCases: { where: { isHidden: false }, select: { id: true, input: true } }
  ```

**7. ✅ FIXED — Quiz Answer Leak (`app/api/quizzes/[id]/route.ts:118-120`)**
- **Issue:** Returns correct answers for unanswered questions.
- **Fix:** Only include `correctAnswer` in the response object if `userAnswer` is not undefined.

**8. ✅ FIXED (documented) — Client-trusted Attempts (`app/api/attempts/route.ts:35-55`)**
- **Issue:** API blindly trusts `isCorrect` and `points` from client.
- **Fix:** For MVP, add a warning comment. For actual fix, calculate `isCorrect` server-side using the DB answer key.

---

## 📋 PHASE 2: HIGH & MEDIUM RISK
*Data integrity, rate limiting, and architecture.*

### 🛠️ Batch 3: Data Integrity & Transactions ✅ DONE

**9. ✅ FIXED — Partial Writes (`app/api/admin/settings/route.ts:42-105`)**
- **Issue:** 6 separate upserts. If one fails, data is corrupt.
- **Fix:** Wrap all 6 `upsert` calls inside `prisma.$transaction([ ... ])`.

**10. ✅ FIXED — Review Cooldown Bypass (`app/api/reviews/route.ts:78-98`)**
- **Issue:** Race condition allows multiple reviews.
- **Fix:** Wrap `review.create` and `reviewCooldown.upsert` in `prisma.$transaction()`.

**11. ✅ FIXED — PIN Lockout DoS (`lib/pin.ts:24, 60-69`)**
- **Issue:** Permanent lockout (year 9999) on global singleton.
- **Fix:** Change `lockedUntil` to a realistic lock duration (e.g., `Date.now() + 15 * 60000` for 15 mins) instead of `FAR_FUTURE`.

### 🛠️ Batch 4: SEO & Security Headers ✅ DONE

**12. ✅ FIXED — Canonical URL Bug (`app/[locale]/layout.tsx:87-96`)**
- **Issue:** Layout sets canonical to `/bn` for all subpages.
- **Fix:** Remove `canonical` from `layout.tsx` metadata. Add it to individual `page.tsx` files using the actual path.

**13. ✅ FIXED — JSON-LD XSS (`app/[locale]/(site)/tutorials/page.tsx` etc.)**
- **Issue:** `JSON.stringify` can break out of `<script>` tag.
- **Fix (applied):** Added a shared helper `serializeJsonLd()` in `lib/json-ld.ts`
  that escapes `<`, `\u2028`, `\u2029`. Replaced every
  `dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}` with
  `dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}`.
  - Applied in **7 pages** (not just tutorials): `about`, `challenges`,
    `challenges/[id]`, `references`, `references/[slug]`, `search`, `tutorials`.
  - A shared helper (instead of inline `.replace` on each page) keeps future
    pages safe by default.

**14. ✅ FIXED — Missing CSP (`next.config.ts:24-44`)**
- **Issue:** No Content-Security-Policy header.
- **Fix:** Add a basic CSP header to `next.config.ts` headers array: `{ key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';" }`

---

## 📋 PHASE 3: LOW RISK & CLEANUP
*Optional, but makes the codebase top 1%.*

### 🛠️ Batch 5: Cleanup & Polish ✅ DONE (code)

**15. ✅ FIXED — Remove Unused Dep (`package.json:50`)** (removed; 11 packages dropped)
- Run: `npm uninstall rehype-raw`

**16. ✅ FIXED — Redundant Indexes (`prisma/schema.prisma`)**
- Remove `@@index([slug])` from Tutorial and Reference (since `@unique` already creates an index).

**17. ✅ FIXED — Silent Catch Blocks (`app/api/sponsors/[id]/click/route.ts:17` etc.)**
- Add `console.error(e)` inside empty `catch {}` blocks so failures are logged.

**18. ✅ FIXED — Rate Limiter Warning (`lib/auth.ts:41`)**
- Add a comment: `// TODO: Replace with Redis for serverless environments`

**19. ✅ FIXED — Dead FTS Code (`app/api/search/route.ts:23-45`)**
- Keep the ILIKE fallback, but add a comment clarifying that FTS is disabled until DB migration restores `searchVec`.

---

## ✅ SUCCESS CRITERIA
- [x] Batch 1 fixes applied & verified (tsc + build pass)
- [x] Batch 2 fixes applied & verified (tsc + build pass)
- [x] All Phase 1 fixes applied (Batch 1 + 2).
- [x] Batch 3 fixes applied & verified (tsc + build pass)
- [x] Batch 4 fixes applied & verified (tsc + build pass)
- [x] All Phase 2 fixes applied (Batch 3 + 4).
- [x] Batch 5 fixes applied & verified (#15–19, tsc + build pass)
- [x] `npx tsc --noEmit` returns 0 errors (verified after each batch).
- [x] `npm run build` completes successfully (verified after each batch).
- [x] No `any` or `as any` introduced.
- [ ] Pushed to GitHub.  ← still pending (do after Phase 3)

---

## ⚠️ KNOWN ACCEPTED RISKS (not part of the 19 fixes)

These are **not** audit findings above — they are dependency advisories that
were consciously accepted. Do not "fix" them with `npm audit fix --force`.

### R1: `braces` — GHSA-vfj7-8cjw-p6xm (high, stack-exhaustion DoS)
- **Chain:** `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`
- **Dev-only:** `npm audit --omit=dev` reports **0 vulnerabilities**; it never
  ships in the production runtime bundle.
- **Not reachable:** `braces` only parses glob patterns from our own lint/build
  config — no user input ever reaches it.
- **No fix exists:** every published `braces` version (incl. latest `3.0.3`) is
  in the vulnerable range. npm's only suggestion is a **breaking downgrade** to
  `eslint-config-next@14.x`, which breaks Next.js 16 compatibility and does not
  remove the vulnerable `braces` version anyway.
- **Action:** re-review when `eslint-config-next` ships an upgraded
  `fast-glob`/`micromatch`/`braces` chain. Until then, leave as-is.
