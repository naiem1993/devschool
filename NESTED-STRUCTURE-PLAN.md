# DevSchool — Nested Structure Plan (v3 — FINAL)

> **Status:** FINAL — awaiting explicit approval
> **Approve করার একমাত্র উপায়:** "Plan approve — শুরু করো" লিখো
> **Rule:** feedback #16 — approve ছাড়া কোনো code touch হবে না

---

## §0. v2 → v3-এ কী বদলালো

| # | পরিবর্তন | কারণ |
|---|----------|------|
| ১ | §৭ Migration plan **সম্পূর্ণ বাদ** | Site live নয়, পুরনো lesson বাঁচানোর দরকার নেই (D7) |
| ২ | §৯ Redirect risk **বাদ** | পুরনো URL কারো কাছে নেই, SEO rank শূন্য (D7) |
| ৩ | Phase 5 (Redirects) **বাদ**, ৬ → ৫ code phase | একই কারণ |
| ৪ | DB: `TutorialContent` **delete** করে নতুন `Chapter` + `Lesson` + `ChapterGroup` | Data বাঁচাতে হবে না → deprecated/nullable field-এর জঞ্জাল লাগবে না (D7) |
| ৫ | 3-level sidebar (GroupHeader → Chapter → Lesson) plan-এ পূর্ণ ঠিকানা পেল | D5, memory #95 |
| ৬ | §12-এর ৫টা open question → §2-এ locked decision হিসেবে সরানো | Q1–Q4 confirmed, Q5 বাতিল |
| ৭ | Phase roadmap: N1–N6 পুনর্বিন্যাস | Cleanup আলাদা phase হলো |

---

## §1. কেন nested-এ যাচ্ছি

আসল vision: W3Schools-এর English content বাংলায় re-teaching + real-life example। Flat ১৫-chapter model-এ শিক্ষার্থী একটা page-এ সব দেখে ক্লান্ত হয়।

**সমাধান:** W3Schools-এর মতো dropdown sidebar, কিন্তু ভেতরের lesson গুলো orphan reference নয় — একটা ক্রমিক journey।

---

## §2. Locked decisions (আর আলোচনা হবে না)

| # | Decision |
|---|----------|
| **D1** | Nested structure (Chapter → Lesson)-এ যাওয়া হবে |
| **D2** | URL slug-based; number-based URL সম্পূর্ণ বাদ |
| **D3** | Chapter slug = URL prefix। First lesson-এর আলাদা suffix নেই (`/html/basic`, `/html/basic/exercises`) |
| **D4** | Chapter-এ click → first lesson page (W3Schools pattern)। Chapter-এর নিজের overview page নেই |
| **D5** | 3-level sidebar: GroupHeader → Chapter → Lesson |
| **D6a** | Chapter slug ও first lesson slug auto-sync (admin-এ আলাদা chapter slug input নেই) |
| **D6b** | বাংলা title-এর ক্ষেত্রে admin নিজে English slug লিখবে; সব slug lowercase force |
| **D6c** | GroupHeader non-clickable divider; caret/URL নেই |
| **D6d** | Sidebar collapse state = in-memory (`useState`); LocalStorage নেই |
| **D7** | **Site live নয় → সব lesson মুছে নতুন করে যোগ। Migration script ও 301 redirect ❌ বাদ** |
| **D8** | DB: পুরনো `TutorialContent` model delete; নতুন `Chapter` + `Lesson` + `ChapterGroup` (nullable/deprecated field নেই) |

---

## §3. DB Schema (v3)

### ৩.১ নতুন model

```prisma
// ==========================================
//  CHAPTERGROUP — sidebar-এর section header
//  e.g. "HTML Forms", "HTML Graphics"
//  Non-clickable, শুধু visual divider
// ==========================================
model ChapterGroup {
  id         String   @id @default(cuid())
  tutorialId String
  tutorial   Tutorial @relation(fields: [tutorialId], references: [id], onDelete: Cascade)
  title      String   // "HTML Forms"
  sortOrder  Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  chapters   Chapter[]

  @@index([tutorialId, sortOrder])
}

// ==========================================
//  CHAPTER — sidebar-এর main item
//  দুই ধরনের হতে পারে:
//   (ক) single-page — lessons[] খালি, content নিজের
//   (খ) nested — lessons[] আছে, content null
// ==========================================
model Chapter {
  id          String   @id @default(cuid())
  tutorialId  String
  tutorial    Tutorial @relation(fields: [tutorialId], references: [id], onDelete: Cascade)
  groupId     String?  // nullable — group-এর বাইরে থাকতে পারে
  group       ChapterGroup? @relation(fields: [groupId], references: [id], onDelete: SetNull)

  title       String   // "HTML Basic"
  slug        String   // "basic" — tutorial-wide unique
  sortOrder   Int      @default(0)

  // শুধু single-page chapter-এর জন্য
  content     String?  @db.Text
  codeExample String?  @db.Text

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  lessons     Lesson[]

  @@unique([tutorialId, slug])
  @@index([tutorialId, sortOrder])
  @@index([groupId])
}

// ==========================================
//  LESSON — nested chapter-এর ভেতরের item
//  URL rule:
//   - lowest sortOrder → /{chapter-slug}          (slug ignore)
//   - বাকি সব         → /{chapter-slug}/{lesson-slug}
// ==========================================
model Lesson {
  id          String   @id @default(cuid())
  chapterId   String
  chapter     Chapter  @relation(fields: [chapterId], references: [id], onDelete: Cascade)

  title       String   // "Basic", "Exercises"
  slug        String   // "basic", "exercises" — chapter-এর ভেতরে unique
  content     String   @db.Text
  codeExample String?  @db.Text
  sortOrder   Int      @default(0)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([chapterId, slug])
  @@index([chapterId, sortOrder])
}
```

### ৩.২ পরিবর্তন: `Tutorial` model

```prisma
model Tutorial {
  // ... বিদ্যমান সব field অপরিবর্তিত ...

  // ❌ বাদ: contents TutorialContent[]
  // ✅ যোগ:
  groups     ChapterGroup[]
  chapters   Chapter[]

  // quizzes ও challenges অপরিবর্তিত
}
```

### ৩.৩ Delete: `TutorialContent` model

সম্পূর্ণ delete। কোনো `@deprecated` field রইল না, কোনো nullable `content String?` migration-এর দরকার নেই। কারণ D7 — পুরনো data বাঁচাতে হবে না।

### ৩.৪ Slug rules (final)

| নিয়ম | মান |
|------|-----|
| Character set | `a-z`, `0-9`, `-` |
| Case | সব lowercase force (`Basic` → `basic`) |
| Space | হাইফেনে convert |
| বাংলা character | ❌ error দেখাবে — English slug বাধ্যতামূলক |
| Auto-suggest | শুধু English অংশ থেকে; বাংলা অংশ বাদ |
| Chapter slug uniqueness | tutorial-wide |
| Lesson slug uniqueness | chapter-এর ভেতরে |

---

## §4. URL Design

### ৪.১ Pattern

```
/tutorials/{tutorial-slug}                              → tutorial home
/tutorials/{tutorial-slug}/{chapter-slug}               → single-page chapter
                                                        অথবা nested chapter-এর first lesson
/tutorials/{tutorial-slug}/{chapter-slug}/{lesson-slug} → nested chapter-এর অন্যান্য lesson
```

### ৪.২ উদাহরণ (HTML tutorial)

| Sidebar-এ যা দেখাবে | URL | কী render হবে |
|---|---|---|
| HTML HOME | `/tutorials/html/home` | Chapter.content (single-page) |
| HTML Introduction ▾ | — | (clickable label) |
| ↳ Introduction | `/tutorials/html/introduction` | Lesson[0].content |
| ↳ Exercises | `/tutorials/html/introduction/exercises` | Lesson[1].content |
| HTML Basic ▾ | — | |
| ↳ Basic | `/tutorials/html/basic` | Lesson[0].content |
| ↳ Exercises | `/tutorials/html/basic/exercises` | Lesson[1].content |
| ↳ Code Challenge | `/tutorials/html/basic/code-challenge` | Lesson[2].content |

### ৪.৩ Redirect নেই

```
❌ /tutorials/html/1 → /tutorials/html/introduction
```

কারণ site live নয়, পুরনো number-based URL কেউ দেখেনি। `next.config.ts`-এ `redirects()` **যোগ করা হবে না**।

---

## §5. Sidebar (3-level)

### ৫.১ Visual layout

```
HTML টিউটোরিয়াল                 ← 🔵 GROUP HEADER (non-clickable divider)
├── HTML HOME                    ← CHAPTER — single-page (no caret)
├── HTML Introduction         ▾  ← CHAPTER — nested, active
│   ├── Introduction             ← LESSON (active)
│   └── Exercises                ← LESSON
├── HTML Editors                 ← CHAPTER — single-page
├── HTML Basic                ▾  ← CHAPTER — nested, user manually opened
│   ├── Basic
│   ├── Exercises
│   └── Code Challenge
├── HTML Elements             ▸  ← CHAPTER — nested, closed
│
HTML FORMS                       ← 🔵 GROUP HEADER (২য় group)
├── HTML Forms                ▸
├── HTML Form Attributes      ▸
└── HTML Input Types          ▸
```

### ৫.২ Style spec

| স্তর | Font | Behavior |
|---|---|---|
| **Group Header** | `text-[11px] font-bold tracking-widest uppercase text-slate-500` + `mt-5 mb-1.5 px-3` | Non-clickable, no caret, no hover |
| **Chapter — single-page** | Normal link, no caret | Click → own page |
| **Chapter — nested** | Link + caret (▾/▸) | Click → toggle + navigate (§৫.৩) |
| **Lesson** | Indented (`pl-8`), ছোট font | Click → lesson page |

### ৫.৩ Chapter click rule

| User কোথায় আছেন | Chapter-এ click করলে |
|---|---|
| ওই chapter-এর **first lesson page**-এ | শুধু toggle — navigate নেই |
| ওই chapter-এর **অন্য lesson page**-এ | Navigate → first lesson + expand |
| **সম্পূর্ণ অন্য chapter/পেজে** | Navigate → first lesson + expand |

### ৫.৪ Collapse state

- **Storage:** React `useState` (in-memory) — LocalStorage নেই
- **Initial:** URL-এর chapter auto-open (deep-link friendly)
- **Manual open:** user ইচ্ছামতো যত chapter খুলতে পারে
- **Navigation-এ:** state preserved (SPA navigation-এ)
- **Full reload-এ:** reset হয়ে শুধু current chapter খোলা

### ৫.৫ Active highlight

- **Parent chapter:** সবুজ বাম-border + হালকা bg
- **Active lesson:** গাঢ় হালকা bg
- **Other:** normal

---

## §6. Public Page Structure

### ৬.১ Route files

| Route | File | কী render |
|---|---|---|
| `/tutorials/[slug]` | বিদ্যমান `page.tsx` (edit) | Tutorial home — chapter/group-এর তালিকা |
| `/tutorials/[slug]/[chapter]` | বিদ্যমান `page.tsx` (**rewrite**) | single-page chapter অথবা nested-এর first lesson |
| `/tutorials/[slug]/[chapter]/[lesson]` | **নতুন** `page.tsx` | nested chapter-এর ২য়+ lesson |

### ৬.২ `[chapter]/page.tsx` logic

```
chapter খুঁজো (tutorial.slug + chapter.slug)
  ├─ না পেলে → notFound()
  ├─ lessons.length === 0 → single-page render (chapter.content)
  └─ lessons.length >= 1 → first lesson render (lessons[0].content)
```

### ৬.৩ `[chapter]/[lesson]/page.tsx` logic

```
chapter খুঁজো → lesson খুঁজো (chapter.slug + lesson.slug)
  ├─ না পেলে → notFound()
  └─ lesson === first lesson হলে → permanentRedirect(`/{chapter}`)   // canonical
       নাহলে → render
```

⚠️ এখানে redirect-টা **canonical URL protection**-এর জন্য, পুরনো URL বাঁচানোর জন্য নয়।

### ৬.৪ SEO

- `<title>` = `{lesson.title} — {chapter.title} — {tutorial.title} | DevSchool`
- `canonical` = lesson-এর canonical URL (first lesson হলে chapter URL)
- `generateStaticParams` — সব published tutorial-এর group/chapter/lesson enumerate
- `sitemap.ts` আপডেট — নতুন URL গুলো যোগ
- `revalidate = 3600` (ISR)

---

## §7. Admin Flow

### ৭.১ Chapter যোগ করার step

```
/admin/tutorials/[id]/chapters
  1. "Add Chapter" ক্লিক
  2. Title লিখো → slug auto-suggest (English-only validation)
  3. Group select (optional dropdown)
  4. Type বাছো: [Single-page] অথবা [Nested]
     ├─ Single-page → content + codeExample editor দেখাবে
     └─ Nested → "First lesson যোগ করো" form বাধ্যতামূলক
  5. Save → Chapter + Lesson[0] একসাথে তৈরি
```

### ৭.২ Lesson যোগ করার step

```
/admin/tutorials/[id]/chapters/[chapterId]
  → "Lessons" section
  1. "Add Lesson" ক্লিক
  2. Title + slug (auto-suggest) + content + codeExample
  3. sortOrder drag-and-drop
  4. Save
```

### ৭.৩ Group Header management

```
/admin/tutorials/[id]/chapters  (একই page-এ section)
  → "Groups" section
  1. "Add Group" → title + sortOrder
  2. Chapter-এ group assign (dropdown)
  3. Drag-and-drop reorder
```

### ৭.৪ Validation

| Rule | কোথায় |
|---|---|
| Chapter slug — tutorial-wide unique | Save-এ |
| Lesson slug — chapter-এর ভেতরে unique | Save-এ |
| বাংলা character slug-এ থাকলে error | Blur-এ |
| Nested chapter-এ minimum ১টা lesson | Save-এ |
| First lesson ছাড়া nested chapter publish নয় | Save-এ |

---

## §8. Data Reset Plan (migration নয়)

কারণ D7 — migration script **লাগবে না**। বদলে:

### ৮.১ Reset script (একবার চালানোর জন্য)

`scripts/reset-tutorial-content.ts`

```
১. সব Lesson delete
২. সব Chapter delete
৩. সব ChapterGroup delete
৪. (Tutorial, Category, Quiz, Challenge, Reference অপরিবর্তিত)
৫. Console-এ summary print
```

### ৮.২ তারপর

- Admin panel থেকে হাতে chapter + group + lesson যোগ
- অথবা seed script দিয়ে bulk import (ভবিষ্যতে)
- পুরনো ৫টা HTML chapter-এর content **আর নেই** — নতুন করে লিখবে

⚠️ **সতর্কতা:** script চালানোর আগে `prisma/dev.db` (বা Postgres DB) ব্যাকআপ নেওয়া হবে।

---

## §9. File List

### ৯.১ নতুন ফাইল (৮টা)

| # | ফাইল | উদ্দেশ্য |
|---|------|---------|
| ১ | `app/(site)/tutorials/[slug]/[chapter]/[lesson]/page.tsx` | Lesson page |
| ২ | `app/api/admin/chapters/[id]/lessons/route.ts` | Lesson CRUD (list + create) |
| ৩ | `app/api/admin/lessons/[id]/route.ts` | Lesson update + delete |
| ৪ | `app/api/admin/groups/route.ts` | Group create + list |
| ৫ | `app/api/admin/groups/[id]/route.ts` | Group update + delete |
| ৬ | `components/admin/LessonsManager.tsx` | Lesson list + editor UI |
| ৭ | `components/admin/GroupsManager.tsx` | Group list + editor UI |
| ৮ | `scripts/reset-tutorial-content.ts` | একবারের reset script |

### ৯.২ এডিট করার ফাইল (৯টা)

| # | ফাইল | কী বদলাবে |
|---|------|-----------|
| ১ | `prisma/schema.prisma` | নতুন ৩ model, `TutorialContent` delete, `Tutorial` relation update |
| ২ | `app/(site)/tutorials/[slug]/[chapter]/page.tsx` | Complete rewrite (§৬.২) |
| ৩ | `app/(site)/tutorials/[slug]/page.tsx` | Tutorial home — new relation shape |
| ৪ | `components/LessonSidebar.tsx` | 3-level render (§৫) |
| ৫ | `components/TutorialShell.tsx` | New props shape (groups + chapters + lessons) |
| ৬ | `components/admin/ChaptersManager.tsx` | Slug input, group dropdown, lessons link, type toggle |
| ৭ | `app/api/admin/tutorials/[id]/route.ts` | Include new relations |
| ৮ | `app/api/tutorials/[slug]/route.ts` | Public API — new shape |
| ৯ | `app/sitemap.ts` | নতুন URL structure |

**মোট: ১৭টা ফাইল (৮ নতুন + ৯ এডিট)**

---

## §10. Risks & Mitigation

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| ১ | Sidebar 3-level render জটিল — bug প্রবণ | Medium | Phase N3-এ ছোট ছোট step; প্রতিটি step-এ manual browser test |
| ২ | `TutorialShell` props shape বদলালে অন্য page ভাঙতে পারে | Medium | Phase N2-এ type_check চালানো |
| ৩ | Reset script ভুল করে Tutorial delete করলে | High | Script-এ শুধু Lesson/Chapter/ChapterGroup delete; Tutorial-এ হাত দেবে না; আগে ব্যাকআপ |
| ৪ | Slug conflict (chapter vs lesson) | Low | DB-level `@@unique` constraint |
| ৫ | First lesson slug rule ভুল হলে URL ভুল | Medium | Phase N2-এ test case — ৩টা scenario |
| ৬ | `generateStaticParams` ভুল হলে build fail | Medium | try/catch + fallback `[]` |
| ৭ | Admin-এ nested chapter-এ lesson ছাড়া publish | Low | Save-time validation |

---

## §11. Phase Roadmap (N1–N6)

**Rule: প্রতিটা phase-এর পরে থামব। তুমি approve করলে পরেরটায় যাব।**

| # | Phase | কাজ | সময় |
|---|-------|-----|------|
| **N1** | Schema + Reset script | ৩ model, TutorialContent delete, migration, reset script | ৩০ মিন |
| **N2** | Public pages | `[chapter]` rewrite + `[chapter]/[lesson]` নতুন | ১ ঘণ্টা |
| **N3** | Sidebar (3-level) | LessonSidebar + TutorialShell | ১ ঘণ্টা |
| **N4** | Admin (Lesson + Group) | LessonsManager, GroupsManager, ChaptersManager edit | ২ ঘণ্টা |
| **N5** | Cleanup + SEO | sitemap, dead code, type_check | ৩০ মিন |
| **N6** | Content writing | নতুন lesson লেখা | তোমার হাতে |

### প্রতিটা phase-এর Definition of Done

- **N1:** `prisma migrate` সফল, `prisma generate` সফল, reset script dry-run দেখানো
- **N2:** `/tutorials/html/basic` আর `/tutorials/html/basic/exercises` দুটোই render হয়
- **N3:** ৩-level sidebar browser-এ দেখা যায়, collapse/expand কাজ করে
- **N4:** Admin থেকে chapter + lesson + group যোগ/এডিট/ডিলিট হয়
- **N5:** `npm run typecheck` pass, `npm run build` pass

---

## §12. Out of Scope (এখন করছি না)

| # | Item | কেন |
|---|------|-----|
| ১ | পুরনো URL-এর redirect | Site live নয় (D7) |
| ২ | Search functionality | পরের phase |
| ৩ | Lesson-level quiz/challenge attach | ভবিষ্যতে |
| ৪ | Lesson-এ image upload | ভবিষ্যতে |
| ৫ | Multi-language slug (বাংলা slug) | D6b |
| ৬ | Sidebar collapse state persistence (LocalStorage) | D6d |
| ৭ | Version history / draft-publish workflow | ভবিষ্যতে |

---

## §13. Approve করার Checklist

Approve করার আগে নিশ্চিত হও:

- [ ] §৩-এর schema ঠিক আছে (৩ নতুন model, TutorialContent delete)
- [ ] §৪-এর URL pattern পছন্দ (`/html/basic`, `/html/basic/exercises`)
- [ ] §৫-এর sidebar behavior পছন্দ (toggle vs navigate rule)
- [ ] §৭-এর admin flow পছন্দ (chapter যোগ করার সময় first lesson বাধ্যতামূলক)
- [ ] §৮-এর reset plan পছন্দ (পুরনো content যাবে, নতুন লিখবে)
- [ ] §১১-এর phase order পছন্দ (N1 → N6)

সব ঠিক থাকলে লিখো:

> **"Plan approve — শুরু করো"**

তাহলে আমি **শুধু N1** শুরু করব, তারপর থেমে তোমাকে দেখাব।
