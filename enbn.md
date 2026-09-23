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
| 6 | ডেটাবেস থেকে ভাষা-সঠিক লেখা (fallback) | 🔄 চলছে (ধাপ ১-৬ শেষ ✅ — components-ও locale-aware প্রমাণিত; এখন পেজের হার্ডকোড লেখা → dictionary, admin/scripts বাকি) |
| 7 | হেডারে EN / বাং বাটন | ⏸️ শুরু হয়নি |
| 8 | SEO (hreflang, canonical, sitemap) | ⏸️ শুরু হয়নি |
| 9 | Admin panel-এ দুই ভাষার ইনপুট | ⏸️ শুরু হয়নি |
| 10 | Seed / content workflow | ⏸️ শুরু হয়নি |
| 11 | চূড়ান্ত টেস্ট | ⏸️ শুরু হয়নি |

**বর্তমান অবস্থান:** Part 6 ধাপ ১-৬ সম্পন্ন ✅ (localize.ts helper + tutorial-data.ts + tutorials/[slug] + [chapter] + [lesson] + tryit দুটো — সব locale-aware, strict no-fallback, redirect-এ locale যুক্ত)। tsc error ~২৬৩ → ~১৯১। **ধাপ ৬ (components) চেক করা হয়েছে — আসলেই locale-aware ✅** (details নিচের রিপোর্টে)। পরের কাজ: **ধাপ ৭ — টিউটোরিয়াল/চ্যালেঞ্জ/রেফারেন্স/টুলস পেজের হার্ডকোড বাংলা লেখা dictionary-তে আনা** (যেমন "হোম", "টিউটোরিয়াল", "এই টিউটোরিয়ালে যা যা শিখবেন")।

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
