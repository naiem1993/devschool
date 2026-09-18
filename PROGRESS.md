# DevSchool — Build Progress Tracker

**Last Updated:** 2026-09-18
**Updated By:** MCP AI
**Current Phase:** Nested Structure — **N4 (Admin Panel)** — শুরু করা দরকার
**Overall Progress:** ▰▰▰▰▰▰▱▱▱▱ 55%

## 🚦 Legend
✅ Done  |  🔄 In Progress  |  ⏳ Not Started  |  ⚠️ Blocked  |  ❌ Cancelled

---

## 📖 প্রথমে পড়ো

👉 **[NEXT-AI-HANDOFF.md](./NEXT-AI-HANDOFF.md)** — পরের AI-এর জন্য পূর্ণ instruction।

---

## 📊 Macro Phase Overview

| # | Phase | Status | % | Last Action |
|---|-------|--------|---|-------------|
| 1 | Foundation Audit | ✅ | 100% | schema + migrations verified |
| 2 | Repo Hygiene | ⏳ | 0% | — |
| 3 | Security Audit | ⏳ | 0% | — |
| 4 | Core Features | 🔄 | 75% | public site nested — admin বাকি |
| 5 | Admin Panel | 🔄 | 30% | পুরনো schema — N4-এ rewrite দরকার |
| 6 | UX Polish | ⏳ | 0% | — |
| 7 | SEO & Perf | ⏳ | 0% | — |
| 8 | Testing | ⏳ | 0% | — |
| 9 | Deploy & Launch | ⏳ | 0% | — |

---

## 🌳 Nested Structure Sub-Track

**Plan document:** `NESTED-STRUCTURE-PLAN.md` (v3 FINAL, approved)

| # | Phase | Status | Notes |
|---|-------|--------|-------|
| N1 | Schema + Reset script | ✅ **DONE** | migration চালানো, DB clean |
| N2 | Public pages | ✅ **DONE** | `[chapter]` rewrite, `[lesson]` নতুন, tryit pages |
| N3 | 3-level Sidebar | ✅ **DONE** | LessonSidebar সম্পূর্ণ rewrite |
| **N4** | **Admin (Lesson + Group)** | 🔴 **PENDING** | এখান থেকে শুরু করবে |
| N5 | Cleanup + SEO | ⏳ | redirect নেই |
| N6 | Content writing | ⏳ | ইউজারের হাতে |

---

## 🔍 N1 — Schema + Reset (✅ DONE)

- [x] `prisma/schema.prisma.bak` backup
- [x] `TutorialContent` delete
- [x] `ChapterGroup` model যোগ
- [x] `Chapter` model যোগ
- [x] `Lesson` model যোগ
- [x] `Tutorial.contents` → `groups` + `chapters`
- [x] `scripts/reset-tutorial-content.ts` তৈরি
- [x] `npx prisma migrate dev --name nested_structure_chapter_lesson` (user চালিয়েছে)
- [x] `npx prisma generate` (EPERM fix করে user চালিয়েছে)

**DB state:** সব table clean (Lesson 0 / Chapter 0 / ChapterGroup 0 / Tutorial 0)

---

## 🔍 N2 — Public pages (✅ DONE)

- [x] `lib/tutorial-types.ts` — shared types + helpers
- [x] `lib/tutorial-data.ts` — `getTutorialNav()`
- [x] `components/TutorialShell.tsx` — নতুন props (`nav`, `active`)
- [x] `components/LessonSidebar.tsx` — 3-level rewrite
- [x] `app/(site)/tutorials/[slug]/page.tsx` — home rewrite
- [x] `app/(site)/tutorials/[slug]/[chapter]/page.tsx` — rewrite
- [x] `app/(site)/tutorials/[slug]/[chapter]/[lesson]/page.tsx` — নতুন
- [x] `app/(site)/tutorials/[slug]/[chapter]/tryit/page.tsx` — নতুন
- [x] `app/(site)/tutorials/[slug]/[chapter]/[lesson]/tryit/page.tsx` — নতুন
- [x] `components/LessonContent.tsx` — `chapterNo` → `lessonPath`
- [x] `components/TryIt.tsx` — same
- [x] `components/TryItFullClient.tsx` — same
- [x] `app/(site)/page.tsx` — `contents` → `chapters`
- [x] `app/api/tutorials/route.ts` — inline contents বাদ
- [x] `app/api/tutorials/[slug]/route.ts` — নতুন shape
- [x] `app/sitemap.ts` — নতুন URL pattern
- [x] `prisma/seed.ts` — সম্পূর্ণ rewrite
- [x] `lib/validators.ts` — contents deprecated
- [x] ৩টা obsolete script delete

---

## 🔍 N3 — 3-level Sidebar (✅ DONE)

- [x] GroupHeader render (non-clickable)
- [x] Chapter render (caret + click rule)
- [x] Lesson render (indented)
- [x] In-memory collapse state (`useState`)
- [x] Deep-link auto-expand
- [x] Active highlight

---

## 🔍 N4 — Admin Panel (✅ DONE)

### Pages
- [x] `app/admin/tutorials/[id]/chapters/page.tsx` — groups + chapters + lessons include
- [x] `app/admin/tutorials/[id]/edit/page.tsx` — নতুন shape
- [x] `app/admin/tutorials/page.tsx` — `_count.chapters` + `_count.groups`
- [x] `app/admin/layout.tsx` — `force-dynamic` (admin list instant update)

### Components
- [x] `components/admin/ChaptersManager.tsx` — সম্পূর্ণ rewrite
- [x] `components/admin/LessonsManager.tsx` — নতুন
- [x] `components/admin/GroupsManager.tsx` — নতুন
- [x] `components/admin/TutorialForm.tsx` — `contents` বাদ
- [x] `lib/validators.ts` — group/chapter/lesson schema

### API routes (সব nested `/api/admin/tutorials/[id]/...`)
- [x] `chapters/route.ts` + `[chId]/route.ts`
- [x] `chapters/[chId]/lessons/route.ts` + `[lessons]/[lid]/route.ts`
- [x] `groups/route.ts` + `[gid]/route.ts`

### Definition of Done
- [x] `npx tsc --noEmit` → **০ error**
- [x] `npm run build` সফল
- [x] Admin-এ chapter + lesson + group যোগ/এডিট/ডিলিট কাজ করে

---

## 🔍 N5 — Cleanup + SEO (🔄 In Progress — ISR part done)

### ISR + on-demand revalidation (✅ DONE)
- [x] `lib/revalidate-tutorial.ts` — `revalidateTutorialPaths` + `revalidateTutorialListPaths` helper
- [x] admin save → instant public update (সব tutorial/chapter/lesson/groups route-এ call)
- [x] Home + categories + challenges + references + search + progress + tools → ISR 5m
- [x] Tutorials [slug]/[chapter]/[lesson] → SSG+ISR (86400s safety net)
- [x] Security verify: কোনো user data static-এ নেই

### বাকি
- [ ] পুরনো URL redirect
- [ ] SEO metadata audit
- [ ] sitemap verify

---

## ✅ Decision Log

| # | Decision | Date |
|---|----------|------|
| D1 | Nested structure (Group → Chapter → Lesson) | 09-18 |
| D2 | URL slug-based | 09-18 |
| D3 | Chapter slug = URL prefix; first lesson-এর suffix নেই | 09-18 |
| D4 | Chapter click → first lesson | 09-18 |
| D5 | 3-level sidebar | 09-18 |
| D6a–d | Slug sync / English slug / non-clickable group / in-memory collapse | 09-18 |
| D7 | Site live নয় → wipe, no migration/redirect | 09-18 |
| D8 | `TutorialContent` delete; ৩ নতুন model | 09-18 |

---

## 📜 Changelog (newest first)

| Date | Phase | Action | Result |
|------|-------|--------|--------|
| 09-18 | N5 | ISR + on-demand revalidate (৮ admin route) | ✅ instant update |
| 09-18 | N5 | Home + site layout ISR → ২৮ public page static | ✅ |
| 09-18 | N4 | Admin panel সম্পূর্ণ — tsc ০ error, build সফল | ✅ |
| 09-18 | N4 | LessonsManager + GroupsManager নতুন | ✅ |
| 09-18 | Docs | `NEXT-AI-HANDOFF.md` তৈরি | ✅ পরের AI-এর জন্য |
| 09-18 | N2 | seed.ts সম্পূর্ণ rewrite + validators fix | ✅ |
| 09-18 | N2 | `app/(site)/page.tsx`, `api/tutorials` fix | ✅ |
| 09-18 | N2 | ৩টা obsolete script delete | ✅ |
| 09-18 | N2 | Public pages + Sidebar সম্পূর্ণ rewrite | ✅ |
| 09-18 | N1 | Migration + Prisma generate | ✅ DB clean |
| 09-18 | N1 | Schema সম্পূর্ণ edit (৩ নতুন model) | ✅ |

---

## ⏭️ Next Action

**N4 ✅ শেষ, N5-এর ISR অংশও ✅ শেষ। বাকি N5 cleanup:**
1. পুরনো URL redirect verify (D7 অনুযায়ী site live নয়, তাই redirect লাগতেও পারে না)
2. SEO metadata audit
3. sitemap verify
4. তারপর N6 (content writing — ইউজারের হাতে)

**⚠️ কোনো প্রশ্ন করার দরকার নেই — সব decision `NEXT-AI-HANDOFF.md`-এ locked।**

---
**📌 AI Instruction:** প্রতিটা কাজের পরে `NEXT-AI-HANDOFF.md`-এর Status table + এই PROGRESS.md-এর Changelog update করো।
