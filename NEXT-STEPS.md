# 🎯 NEXT STEPS — DevSchool (পরবর্তী কাজের গাইড)

> **এই ফাইলটি কী?** পরের কাজ কী কী — সেটা সহজ বাংলায় গুছিয়ে লেখা।
> নতুন কোনো AI বা ডেভ এই ফাইল পড়লেই বুঝবে এখন কোথায় আছি, এরপর কী করতে হবে।

**শেষ আপডেট:** ২০২৬-০৯-২৬
**বর্তমান অবস্থান:** PART 10 (Seed/content workflow) ✅ সম্পূর্ণ — PART 11 (চূড়ান্ত টেস্ট) শুরু হয়নি।

---

## 📌 প্রজেক্টের বর্তমান অবস্থা (এক নজরে)

| বিষয় | অবস্থা |
|-------|--------|
| **প্রজেক্ট** | DevSchool — W3Schools-এর মতো টিউটোরিয়াল সাইট |
| **লোকেশন** | `C:\Users\Naiem\Desktop\devschool` |
| **Tech Stack** | Next.js 16.3.4 (App Router), React 19.2.8, Prisma 5.22 + PostgreSQL (Supabase), Tailwind 4, Zod 3.23 |
| **Public সাইট** | দুই ভাষায় (bn + en) — `/bn/...`, `/en/...` |
| **Admin Panel** | শুধু বাংলায় (dual-input form: Bn + En) |
| **Database** | Prisma schema-তে দুই ভাষার কলাম; Prisma `@map` দিয়ে পুরনো ডেটা নিরাপদ |
| **Content file** | ৭টা chapter বাংলা `.md` + ৭টা ইংরেজি `.en.md` |
| **তsc error** | ০ |
| **Build** | সফল — ৫৪ পেজ |
| **Git state** | Local commit — GitHub push **নিষেধ** |

---

## ✅ কী কী সম্পন্ন হয়েছে (Part 0 → Part 10)

| Part | কাজ | Commit |
|------|-----|--------|
| 0 | প্রজেক্ট পড়া ও প্রস্তুতি | — |
| 1 | Prisma schema-তে দুই ভাষার ঘর | `9ff722c` |
| 2 | i18n ভিত্তি (config, locale, dictionary, pick) | — |
| 3 | `proxy.ts`-এ ভাষা দারোয়ান | — |
| 4 | সব পেজ `/[locale]/`-এ | — |
| 5 | সব লেখা dictionary-তে | `394eb1c` |
| 6 | DB থেকে ভাষা-সঠিক লেখা | `a6a17f6` |
| 7 | Header EN / বাং বাটন | — |
| 7.5 | Console fix + locale-aware hero + /en ComingSoon | — |
| 8 | SEO (hreflang, canonical, sitemap, robots) | `745ddfd`, `7211e9d` |
| 9 | Admin dual-input (9a-9j) | `039d9b8`-এর আগে |
| 10 | Seed/content workflow (10a-10e) | `039d9b8`, `c3e9153`, + পরের commit |

---

## 🚀 পরবর্তী কাজ — PART 11: চূড়ান্ত টেস্ট চেকলিস্ট

### 🎯 লক্ষ্য
পুরো সাইট হাতে ঘুরে যাচাই করা — public page, admin, দুই ভাষা, সিদ্ধান্ত নেওয়া সব ঠিক আছে কিনা।

### 📋 ধাপে ধাপে checklist

#### ১) স্ট্যাটিক যাচাই (কোড-স্তর)
- [ ] `npx tsc --noEmit` → ০ error
- [ ] `npm run build` → সফল (৫৪ পেজ)
- [ ] `npm run lint` → কোনো warning/error নেই

#### ২) Dev server চালু করে যাচাই
- [ ] `npm run dev` চালু
- [ ] `/bn` আর `/en` — দুই হোম পেজ ঠিকভাবে খুলছে

#### ৩) Public সাইট হাতে ঘুরে দেখা
- [ ] Tutorials listing (`/bn/tutorials` ও `/en/tutorials`) — উভয় ভাষার chapter ঠিক দেখাচ্ছে
- [ ] Tutorial detail (`/bn/tutorials/html` ও `/en/tutorials/html`) — বাংলা ও ইংরেজি আলাদা
- [ ] Chapter (`/bn/tutorials/html/introduction`, `/en/...`) — titleBn/titleEn আলাদা
- [ ] Lesson page-এ Try It ব্লক কাজ করছে
- [ ] References listing + detail
- [ ] Challenges listing + detail
- [ ] Playground, Progress, Search, Tools sub-pages
- [ ] Header-এ EN | বাং টগল — ভাষা বদলায় + cookie save হয়
- [ ] Hreflang meta tag — `/bn/...` পেজে en ভার্সনের link আছে
- [ ] Sitemap (`/sitemap.xml`) — দুই ভাষার URL
- [ ] Robots (`/robots.txt`) — admin/api disallow

#### ৪) Admin Panel যাচাই
- [ ] `/admin/login` — লগইন কাজ করে
- [ ] Tutorial create — Bn + En দুটোই সেভ হয়
- [ ] Chapter/Group/Lesson create — Bn + En
- [ ] Reference, Challenge, Quiz — Bn + En required check
- [ ] Site Settings — Hero (Bn+En), Footer (Bn+En), FAQ (Bn+En)
- [ ] পুরনো record যেগুলোতে `*En` খালি — re-save করলে ইংরেজি দিতে বাধ্য করে (এটা expected — হাতে ভরে দিতে হবে)

#### ৫) Git
- [ ] সব পরিবর্তন local commit করা
- [ ] GitHub-এ **push নয়** (ইউজারের সিদ্ধান্ত)

---

## ⚠️ এখনো বাকি থাকা ছোট কাজ (Part 11-এর বাইরে)

| # | কাজ | কেন দরকার |
|---|------|-----------|
| ১ | **tools/* sub-pages locale-aware করা** (8d — স্থগিত) | `/bn/tools/base64`, `/en/tools/base64` — canonical, metadata, hero localization |
| ২ | **`robots.ts` থেকে `/bn/tools/` ও `/en/tools/` disallow সরানো** | tools localized হলে temporary disallow আর দরকার নেই |
| ৩ | **`HomeExtras.tsx`-এর hardcoded বাংলা** | BENTO/ROADMAP সেকশনের লেখা dictionary-তে নেওয়া |
| ৪ | **পুরনো DB-রেকর্ড যেসব `*En` = বাংলা-copy** | Admin panel থেকে re-save করে সঠিক ইংরেজি বসানো |
| ৫ | **`prisma/seed.ts`** | পুরনো ডেমো ডেটা — বাদ দেওয়া হয়েছে; দরকার হলে নতুন `.md`-ভিত্তিক seeder-ই ব্যবহার হবে |

---

## 🛠️ গুরুত্বপূর্ণ কমান্ড (দরকারে)

```bash
# Type check
npx tsc --noEmit

# Production build
npm run build

# Dev server
npm run dev

# Bilingual seeder (সব course)
npm run seed:course

# শুধু css / নির্দিষ্ট chapter
npm run seed:course -- css
npm run seed:course -- html 01

# পুরনো lesson মুছতে চাইলে (সাবধান — ডিফল্টে মুছবে না)
npm run seed:course -- --prune

# Admin user তৈরি
npm run seed:admin
```

---

## 🔴 স্থায়ী নিয়মাবলি (নতুন AI-এর জন্য)

1. **ইউজার কোড বোঝেন না** — সব ব্যাখ্যা সহজ বাংলায় + real-life উদাহরণ দিয়ে করতে হবে।
2. **অনুমতি ছাড়া কোনো ফাইল ছোঁব না** — edit/create/delete করার আগে ইউজারকে সহজ বাংলায় বুঝিয়ে অনুমতি চাইতে হবে।
3. **GitHub-এ push নিষেধ** — শুধু local commit।
4. **প্রতিটা Part শেষে:** `tsc --noEmit` + `npm run build` চেক করতে হবে।
5. **`enbn.md` আপডেট করতে হবে** — অগ্রগতি ট্র্যাকার সেকশনে।
6. **বাংলা কমেন্ট ঠিক আছে**, কিন্তু ফাইল/ভেরিয়েবল/ফাংশনের নাম ইংরেজিতে।
7. **`.bak` ব্যাকআপ** — বড় পরিবর্তনের আগে।
8. **Slug সবসময় ইংরেজিতে** — বাংলা পেজ বা ইংরেজি পেজ, একই ইংরেজি slug।

---

## 📞 জরুরি তথ্য

- **প্রজেক্ট মালিকের ভাষা:** বাংলা (সহজ করে বুঝিয়ে দিতে হবে)
- **প্রধান ট্র্যাকার ফাইল:** `enbn.md` (এখানে সব Part-এর বিস্তারিত রিপোর্ট)
- **Part 10-এর মূল প্ল্যান:** `PART-10-PLAN.md`
- **এই ফাইল:** `NEXT-STEPS.md` — এখনকার অবস্থা ও পরের কাজের সারসংক্ষেপ

---

## 🎯 এক লাইনে: এখন কী করব?

> **Part 11 শুরু করো** — উপরের checklist ধরে ধরে হাতে ঘুরে সব যাচাই করো। কোনো ভুল পেলে সাথে সাথে ঠিক করো। শেষে local commit করো (push নয়)।

---

**সব কাজ শেষ হলে:** সাইট deploy-এর জন্য প্রস্তুত হবে (তবে deploy করতে হলে ইউজারের স্পষ্ট অনুমতি লাগবে)।
