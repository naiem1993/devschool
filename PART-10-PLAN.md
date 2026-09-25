# 🚀 PART 10 — Seed / Content Workflow (বিস্তারিত প্ল্যান)

> **উদ্দেশ্য:** যেকোনো AI এই ফাইল পড়ে Part 10 হুবহু সম্পন্ন করতে পারবে।
> **সম্পর্কিত ফাইল:** `enbn.md` (মাস্টার ট্র্যাকার) — Part 10-এর সংক্ষিপ্ত বিবরণ ওখানে (লাইন ৮৬২)।

- **তারিখ:** ২০২৬-০৯-২৫
- **অবস্থা:** 📝 প্ল্যান রেডি (এখনো কোনো কোড বদলানো হয়নি)
- **আগের Part:** Part 9 ✅ সম্পন্ন (Admin dual-input, 9a-9j)

---

## 📌 প্রজেক্ট পরিচিতি

- **প্রজেক্ট:** DevSchool — W3Schools-এর মতো টিউটোরিয়াল সাইট
- **লোকেশন:** `C:\Users\Naiem\Desktop\devschool`
- **টেক স্ট্যাক:**
  - Next.js 16.3.4 (App Router, TypeScript)
  - React 19.2.8
  - Prisma 5.22 + PostgreSQL (Supabase)
  - Tailwind CSS 4
  - Zod 3.23
  - tsx 4.7 (স্ক্রিপ্ট চালানোর জন্য)
- **ইউজার:** কোড বোঝেন না — সব ব্যাখ্যা সহজ বাংলায় ও real-life উদাহরণ দিয়ে করতে হবে।
- **GitHub-এ push নিষেধ** — শুধু local commit।

---

## 🎯 Part 10-এর লক্ষ্য

বর্তমান সিড সিস্টেম ইংরেজি কনটেন্ট আলাদা রাখে না — বাংলা লেখাকে দুই ঘরে (`*Bn` ও `*En`) কপি করে। Part 9-এর নতুন নিয়ম (bn ≠ en — আলাদা কনটেন্ট) মেনে Part 10-এ:

1. **`.en.md` ফাইল থেকে ইংরেজি কনটেন্ট পড়া** — বাংলা `.md`-এর পাশে থাকবে।
2. **`.en.md` না থাকলে `*En` = null** — বাংলা কপি নয় (strict no-fallback)।
3. **সিডার idempotent** — বারবার চালালেও ডেটা নষ্ট হবে না (upsert)।
4. **ডেমো কনটেন্ট সরানো যাবে** — ইউজার পরে আসল lesson/content নিজে যোগ করবেন।

**সহজ উদাহরণ:** এখন একই খাতা দুইবার কপি করা হয় (বাংলা → Bn ঘরে, বাংলা → En ঘরে)। Part 10-এর পরে দুইটা আলাদা খাতা থাকবে — বাংলা `.md`, ইংরেজি `.en.md`। যা নেই, সেটা খালি রাখা হবে — জোর করে বাংলা বসানো হবে না।

---

## 📊 বর্তমান অবস্থা (যাচাই করা — আন্দাজ নয়)

### Content ফাইল (`content/`)
| ফাইল | ভাষা |
|---|---|
| `content/html/chapter-01.md` | বাংলা (২৩০ লাইন) |
| `content/html/chapter-02.md` | বাংলা |
| `content/css/chapter-01.md` … `chapter-05.md` | বাংলা (মোট ৫টা) |
| `content/*/*.en.md` | ❌ একটাও নেই |

**মোট বাংলা chapter:** ৭টা (HTML ২ + CSS ৫)। **মোট lesson:** প্রায় ৩৫টি।

### Seed স্ক্রিপ্ট
| ফাইল | কাজ | সমস্যা |
|---|---|---|
| `scripts/seed-course.ts` (336 লাইন) | Generalized — `.md` পড়ে Tutorial/Chapter/Lesson upsert | `titleEn: course.title` — বাংলা কপি করে |
| `scripts/seed-html-course.ts` | পুরনো HTML-নির্দিষ্ট seeder | এখনো বিদ্যমান |
| `prisma/seed.ts` (335 লাইন) | ডেমো ডেটা | `titleBn: ''` — খালি বাংলা (bug) |
| `prisma/seed-admin.ts` | Admin user তৈরি | ✅ ঠিক |
| `prisma/seed-challenge.ts` | Challenge ডেটা | দেখতে হবে |
| `prisma/seed-reviews.ts` | রিভিউ ডেটা | দেখতে হবে |

### npm scripts (package.json)
`seed`, `seed:admin`, `seed:html`, `seed:course`, `verify:html-seed`, `merge:html`, `db:inspect`, `diagnose:db`, `reset:admin`, `typecheck` ইত্যাদি।

### Prisma schema (দুই ভাষার ঘর — Part 1-এ যোগ করা)
- `Tutorial`: `titleBn/titleEn`, `descriptionBn/descriptionEn`
- `Chapter`: `titleBn/titleEn`, `contentBn/contentEn`, `codeExampleBn/codeExampleEn`
- `Lesson`: `titleBn/titleEn`, `contentBn/contentEn`, `codeExampleBn/codeExampleEn`
- (আরও: ChapterGroup, QuizQuestion, QuizOption, CodeChallenge, Reference)

---

## ⚠️ যে সমস্যাগুলো ঠিক করতে হবে

### সমস্যা ১ — `seed-course.ts` বাংলা কপি করে
বর্তমান কোডে: `titleEn: course.title` — অর্থাৎ ইংরেজি ঘরে বাংলা টিউটোরিয়ালের নাম বসে। এটা Part 9-এর নিয়ম ভাঙে।

### সমস্যা ২ — `prisma/seed.ts`-এ খালি বাংলা
`titleBn: ''` → DB-তে খালি string। `/bn` পেজে lesson দেখাবে না বা ফাঁকা দেখাবে।

### সমস্যা ৩ — `.en.md` সাপোর্ট নেই
`seed-course.ts` শুধু `chapter-NN.md` পড়ে; `.en.md` চেনে না।

### সমস্যা ৪ — prune behavior স্পষ্ট নয়
`seed-course.ts`-এর নিজের কমেন্ট বলছে "পুরনো lesson (যা .md থেকে সরানো) auto-delete"। অ্যাডমিন-এ হাতে করা lesson হারানোর ঝুঁকি।

---

## 🗺️ রোডম্যাপ — ৫টা sub-step

| ধাপ | কাজ | ঝুঁকি | সময় |
|---|---|---|---|
| **10a** | `seed-course.ts`-এ `.en.md` সাপোর্ট (থাকলে পড়বে, না থাকলে null) | 🟢 কম | ~৪০ মিনিট |
| **10b** | `prisma/seed.ts`-এর খালি-বাংলা bug ফিক্স / বাদ দেওয়া | 🟡 মাঝারি | ~১৫ মিনিট |
| **10c** | `--prune` flag (opt-in delete; ডিফল্টে কিছু মুছবে না) | 🟢 কম | ~২০ মিনিট |
| **10d** | ইংরেজি `.en.md` ফাইল লেখা (**ইউজার পরে করবেন**) | 🟡 সময়সাপেক্ষ | ~৩-৪ ঘণ্টা (ব্যাচে) |
| **10e** | seeder চালানো + DB যাচাই + enbn.md আপডেট + commit | 🟢 কম | ~২০ মিনিট |

---

## 🔧 PART 10a — `.en.md` সাপোর্ট

### কী করতে হবে
1. `scripts/seed-course.ts.bak` ব্যাকআপ নেওয়া।
2. `CourseConfig` type-এ `titleEn: string | null` field যোগ।
3. `COURSES`-এ প্রতি course-এ `titleEn` (html → `'HTML Tutorial'`, css → `'CSS Tutorial'`)।
4. নতুন ফাংশন: `parseChapterEn(md, course)` অথবা বিদ্যমান `parseChapter`-এ `lang: 'bn' | 'en'` প্যারামিটার।
5. `seedChapter` ফাংশন:
   - `chapter-NN.md` পড়ে বাংলা parse → `titleBn/contentBn/codeExampleBn`
   - `chapter-NN.en.md` ফাইল **থাকলে** পড়ে ইংরেজি parse → `titleEn/contentEn/codeExampleEn`
   - না থাকলে `*En = null`
6. Tutorial upsert-এ: `titleBn = course.title`, `titleEn = course.titleEn ?? null`।
7. `chapterSlugs` / `lessonSlugs` — বাংলা title-এর জন্য আছে; ইংরেজি `.en.md`-এর heading ইংরেজি হবে → আলাদা map দরকার **অথবা** slug auto-generate।

### 🔴 খোলা সিদ্ধান্ত #১ — ইংরেজি slug ম্যাপিং
তিনটা অপশন:
- **(ক) আলাদা ম্যাপ** — `lessonSlugsEn: { 'What is HTML?': 'what-is-html', ... }`। স্পষ্ট, কিন্তু হাতে লিখতে হবে।
- **(খ) Auto-slug** — ইংরেজি heading → lowercase, space→dash, non-alnum বাদ (`what-is-html`)। বাংলা ফাইলের slug-এর সাথে মিলবে।
- **(গ) ফাইলের ভেতরে `<!-- slug: what-is-html -->` marker** — সবচেয়ে নির্ভরযোগ্য, কিন্তু ইউজারকে মানতে হবে।

**প্রস্তাব:** (খ) Auto-slug — কম হাতের কাজ, বাংলা ফাইলের slug-এর সাথে মিলবে।

### কোড প্যাটার্ন (চূড়ান্ত কোড AI লিখবে)
```ts
type ParsedChapter = {
  number: number
  titleBn: string
  titleEn: string | null
  slug: string
  goal: string
  lessons: ParsedLesson[]
}
```
Prisma upsert-এ:
```ts
update: { titleBn: parsed.titleBn, titleEn: parsed.titleEn, sortOrder: parsed.number }
```

### যাচাই
- `npx tsc --noEmit` → ০ error
- (dry-run flag থাকলে) `npx tsx scripts/seed-course.ts --dry-run`

---

## 🔧 PART 10b — `prisma/seed.ts`

### কী করতে হবে (তিনটা অপশনের একটা)
- **(ক)** পুরো রিভাইজ করে দুই ভাষার সঠিক ডেটা লেখা (সময় বেশি)।
- **(খ)** শুধু `titleBn: ''` bug ফিক্স (কম সময়)।
- **(গ)** এই ফাইল আর ব্যবহার না করা — `.md`-ভিত্তিক `seed-course.ts`-ই একমাত্র সত্য (প্রস্তাব ✅)।

### যাচাই
- `npx tsc --noEmit`

---

## 🔧 PART 10c — `--prune` flag

### কী করতে হবে
1. `seed-course.ts.bak` আবার (১০a-র ব্যাকআপের পর)।
2. CLI argument parse: `process.argv.includes('--prune')`।
3. ডিফল্ট: পুরোনো lesson/chapter **মুছবে না**।
4. `--prune` দিলে: `.md`-তে নেই এমন lesson/chapter DB থেকে মুছে দেবে।
5. লগ: `🧹 Pruned N old lessons (--prune was set)`।

### যাচাই
- `npx tsx scripts/seed-course.ts --prune` (শুধু টেস্ট DB-তে)

---

## 🔧 PART 10d — ইংরেজি `.en.md` ফাইল লেখা

**ইউজার পরে করবেন** — এই Part-এ শুধু ফরম্যাট ডকুমেন্ট করা।

### ফাইল নামকরণ
- `content/html/chapter-01.md` → বাংলা
- `content/html/chapter-01.en.md` → ইংরেজি

### ইংরেজি ফাইলের ফরম্যাট (বাংলা ফাইলের হুবহু কাঠামো, শুধু ইংরেজিতে)
```markdown
# Chapter 1: Introduction to HTML

**Goal:** Understand what HTML is and build your first page.

---

## 1.1 What is HTML?

### 1. Simple intro
...

### 4. Code Example

\`\`\`html
<!DOCTYPE html>
...
\`\`\`
```

### যাচাই
- প্রতি ফাইল সেভের পর `npx tsx scripts/seed-course.ts <course> <NN>`

---

## 🔧 PART 10e — চালানো + যাচাই + commit

### কমান্ড
```bash
npx tsx scripts/seed-course.ts              # সব course
npx tsx scripts/seed-course.ts html         # শুধু html
npx tsx scripts/seed-course.ts html 01      # html chapter-01
```

### DB যাচাই
- `npm run db:inspect` (db-inspect-tutorial.ts)
- অথবা Prisma Studio: `npx prisma studio`

### যাচাই checklist
- [ ] `npx tsc --noEmit` → ০ error
- [ ] `npm run build` → সফল (৫৪ পেজ)
- [ ] DB-তে Tutorial/Chapter/Lesson-এ `titleBn` (বাংলা) আর `titleEn` (ইংরেজি বা null) সঠিক
- [ ] `/bn/tutorials/html` — বাংলা দেখাচ্ছে
- [ ] `/en/tutorials/html` — ইংরেজি দেখাচ্ছে (যেখানে `.en.md` আছে)
- [ ] `enbn.md`-এর অগ্রগতি টেবিলে Part 10 ✅
- [ ] `git add . && git commit -m "feat(i18n): Part 10 — bilingual seed workflow"` (push নয়)

---

## 🛡️ নিরাপত্তা নিয়ম (Part 10-এর জন্য)

1. **প্রতিটা ফাইল এডিটের আগে `.bak` ব্যাকআপ।**
2. **প্রতিটা sub-step শেষে `npx tsc --noEmit` এবং `npm run build`।**
3. **error থাকলে পরের sub-step-এ যাওয়া যাবে না।**
4. **GitHub-এ push করা যাবে না** (ইউজারের সিদ্ধান্ত)।
5. **ডেটা মোছার আগে ইউজারের স্পষ্ট অনুমতি লাগবে।**
6. **বাংলা কমেন্ট ঠিক আছে, কিন্তু ফাইল/ভেরিয়েবল/কী-এর নাম ইংরেজিতে।**
7. **ইউজার কোড বোঝেন না — প্রতি ধাপে সহজ বাংলায় জিজ্ঞেস করতে হবে।**
8. **`enbn.md`-এর নিয়ম: প্রতিটা Part শেষে tsc + build + enbn.md আপডেট + local commit (push নয়)।**

---

## ❓ খোলা সিদ্ধান্ত (শুরুর আগে উত্তর দরকার)

1. **ইংরেজি slug ম্যাপিং** — (ক) আলাদা ম্যাপ, (খ) Auto-slug, (গ) ফাইল marker। **প্রস্তাব: খ**
2. **`prisma/seed.ts`** — (ক) দুই ভাষায় রিভাইজ, (খ) শুধু bug ফিক্স, (গ) বাদ দিই। **প্রস্তাব: গ**
3. **Prune default** — (ক) ডিফল্টে কিছু মুছবে না (opt-in `--prune`) ✅ প্রস্তাব; (খ) ডিফল্টে মুছবে।
4. **ডেমো কনটেন্ট** — ইউজার বলেছেন সরানো ঠিক আছে। কখন সরাব? (১০a-র আগে / পরে / ১০e-তে)।
5. **পুরনো DB-রেকর্ড যেখানে `*En` এখন বাংলা-copy** — re-seed-এ null বসবে। চাই কি?

---

## ✅ শেষ কথা

- এই প্ল্যান ৫টা ছোট ধাপে ভাঙা — প্রতিটা ধাপ আলাদাভাবে যাচাই করা যাবে।
- কোনো ধাপে সন্দেহ থাকলে **এগোব না** — ইউজারকে জিজ্ঞেস করব।
- enbn.md-এর মাস্টার ট্র্যাকার শেষে আপডেট করব।

**প্রস্তুতকারী:** AI assistant (top-level developer mode)
**শেষ আপডেট:** ২০২৬-০৯-২৫
