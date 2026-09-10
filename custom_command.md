Frontend-এ Prisma রেখে Server Components ব্যবহার করুন — এটি সবচেয়ে দ্রুত ও নিরাপদ।
✅ নিরাপত্তার জন্য যা করবেন:
.env ফাইল কখনো Git-এ আপলোড করবেন না (.gitignore-এ রাখুন)।

Prisma Client শুধু Server Components-এ ইম্পোর্ট করবেন (কখনো Client Component-এ নয়)।

API Routes-এ ইনপুট ভ্যালিডেশন (Zod ব্যবহার করুন)।

Rate Limiting যোগ করুন (ভবিষ্যতে)।

✅ গতির জন্য যা করবেন:
prisma.findMany()-এ শুধু প্রয়োজনীয় ফিল্ড আনুন (select বা include সঠিকভাবে ব্যবহার করুন)।

Caching ব্যবহার করুন (Next.js-এর fetch বা React Cache)।

ডাটাবেসে Index যোগ করুন (Prisma schema-তে @@index ব্যবহার করুন)।


Next.js-এ ৪টি প্রধান Caching স্তর আছে:

স্তর	কাজ	কোথায় হয়
Data Cache	fetch()-এর ডেটা সার্ভারে সংরক্ষণ করে	Server Components, API Routes
Full Route Cache	পুরো পেজের HTML ক্যাশে করে (SSG/ISR)	Static Routes (page.tsx)
Router Cache	ব্রাউজারে পেজ ডেটা ক্যাশে করে (Client-side Navigation)	ব্রাউজার (Link ক্লিক)
React cache()	একই রিকোয়েস্টে ডুপ্লিকেট query আটকায়	Server Components
🎯 আপনার প্রোজেক্টে প্রতিটি পেজের জন্য Caching Strategy
১. হোমপেজ (/)
ব্যবহার:

revalidate: 86,400 (24 ঘন্টা) → ISR (Incremental Static Regeneration)

React cache() → ডুপ্লিকেট ডেটা ফেচ আটকাতে
কারণ:

হোমপেজে ক্যাটাগরি ও জনপ্রিয় টিউটোরিয়াল একই রিকোয়েস্টে বারবার ফেচ হতে পারে — cache() একবার ডাটাবেসে গিয়ে ফলাফল মেমোরিতে রেখে দেয়।

revalidate দিয়ে পেজটি 24 ঘন্টা পর পুনরায় জেনারেট হয়, নতুন কন্টেন্ট অটো দেখায়।

২. ক্যাটাগরি লিস্টিং পেজ (/categories/[slug])
ব্যবহার:

generateStaticParams → সব ক্যাটাগরির জন্য প্রি-রেন্ডার

revalidate: 3600 → ১ ঘন্টা পর আপডেট
কারণ:

প্রতিটি ক্যাটাগরি পেজ আলাদা, তাই generateStaticParams দিয়ে বিল্ড টাইমে সব পেজ তৈরি করে ফেলি।

নতুন টিউটোরিয়াল যোগ করলে ১ ঘন্টা পর পেজ আপডেট হবে।

৩. টিউটোরিয়াল ডিটেইল পেজ (/tutorials/[slug])
ব্যবহার:

generateStaticParams → সব টিউটোরিয়ালের জন্য প্রি-রেন্ডার

revalidate: 86400 (২৪ ঘন্টা) → কারণ টিউটোরিয়াল কন্টেন্ট খুব কম পরিবর্তিত হয়
কারণ:

টিউটোরিয়াল কন্টেন্ট স্থিতিশীল, তাই ২৪ ঘন্টা রি-বিল্ড যথেষ্ট।

generateStaticParams সব পেজ প্রি-রেন্ডার করে, ফলে লোড দ্রুত হয়।

৪. API Routes (যদি ব্যবহার করেন)
ব্যবহার:

Response-এ Cache-Control হেডার সেট করুন
কারণ:

CDN বা Vercel Edge Network-এ API রেসপন্স ক্যাশে হয়, ফলে পরবর্তী রিকোয়েস্ট দ্রুত হয়।

৫. React cache() ফাংশন (সব Server Component-এর জন্য)
ব্যবহার:

যেসব ডেটা ফেচিং ফাংশন একাধিক জায়গায় ব্যবহার হয়, সেগুলোকে cache() দিয়ে র‍্যাপ করুন।
কারণ:

একই রিকোয়েস্টে একই ডেটা বারবার ফেচ করা আটকায় — ডাটাবেসের চাপ কমায়।
সারাংশ টেবিল (পেশাদারদের জন্য)
পেজ / কম্পোনেন্ট	Caching Method	কোডে কী দেবেন?	Revalidate Time
হোমপেজ (/)	ISR + React cache()	export const revalidate = 3600 + cache()	১ ঘন্টা
ক্যাটাগরি পেজ (/categories/[slug])	ISR + generateStaticParams	revalidate: 3600 + generateStaticParams	১ ঘন্টা
টিউটোরিয়াল ডিটেইল (/tutorials/[slug])	ISR + generateStaticParams	revalidate: 86400 + generateStaticParams	২৪ ঘন্টা
API Routes	Cache-Control Header	Cache-Control: s-maxage=3600	১ ঘন্টা
ডুপ্লিকেট কোয়েরি	React cache()	cache(async () => { ... })	—
🔐 নিরাপত্তা ও গতির জন্য অতিরিক্ত টিপস
.env ফাইল Git-এ আপলোড করবেন না (.gitignore-এ রাখুন)।

Prisma Client শুধু Server Components / API Routes-এ ইম্পোর্ট করুন — Client Component-এ নয়।

API Routes-এ ইনপুট ভ্যালিডেশন করতে Zod ব্যবহার করুন।

ডাটাবেসে Index যোগ করুন (Prisma schema-তে @@index) — যেমন slug, views, createdAt-এ।






# 🚀 DevSchool – সম্পূর্ণ প্রফেশনাল ডেভেলপমেন্ট ডকুমেন্টেশন

**সংস্করণ:** 1.0  
**প্রস্তুতকারক:** [আপনার নাম]  
**তারিখ:** [বর্তমান তারিখ]

---

## ১. প্রকল্পের সারাংশ (Project Overview)

**DevSchool** একটি W3Schools-স্টাইলের আধুনিক, ফ্রি ও ইন্টারঅ্যাকটিভ লার্নিং প্ল্যাটফর্ম। এটি বাংলা ও ইংরেজি ভাষায় প্রোগ্রামিং টিউটোরিয়াল, লাইভ কোড প্লেগ্রাউন্ড, MCQ কুইজ, কোড চ্যালেঞ্জ ও রেফারেন্স ডকুমেন্টেশন সরবরাহ করে। কোনো লগইন বাধ্যতামূলক নয় – সবকিছু সম্পূর্ণ ওপেন এবং ফ্রি। সাইটটি বিজ্ঞাপন ও দানের মাধ্যমে পরিচালিত হবে।

**মূল লক্ষ্য:**  
- বাংলাভাষী প্রোগ্রামিং শিক্ষার্থীদের জন্য বিশ্বমানের কন্টেন্ট তৈরি করা।  
- প্রযুক্তি শেখার বাধা দূর করা (পেমেন্ট, লগইন, ভাষা)।

---

## ২. ব্যবসায়িক উদ্দেশ্য ও সমস্যা সমাধান (Business Objectives)

| **সমস্যা** | **আমাদের সমাধান** |
|------------|-------------------|
| বাংলায় ভালো মানের ফ্রি টিউটোরিয়ালের অভাব | সম্পূর্ণ বাংলা+ইংরেজি মিশ্র টিউটোরিয়াল |
| W3Schools-এর মতো সাইটে বাংলা কন্টেন্ট নেই | নিজস্ব বাংলা কন্টেন্ট তৈরি |
| লগইন/পেমেন্ট বাধ্যতামূলক | কোনো লগইন নেই, সব ওপেন |
| টেকসই আয়ের অভাব | Google AdSense + ডোনেশন (SSLCommerz/Stripe) |

---

## ৩. টার্গেট ইউজার ও তাদের রোল (Target Users & Roles)

| **রোল** | **বিবরণ** | **কী করতে পারবে** |
|---------|-----------|-------------------|
| **অ্যাডমিন** | সাইটের একমাত্র মালিক (আপনি) | টিউটোরিয়াল, কুইজ, চ্যালেঞ্জ, রেফারেন্স যোগ/সম্পাদনা/ডিলিট (বর্তমানে Prisma Studio এর মাধ্যমে) |
| **গেস্ট ইউজার** | যে কেউ সাইট ভিজিট করবে | সব টিউটোরিয়াল, প্লেগ্রাউন্ড, কুইজ, চ্যালেঞ্জ, রেফারেন্স ব্যবহার করতে পারবে (লগইন ছাড়াই) |
| **ডোনার** | যে কেউ দান করতে চায় | SSLCommerz/Stripe বা bKash এর মাধ্যমে দান করতে পারবে |

> **নিরাপত্তা সতর্কতা:** যেহেতু কোনো অথেনটিকেশন নেই, তাই অ্যাডমিন প্যানেল বা মিউটেশন API রাউটগুলোকে **সিক্রেট API কী** বা **মিডলওয়্যার** দিয়ে সুরক্ষিত রাখতে হবে। (বিস্তারিত সুরক্ষা বিভাগে)

---

## ৪. সম্পূর্ণ ফিচার লিস্ট (Feature List)

### 🔥 মাস্ট-হ্যাভ ফিচার (বাধ্যতামূলক)

| **নং** | **ফিচার** | **বিবরণ** |
|--------|-----------|-----------|
| 1 | টিউটোরিয়াল সিস্টেম | ক্যাটাগরি অনুযায়ী টিউটোরিয়াল (শিরোনাম, কন্টেন্ট, ডিফিকাল্টি লেভেল, ভিউ কাউন্ট) |
| 2 | ইন্টারঅ্যাকটিভ কোড প্লেগ্রাউন্ড | Monaco Editor (VS Code ইঞ্জিন) দিয়ে HTML/CSS/JS লাইভ এডিট ও আউটপুট |
| 3 | কুইজ সিস্টেম | টিউটোরিয়ালের নির্দিষ্ট লাইনের পর (অ্যাডমিন কনফিগারেবল) ৫-১০টি MCQ; সঠিক উত্তরে অটোসবাজি অ্যানিমেশন |
| 4 | কোড চ্যালেঞ্জ | টিউটোরিয়ালের সাথে সংযুক্ত; ইউজার কোড সাবমিট করলে টেস্ট কেস চেক করে ফিডব্যাক |
| 5 | রেফারেন্স ডকুমেন্টেশন | ট্যাগ, ফাংশন, মেথডের বিস্তারিত ডকুমেন্টেশন (ডিকশনারি স্টাইলে) |
| 6 | রেসপনসিভ ডিজাইন | মোবাইল, ট্যাব, ডেস্কটপ – সব ডিভাইসে সঠিক কাজ করবে |
| 7 | ডার্ক/লাইট মোড | ইউজার নিজের পছন্দমতো থিম পরিবর্তন করতে পারবে |
| 8 | অ্যাড স্পেস | Google AdSense বা কাস্টম ইমেজ অ্যাড বসানোর জায়গা |
| 9 | ডোনেশন সিস্টেম | SSLCommerz/Stripe ইন্টিগ্রেশন (গেস্ট চেকআউট) |
| 10 | সার্চ ফাংশন | টিউটোরিয়াল ও রেফারেন্সে দ্রুত ও সিকিউর সার্চ (PostgreSQL Full-Text Search বা আলাদা সার্চ ইঞ্জিন) |

### 🚀 ভবিষ্যৎ ফিচার (Future Plan)

| **নং** | **ফিচার** | **বিবরণ** |
|--------|-----------|-----------|
| 11 | ইউজার প্রগ্রেস ট্র্যাকিং | লগইন সিস্টেম যোগ করলে |
| 12 | সার্টিফিকেট জেনারেশন | কোর্স শেষে ডাউনলোডযোগ্য সার্টিফিকেট |

---

## ৫. ইউজার ফ্লো / জার্নি (User Flow)

1. **হোমপেজে প্রবেশ** → ক্যাটাগরি ও জনপ্রিয় টিউটোরিয়াল দেখে।  
2. **ক্যাটাগরি নির্বাচন** → সেই ক্যাটাগরির সব টিউটোরিয়ালের তালিকা দেখে।  
3. **টিউটোরিয়াল পড়া** → কন্টেন্ট পড়ে, পাশের সাইডবারে অধ্যায়ের তালিকা দেখে।  
4. **প্লেগ্রাউন্ড ব্যবহার** → লাইভ কোড এডিটরে কোড লিখে আউটপুট দেখে।  
5. **কুইজ দেওয়া** → টিউটোরিয়ালের মাঝে বা শেষে MCQ উত্তর দেয়; সঠিক উত্তরে অটোসবাজি অ্যানিমেশন দেখে।  
6. **চ্যালেঞ্জ সাবমিট** → কোড লিখে সাবমিট করলে টেস্ট কেস চেক হয়ে ফিডব্যাক পায়।  
7. **রেফারেন্স দেখা** → প্রয়োজনে ট্যাগ/ফাংশনের ডকুমেন্টেশন দেখে।  
8. **দান করা** → চাইলে ডোনেশন বাটন থেকে দান করে (অ্যাডমিন প্যানেল থেকে অন/অফ করা যাবে)।

**অ্যাডমিন ফ্লো (বর্তমান):**  
- Prisma Studio বা pgAdmin দিয়ে ডাটাবেসে সরাসরি এন্ট্রি যোগ/সম্পাদনা/ডিলিট।  
- (ভবিষ্যতে একটি ডেডিকেটেড অ্যাডমিন ড্যাশবোর্ড তৈরি করা যেতে পারে।)

---

## ৬. ডিজাইন ও ইউজার ইন্টারফেস (Design & UI)

### থিম ও কালার

- **প্রাইমারি কালার:** ইন্ডিগো/পার্পল গ্রেডিয়েন্ট (`from-indigo-600 to-purple-600`)  
- **লাইট মোড:** ব্যাকগ্রাউন্ড সাদা, টেক্সট ধূসর  
- **ডার্ক মোড:** ব্যাকগ্রাউন্ড `#0a0a0a`, টেক্সট হালকা ধূসর  
- **অ্যাকসেন্ট:** ইন্ডিগো, হলুদ (হিরোতে)

### ডিজাইন সিস্টেম

- **টাইপোগ্রাফি:** Geist Font (Next.js ডিফল্ট)  
- **কম্পোনেন্ট:** Tailwind CSS (`dark:` ক্লাস ব্যবহার করে)  
- **কার্ড:** রাউন্ডেড, হোভার ইফেক্ট (শ্যাডো + স্কেল)  
- **বাটন:** রাউন্ডেড, গ্রেডিয়েন্ট, হোভার ইফেক্ট  
- **সাইডবার:** টিউটোরিয়াল পেজে বাম পাশে, অধ্যায়ের তালিকা

### লেআউট

- **হোমপেজ:** হিরো সেকশন → ক্যাটাগরি কার্ড → জনপ্রিয় টিউটোরিয়াল → সর্বশেষ টিউটোরিয়াল  
- **ক্যাটাগরি পেজ:** ক্যাটাগরি টাইটেল + টিউটোরিয়াল লিস্ট  
- **টিউটোরিয়াল ডিটেইল:** সাইডবার (বাম) + কন্টেন্ট (ডান)  
- **প্লেগ্রাউন্ড:** কোড এডিটর (বাম) + আউটপুট (ডান)  
- **সার্চ বার:** হোমপেজের শীর্ষে সুন্দরভাবে থাকবে

---

## ৭. প্রযুক্তি স্ট্যাক (Tech Stack)

| **স্তর** | **প্রযুক্তি** | **কারণ** |
|-----------|---------------|-----------|
| **ফ্রন্টএন্ড** | Next.js 16 (App Router) | Server Components, ISR, SEO ফ্রেন্ডলি |
| **ভাষা** | TypeScript | টাইপ সেফ, Error কম |
| **স্টাইলিং** | Tailwind CSS | দ্রুত UI ডেভেলপমেন্ট, ডার্ক মোড সাপোর্ট |
| **ORM** | Prisma 5.x | টাইপ সেফ, সহজ কুয়েরি, মাইগ্রেশন |
| **ডাটাবেস** | PostgreSQL (Supabase / Cloudflare D1) | ফ্রি টিয়ার, স্কেলেবল |
| **অথেনটিকেশন** | ❌ নেই | সবকিছু ওপেন, লগইন বাধ্যতামূলক নয় |
| **পেমেন্ট** | SSLCommerz / Stripe | গেস্ট চেকআউট সাপোর্ট |
| **কোড এডিটর** | Monaco Editor | VS Code-এর মতো অভিজ্ঞতা |
| **হোস্টিং** | Vercel (ফ্রি টিয়ার) | Next.js-এর জন্য বেস্ট |

---

## ৮. ডাটাবেজ স্ট্রাকচার (Database Schema)

Prisma Schema (সম্পূর্ণ, ইন্ডেক্সসহ):

```prisma
// ==========================================
//  CATEGORY
// ==========================================
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  icon        String?
  createdAt   DateTime @default(now())

  tutorials   Tutorial[]
  references  Reference[]
}

// ==========================================
//  TUTORIAL
// ==========================================
model Tutorial {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   @db.Text
  categoryId  String   @map("category_id")
  category    Category @relation(fields: [categoryId], references: [id])
  difficulty  String   @default("beginner") // beginner, intermediate, advanced
  isPublished Boolean  @default(true)
  views       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  exercises   Exercise[]
  quizzes     Quiz[]

  @@index([slug])
  @@index([views])
  @@index([createdAt])
}

// ==========================================
//  EXERCISE (প্র্যাকটিস)
// ==========================================
model Exercise {
  id          String   @id @default(cuid())
  tutorialId  String   @map("tutorial_id")
  tutorial    Tutorial @relation(fields: [tutorialId], references: [id])
  question    String   @db.Text
  hint        String?  @db.Text
  solution    String?  @db.Text
  language    String   @default("javascript")
  createdAt   DateTime @default(now())
}

// ==========================================
//  QUIZ
// ==========================================
model Quiz {
  id          String   @id @default(cuid())
  title       String
  tutorialId  String?  @map("tutorial_id")
  tutorial    Tutorial? @relation(fields: [tutorialId], references: [id])
  description String?
  createdAt   DateTime @default(now())

  questions   QuizQuestion[]
}

model QuizQuestion {
  id          String   @id @default(cuid())
  quizId      String   @map("quiz_id")
  quiz        Quiz     @relation(fields: [quizId], references: [id])
  question    String   @db.Text
  options     String   @db.Text   // JSON array: ["A", "B", "C", "D"]
  correctIndex Int
  explanation String?  @db.Text
  createdAt   DateTime @default(now())
}

// ==========================================
//  CHALLENGE
// ==========================================
model Challenge {
  id          String   @id @default(cuid())
  title       String
  description String   @db.Text
  language    String   @default("javascript")
  starterCode String?  @db.Text
  difficulty  String   @default("easy") // easy, medium, hard
  points      Int      @default(10)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  testCases   ChallengeTestCase[]
}

model ChallengeTestCase {
  id            String   @id @default(cuid())
  challengeId   String   @map("challenge_id")
  challenge     Challenge @relation(fields: [challengeId], references: [id])
  input         String   @db.Text
  expectedOutput String @db.Text
  isHidden      Boolean  @default(false) // true means not shown to user
}

// ==========================================
//  REFERENCE
// ==========================================
model Reference {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   @db.Text
  categoryId  String?  @map("category_id")
  category    Category? @relation(fields: [categoryId], references: [id])
  language    String
  isPublished Boolean  @default(true)
  views       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
}