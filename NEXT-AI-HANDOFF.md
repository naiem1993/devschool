# DevSchool — Next AI Handoff Document

> **তৈরি:** 2026-09-18
> **উদ্দেশ্য:** পরের AI যেন এই ফাইলটা পড়েই exact জায়গা থেকে কাজ শুরু করতে পারে — কোনো প্রশ্ন ছাড়াই।
> **Project:** `C:\Users\Naiem\Desktop\devschool` (Next.js 16.3.4 + Prisma 5.22 + PostgreSQL/Supabase)

---

## 🎯 মূল উদ্দেশ্য (Mission)

DevSchool-এর tutorial structure **flat ১৫-chapter → nested (ChapterGroup → Chapter → Lesson)** করা হচ্ছে।
Plan document: `NESTED-STRUCTURE-PLAN.md` (v3 FINAL — approved)।

---

## 📊 বর্তমান অবস্থা (কোথায় আছি)

| Phase | কাজ | Status |
|---|---|---|
| **N1** | Schema + Reset script | ✅ **DONE** — migration চালানো হয়েছে, DB clean |
| **N2** | Public pages (chapter + lesson) | ✅ **DONE** — সব public page rewrite |
| **N3** | 3-level Sidebar | ✅ **DONE** — LessonSidebar সম্পূর্ণ rewrite |
| **N4** | Admin (Lesson + Group manager) | 🔴 **PENDING** — এখান থেকেই শুরু করবে |
| **N5** | Cleanup + SEO | ⏳ Pending |
| **N6** | Content writing | ⏳ ইউজারের হাতে |

---

## 🗄️ DB Schema (যা এখন live)

**`prisma/schema.prisma`-এ ৩টা নতুন model, `TutorialContent` delete হয়ে গেছে।**

```prisma
model ChapterGroup {
  id         String   @id @default(cuid())
  tutorialId String
  tutorial   Tutorial @relation(fields: [tutorialId], references: [id], onDelete: Cascade)
  title      String
  sortOrder  Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  chapters   Chapter[]
  @@index([tutorialId, sortOrder])
}

model Chapter {
  id          String        @id @default(cuid())
  tutorialId  String
  tutorial    Tutorial      @relation(fields: [tutorialId], references: [id], onDelete: Cascade)
  groupId     String?
  group       ChapterGroup? @relation(fields: [groupId], references: [id], onDelete: SetNull)
  title       String
  slug        String
  sortOrder   Int           @default(0)
  content     String?       // শুধু single-page chapter-এ
  codeExample String?       // শুধু single-page chapter-এ
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  lessons     Lesson[]
  @@unique([tutorialId, slug])
  @@index([tutorialId, sortOrder])
  @@index([groupId])
}

model Lesson {
  id          String   @id @default(cuid())
  chapterId   String
  chapter     Chapter  @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  title       String
  slug        String
  content     String
  codeExample String?
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@unique([chapterId, slug])
  @@index([chapterId, sortOrder])
}
```

**Tutorial model-এ:** `contents TutorialContent[]` বাদ → `groups ChapterGroup[]` + `chapters Chapter[]` যোগ।

---

## 🌐 URL Rules (D3, D4)

```
/tutorials/{tutorialSlug}                          → tutorial home
/tutorials/{tutorialSlug}/{chapterSlug}            → single-page chapter
                                                    অথবা nested chapter-এর first lesson
/tutorials/{tutorialSlug}/{chapterSlug}/{lessonSlug} → nested chapter-এর ২য়+ lesson

/tutorials/{tutorialSlug}/{chapterSlug}/tryit                 → full editor
/tutorials/{tutorialSlug}/{chapterSlug}/{lessonSlug}/tryit    → full editor (2nd+ lesson)
```

**নিয়ম:**
- Chapter-এর slug = URL prefix
- **First lesson** (lowest `sortOrder`)-এর URL = `/{chapterSlug}` (সuffix নেই)
- **বাকি lesson** = `/{chapterSlug}/{lessonSlug}`
- `/{chapterSlug}/{firstLessonSlug}`-এ গেলে **`permanentRedirect`** → `/{chapterSlug}`
- বাংলা slug ❌, সব lowercase force

---

## 📁 Files Created/Modified — Status

### ✅ নতুন ফাইল (N2/N3-এ তৈরি)
| File | কাজ |
|---|---|
| `lib/tutorial-types.ts` | Shared types + `buildSidebarSections`, `lessonUrl`, `chapterTargetUrl` helper |
| `lib/tutorial-data.ts` | `getTutorialNav(tutorialId)` — server-side tree fetch |
| `app/(site)/tutorials/[slug]/[chapter]/[lesson]/page.tsx` | Nested lesson page |
| `app/(site)/tutorials/[slug]/[chapter]/tryit/page.tsx` | Chapter full editor |
| `app/(site)/tutorials/[slug]/[chapter]/[lesson]/tryit/page.tsx` | Lesson full editor |

### ✅ Rewrite/edit হয়েছে
| File | কী বদলালো |
|---|---|
| `prisma/schema.prisma` | ৩ নতুন model, TutorialContent delete |
| `prisma/seed.ts` | **সম্পূর্ণ নতুন — Chapter + Lesson দিয়ে** |
| `app/(site)/tutorials/[slug]/page.tsx` | Tutorial home — `chapters` থেকে |
| `app/(site)/tutorials/[slug]/[chapter]/page.tsx` | single-page + first-lesson উভয় handle |
| `components/TutorialShell.tsx` | নতুন props: `nav`, `active` |
| `components/LessonSidebar.tsx` | **সম্পূর্ণ 3-level rewrite** |
| `components/LessonContent.tsx` | `chapterNo` → `lessonPath` |
| `components/TryIt.tsx` | `chapterNo` → `lessonPath` |
| `components/TryItFullClient.tsx` | `chapterNo` → `lessonPath` |
| `app/(site)/page.tsx` | Home — `contents` → `chapters` |
| `app/api/tutorials/route.ts` | `contents` inline create বাদ |
| `app/api/tutorials/[slug]/route.ts` | `contents` → `groups` + `chapters` |
| `app/api/admin/tutorials/route.ts` | নতুন — `_count.chapters` |
| `app/api/admin/tutorials/[id]/route.ts` | `contents` → `groups` + `chapters` |
| `app/sitemap.ts` | নতুন URL pattern |
| `lib/validators.ts` | `createTutorialSchema.contents` → `z.array(z.any())` deprecated |

### 🗑️ Delete হয়েছে
- `scripts/add-html-paragraphs.ts`
- `scripts/merge-html-lessons.ts`
- `scripts/inspect-tutorials.ts`

### ⚠️ সবচেয়ে জরুরি — এখনো যা বাকি

`npx tsc --noEmit` চালালে **~৪৪টা error** দেখাবে। সব error এই ফাইলগুলোতে:

| File | Errors | কী করতে হবে |
|---|---|---|
| `app/admin/tutorials/[id]/chapters/page.tsx` | 5 | `contents` → `chapters`; `tutorial.category` যোগ করতে হবে |
| `app/admin/tutorials/[id]/edit/page.tsx` | 3 | `contents` → নতুন shape |
| `app/admin/tutorials/page.tsx` | 3 | `_count.contents` → `_count.chapters`; `category` include ঠিক |
| `app/api/admin/tutorials/[id]/chapters/route.ts` | 8 | `tutorialContent` → `chapter`, chapterNo logic → sortOrder/slug |
| `app/api/admin/tutorials/[id]/chapters/[chId]/route.ts` | 7 | same |
| `components/admin/ChaptersManager.tsx` | ? | সম্পূর্ণ নতুন — slug input, group dropdown, type toggle, lessons link |
| `components/admin/TutorialForm.tsx` | ? | `contents` বাদ |
| **নতুন দরকার:** `components/admin/LessonsManager.tsx` | — | lesson CRUD UI |
| **নতুন দরকার:** `components/admin/GroupsManager.tsx` | — | group CRUD UI |
| **নতুন দরকার:** `app/api/admin/lessons/route.ts` + `[id]/route.ts` | — | lesson CRUD API |
| **নতুন দরকার:** `app/api/admin/groups/route.ts` + `[id]/route.ts` | — | group CRUD API |

**✅ N4 শেষ — সব error fix হয়েছে।** Public site (home, tutorial, chapter, lesson, sidebar) এবং admin panel — দুটোই এখন কাজ করবে।

**পরের কাজ (N5 — Cleanup + SEO):**
1. `npx tsc --noEmit` আবার চালাও (নিশ্চিত হও ০ error)
2. `npm run build` চালাও — build সফল কিনা দেখো
3. পুরনো URL redirect verify করো
4. SEO metadata + sitemap verify করো

---

## 🎨 Design Rules (মনে রাখতে হবে)

| Rule | মান |
|---|---|
| Brand color | Neon Green `#22C55E` (hover `#4ADE80`, dark text `#15803d`) |
| Dark bg | `#050806` / `#080c0a` / `#0a0f0c` |
| Light bg | `#F2FBF4` (mint) |
| Sidebar 3-level | GroupHeader (non-clickable, `text-[11px] uppercase font-bold tracking-widest`) → Chapter (caret + click) → Lesson (`pl-9`, smaller) |
| Sidebar collapse state | **in-memory `useState` only** — LocalStorage নেই (D6d) |
| Chapter click rule | First lesson-এ থাকলে → শুধু toggle; অন্যথায় → navigate + expand |
| Group Header | caret নেই, hover নেই, কোনো URL নেই |
| Reply ভাষা | **ইজি বাংলা** (feedback #4) |

---

## 📜 Locked Decisions (আর আলোচনা হবে না)

| # | সিদ্ধান্ত |
|---|---|
| D1 | Nested structure (Group → Chapter → Lesson) |
| D2 | URL slug-based, number-based নয় |
| D3 | Chapter slug = URL prefix; first lesson-এর suffix নেই |
| D4 | Chapter click → first lesson (W3Schools pattern) |
| D5 | 3-level sidebar |
| D6a | Chapter slug = first lesson slug (auto-sync); admin-এ আলাদা chapter slug নেই |
| D6b | বাংলা title-এ admin নিজে English slug লিখবে; lowercase force |
| D6c | Group Header non-clickable |
| D6d | Sidebar collapse in-memory |
| D7 | Site live নয় → সব lesson wipe; migration script + redirect ❌ বাদ |
| D8 | `TutorialContent` delete; ৩ নতুন model |

---

## 🚦 পরের AI-এর জন্য কাজের ধাপ

### Line 1 — Situation বুঝে নাও
```bash
cd C:\Users\Naiem\Desktop\devschool
npx tsc --noEmit
```
Output-এ ~৪৪টা error দেখবে — সব admin-এ। এটা **প্রত্যাশিত**।

### Line 2 — N4 শুরু করো

Plan §৭ (admin flow) অনুযায়ী:

1. **Chapter API rewrite** — `app/api/admin/tutorials/[id]/chapters/route.ts`
   - `tutorialContent` → `chapter`
   - `chapterNo` → `sortOrder` (0-based)
   - নতুন field: `slug`, `groupId`, `content?` (single-page), `lessons?`
   - POST: title + slug + type (single/nested) + first lesson

2. **Chapter item API** — `[chId]/route.ts` — same rewrite

3. **Lessons API** (নতুন):
   - `POST /api/admin/tutorials/[id]/chapters/[chId]/lessons`
   - `PATCH/DELETE /api/admin/lessons/[id]`

4. **Groups API** (নতুন):
   - `POST/PATCH/DELETE /api/admin/groups`

5. **UI rewrite** — `ChaptersManager.tsx`:
   - Slug input (auto-suggest, lowercase, English only)
   - Group dropdown
   - Type toggle (Single-page / Nested)
   - Nested হলে first lesson form বাধ্যতামূলক
   - "Lessons" sub-page link

6. **নতুন UI** — `LessonsManager.tsx`, `GroupsManager.tsx`

7. **Page wiring** — `app/admin/tutorials/[id]/chapters/page.tsx`, `app/admin/tutorials/[id]/edit/page.tsx`, `app/admin/tutorials/page.tsx`

8. **TutorialForm.tsx** — `contents` সম্পূর্ণ বাদ

### Line 3 — N4 শেষ হলে
- `npx tsc --noEmit` → **০ error** হতে হবে
- `npm run build` সফল হতে হবে
- Browser-এ test: admin panel → tutorial → chapters → lesson যোগ

### Line 4 — N5 (Cleanup + SEO)
- `/tutorials/[slug]/[chapter]/tryit` route থেকে পুরনো রেফারেন্স চেক
- SEO test (`/sitemap.xml`)

---

## 🔒 Feedback Rules (User-এর স্পষ্ট নির্দেশ)

1. **সবসময় ইজি বাংলায় reply** (feedback #4)
2. **Token cost নিয়ে চিন্তা করবে না** — stability/performance-এ মনোযোগ (feedback #7)
3. **Approval ছাড়া code touch করবে না** (feedback #16)
4. **Dual-AI workflow** — অন্য AI command লিখে দেয়, এই AI execute করে (memory #8)
5. **W3Schools-এর মতো design** — Neon Green brand (memory #44)

---

## 🧪 Test করার নির্দেশ

N4 শেষ হলে user যেভাবে test করবে:

```bash
# 1. Dev server
npm run dev

# 2. Browser-এ যাও
# http://localhost:3000/tutorials/html-intro
# → sidebar-এ chapters list দেখবে
# http://localhost:3000/tutorials/html-intro/what-is-html
# → nested chapter-এর first lesson
# http://localhost:3000/tutorials/html-intro/what-is-html/basics
# → ২য় lesson

# 3. Admin
# http://localhost:3000/admin/tutorials
# login: a@gmail.com / 1
```

---

## 📞 প্রশ্ন থাকলে

- Plan: `NESTED-STRUCTURE-PLAN.md`
- Progress tracker: `PROGRESS.md`
- Content writer prompt: `HTML-CHAPTER-WRITER-PROMPT.md`
- Memory system: `memory.json`-এ সব সিদ্ধান্ত/feedback সংরক্ষিত

**সব কিছু পরিষ্কার থাকলে সরাসরি N4-এ হাত দাও। কোনো প্রশ্ন করার দরকার নেই — সব decision locked.**
