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
| 1 | Prisma schema-তে দুই ভাষার ঘর | ✅ **সম্পন্ন** |
| 2 | i18n ভিত্তি (config, locale, dictionary, pick) | ✅ **সম্পন্ন** |
| 3 | `proxy.ts`-এ ভাষা দারোয়ান | ✅ **সম্পন্ন** |
| 4 | সব পেজ `/[locale]/`-এ আনা | ✅ **সম্পন্ন** |
| 5 | সব লেখা dictionary-তে | ✅ **সম্পন্ন** (5e-3 শেষ — client UI + about + slug) |
| 6 | ডেটাবেস থেকে ভাষা-সঠিক লেখা (fallback) | ✅ **সম্পন্ন** — tsc ০ error, npm run build সফল (commit `a6a17f6`) |
| 7 | হেডারে EN / বাং বাটন | ✅ **সম্পন্ন** — tsc ০ error, npm run build সফল (৫৪ পেজ); Server Action (Plan B) দিয়ে LanguageSwitcher |
| 7.5 | Console fix + locale-aware hero + /en ComingSoon | ✅ **সম্পন্ন** — tsc ০ error, npm run build সফল (৫৪ পেজ) |
| 8 | SEO (hreflang, canonical, sitemap) | ✅ **সম্পন্ন** — 8b+8c.2+8e+8f সব commit হয়েছে |
| 9 | Admin panel-এ দুই ভাষার ইনপুট (bn=en জোড়া নিয়ম) | ✅ **সম্পন্ন** — 9a-9j সব শেষ; tsc ০ error (২০২৬-০৯-২৫) |
| 10 | Seed / content workflow | 🟡 **চলমান** — 10a + 10c ✅ সম্পন্ন (২০২৬-০৯-২৫); tsc ০ error, npm run build সফল (৫৪ পেজ)। বাকি: 10d (ইংরেজি `.en.md` ফাইল — ইউজার পরে লিখবেন) + 10e (seeder চালানো + DB যাচাই) |
| 11 | চূড়ান্ত টেস্ট | ⏸️ শুরু হয়নি |

**বর্তমান অবস্থান:** **PART 10a + 10c ✅ সম্পন্ন (২০২৬-০৯-২৫)** — নতুন seeder `.en.md` সাপোর্ট + safe prune সহ। tsc ০ error, build সফল। পরবর্তী: **Part 10d — `.en.md` ফাইল লেখা** (ইউজার পরে করবেন), তারপর **10e — seeder চালানো + DB যাচাই**।

---

### ✅ PART 10a + 10c — Bilingual seeder + safe prune (সম্পূর্ণ — ২০২৬-০৯-২৫)

**সমস্যা যা ঠিক করা হলো:**
- পুরনো `scripts/seed-course.ts` শুধু `chapter-NN.md` পড়ত এবং `*En` ঘরে বাংলা কপি করত (Part 9-এর নিয়ম ভাঙত)।
- `.md`-তে নেই এমন lesson সবসময় auto-delete হতো (অ্যাডমিন-এ হাতে করা কাজ হারানোর ঝুঁকি)।

**ইউজারের সিদ্ধান্ত (২০২৬-০৯-২৫):**
- **Slug সবসময় ইংরেজিতে** — বাংলা `.md` থেকে slug mapping table-এ; ইংরেজি ফাইলে position-ভিত্তিক pairing।
- `.en.md` না থাকলে `*En = null` (strict no-fallback)।
- Prune **opt-in** — ডিফল্টে কিছু মুছবে না; `--prune` দিলে মুছবে।

**যেই ফাইল বদলেছে:**
- `scripts/seed-course.ts.bak` — ব্যাকআপ নেওয়া হয়েছে।
- `scripts/seed-course.ts` — সম্পূর্ণ rewrite:
  - `CourseConfig`-এ `titleBn` + `titleEn` + `descriptionBn` + `descriptionEn` (আলাদা)।
  - নতুন `parseMarkdown(md, codeFence)` — Bn ও En দুই ফরম্যাট সাপোর্ট (লক্ষ্য / Goal; ৪. / 4. Code Example)।
  - `seedChapter(course, filename, prune)` — `.md` + `.en.md` (থাকলে); lesson count mismatch হলে error।
  - Position-ভিত্তিক pairing — En ফাইলের heading-এ slug mapping লাগে না, শুধু content আসে।
  - `--prune` flag; ডিফল্টে অপ্রয়োজনীয় lesson DB-তে থাকবে (লগ: `kept — use --prune to remove`)।

**কমান্ড:**
```
npm run seed:course                → সব course, কিছু মুছবে না
npm run seed:course -- css         → শুধু css
npm run seed:course -- html 01     → html chapter-01
npm run seed:course -- --prune     → অপ্রয়োজনীয় lesson/chapter মুছবে
```

**যাচাই:** `npx tsc --noEmit` ০ error ✅; `npm run build` সফল (৫৪ পেজ) ✅

**⚠️ এখনো করা হয়নি:**
- `.en.md` ফাইল লেখা (Part 10d) — ইউজার পরে নিজে করবেন।
- seeder চালানো ও DB যাচাই (Part 10e) — কনটেন্ট লেখা শেষ হলে।
- পুরনো DB-রেকর্ড যেসব `*En` = বাংলা-copy — নতুন seeder চালালে `null` হবে (ইউজার এই re-seed অনুমোদন করেছেন শুধু seeder চালানোর সময়)।

### ✅ PART 9d — ChaptersManager dual-input (সম্পূর্ণ)

**9d-1 — API routes (committed `cae28b9`):**
- `app/api/admin/tutorials/[id]/chapters/route.ts` — POST-এ `titleEn/contentEn/codeExampleEn` গ্রহণ
- `app/api/admin/tutorials/[id]/chapters/[chId]/route.ts` — PATCH-এ ৩টা `*En` if-block
- .bak ব্যাকআপ নেওয়া হয়েছে; পুরনো `*Bn` অপরিবর্তিত

**9d-2 — UI (committed `d1e4222`):**
- `app/(admin)/admin/tutorials/[id]/chapters/page.tsx` — `chapterRows`-এ ৩টা `*En` DB থেকে আনা
- `components/admin/ChaptersManager.tsx` — `ChapterRow` type + `ChapterCard` (draft/save/JSX) + `AddChapterForm` (state/submit/reset/JSX)-এ ৩টা ইনপুট
- নতুন "English (optional)" box **বাংলার নিচে** — dashed border, same design
- `npx tsc --noEmit` ০ error ✅; `npm run build` সফল (৫৪ পেজ) ✅

### ✅ PART 9e — LessonsManager dual-input (সম্পূর্ণ)

**9e-1 — API routes (committed `9ae852e`):**
- `app/api/admin/tutorials/[id]/chapters/[chId]/lessons/route.ts` — POST-এ `titleEn/contentEn/codeExampleEn` গ্রহণ
- `app/api/admin/tutorials/[id]/chapters/[chId]/lessons/[lid]/route.ts` — PATCH-এ ৩টা `*En` if-block
- D6a slug-sync (first lesson → chapter slug) অপরিবর্তিত; DELETE + PIN verify অপরিবর্তিত
- `npx tsc --noEmit` ০ error ✅

**9e-2 — UI (committed `d49ed8e`):**
- `app/(admin)/admin/tutorials/[id]/chapters/page.tsx` — `lessons.map()`-এ ৩টা `*En` DB থেকে আনা
- `components/admin/LessonsManager.tsx` — `LessonRow` type + `LessonItem` (draft/save/JSX) + `AddLessonForm` (state/submit/reset/JSX)-এ ৩টা ইনপুট
- নতুন "English (optional)" box **বাংলার নিচে** (দুই জায়গায়); dashed border, same design
- D6a slug-sync + বাংলা `hasBangla`/`autoSlug` logic অপরিবর্তিত
- `npx tsc --noEmit` ০ error ✅; `npm run build` সফল (৫৪ পেজ) ✅

### ✅ PART 9f — ReferenceForm dual-input (সম্পূর্ণ)

**⚠️ পার্থক্য:** Reference API routes 9d/9e-এর মতো manual validation করে না — এরা **Zod schema** ব্যবহার করে। 9a-তে `createReferenceSchema` ও `updateReferenceSchema`-এ `titleEn/descriptionEn/syntaxEn/exampleEn` আগেই যোগ করা ছিল (validators.ts লাইন ১১১-১৩৮)। তাই API-তে **কিছুই বদলাতে হয়নি** — শুধু UI।

**committed `a4324de` (২ ফাইল; enbn.md-এর 9e-আপডেটও একসাথে এই কমিটে গেছে):**
- `components/admin/ReferenceForm.tsx` (৯৯ → ১২৬ লাইন) — `form` state-এ ৪টা `*En` + নতুন "English (optional)" box (বাংলা Example-এর পরে, Tags-এর আগে); `admin-input`/`admin-label` class অপরিবর্তিত
- `app/(admin)/admin/references/[id]/edit/page.tsx` (৩৭ → ৪১ লাইন) — `initial`-এ ৪টা `*En` DB থেকে আনা
- API routes ছোঁয়া হয়নি; `new/page.tsx` ছোঁয়া হয়নি (create mode-এ initial নেই)
- `npx tsc --noEmit` ০ error ✅; `npm run build` সফল (৫৪ পেজ) ✅

### ✅ PART 9g — ChallengeForm dual-input (সম্পূর্ণ)

**⚠️ পার্থক্য:** Challenge API routes Reference-এর মতো Zod ব্যবহার করে **না** — এরা manual destructuring করে। তাই API-তে **হাত লাগাতে হয়েছে** (9d/9e-এর মতো) — ২টা route-এ titleEn/descriptionEn যোগ করা হয়েছে।

**committed `18d326a` (৪ ফাইল):**
- `app/api/admin/challenges/route.ts` (POST) — destructuring + `create` data-তে ২টা `*En`
- `app/api/admin/challenges/[id]/route.ts` (PUT) — destructuring + `update` data-তে ২টা `*En`; GET ও DELETE অপরিবর্তিত
- `components/admin/ChallengeForm.tsx` (১২২ → ১৪০ লাইন) — `form` state-এ ২টা `*En` + নতুন "English (optional)" box (বাংলা Description-এর পরে, Starter Code-এর আগে); **Test Cases UI অপরিবর্তিত**
- `app/(admin)/admin/challenges/[id]/edit/page.tsx` (৪০ → ৪২ লাইন) — `initial`-এ ২টা `*En`
- `npx tsc --noEmit` ০ error ✅; `npm run build` সফল (৫৪ পেজ) ✅

### 🔴 PART 9 — সংশোধন (২০২৬-০৯-২৫): bn=en জোড়া নিয়ম

**ইউজারের নতুন সিদ্ধান্ত:** সব কনটেন্টে bn + en জোড়ায় থাকবে। যেখানে বাংলা required, ইংরেজিও required। যেখানে বাংলা optional, ইংরেজিও optional।

**যা করা হয়েছে (ধাপে ধাপে, প্রতিটা ধাপে tsc পাস):**

**9d-fix — ChaptersManager (required শুধু Title EN):**
- `components/admin/ChaptersManager.tsx` — Edit + Add দুই form-এ `titleEn` required; box text "English (required)"
- `app/api/admin/tutorials/[id]/chapters/route.ts` (POST) + `[chId]/route.ts` (PATCH) — `titleEn` empty হলে 400
- (Content EN + Code EN optional — bn-এর মতো, তাই অপরিবর্তিত)

**9e-fix — LessonsManager (required Title EN + Content EN):**
- `components/admin/LessonsManager.tsx` — `LessonItem.save()` + `AddLessonForm.submit()`-এ `titleEn` + `contentEn` required চেক
- `app/api/.../lessons/route.ts` (POST) — `titleEn` + `contentEn` empty হলে 400
- `app/api/.../lessons/[lid]/route.ts` (PATCH) — `contentEn` empty হলে 400
- (Code example EN optional)

**9f-fix — ReferenceForm (required Title EN):**
- `components/admin/ReferenceForm.tsx` — `titleEn` required attr; `onSubmit`-এ চেক; box text "English (required)"
- `lib/validators.ts` → `createReferenceSchema.titleEn` থেকে `.optional()` সরানো
- `updateReferenceSchema` অপরিবর্তিত (partial update — খালি পাঠালে min(2) reject করে)

**9g-fix — ChallengeForm (required Title EN + Description EN):**
- `components/admin/ChallengeForm.tsx` — `titleEn` + `descriptionEn` required attr; `onSubmit`-এ চেক
- `app/api/admin/challenges/route.ts` (POST) — ৫টা ফিল্ড required চেক
- `app/api/admin/challenges/[id]/route.ts` (PUT) — `testCase.deleteMany`-এর **আগে** required চেক (খালি হলে ডেটা মুছবে না)
- Test Cases UI ছোঁয়া হয়নি ✅

**9h — QuizForm (নতুন ইংরেজি ঘর + required):**
- `components/admin/QuizForm.tsx` — `Option` type-এ `textEn`; form state-এ `questionEn`+`explanationEn`; English box (Question EN required, Explanation EN optional); প্রতি option-এ BN+EN দুটো ইনপুট
- `app/api/admin/quiz/route.ts` (POST) — `questionEn` + per-option `textEn` required চেক
- `app/api/admin/quiz/[id]/route.ts` (PUT) — একই চেক + DB সেভ
- `app/(admin)/admin/quizzes/[id]/edit/page.tsx` — `initial`-এ `questionEn/explanationEn/textEn`

**💡 পার্থক্য মনে রাখার জন্য:**
- Manual validation (destructuring): 9d, 9e, 9g, 9h — API-তে হাতে চেক বসাতে হয়েছে
- Zod schema: 9f (Reference) — শুধু validators.ts-এ `.optional()` সরালেই হয়

**⚠️ পুরনো ডেটার সতর্কতা:** যেসব রেকর্ডে `*En` null — re-save করতে গেলে ইংরেজি না লিখলে সেভ হবে না। Site live-এর আগে হাতে ঠিক করতে হবে।

**সব ধাপে:** `.bak` ব্যাকআপ নেওয়া হয়েছে; `npx tsc --noEmit` ০ error।

### ✅ PART 9i — SiteSettingsForm dual-input (English hero) (সম্পূর্ণ)

**⚠️ পার্থক্য:** এটা ইতিমধ্যে-সেট-আপ করা hero_en key ব্যবহার করেছে (Part 7.5b-তে যুক্ত হয়েছিল)। শুধু admin form + API + settings page-এ যোগ করা লাগল।

**ইউজারের সিদ্ধান্ত (২০২৬-০৯-২৫):**
- **নিয়ম:** সেভ করার আগে ইংরেজি বক্স ভরতেই হবে (কড়া required)।
- **কিন্তু:** form খোলার সময়ে ইংরেজি বক্স আগে থেকেই `DEFAULT_HERO_EN` দিয়ে ভরা থাকবে — যাতে প্রতি বার টাইপ করতে না হয়।

**committed (৪ ফাইল বদল + enbn.md):**
- `lib/site-settings.ts` — `getSiteSettings()` return-এ `heroEn: HeroContent | null` যোগ (getHeroSettings('en') থেকে); আসল bn hero পুরনো আচরণেই।
- `app/(admin)/admin/settings/page.tsx` (২৩ লাইন) — `initialHeroEn={heroEn}` prop পাঠানো।
- `app/api/admin/settings/route.ts` — `heroSettingsSchema` দিয়ে `body.heroEn` validate; খালি/invalid হলে 400; সফল হলে `HERO_EN_SETTINGS_KEY` (='hero_en') upsert; response-এ `heroEn` যোগ।
- `components/admin/SiteSettingsForm.tsx` (৫২১ → ~৬৪০ লাইন) — `initialHeroEn` prop; `heroEn` state (`initialHeroEn ?? DEFAULT_HERO_EN`); `updateHeroEn`, `updateStatEn` helper; বাংলা hero-র নিচে আলাদা "Hero Section (English) 🇬🇧" সেকশন — সব ইনপুটে `required`; POST body-তে `heroEn` যোগ।
- `heroSettingsSchema` / `HERO_EN_SETTINGS_KEY` / `DEFAULT_HERO_EN` — সব আগে থেকেই ছিল, বদলাতে হয়নি।
- Public site-এর কোনো কোড ছোঁয়া হয়নি। ফুটার/রিভিউ/FAQ অপরিবর্তিত।
- `npx tsc --noEmit` ০ error ✅; `npm run build` সফল (৫৪ পেজ) ✅

**ফলাফল:**
- Admin-এর Site Settings খুললে বাংলা hero-র নিচে ইংরেজি hero বক্স দেখা যাবে (ডিফল্ট লেখা ভরা, সব required)।
- Save চাপলে বাংলা + ইংরেজি দুটোই DB-তে যাবে।
- `/en` পেজে এখন (admin-এ সেভ করার পরে) ইংরেজি hero দেখাবে — "Content coming soon" আর দেখাবে না।

### ✅ PART 9j — Footer + FAQ English (Reviews-এ কিছু লাগেনি) (সম্পূর্ণ)

**বিশেষ নোট:** Reviews-এর settings shape = `{ enabled: boolean }` — শুধু একটা চালু/বন্ধ সুইচ। ওতে লেখা নেই, তাই ইংরেজি যোগ করার কিছু নেই। Site-section heading dictionary-তে আছে, আসল রিভিউ ইউজারের ভাষায়। তাই 9j-তে শুধু **Footer + FAQ।**

**ইউজারের সিদ্ধান্ত (২০২৬-০৯-২৫):**
- FAQ: **যুক্ত (paired) পদ্ধতি 🅰️** — প্রতিটা FAQ item-এ ৪টা ইনপুট: `q, a, qEn, aEn`; db-তে এক item-এ দুটো ভাষা পাশাপাশি।
- Footer + FAQ দুটোতেই ইংরেজি required (admin form-এ required attr)।
- Social links bn/en দুই view-এ শেয়ার (URL-এ ভাষা নেই)।

**যেই ৭টা ফাইল বদলেছে:**
1. `lib/footer-content.ts` (১০১ → ~১২২ লাইন) — `FOOTER_EN_SETTINGS_KEY='footer_en'`; `DEFAULT_FOOTER_EN`; `mergeFooter(raw, fallback)` fallback প্যারামিটার যোগ
2. `lib/faq-content.ts` (৫৪ → ~৯৪ লাইন) — `FaqItem`-এ `qEn?, aEn?`; `DEFAULT_FAQ`-এ প্রতি item-এ ইংরেজি লেখা যোগ; `DEFAULT_FAQ_EN` (bn row না থাকলে /en পেজে); `mergeFaq(raw, fallback)` — qEn/aEn পার্স করে
3. `lib/site-settings.ts` — `getFooterSettings(locale)` locale-aware (en → 'footer_en' key; socialLinks bn থেকে share); `getFaqSettings(locale)` locale-aware (en → items-এর qEn/aEn, খালিগুলো বাদ); `getSiteSettings()` return-এ `footerEn` যোগ
4. `app/[locale]/(site)/layout.tsx` — `getFooterSettings(locale)` locale পাস
5. `app/[locale]/(site)/page.tsx` — `getFaqSettings(locale)` locale পাস
6. `components/admin/SiteSettingsForm.tsx` (৫২১ → ~৭৪০ লাইন) — নতুন `footerEn` state (DEFAULT_FOOTER_EN fallback); `updateFooterEn` helper; FAQ প্রতি item-এ '🇬🇧 English (required)' বক্স (qEn/aEn); নতুন "+ নতুন প্রশ্ন"-এ qEn/aEn '';
7. `app/(admin)/admin/settings/page.tsx` — `initialFooterEn={footerEn}` prop

**API route (`app/api/admin/settings/route.ts`):**
- PUT-এ `body.footerEn` validate + খালি হলে 400
- `footer_en` key-তে upsert (socialLinks bn থেকে share হবে site-render-এ)
- response-এ `footerEn` যোগ

**lib/validators.ts:**
- `faqSettingsSchema`-তে `qEn?, aEn?` optional যোগ (পুরনো data tolerate করার জন্য; UI-তে required)

**অপরিবর্তিত:**
- Reviews-এর কোনো কোড (সুইচ, ভাষাহীন)
- hero-র কোড (9i)
- ডেটাবেস স্কিমা (শুধু data, নতুন key)
- Public bn আচরণ (হুবহু আগের মতো)
- `HomeExtras.tsx`-এর hardcoded বাংলা (BENTO/ROADMAP) — এই PART-এ ছোঁয়া হয়নি (আলাদা PART-এ হবে)

**ফলাফল:**
- Admin-এর Site Settings-এ এখন **Footer (English)** বক্স + FAQ-তে প্রতি item-এ ইংরেজি প্রশ্ন-উত্তর
- `/en` পেজে এখন ইংরেজি FAQ + ইংরেজি footer দেখা যাবে
- `/bn` অপরিবর্তিত

**যাচাই:** `npx tsc --noEmit` ০ error ✅; `npm run build` সফল (৫৪ পেজ) ✅

### 🎉 PART 9 — চূড়ান্ত সারসংক্ষেপ

| ধাপ | ফাইল মোট | অবস্থা |
|-----|---------|-------|
| 9a | validators.ts | ✅ |
| 9b | TutorialForm + 2 API | ✅ |
| 9c | GroupsManager + 2 API | ✅ |
| 9d | ChaptersManager + 2 API | ✅ |
| 9e | LessonsManager + 2 API | ✅ |
| 9f | ReferenceForm + validators | ✅ |
| 9g | ChallengeForm + 2 API | ✅ |
| 9h | QuizForm + 2 API + edit page | ✅ |
| 9i | SiteSettingsForm (English hero) + settings API + page + site-settings | ✅ |
| 9j | Footer + FAQ English (Reviews লাগেনি) — ৭ ফাইল + validators | ✅ |

**Part 9-এর পরে bn=en অবস্থা:**
- Tutorial title: required | description: optional
- Group title: required
- Chapter title: required | content/codeExample: optional
- Lesson title: required | content: required | codeExample: optional
- Reference title: required | description/syntax/example: optional
- Challenge title: required | description: required
- Quiz question: required | option text: required | explanation: optional
- Site hero (English): required (ডিফল্ট ইংরেজি লেখা আগে থেকে ভরা)
- Site hero (Bangla): required (আগের মতোই)
- Site footer (English): required; socialLinks bn-এর সাথে শেয়ার
- Site FAQ (English): required (paired — প্রতি item-এ qEn + aEn); db-তে q, a, qEn, aEn একসাথে
- Reviews: language-free (শুধু enabled boolean); ইংরেজি যোগ করার কিছু নেই

### ✅ PART 8 — SEO (hreflang, canonical, sitemap)

**8b — locale-aware sitemap** (`app/sitemap.ts`):
- প্রতিটা route-এর দুই ভাষার entry (bn + en) + reciprocating hreflang alternates
- tutorial/chapter/lesson/reference/challenge detail URL সব locale-aware
- `/playground` static route যোগ
- commit `745ddfd`-এ যুক্ত

**8c.2 — hreflang consistency + x-default everywhere (১৫ ফাইল)**:
- **8c.1**: `challenges/[id]/page.tsx` — `'bn-BD'` → `bn` (bn-BD মোট ৪টা ফাইলে ছিল)
- **8c.2 দল ক (৪টা)**: `references/[slug]`, `tutorials/[slug]`, `tutorials/[slug]/[chapter]`, `tutorials/[slug]/[chapter]/[lesson]` — প্রতিটাতে `bn-BD` → `bn` + `x-default` যোগ
- **8c.2 দল খ (১০টা)**: layout + home + tutorials/references/challenges listing + playground + progress + search + about + tools — শুধু `x-default` যোগ
- commit `745ddfd`-এ যুক্ত (196 insertions, 55 deletions)

**8f — sitemap x-default (build-verified)**:
- `withAlternates()` helper-এ `'x-default': SITE_URL + bnPath` যোগ
- Next.js 16.3.4-এ build pass, `/sitemap.xml`-এ `hreflang="x-default"` নির্গত ✅
- **প্রমাণ:** Next.js 16.3.4-এ `npm run build` pass, এবং `.next/server/app/sitemap.xml.body`-এ `hreflang="x-default"` নির্গত। (TypeScript-এর `MetadataRoute.Sitemap` type স্বীকৃতি দিয়েছে — `npx tsc --noEmit` ০ error।)

**টেকনিক্যাল শিক্ষা:**
- `backup_file` MCP tool `.bak` নাম দেয়; custom suffix দরকার হলে `read_file` + `create_file` MCP দিয়ে করতে হয়
- Shell quotes MCP wrapper-এ ভাঙে → commit message-এর জন্য `git commit -F <file>` ব্যবহার করা নিরাপদ
- `backup_file` বিদ্যমান `.bak` overwrite করে না (mtime সংরক্ষণ করে)

**8d (স্থগিত)** — tools/* sub-pages (base64 etc.) locale-aware করতে হবে (canonical + generateMetadata + hero localization) — PART 9-এ যাবে।

**8e — robots.ts locale-aware disallow ✅ (PART 8e, committed 7211e9d)**:
- ৮টা pattern entry: `/admin/`, `/api/`, `/bn/progress`, `/en/progress`, `/bn/search`, `/en/search`, `/bn/tools/`, `/en/tools/`
- পুরনো locale-হীন `/progress` ও `/search` (no-op) বাদ দিয়ে locale-প্রিফিক্স যোগ
- tools/* sub-pages-এর জন্য pattern entry (`/bn/tools/`, `/en/tools/`) — tools listing (trailing slash ছাড়া) কে disallow করে না, কিন্তু সব sub-path ধরে
- prefix-matching RFC 9309 §2.2.2 standard — `/bn/tools/` (trailing slash সহ) listing বাদ দেয় না, sub-paths ধরে
- build pass, `/robots.txt` output verified

⚠️ Tools/* sub-pages robots-এ disallow — temporary।
PART 9-এ admin dual-input শেষে tools localized হবে →
তখন disallow সরিয়ে sitemap-এ যোগ করা হবে।

---

## 🚀 PART 9 — Admin dual-input (৯টা sub-part)

> **PART 9-এর মূল কাজ:** প্রতিটা admin form-এ `*En` ইনপুট যোগ করা — যাতে DB-তে ইংরেজি ভার্সনও সেভ করা যায় (titleEn, descriptionEn, contentEn ইত্যাদি)।
> **বর্তমান অবস্থা:** PART 8 পর্যন্ত ✅। এখন পর্যন্ত শুধু `*Bn` ফিল্ড (titleBn, descriptionBn) আছে — `*En` নেই।
> **কেন ভাগ করছি:** PART 9 বড় — ৭টা admin form + ৭টা API route। একবারে করলে ভুল বেশি জায়গায় ছড়াবে। ছোট ছোট sub-part-এ ভাগ করলে প্রতিটা শেষে tsc + build verify করা যাবে।

**সহজ উদাহরণ:** বড় চায়ের হাঁড়ি একবারে উনুনে দিলে উপচে যায়। ছোট ছোট কাপে ভরে একটার পর একটা করলে প্রতিটা ঠিকভাবে দেখা যায়। তেমনিই — ৯টা sub-part = ৯টা কাপ।

### 📦 PART 9-এর ৯টা sub-part

| Sub-part | কাজ | ফাইল | সময় | ঝুঁকি |
|---|---|---|---|---|
| ✅ **9a** | Foundation: Validators-এ `*En` ফিল্ড | `lib/validators.ts` (~৩১০ লাইন) | ২০ মিনিট | 🟡 মাঝারি |
| ✅ **9b** | TutorialForm — titleEn + descriptionEn | `components/admin/TutorialForm.tsx` (৫.৮ KB) + ২ API route | ২০ মিনিট | 🟢 কম |
| ✅ **9c** | GroupsManager — titleEn | `components/admin/GroupsManager.tsx` (৮.৬ KB) + ২ API route | ১৫ মিনিট | 🟢 কম |
| ✅ **9d** | ChaptersManager — titleEn + contentEn + codeExampleEn | `components/admin/ChaptersManager.tsx` (১৬.৭ KB) + ২ API route | ৩০ মিনিট | 🟡 মাঝারি |
| ✅ **9e** | LessonsManager — titleEn + contentEn (required), codeExampleEn (optional) | `components/admin/LessonsManager.tsx` + ২ API route | ৩০ মিনিট | 🟡 মাঝারি |
| ✅ **9f** | ReferenceForm — titleEn + descriptionEn + syntaxEn + exampleEn | `components/admin/ReferenceForm.tsx` (৪.২ KB) + ২ API route | ২০ মিনিট | 🟢 কম |
| ✅ **9g** | ChallengeForm — titleEn + descriptionEn | `components/admin/ChallengeForm.tsx` (৫.৯ KB) + ২ API route | ১৫ মিনিট | 🟢 কম |
| ✅ **9h** | QuizForm — questionEn + textEn (required), explanationEn (optional) | `components/admin/QuizForm.tsx` + ২ API route | ২০ মিনিট | 🟢 কম |
| **9i** | SiteSettingsForm — শুধু hero_en | `components/admin/SiteSettingsForm.tsx` (১৯.৭ KB) + settings API | ৩০ মিনিট | 🔴 বেশি |
| **9j** | Final verification — সব form হাতে test + tsc + build + enbn.md আপডেট | — | ২০ মিনিট | 🟢 কম |

**মোট সময়:** ~৩.৫ ঘণ্টা (৩-৪ session-এ)

### 🎯 PART 9a — Foundation (Validators)

**সবার আগে এটা কেন:** সব form আর API এই Zod schema-র উপর নির্ভর করে। Foundation ঠিক হলে বাকিগুলো সহজ।

**কোন কোন schema-তে কী যোগ হবে:**

```
- createTutorialSchema / updateTutorialSchema:
    titleEn: z.string().min(2).max(255).optional()
    descriptionEn: z.string().optional()

- createGroupSchema / updateGroupSchema:
    titleEn: z.string().min(1).max(255).optional()

- createChapterSchema / updateChapterSchema:
    titleEn: z.string().min(1).max(255).optional()
    contentEn: z.string().nullable().optional()
    codeExampleEn: z.string().nullable().optional()

- createLessonSchema / updateLessonSchema:
    titleEn: z.string().min(1).max(255).optional()
    contentEn: z.string().nullable().optional()
    codeExampleEn: z.string().nullable().optional()

- Reference schemas:
    titleEn, descriptionEn, syntaxEn, exampleEn — সব optional

- Challenge schemas:
    titleEn, descriptionEn — সব optional

- Quiz schemas:
    questionEn: required, textEn: required (প্রতি option),
    explanationEn: optional
```

**🔴 নতুন নিয়ম (২০২৬-০৯-২৫): bn=en — জোড়া নিয়ম**

ইংরেজি ফিল্ডগুলো বাংলার নিয়মেই চলবে:
- **যেখানে bn required → en-ও required:**
  Tutorial title, Chapter title, Lesson title+content,
  Reference title, Challenge title+description,
  Quiz question + option text
- **যেখানে bn optional → en-ও optional:**
  Tutorial description, Chapter content/codeExample,
  Lesson codeExample, Reference description/syntax/example,
  Quiz explanation

পুরনো `*Bn` ফিল্ড কখনো ভাঙা যাবে না।

**⚠️ সতর্কতা:** পুরনো ডেটা যেসব রেকর্ডে `*En` null — সেগুলো admin panel-এ re-save করলে ইংরেজি না দিলে সেভ হবে না। Site live-এর আগে হাতে ঠিক করতে হবে।

### 📋 প্রতিটা sub-part-এর জন্য AI-কে যা দিতে হবে

প্রতিবার এই ৪টা অংশ থাকবে:

**১) Context (প্রসঙ্গ)** — PART 9-এর কোন sub-part, কী ফাইল।

**২) Rules (নিয়ম)** — সবসময় থাকবে:
```
- কোনো ফাইল edit করার আগে read_file দিয়ে পুরো ফাইল পড়বে
- কী বদলাবে সহজ বাংলায় প্রিভিউ দেবে
- "হ্যাঁ" পেলে তবেই edit
- প্রতিটা edit-এর আগে .bak backup
- edit-এর পর npx tsc --noEmit → ০ error যাচাই
- error থাকলে পরের step-এ যাবে না
- push নিষেধ (শুধু local commit)
- .bak / *.bakN git-এ add করবে না
- প্রতিটা commit-এর আগে আলাদা "হ্যাঁ" নেবে
```

**৩) কাজ (Task)** — sub-part-এর নির্দিষ্ট কাজ।

**৪) Verify criteria** — কী দেখে বুঝবেন কাজ সফল:
```
- npx tsc --noEmit → ০ error
- read_file দিয়ে দেখাও নতুন ফিল্ড
- পুরনো *Bn ফিল্ড অপরিবর্তিত
```

### 📝 উদাহরণ — 9a-এর জন্য পাঠানোর টেক্সট

```
DevSchool — PART 9a: Validators (Foundation)

আমি নতুন চ্যাটে আছি। রুটে enbn.md আছে — প্রথমে পড়ো।

পরিস্থিতি: PART 8 সম্পূর্ণ ✅। এখন PART 9a — lib/validators.ts-এ
সব Zod schema-তে *En ফিল্ড যোগ করা।

━━━ কঠোর নিয়ম ━━━
- edit করার আগে read_file দিয়ে পুরো ফাইল পড়ো
- প্রিভিউ দাও — কোন কোন schema-তে কী কী ফিল্ড যোগ হবে
- "হ্যাঁ" পেলে তবেই edit
- .bak backup আগে
- npx tsc --noEmit → ০ error যাচাই
- push নিষেধ
- commit-এর আগে আলাদা "হ্যাঁ" নাও

━━━ কাজ ━━━
lib/validators.ts (৩১০ লাইন) পড়ে প্রতিটা schema-তে *En
ফিল্ড যোগ করো (উপরে PART 9a সেকশনে তালিকা আছে)।

━━━ verify ━━━
- npx tsc --noEmit → ০ error
- read_file দেখাও: প্রতিটা schema-তে নতুন ফিল্ড
- কোথাও কোনো required ফিল্ড ভাঙেনি

━━━ রিপোর্ট + commit ━━━
- কী কী ফিল্ড যোগ হলো — সংক্ষিপ্ত তালিকা
- .bak তৈরি হয়েছে কিনা জানাও
- commit proposal (message اقتراح)
- "হ্যাঁ" পেলে commit → git log --oneline -3
```

**9b থেকে 9j পর্যন্ত একই প্যাটার্ন** — শুধু "কাজ" অংশ বদলাবে।

### 🔴 বিশেষ সতর্কতা — 9i (SiteSettingsForm)

- ফাইলটা **১৯.৭ KB** — hero + footer + faq + reviews — ৪টা section একসাথে
- **সুপারিশ:** 9i-তে **শুধু hero_en**। বাকি footer/faq/reviews — আলাদা PART-এ (এখন সিদ্ধান্ত দরকার নেই)।
- **কারণ:** hero_en দিলেই `/en` পেজ আর "Content coming soon" দেখাবে না — সবচেয়ে বড় visual improvement।

### 🎯 কীভাবে এগোবেন — ২টা পথ

**পথ A** — এক session-এ ২-৩টা sub-part (দ্রুত, কিন্তু ভুল ছড়াতে পারে)

**পথ B** — এক session-এ ১টা sub-part (নিরাপদ, কিন্তু বেশি session লাগবে)

**সুপারিশ (পথ A-র সাথে সাজানো):**
- Session ১: 9a + 9b + 9c (~৫৫ মিনিট)
- Session ২: 9d + 9e (~৬০ মিনিট)
- Session ৩: 9f + 9g + 9h (~৫৫ মিনিট)
- Session ৪: 9i + 9j (~৫০ মিনিট)

মোট ৪ session — প্রতিটা ৪৫-৬০ মিনিট।

### 📋 প্রতিটা sub-part শেষে করণীয়

১) `npx tsc --noEmit` → ০ error যাচাই
২) `npm run build` → সফল
৩) `git log --oneline -2` → commit verify
৪) নতুন sub-part শুরু করার আগে — নতুন চ্যাট খুলবেন কি না সিদ্ধান্ত নিন (বড় sub-part 9d/9e/9i হলে নতুন চ্যাট সুপারিশ)

---

### ✅ PART 7.5 — Console fix + Hero localization + /en ComingSoon

**PHASE A:** ⚠️ **accepted (dev-only)** — React 19-এর নতুন dev-only warning। React 19 + Next.js 16.3.4-এ <Script> strategy='beforeInteractive' root layout-এ [locale] segment switch-এর সময় client re-mount হলে warning দেয়। Production build-এ আসে না, theme ঠিকই কাজ করছে। docs/script.md মেনে pattern সঠিকই আছে। কোনো fix দরকার নেই।

**PHASE B (hero localization):**
- `lib/hero-content.ts` — `DEFAULT_HERO` → `DEFAULT_HERO_BN` (+ alias রাখা হয়েছে), নতুন `DEFAULT_HERO_EN`, নতুন `HERO_EN_SETTINGS_KEY = 'hero_en'`, `mergeHero(raw, fallback?)` — fallback প্যারামিটার যোগ।
- `lib/site-settings.ts` — `getHeroSettings(locale = 'bn'): Promise<HeroContent | null>` (bn → `'hero'` key; en → `'hero_en'` key; না থাকলে en-এ null); `getSiteSettings()` ভেতরে `getHeroSettings('bn').then(h => h ?? DEFAULT_HERO_BN)` — admin অপরিবর্তিত।
- `components/HeroSection.tsx` — `hero: HeroContent` (required, ডিফল্ট বাদ)।
- `app/[locale]/(site)/page.tsx` — `getHeroSettings(locale)`; hero null হলে `<ContentComingSoon />`।

**PHASE C (/en placeholder):**
- নতুন `components/ContentComingSoon.tsx` — badge + heading + message + বাংলা লিঙ্ক।
- `lib/i18n/dictionaries/bn.ts` + `en.ts` — `home` ঘরে ৪টা নতুন key: `comingSoonBadge`, `comingSoonTitle`, `comingSoonMessage`, `comingSoonCta`।

**আচরণ:**
- `/bn` → বাংলা hero ✅
- `/en` → "Content coming soon" (কারণ DB-তে `hero_en` এখনো নেই) ✅
- ভবিষ্যতে admin থেকে `hero_en` লেখা হলে /en-এ ইংরেজি hero দেখাবে (PART 9)

**পরের কাজ: PART 8 — SEO (hreflang, canonical, sitemap)**।

> ⚠️ **নোট:** এই সেকশনের নিচের সব কিছু **ঐতিহাসিক** (পুরনো নোট)।
> **PART 6 ✅ ১০০% সম্পূর্ণ** — commit `a6a17f6`।
> নিচের যেখানে "commit বাকি" / "পরের কাজ" লেখা আছে — সেগুলো এখন **সব শেষ**; এখন আর বাকি নেই।

_(পুরনো নোট, ইতিহাসের জন্য)_ সর্বশেষ step ছিল: chapters + groups admin tree (PART 6 step 7a) ✅ — page + ৫টা API route (POST/PATCH) সব `titleBn`/`contentBn`/`codeExampleBn`-এ; client components (ChaptersManager, GroupsManager, LessonsManager) আগেই ঠিক ছিল। নিচের tree গুলো সম্পূর্ণ locale-aware:

- **tutorials tree** ✅ — localize.ts + tutorial-data.ts + [slug] + [chapter] + [lesson] + tryit দুটো।
- **references tree** ✅ (commit `666556d`) — [slug] detail + listing।
- **challenges tree** ✅ (commit `af91304`) — [id] detail + listing।

**tsc error ~২৬৩ → ~১৩৫** (এই নোটটা পুরনো — PART 6 শেষে tsc এখন **০ error**)।

⚠️ **ভাষা নীতি (চূড়ান্ত):** admin panel থেকে ইউজার নিজে BN+EN দুই ফিল্ডে ইনপুট দেবেন। কোনো auto-translate বা language-detect নেই। `/bn` পেজ শুধু `*Bn` ফিল্ড দেখাবে, `/en` পেজ শুধু `*En`। strict no-fallback। টেকনিক্যাল টার্ম (Easy/Medium/Advanced, HTML, API ইত্যাদি) ইংরেজিতেই থাকবে দুই পেজে।

⚠️ **listing-এ strict filter (Rule #4):** `/en`-এ শুধু যেসব আইটেমের `titleEn` non-empty। সাথে map-এর পরে `.filter()` দিয়ে খালি string + trim()-করা খালি string বাদ (references + challenges listing-এ করা হয়েছে)।

✅ **PART 6 step 6 (home + tutorials listing):** `app/[locale]/(site)/page.tsx` ও `app/[locale]/(site)/tutorials/page.tsx` — দুইটাই locale-aware। home-এ ৫টা query (popular/latest/search/chapters/marquee) Rule #4 filter + `pickText` পেয়েছে; `generateMetadata`-এর count-ও locale-aware। tutorials listing-এ select-এ `titleBn/En + descriptionBn/En`, Rule #4 filter, ভাষা-নির্ভর `orderBy`, map-এ `pickText` + `.filter()`। পাবলিক সাইটের সব tree ✅ সম্পূর্ণ। commit a9a6b84 ✅ সম্পন্ন।

✅ **PART 6 step 7a (chapters + groups admin tree):** নিচের ৮টা ফাইল locale-aware (admin, locale-প্যারামিটার ছাড়া — শুধু নাম বদল):
- `app/(admin)/admin/tutorials/[id]/chapters/page.tsx`
- `app/api/admin/tutorials/[id]/chapters/route.ts` (GET+POST+PATCH)
- `app/api/admin/tutorials/[id]/chapters/[chId]/route.ts` (PATCH)
- `app/api/admin/tutorials/[id]/groups/route.ts` (POST)
- `app/api/admin/tutorials/[id]/groups/[gid]/route.ts` (PATCH)
- `app/api/admin/tutorials/[id]/chapters/[chId]/lessons/route.ts` (POST)
- `components/admin/ChaptersManager.tsx` ✅
- `components/admin/GroupsManager.tsx` ✅
- `components/admin/LessonsManager.tsx` ✅

⚠️ **গুরুত্বপূর্ণ শিক্ষা:** `select`/`include`-এর ভেতরের nested `title: true` চোখে পড়া কঠিন — যেমন `group: { select: { id: true, title: true } }`। এটা বারবার মিস হয়। তাই প্রতিটা API route-এ `grep title` চালানো বাঞ্ছনীয়।

✅ **PART 6 step 7b (quizzes edit tree) [commit `0a35718`]:** `app/(admin)/admin/quizzes/[id]/edit/page.tsx` + `app/api/admin/quiz/route.ts` + `app/api/admin/quiz/[id]/route.ts` + `components/admin/QuizForm.tsx` (Path A — state key-ও `Bn`) + `lib/validators.ts` (Quiz schemas) — সব locale-aware (admin, locale-প্যারামিটার ছাড়া — শুধু field rename)। বাড়তি: `app/api/quizzes/[id]/route.ts` (public) — field rename হয়েছে; locale-awareness step 8-এ যোগ হবে। tsc: ~১১২ → ~৮৫।

📌 **tsc ডিবাগ নিয়ম (মনে রাখতে হবে):** tsc ডিবাগ ফাইল বানাতে `Set-Content -Encoding UTF8` ব্যবহার করো (`Out-File` নয় — BOM যোগ করে MCP tool আটকে দেয়)। উদাহরণ: `npx tsc --noEmit 2>&1 | Select-String -NotMatch "\.next","node_modules" | Set-Content -Encoding UTF8 tsc-raw.txt`

✅ **PART 6 step 7f (new pages tutorial dropdown) [commit `c822da1`]:** `admin/challenges/new` + `admin/quizzes/new` + `admin/references/new` — tutorial dropdown-এ `orderBy: { titleBn: 'asc' }` + `title: t.titleBn`। tsc: ~৭৩ → ~৬৭।

⚠️ **PART 6 step 8 (public API) — locale-awareness নোট (বাকি):** `api/search/route.ts` — $queryRaw অংশ DB-কলামেই আছে (title @map-এর কারণে) — ঠিক আছে; কিন্তু Prisma fallback অংশে locale-নির্ভর ফিল্টার (bn→titleBn, en→titleEn) এখনো বাকি — PART 7-এর পরে সাব-স্টেপে হবে। `api/tutorials/route.ts` — dynamic sort map করা হয়েছে (`sort === 'title'` হলে ভেতরে `titleBn`; URL `?sort=title` অপরিবর্তিত)।

✅ **PART 6 step 7e (tutorials edit tree) [commit `a326da3`]:** `app/(admin)/admin/tutorials/[id]/edit/page.tsx` + `components/admin/TutorialForm.tsx` (Path A — state key-ও `Bn`) + `lib/validators.ts` (createTutorialSchema + updateTutorialSchema) locale-aware। API routes (POST/PUT) ছোঁয়া হয়নি — schema rename হলেই `tutorialData` নতুন নামে আসে, Prisma মিলে যায়। tsc: ~৮০ → ~৭৩।

✅ **PART 6 step 7c-challenge (challenges edit tree):** `app/(admin)/admin/challenges/[id]/edit/page.tsx` + `app/api/admin/challenges/route.ts` + `app/api/admin/challenges/[id]/route.ts` + `components/admin/ChallengeForm.tsx` (Path A — state key-ও `Bn`) + `lib/validators.ts` (`createChallengeSchema`) — সব locale-aware (admin, locale-প্যারামিটার ছাড়া — শুধু field rename)। testCases ছোঁয়া হয়নি (input/expectedOutput ভাষা-নিরপেক্ষ)। tsc: ~৮৫ → ~৮০ (৫টা কমেছে)। commit a6a17f6-এ অন্তর্ভুক্ত ✅।


**পরের কাজ:** PART 7 — LanguageSwitcher.tsx (হেডারে `EN | বাং` বাটন)।

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
- Migration history: নতুন migration `20260922164626_add_bilingual_fields` প্রয়োগ হয়েছে

---

## 🟢 PART 1-এর রিপোর্ট (সম্পন্ন — ২০২৬-০৯-২২)

### কী করা হয়েছে
1. `prisma/schema.prisma.bak` ব্যাকআপ নেওয়া হয়েছে
2. **৮টা মডেলে** দুই ভাষার ঘর যোগ (CRLF মিলিয়ে `edit_file` দিয়ে):
   - `Tutorial` → `titleBn/En`, `descriptionBn/En`
   - `ChapterGroup` → `titleBn/En`
   - `Chapter` → `titleBn/En`, `contentBn/En`, `codeExampleBn/En`
   - `Lesson` → `titleBn/En`, `contentBn/En`, `codeExampleBn/En`
   - `QuizQuestion` → `questionBn/En`, `explanationBn/En`
   - `QuizOption` → `textBn/En`
   - `CodeChallenge` → `titleBn/En`, `descriptionBn/En`
   - `Reference` → `titleBn/En`, `descriptionBn/En`, `syntaxBn/En`, `exampleBn/En`
3. `npx prisma migrate dev --name add_bilingual_fields` — ✅ সফল
   - Migration: `20260922164626_add_bilingual_fields`
   - Prisma Client v5.22.0 generate হয়েছে
   - পুরনো কলাম (`title`, `content`...) DB-তে অপরিবর্তিত — বাংলা ডেটা **নিরাপদ**
4. `npx tsc --noEmit` — **fail করেছে (প্রত্যাশিত)** — কারণ কোডে এখনো `tutorial.title` ব্যবহার হচ্ছে। Part 6-এ ঠিক হবে।

### Git commit
`9ff722c` — feat(i18n): Part 1 — add bilingual columns to Prisma schema

### যা এখনো বাকি (Part 1-এর মধ্যে)
- tsc-এর exact error সংখ্যা জানা হয়নি (tsc-errors.txt তৈরি করার কমান্ড whitelist-এ নেই)

### সতর্কতা
- Part 1 থেকে Part 6 পর্যন্ত সাইট **ভাঙা** থাকবে। **deploy নিষেধ।**
- সব Part শেষ না হওয়া পর্যন্ত GitHub-এ push করা হবে না

### নতুন AI-এর জন্য টিপস (শিখে রাখা দরকার)
- `edit_file`-এ **CRLF (`\r\n`)** দিতে হবে `schema.prisma`-র জন্য (Windows line ending)
- কিন্তু `enbn.md`-এর জন্য **LF (`\n`)** ব্যবহার করতে হবে (আমি যখন তৈরি করেছি তখন LF দিয়েছি)
- বড় ফাইল (≥১০KB) `create_file` দিয়ে overwrite করতে গেলে silent fail করে — ছোট ছোট `edit_file` ব্যবহার করাই নিরাপদ
- `edit_multiple_files` atomic — একটার oldContent fail হলে সব বাতিল হয়। তাই একটা একটা `edit_file` নিরাপদ।

---

## 🟢 PART 2-এর রিপোর্ট (সম্পন্ন — ২০২৬-০৯-২২)

### কী তৈরি হয়েছে (৬টা নতুন ফাইল)

| # | ফাইল | কাজ |
|---|---|---|
| ১ | `lib/i18n/config.ts` | LOCALES = ['bn','en'], DEFAULT_LOCALE = 'bn', LOCALE_COOKIE = 'ds_locale', LOCALE_COOKIE_MAX_AGE, LOCALE_DISPLAY_NAMES, LOCALE_TAGS, isLocale(), getOtherLocale() |
| ২ | `lib/i18n/locale.ts` | `getLocale()` (cookie → Accept-Language → ডিফল্ট), `getLocaleFromParams()` |
| ৩ | `lib/i18n/dictionaries/bn.ts` | বাংলা UI লেখা — সব key-এর আসল আকার (source of truth) |
| ৪ | `lib/i18n/dictionaries/en.ts` | ইংরেজি UI লেখা — হুবহু একই key |
| ৫ | `lib/i18n/dictionaries/index.ts` | `getDictionary(locale)`, `getDictionarySync(locale)` |
| ৬ | `lib/i18n/pick.ts` | `pick()`, `pickOr()` — fallback নিয়ম |

### Dictionary-র key গ্রুপ
- `nav`: tutorials, references, playground, challenges, tools, progress, search, about
- `common`: home, next, prev, complete, loading, notFound, error, back, close, yes, no
- `tutorial`: example, tryIt, onThisPage, chapters, lessons, previousLesson, nextLesson
- `footer`: about, contact, privacy, terms, copyright
- `notFound`: title, message, goHome
- `error`: title, message, retry
- `language`: switchTo, bengali, english

### tsc যাচাই
- `npx tsc --noEmit 2>&1 | findstr "i18n" > i18n-errors2.txt` (ইউজার নিজে terminal-এ চালিয়েছেন)
- **ফলাফল: খালি** — মানে `lib/i18n/` ফোল্ডারে কোনো error নেই ✅
- পুরো প্রজেক্টের tsc fail আছে — সব **Part 1-এর কারণে** (কোডে এখনো `tutorial.title` ব্যবহৃত), Part 6-এ ঠিক হবে

### 🐛 যেই সমস্যা হয়েছিল এবং সমাধান
**সমস্যা:** `bn.ts`-এ `as const` দেওয়ার কারণে TypeScript ভেবেছিল শুধু বাংলা লেখাই বৈধ। তাই `en.ts`-এ ইংরেজি লেখা দিলে error TS2322।
**সমাধান:** `as const` মুছে ফেলা হয়েছে — এখন `typeof bn` সব key-কে `string` টাইপ হিসেবে ধরে।

### যাচাই করার কমান্ড (whitelist-এ নেই)
- `npx tsc --noEmit 2>&1 | findstr "i18n" > i18n-errors2.txt` — ইউজার নিজে চালান
- `read_file` বড় tsc-errors.txt (৬৪KB) পড়তে পারে না — filter করে ছোট ফাইল লাগে

---

## 🟢 PART 3-এর রিপোর্ট (সম্পন্ন — ২০২৬-০৯-২২)

### কী করা হয়েছে
1. `proxy.ts.bak` ব্যাকআপ নেওয়া হয়েছে
2. `proxy.ts` সম্পূর্ণ নতুন করে লেখা হয়েছে — দুই কাজ একসাথে:
   - **Admin auth** (আগের মতোই): `/admin/*` আর `/api/admin/*` সুরক্ষিত
   - **Locale দারোয়ান** (নতুন): URL-এ `/bn` বা `/en` না থাকলে cookie → Accept-Language → ডিফল্ট `bn` অনুযায়ী `307 redirect` + `ds_locale` cookie (১ বছর)
3. `config.matcher` আপডেট:
   - `/admin/:path*` ও `/api/admin/:path*` (admin auth)
   - `/((?!_next|api|admin|.*\..*).*)` — বাকি সব পাবলিক পেজ (স্ট্যাটিক ফাইল বাদে)
4. অফিসিয়াল ডক থেকে যাচাই করা হয়েছে (Next.js 16.3.4 bundled docs):
   - Next.js 16-এ middleware-এর নতুন নাম → `proxy`
   - `proxy.ts` রুটে, `export function proxy()` নামে
   - `NextResponse.redirect(new URL(...), 307)` সিনট্যাক্স সঠিক

### tsc যাচাই
- ইউজার নিজে terminal-এ চালান: `npx tsc --noEmit 2>&1 | findstr "proxy"`
- **ফলাফল: খালি** — মানে `proxy.ts`-এ কোনো নতুন error নেই ✅
- পুরো প্রজেক্টের tsc fail আছে — সব **Part 1-এর কারণে**, Part 6-এ ঠিক হবে

### নতুন AI-এর জন্য টিপস
- Next.js 16-এ `middleware.ts` নেই — `proxy.ts` (একই কাজ)
- `proxy.ts`-এ locale-এর জন্য `request.cookies.get()` আর `request.headers.get('accept-language')` ব্যবহার করা হয় (Edge runtime-এ কাজ করে)
- `withSecurityHeaders()` helper — দুই header যোগ করে (`X-Content-Type-Options`, `X-Frame-Options`)
- whitelist-এ pipe (`|`) সহ command নেই — filter করার command ইউজারকে দিতে হয়

### সতর্কতা
- Part 3 থেকে সাইট **আরো ভাঙা** — এখন `/` মানে `/bn/...` redirect করবে, কিন্তু Part 4-এ এখনো পেজগুলো সরানো হয়নি → 404 আসবে
- **deploy নিষেধ** — Part 6 পর্যন্ত

---

## 🟢 PART 4-এর রিপোর্ট (সম্পন্ন — ২০২৬-০৯-২৩)

### কী করা হয়েছে
1. **ব্যাকআপ** — `app/layout.tsx.bak`, `app/(site)/layout.tsx.bak`, `app/(site)/page.tsx.bak`
2. **নতুন root layout ১** — `app/(admin)/layout.tsx` (admin panel, lang="bn" hardcoded)
3. **নতুন root layout ২** — `app/[locale]/layout.tsx` (public site, `lang={locale}` dynamic, `generateStaticParams` দিয়ে দুই ভাষা pre-render)
4. **ফোল্ডার সরানো:**
   - `app/(site)/` → `app/[locale]/(site)/`
   - `app/admin/` → `app/(admin)/admin/`
   - `app/about/` → `app/[locale]/about/`
5. **পুরনো `app/layout.tsx` মুছে ফেলা** (ব্যাকআপ আছে)
6. **অপরিবর্তিত:** `app/api/`, `app/global-error.tsx`, `app/not-found.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/icon.svg`, `app/globals.css`

### কেন এই পদ্ধতি
Next.js 16-এর bundled docs (layout.md, route-groups.md, internationalization.md) অনুযায়ী:
- Multiple root layouts সম্ভব — route group দিয়ে
- Root layout dynamic segment-এর ভেতরে থাকতে পারে (`app/[locale]/layout.tsx`)
- `params` Next.js 16-এ **async** — `await params` লাগে
- এক root থেকে অন্য root-এ navigation = full page load (স্বাভাবিক)

### tsc যাচাই
- ইউজার নিজে চালিয়েছেন: `npx tsc --noEmit 2>&1 | findstr "[locale] (admin)"`
- **Part 4-এর নতুন ফাইলে ০ error** ✅
- `.next/types/validator.ts`-এর error = পুরনো ক্যাশ (পরের dev/build-এ অটো ঠিক হবে)
- বাকি সব = Part 1-এর প্রত্যাশিত error, Part 6-এ ঠিক হবে

### সতর্কতা
- Part 4 থেকে পাবলিক সাইট এখনো ভাঙা — কারণ ভেতরের link/নেভিগেশন এখনো `/{locale}/...` prefix ব্যবহার করছে না
- Part 7-এ (LanguageSwitcher) আর Part 5-এ link helper যোগ হলে ঠিক হবে
- **deploy নিষেধ**

### নতুন AI-এর জন্য টিপস
- Next.js 16-এ `params` Promise — সব page/layout-এ `await params` করতে হবে
- `[locale]` dynamic segment root layout-এ থাকতে পারে → `next/root-params` দিয়ে যেকোনো Server Component-এ locale পড়া যায়
- multiple root layouts থাকলে `not-found.tsx` global component কাজ করবে না সব জায়গায় — নিজের root layout-এ not-found যোগ করতে হবে
- `.next/` ফোল্ডারের পুরনো type validator error দেখলে ভয় পাওয়ার কিছু নেই — `npm run dev` চালালেই ঠিক

---

## 🟡 PART 5-এর রিপোর্ট (চলমান — ২০২৬-০৯-২৩)

### Part 5a — Header ✅ সম্পন্ন
- `lib/i18n/I18nProvider.tsx` তৈরি (নতুন): client component-দের জন্য dictionary Context + `useDict()` + `useLocale()` hook
- `lib/i18n/link.ts` তৈরি (নতুন): `localeHref(locale, path)`, `stripLocale(path)`, `hasLocalePrefix(path)`
- `app/[locale]/layout.tsx`: I18nProvider দিয়ে children wrap
- `components/Header.tsx`: hardcoded বাংলা + `/tutorials` লিংক → `useDict()` + `localeHref()`
- Commit: `6fe3d02` — feat(i18n): Part 5a
- tsc: `Header I18nProvider link.ts` → **খালি** ✅

### Part 5b — Footer ✅ সম্পন্ন
- `lib/i18n/dictionaries/bn.ts` + `en.ts`: নতুন footer key যোগ (tagline, colLearn/colTools/colSite, linkTutorials/linkChallenges/... , madeWith)
- `components/Footer.tsx`: locale + dict props নেয়, সব লেখা dictionary থেকে, সব লিংক `localeHref()` দিয়ে
- `app/[locale]/(site)/layout.tsx`: `params` থেকে locale নিয়ে `getDictionary(locale)` লোড করে `<Footer locale dict>` পাঠায়
- tsc: `Footer bn.ts en.ts site layout` → **Footer/bn/en/layout এ কোনো error নেই** ✅ (যা ছিল সব `.next/` ক্যাশ বা Part 1-এর প্রত্যাশিত error)
- Commit: **এখনো করা হয়নি** — পরবর্তী commit-এ একসাথে হবে

### যা বাকি (Part 5)
- **5c:** `HeroSection.tsx`, `LanguageTabs.tsx`, `LanguageTabsServer.tsx`
- **5d:** `LessonSidebar.tsx`, `LessonContent.tsx`, `TryIt.tsx`, `TutorialShell.tsx`
- **5e:** সব `page.tsx` (home, tutorials, references, challenges, playground, progress, search, tools, about) + `not-found.tsx` + `error.tsx`

### কাজের নিয়ম (নিরাপদ পথ)
- **প্রতিটা ছোট গ্রুপ শেষে tsc যাচাই** — একবারে সব না
- প্রতিটা ফাইলের `.bak` ব্যাকআপ
- ছোট ছোট `edit_file`, এক一个一个

### নতুন AI-এর জন্য টিপস
- Header একটা **client component** — `useDict()`/`useLocale()` hook লাগে
- Footer একটা **server component** — props আকারে locale+dict পাঠাতে হয়
- `stripLocale(pathname).path` দিয়ে active link মেলানো হয় (pathname-এ locale prefix থাকে)

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

> ⚠️ **SUPERSEDED (২০২৬-০৯-২৪):** এই PART 9-এর বিস্তারিত পরিকল্পনা
> উপরে line 129-এ আছে (9a-9j — ৯টা sub-step টেবিল সহ)। নিচের অংশটা
> শুধু ঐতিহাসিক রেফারেন্স।

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

**সর্বশেষ আপডেট:** Part 5 চলমান — ২০২৬-০৯-২৩
## 🟢 PART 5c-এর রিপোর্ট (সম্পন্ন — ২০২৬-০৯-২৩)

### কী করা হয়েছে
- `components/LanguageTabs.tsx` ও `LanguageTabsServer.tsx` — আগের সেশনেই locale-aware হয়ে গেছে (useDict, pickOr দিয়ে titleBn/titleEn) ✅
- `components/HeroSection.tsx`-এ ৪টা ছোট edit:
  ১) `import { useDict } from '@/lib/i18n/I18nProvider'` যোগ
  ২) কম্পোনেন্টের ভেতরে `const dict = useDict()`
  ৩) `useState(INITIAL_CODE)` → `useState({ ...INITIAL_CODE, html: dict.heroDemo.html, js: dict.heroDemo.js })`
  ৪) টাইপিং লাইন → `dict.heroDemo.typing1` / `dict.heroDemo.typing2`
- `components/HeroSection.tsx.bak` ব্যাকআপ নেওয়া হয়েছে
- **যা ছোঁয়া হয়নি (ইচ্ছাকৃত):** হেডিং/ব্যাজ/সাবটাইটেল/বাটন/স্ট্যাট লেবেল (ওগুলো DB থেকে আসে → Part 6-এর কাজ), CSS ডেমো, `npm create devschool@latest` কমান্ড

### যাচাই
- grep-এ `dict.heroDemo` ৪ জায়গায় বসেছে ✅
- পুরনো `INITIAL_CODE`-এর বাংলা html/js fallback হিসেবে রয়ে গেছে (ইচ্ছাকৃত)
- `npx tsc --noEmit` — ❌ fail (Part 1 থেকে প্রত্যাশিত; বিস্তারিত error ফিল্টার করে দেখতে হবে)

### সতর্কতা
- সাইট এখনো ভাঙা — Part 6 পর্যন্ত deploy / GitHub push নিষেধ

## 🟢 PART 5d-এর রিপোর্ট (সম্পন্ন — ২০২৬-০৯-২৩)

### নতুন dictionary কী যোগ (tutorial ঘরে, bn + en দুইটাতেই)
`navLabel`, `emptyChapters`, `collapse`, `expand`, `run`, `editor`, `editorTitle`, `close`

### কোন ফাইলে কী হলো
| ফাইল | কাজ |
|---|---|
| `TutorialShell.tsx` | কিছুই না — কোনো UI লেখা নেই, layout-only ✅ |
| `LessonContent.tsx` | কিছুই না — শুধু marker পার্স করে ✅ |
| `LessonSidebar.tsx` | ৩টা লেখা dict থেকে — navLabel, emptyChapters, collapse/expand |
| `TryIt.tsx` | ৪টা লেখা dict থেকে — run (label default), close, editor, editorTitle |

### যাচাই
- `dict.tutorial` এখন ৭ জায়গায় বসেছে ✅
- পুরনো হার্ডকোড বাংলা লেখা শুধু dictionary ফাইলে আছে ✅
- `npx tsc --noEmit` — ❌ fail (Part 1 থেকে প্রত্যাশিত)
- ব্যাকআপ: bn.ts.bak, en.ts.bak, LessonSidebar.tsx.bak, TryIt.tsx.bak ✅

### Git commit
`394eb1c` — feat(i18n): Part 5c+5d — HeroSection demo + Tutorial components use dictionary

## 🟢 PART 5e-1-এর রিপোর্ট (সম্পন্ন — ২০২৬-০৯-২৩)

### 🔎 বড় আবিষ্কার
- `app/layout.tsx` **নেই** — `app/[locale]/layout.tsx`-ই একমাত্র মূল layout।
- তাই root metadata locale-aware করা সহজ ছিল।
- `app/not-found.tsx` মূল [locale]-এর বাইরে → ভাষা জানতে client-side URL দরকার।

### নতুন dictionary কী
- `error`: statusPill, bigTitle, bigMessage, tryAgain, homePage, footerText
- `notFound`: metaTitle, metaDescription, statusPill, bigTitle, bigMessage, backHome, searchSomething, popularLabel, linkTutorials/Challenges/References/Search, footerText
- নতুন `meta` ঘর: siteTitle, siteDescription

### কোন ফাইলে কী হলো
| ফাইল | কাজ |
|---|---|
| `lib/i18n/dictionaries/bn.ts` + `en.ts` | উপরের কী যোগ |
| `app/[locale]/layout.tsx` | স্থির metadata → locale-aware `generateMetadata` + hreflang |
| `components/NotFoundContent.tsx` | **নতুন** — client-side URL দেখে ভাষা |
| `app/not-found.tsx` | slim — client component-এ metadata চলে না |
| `app/[locale]/(site)/error.tsx` | ৬টা লেখা dict থেকে |

### যাচাই
- `npx tsc --noEmit 2>&1 | findstr "NotFoundContent layout.tsx not-found error.tsx"` — **খালি** ✅
- `dict.error` ৬ জায়গায়, `dict.tutorial` ৭, `dict.heroDemo` ৪ ✅
- ব্যাকআপ: ৫টা `.bak` ✅

### সাইড-নোট (5e-3-এর জন্য)
- `challenges/error.tsx` ও `references/error.tsx`-এও হার্ডকোড "কিছু একটা ভুল হয়েছে" আছে — 5e-3-তে ঠিক হবে।

## 🟢 PART 5e-2-এর রিপোর্ট (সম্পন্ন — ২০২৬-০৯-২৩)

### কী করা হয়েছে
- `app/[locale]/(site)/tutorials/page.tsx` — locale-aware generateMetadata (hreflang সহ), locale + dict; DB ত্রুটি বার্তা, DB error ব্লক, JSON-LD, Breadcrumb, হিরো শিরোনাম/বর্ণনা, ৩টা StatCard — সব `dict.listing` থেকে
- `app/[locale]/(site)/page.tsx` (Home) — ইতিমধ্যেই `dict.home` (২৪ জায়গায়) + `dict.homeError` ব্যবহার করছিল; যাচাই করে নিশ্চিত হলাম ✅

### নতুন dictionary কী
- `listing` ঘর (bn + en): breadcrumbHome, tutorialsTitle, tutorialsSubtitle, statTutorials/Chapters/References, dbConnectError, backHome, dbErrNoConn/NoTable/Generic, emptyTutorials
- `home` ও `homeError` ঘর আগেই bn+en-এ ছিল (আগের সেশনের কাজ)

### যাচাই
- `dict.listing` ১১ জায়গায় ✅
- `dict.home` ২৪ জায়গায়, `dict.homeError` ৬ জায়গায় ✅
- ফাইল CRLF — তাই edit-এ CRLF দেওয়া হয়েছে (২টা edit প্রথমে fail → CRLF দিয়ে ঠিক)
- ব্যাকআপ: ৪টা `.bak` ✅

## 🟢 PART 5e-3-এর রিপোর্ট (আংশিক — ২০২৬-০৯-২৩)

### সম্পন্ন: references + challenges
| ফাইল | কাজ |
|---|---|
| `references/page.tsx` | locale-aware metadata + hreflang, DB err, JSON-LD, breadcrumb, hero, stat, empty |
| `references/ReferencesFilter.tsx` | client — useDict, placeholder, filter/sort labels, count, empty, detailsSoon |
| `references/error.tsx` | useDict — title, message, tryAgain, homePage |
| `challenges/page.tsx` | locale-aware metadata + hreflang, DB err, JSON-LD, breadcrumb, hero, stat, empty |
| `challenges/ChallengeFilter.tsx` | client — useDict, search, allOption, count, clear, empty, solve, pts |
| `challenges/error.tsx` | useDict — title, message, tryAgain, homePage |

### নতুন dictionary কী
- `references` ঘর (bn+en): metaTitle, metaOgTitle, metaDescTpl, heroTitle, heroSubtitle, statReferences, statLanguages, jsonLdName, jsonLdDescTpl, errNoConn/NoTable/Generic, emptyTitle, emptyDesc, searchPlaceholder, searchAria, countTpl, viewAll, filterLanguage, allLanguages, sortAria, sortTitle, sortLanguage, filteredLabel, clearFilters, noResultsTitle, noResultsDesc, detailsSoon, errorTitle, errorMessage
- `challenges` ঘর (bn+en): metaTitle, metaOgTitle, metaDescTpl, heroTitle, heroSubtitle, statChallenges, jsonLdName, jsonLdDescTpl, errNoConn/NoTable/Generic, emptyTitle, emptyDesc, searchPlaceholder, searchAria, allOption, filterClear, noResultsTitle, noResultsDiffDesc, viewAll, solve, pts, errLoadTitle, errLoadMsg

### বাকি (5e-3-এর অংশ)
- tools, playground, progress, search, about পেজ + slug not-found/error পেজ

## 🟢 PART 5e-3-এর রিপোর্ট (প্রায় সম্পন্ন — ২০২৬-০৯-২৩)

### সম্পন্ন (এই সেশনে)
| ফাইল | কাজ |
|---|---|
| `references/*` (৩ ফাইল) | ✅ শেষ |
| `challenges/*` (৩ ফাইল) | ✅ শেষ |
| `tools/page.tsx` + `ToolsGrid.tsx` | ✅ শেষ |
| `playground/page.tsx` | ✅ শেষ (PlaygroundClient বাকি?) |
| `progress/page.tsx` | ✅ শেষ (ProgressClient বাকি?) |
| `search/page.tsx` | ✅ শেষ (SearchClient বাকি) |

### নতুন dictionary ঘর (bn+en)
- `references`, `challenges`, `tools`, `playground`, `progress`, `search`

### ⚠️ বাকি (5e-3)
1. **`search/SearchClient.tsx`** — ট্যাব লেবেল, placeholder, রেজাল্ট টেক্সট (client component)
2. **`playground/PlaygroundClient.tsx`** — ডেমো কোড, বাটন (client)
3. **`progress/ProgressClient.tsx`** — লেখা (client)
4. **`about/page.tsx`** — ⚠️ এখনো placeholder (`Page: about`), আসল পেজ বানানো হয়নি
5. **slug not-found/error পেজ** — `tutorials/[slug]/not-found.tsx`, `tutorials/[slug]/[chapter]/error.tsx`, `tutorials/[slug]/[chapter]/not-found.tsx`, `references/[slug]/not-found.tsx`, `challenges/[id]/not-found.tsx`

## 🟢 PART 5e-3-এর চূড়ান্ত রিপোর্ট (সম্পন্ন — ২০২৬-০৯-২৩)

### কী কী শেষ হলো

**১) dictionary-তে ৪টা নতুন সেকশন যোগ (bn.ts + en.ts):**
- `searchUi` — ট্যাব লেবেল, placeholder, জনপ্রিয়, clear, resultCount, noResults
- `playgroundUi` — editorLoading, run, running, copy, copied, cssPreview
- `progressUi` — ১৬টি key (loadError, retry, emptyTitle/Desc, viewChallenges/Tutorials, quizAccuracy, challengePassed, totalPoints, quizPerformance, recentActivity, passed, failed, refresh)
- `about` — heroTitle, mission, vision, values, contact
- `slugPages` — tutorial/reference/challenge/chapter এর not-found ও error লেখা

**২) ৩টা client component locale-aware:**
| ফাইল | পরিবর্তন |
|---|---|
| `search/SearchClient.tsx` | `useDict()` — tabs, placeholder, aria, popular, resultCount, noResults |
| `playground/PlaygroundClient.tsx` | `useDict()` + `PlaygroundLoadingLabel` wrapper (Monaco loading hook-এর জন্য) |
| `progress/ProgressClient.tsx` | `useDict()` + `useLocale()` — ১৬টি লেখা + তারিখ EN/Bn |

**৩) About পেজ সরানো:**
- পুরনো: `app/[locale]/about/page.tsx` (placeholder) → **মুছে দেওয়া**
- নতুন: `app/[locale]/(site)/about/page.tsx` — Home-এর মতো গ্রিন-গ্লো স্টাইলে, Header/Footer সহ, দুই ভাষার

**৪) slug not-found/error পেজ (৮টা ফাইল):**
- `tutorials/[slug]/not-found.tsx` — client-side locale ✅
- `tutorials/[slug]/error.tsx` — **নতুন** ✅
- `tutorials/[slug]/[chapter]/not-found.tsx` — client-side locale ✅
- `tutorials/[slug]/[chapter]/error.tsx` — locale-aware ✅
- `references/[slug]/not-found.tsx` ✅ + `error.tsx` **নতুন** ✅
- `challenges/[id]/not-found.tsx` ✅ + `error.tsx` **নতুন** ✅

### গুরুত্বপূর্ণ প্যাটার্ন (ভবিষ্যতের জন্য)
- **not-found.tsx** → client component + `usePathname()` দিয়ে locale detect (কারণ not-found এ params পায় না)
- **error.tsx** → client component + `useDict()`/`useLocale()` (layout-এর I18nProvider থেকে)

### tsc যাচাই
- `npx tsc --noEmit` → **fail (প্রত্যাশিত)** — পুরনো Part 1-এর `tutorial.title` ইস্যু, Part 6-এ ঠিক হবে

**পরবর্তী কাজ:** PART 5e-4 — detail পেজ (tutorials/[slug], [chapter], references/[slug], challenges/[id])-এ ডেটাবেস থেকে ভাষা-সঠিক titleBn/En দেখানো। (home, tutorials, references, challenges, playground, progress, search, tools, about) + `not-found.tsx` + `error.tsx`
