# 🎯 EN/BN ভাষা সিস্টেম — পুরো প্ল্যান ও অগ্রগতি ট্র্যাকার

> **এই ফাইলটা কী?**
> এই ফাইলে পুরো কাজের প্ল্যান আর "এখন কোথায় আছি" — সব লেখা আছে।
> **যেকোনো নতুন AI-কে বলবেন:** "enbn.md পড়ে যেখানে শেষ করেছি ওখান থেকে শুরু করো।"
> প্রতি Part শেষ হলে এই ফাইলের **অগ্রগতি** সেকশন আপডেট হবে।

---

## 📌 প্রজেক্ট পরিচিতি (নতুন AI-এর জন্য)

- **প্রজেক্ট**: DevSchool — W3Schools-এর মতো টিউটোরিয়াল সাইট
- **লোকেশন**: `C:\Users\Naiem\Desktop\devschool`
- **টেক স্ট্যাক**:
  - Next.js **16.3.4** (App Router, TypeScript)
  - React **19.2.8**
  - Prisma **5.22** + PostgreSQL (Supabase)
  - Tailwind CSS **4**
  - Zod 3.23 (validation)
- **এখন যা আছে**: পুরো সাইট শুধু বাংলায়, ডেটাবেসে এক ঘরে

## 🎯 লক্ষ্য

পুরো পাবলিক সাইট দুই ভাষায় (ইংরেজি `en` + বাংলা `bn`):

1. 🌐 URL-এ ভাষা থাকবে → `yoursite.com/bn/...` আর `yoursite.com/en/...`
2. 🔘 হেডারে `EN | বাং` বাটন — ক্লিক করলে ভাষা বদলাবে
3. 🍪 ইউজারের পছন্দ ব্রাউজারে (cookie) সেভ থাকবে
4. 🌍 cookie না থাকলে ব্রাউজারের ভাষা দেখে ঠিক করবে
5. 🏠 ডিফল্ট ভাষা: **বাংলা (bn)**
6. 🛡️ Admin panel শুধু বাংলায় থাকবে (দুই ভাষার দরকার নেই)
7. 📊 ডেটাবেসে দুই ভাষার আলাদা কলাম

---

## ⚠️ জরুরি সংশোধন (আগের প্ল্যানে ভুল ছিল)

### সংশোধন ১ — Prisma-তে ডেটা মুছে যাওয়া

**ভুল প্ল্যান ছিল:** `title → titleBn` নাম বদলানো (ভেবেছিল বাংলা লেখা হারাবে না)।
**সমস্যা:** Prisma নাম বদলালে পুরনো `title` কলাম মুছে যায় → সব বাংলা ডেটা হারায়। 😱

**✅ সঠিক পথ (ইউজারের সিদ্ধান্ত):**
```prisma
model Tutorial {
  titleBn String @map("title")   // কোডে নতুন নাম, DB-তে পুরনো কলামটাই
  titleEn String?                // নতুন ঘর, DB-তে নতুন কলাম যোগ হবে
}
```
- `@map("title")` Prisma-কে বলে: "কোডে `titleBn` বলব, কিন্তু DB-তে কলামের নাম `title` রেখে দাও।"
- DB-তে পুরনো কলাম **একই নামে থাকে** → ডেটা **সুরক্ষিত**।
- ইংরেজি ঘর (`titleEn`) null-able রাখা হবে।

**সহজ উদাহরণ:**
> ঘরের লেবেল বদলাচ্ছি না — শুধু আমাদের নিজের খাতায় ডাকনাম দিচ্ছি। বাক্সের ভেতরের জিনিস কখনোই ছোঁব না।

### সংশোধন ২ — `middleware.ts` vs `proxy.ts`

**ভুল প্ল্যান ছিল:** "রুটে `proxy.ts` সম্ভবত dev-tooling, middleware না।"

**সঠিক তথ্য:**
- Next.js 16-এ `middleware.ts` নাম **`proxy.ts`** হয়ে গেছে।
- এই প্রজেক্টে ইতিমধ্যে একটা `proxy.ts` আছে যা **admin auth** করে (matcher: `/admin/*`, `/api/admin/*`)।
- তাই **নতুন `middleware.ts` বানাব না**। `proxy.ts`-এর ভেতরেই locale logic যোগ হবে।

**সতর্কতা:** পুরনো admin auth কাজটা ভাঙা যাবে না। একই ফাইলে দুই কাজ একসাথে করতে হবে।

---

## 📊 অগ্রগতি ট্র্যাকার

| Part | কাজ | অবস্থা |
|---|---|---|
| 0 | প্রজেক্ট পড়া ও প্রস্তুতি | ✅ **সম্পন্ন** |
| 1 | Prisma schema-তে দুই ভাষার ঘর | ⏸️ **শুরু হয়নি** |
| 2 | i18n ভিত্তি (config, locale, dictionary, pick) | ⏸️ শুরু হয়নি |
| 3 | `proxy.ts`-এ ভাষা দারোয়ান | ⏸️ শুরু হয়নি |
| 4 | সব পেজ `/[locale]/`-এ আনা | ⏸️ শুরু হয়নি |
| 5 | সব লেখা dictionary-তে | ⏸️ শুরু হয়নি |
| 6 | ডেটাবেস থেকে ভাষা-সঠিক লেখা (fallback) | ⏸️ শুরু হয়নি |
| 7 | হেডারে EN / বাং বাটন | ⏸️ শুরু হয়নি |
| 8 | SEO (hreflang, canonical, sitemap) | ⏸️ শুরু হয়নি |
| 9 | Admin panel-এ দুই ভাষার ইনপুট | ⏸️ শুরু হয়নি |
| 10 | Seed / content workflow | ⏸️ শুরু হয়নি |
| 11 | চূড়ান্ত টেস্ট | ⏸️ শুরু হয়নি |

**বর্তমান অবস্থান:** Part 0 শেষ, Part 1 শুরু করার অপেক্ষায়।

---

## 🔴 PART 0-এর রিপোর্ট (সম্পন্ন)

### যা পড়া হয়েছে
- ✅ `package.json` — Next 16.3.4, React 19.2.8, Prisma 5.22, Zod 3.23
- ✅ `prisma/schema.prisma` — Tutorial, ChapterGroup, Chapter, Lesson, QuizQuestion, QuizOption, CodeChallenge, TestCase আছে
- ✅ `proxy.ts` — এটা admin auth middleware (ভাষার জন্য মিলিয়ে দিতে হবে)
- ✅ `app/layout.tsx` — `<html lang="bn">` hardcoded (এখানে বদলাতে হবে)
- ✅ পুরো `app/` ফোল্ডার গঠন দেখা হয়েছে

### গুরুত্বপূর্ণ তথ্য
- ডেটাবেস: PostgreSQL (Supabase), `DATABASE_URL` ও `DIRECT_URL` env-এ
- Admin auth: HMAC signed token, `ADMIN_COOKIE` দিয়ে
- Migration history: 6টা migration আছে, নতুন migration হবে `add_bilingual_fields`

---

## 📋 PART-ওয়াইজ বিস্তারিত প্ল্যান

### PART 1 — Prisma schema-তে দুই ভাষার ঘর

**কী হবে:** যেসব ফিল্ডে মানুষ পড়বে এমন লেখা আছে, তার জন্য বাংলা + ইংরেজি আলাদা কলাম।

**পদ্ধতি (সংশোধিত):** `titleBn @map("title")` + `titleEn String?`

**কোন মডেল, কোন ফিল্ড:**

- **Tutorial**:
  - `title` → `titleBn @map("title")` + `titleEn String?`
  - `description` → `descriptionBn String? @map("description")` + `descriptionEn String?`
- **ChapterGroup**: `title` → `titleBn @map("title")` + `titleEn String?`
- **Chapter**:
  - `title` → `titleBn @map("title")` + `titleEn String?`
  - `content` → `contentBn String? @map("content")` + `contentEn String?`
  - `codeExample` → `codeExampleBn String? @map("codeExample")` + `codeExampleEn String?`
- **Lesson**:
  - `title` → `titleBn @map("title")` + `titleEn String?`
  - `content` → `contentBn String @map("content")` + `contentEn String?`
  - `codeExample` → `codeExampleBn String? @map("codeExample")` + `codeExampleEn String?`
- **Reference, QuizQuestion, QuizOption, CodeChallenge** — একই প্যাটার্ন (title/description/question/text/explanation ইত্যাদি)

**যা বদলাবে না:** `slug`, `icon`, `difficulty`, `sortOrder` — ভাষা-নিরপেক্ষ।

**কমান্ড:**
1. ব্যাকআপ: `prisma/schema.prisma.bak` (আগেই আছে, আরেকটা `.bak1`) — **অথবা** নতুন `.bak` overwrite
2. `npx prisma migrate dev --name add_bilingual_fields`
3. `npx prisma generate`
4. `npx tsc --noEmit` — অনেক error আসবে (স্বাভাবিক, Part 6-এ ঠিক হবে)

**সাবধান:** Part 1 থেকে Part 6 পর্যন্ত সাইট ভাঙা থাকবে। **কখনো deploy করবেন না।**

### PART 2 — i18n-এর ভিত্তি

**তৈরি হবে:**
- `lib/i18n/config.ts` — LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE ইত্যাদি
- `lib/i18n/locale.ts` — `getLocale()`, `getLocaleFromParams()`
- `lib/i18n/dictionaries/bn.ts` + `en.ts` — সব UI লেখা
- `lib/i18n/dictionaries/index.ts` — `getDictionary(locale)`
- `lib/i18n/pick.ts` — fallback নিয়ম

**কেন নিজে লিখব (next-intl না):** দুই ভাষার জন্য যথেষ্ট, কম ঝুঁকি, Next 16-এর সাথে library version মেলার দুশ্চিন্তা নেই।

### PART 3 — `proxy.ts`-এ ভাষা দারোয়ান

**⚠️ সংশোধিত:** নতুন `middleware.ts` বানাব না। বিদ্যমান `proxy.ts`-এ locale logic যোগ করব।

**কী করতে হবে:**
1. বিদ্যমান admin auth আগে চেক হবে → `/admin/*` আর `/api/admin/*` locale-এর বাইরে
2. তারপর locale logic:
   - URL-এ locale prefix (`/bn` বা `/en`) থাকলে → সেটাই ব্যবহার
   - না থাকলে → cookie → Accept-Language header → ডিফল্ট `bn`
   - locale ছাড়া path এলে `307 redirect` করে `/{locale}{path}`
   - cookie সেট করে দেবে ১ বছরের জন্য
3. matcher আপডেট করতে হবে যাতে admin/api বাদে সব পেজে কাজ করে

### PART 4 — সব পেজ `/[locale]/`-এ আনা

**বড় কাজ, সাবধান।**

**গঠন:**
```
app/[locale]/...       ← পাবলিক সাইট এখানে
app/admin/...          ← অপরিবর্তিত
app/api/...            ← অপরিবর্তিত
app/not-found.tsx      ← locale-এর বাইরে (দুই ভাষায় লেখা)
app/global-error.tsx   ← locale-এর বাইরে
```

**⚠️ সংশোধন:** `app/layout.tsx`-এ `<html lang>` থাকে। এটাকে `app/[locale]/layout.tsx`-এ নিতে হবে। কিন্তু admin/api-এর জন্য আলাদা layout লাগবে। Next.js 16-এর সঠিক নিয়ম দেখে করতে হবে।

**helper:** `lib/i18n/link.ts` → `localeHref(locale, path)`

### PART 5 — সব hardcoded লেখা dictionary-তে

যেসব ফাইলে বাংলা লেখা আছে সরাসরি (JSX text, aria-label, title, placeholder) সেগুলো dictionary-তে নিয়ে দুই ভাষায় দেখানো।

**সবচেয়ে বেশি হাত লাগবে:**
- `components/Header.tsx`, `Footer.tsx`, `HeroSection.tsx`, `LanguageTabs.tsx`, `TutorialShell.tsx`, `LessonSidebar.tsx`, `LessonContent.tsx`, `TryIt.tsx`, ইত্যাদি
- `app/(site)/**/page.tsx`

**Client component-এর জন্য:** `lib/i18n/I18nProvider.tsx` (React Context) + `useDict()` hook।

### PART 6 — ডেটাবেস থেকে সঠিক ভাষার লেখা

`lib/i18n/localize.ts` বানাব — প্রতিটা model-এর জন্য helper। প্রতিটা `page.tsx`-এ `select`-এ `*Bn` ও `*En` দুটোই আনব, তারপর `pick()` দিয়ে বেছে নেব।

Part 1-এ যে error গুলো এসেছিল, এখানে সব ঠিক হবে।

### PART 7 — হেডারে EN / বাং বাটন

`components/LanguageSwitcher.tsx` (client component):
- দুটো ছোট লেখা: `EN` | `বাং`
- ক্লিক করলে cookie সেট + path-এর locale বদলে navigate
- query string সহ

### PART 8 — SEO

- প্রতিটা page-এর `generateMetadata`-এ `alternates.languages` (hreflang)
- canonical বর্তমান locale-এর URL
- `app/sitemap.ts` — দুই ভাষার entry
- `app/robots.ts` — `/admin/` আর `/api/` disallow
- `lib/revalidate-tutorial.ts` — দুই path revalidate

### PART 9 — Admin panel-এ দুই ভাষার ইনপুট

প্রতিটা admin form-এ দুই সেট ইনপুট (বাংলা required, ইংরেজি optional):
- `TutorialForm.tsx`, `ChaptersManager.tsx`, `LessonsManager.tsx`, `GroupsManager.tsx`, `ReferenceForm.tsx`, `QuizForm.tsx`, `ChallengeForm.tsx`
- API রুটগুলোতে `*Bn` ও `*En` দুটোই নেয়
- `lib/validators.ts`-এ zod schema আপডেট

### PART 10 — Seed/content workflow

`scripts/seed-html-course.ts` আপডেট — `chapter-01.md` + `chapter-01.en.md` পাশাপাশি পড়বে। upsert দিয়ে idempotent।

### PART 11 — চূড়ান্ত টেস্ট চেকলিস্ট

বিস্তারিত চেকলিস্ট original plan-এ আছে। এখানে শুধু রিমাইন্ডার:
- `npx tsc --noEmit` → 0 error
- `npm run build` → সফল
- Dev server-এ হাতে ঘুরে সব যাচাই
- **শেষে Git commit** — কিন্তু GitHub-এ push করবেন না (ইউজারের সিদ্ধান্ত)

---

## ⚠️ গুরুত্বপূর্ণ নিয়মাবলি (নতুন AI-এর জন্য)

1. **প্রতিটা Part শেষে চালাতে হবে:** `npx tsc --noEmit` এবং `npm run build`
2. **error থাকলে পরের Part-এ যাব না** — আগে ঠিক করব
3. **প্রতিটা Part শেষে এই `enbn.md` ফাইলের অগ্রগতি টেবিল আপডেট করব**
4. **GitHub-এ push করব না** (ইউজারের সিদ্ধান্ত, ২০২৬-০৯-২২)
5. **কোনো ফাইল মুছলে/বড় rewrite করলে `.bak` ব্যাকআপ রাখব**
6. **বাংলা কমেন্ট রাখা যাবে, কিন্তু কোডের নাম/ফাইল/কী ইংরেজিতে**
7. **Part 1 থেকে Part 6 পর্যন্ত সাইট deploy করব না** — ভাঙা থাকবে

---

## 🔄 প্রতি Part শেষে যা করব

1. `enbn.md`-এর অগ্রগতি টেবিলে Part-এর অবস্থা ✅ করব
2. কী কী ফাইল বদলাল, কী কমান্ড চালাল, ফলাফল কী — লিখব
3. পরের Part-এর জন্য নতুন AI কী করতে হবে — সংক্ষেপে লিখব
4. Git commit করব (push না)

---

## 📞 জরুরি তথ্য (নতুন AI-এর জন্য)

- **মালিকের ভাষা**: বাংলা (সহজ করে বুঝিয়ে দিতে হবে)
- **ইউজার কোড বোঝে না** — সব ব্যাখ্যা real-life উদাহরণ দিয়ে করতে হবে
- **অনুমতি ছাড়া কোনো ফাইল বদলানো যাবে না** — প্রতিটা step-এ জিজ্ঞেস করতে হবে
- **GitHub-এ push নিষেধ** — শুধু local commit

---

**সর্বশেষ আপডেট:** Part 0 সম্পন্ন — ২০২৬-০৯-২২
**পরবর্তী কাজ:** PART 1 — Prisma schema-তে `*Bn @map("...")` + `*En` যোগ করা
