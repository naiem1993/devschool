import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * 30 demo reviews seed.
 * সব রিভিউ `status: 'approved'` — তাই homepage-এ সাথে সাথে দেখাবে।
 * ইডেম্পোটেন্ট: deviceId = 'demo-seed' মার্কার দিয়ে চেনা হয়,
 * তাই বারবার চালালেও ডুপ্লিকেট হবে না (আগেরগুলো মুছে নতুন করে বসে)।
 */

const DEMO_MARKER = 'demo-seed'

const DEMO_REVIEWS = [
  { name: 'Rahim Uddin', role: 'Frontend Developer', stars: 5, text: 'DevSchool-এর HTML কোর্সটা অসাধারণ। একদম শুরু থেকে ধরে ধরে শেখানো হয়েছে।' },
  { name: 'Sadia Islam', role: 'CSE Student', stars: 5, text: 'লাইভ কোড এডিটর থাকায় পড়তে পড়তেই প্র্যাকটিস করতে পারছি। অনেক উপকার হয়েছে।' },
  { name: 'Tanvir Ahmed', role: 'Web Developer', stars: 4, text: 'CSS পার্টটা চমৎকার। তবে আরও কিছু advanced example থাকলে ভালো হতো।' },
  { name: 'Nusrat Jahan', role: 'Junior Dev', stars: 5, text: 'বাংলায় এত সুন্দর করে টেকনিক্যাল কনটেন্ট আগে দেখিনি। ধন্যবাদ DevSchool।' },
  { name: 'Arif Hossain', role: 'Freelancer', stars: 4, text: 'JavaScript বেসিকস খুব পরিষ্কারভাবে বোঝানো হয়েছে। চ্যাপ্টারগুলো ছোট ছোট, তাই বিরক্ত লাগে না।' },
  { name: 'Mehedi Hasan', role: 'Backend Developer', stars: 5, text: 'প্রোগ্রেস ট্র্যাকিং ফিচারটা দারুণ — কতটুকু শেষ করেছি সেটা দেখতে পারি।' },
  { name: 'Farhana Akter', role: 'Student', stars: 5, text: 'ব্যাখ্যা আর কোড একসাথে থাকায় কনসেপ্ট ক্লিয়ার হতে সময় লাগে না।' },
  { name: 'Imran Khan', role: 'Full Stack Dev', stars: 4, text: 'রেফারেন্স সেকশনটা খুব কাজে দেয়। দ্রুত syntax খুঁজে পাই।' },
  { name: 'Sumaiya Rahman', role: 'UI Designer', stars: 5, text: 'ডিজাইন আর কনটেন্ট দুটোই প্রিমিয়াম কোয়ালিটির। পড়তে ভালো লাগে।' },
  { name: 'Shakib Al Hasan', role: 'Learner', stars: 5, text: 'একদম ফ্রি-তে এত ভালো কোর্স! নতুনদের জন্য perfect।' },
  { name: 'Jannatul Ferdous', role: 'CSE Student', stars: 4, text: 'Python সেকশনটা আরেকটু বড় হলে ভালো হতো। বাকি সব ঠিক আছে।' },
  { name: 'Rakibul Islam', role: 'Web Developer', stars: 5, text: 'চ্যালেঞ্জগুলো প্র্যাকটিসের জন্য দুর্দান্ত। আসল কোডিং শেখা যায়।' },
  { name: 'Tasnim Chowdhury', role: 'Student', stars: 5, text: 'মোবাইলেও পড়তে পারি, লেআউট খুব রেসপন্সিভ।' },
  { name: 'Hasibul Karim', role: 'Junior Dev', stars: 4, text: 'ডিফিকাল্টি লেভেল আলাদা করে দেওয়ায় নিজের লেভেল অনুযায়ী পড়তে পারি।' },
  { name: 'Munira Begum', role: 'Career Switcher', stars: 5, text: 'নন-টেক ব্যাকগ্রাউন্ড থেকে এসেও বুঝতে পারছি। ব্যাখ্যা সহজ ভাষায়।' },
  { name: 'Zahid Hasan', role: 'Freelancer', stars: 5, text: 'কুইজ সেকশনটা শেখা মনে রাখতে দারুণ সাহায্য করে।' },
  { name: 'Nafisa Anjum', role: 'Student', stars: 4, text: 'কনটেন্ট ভালো, তবে আরও প্রজেক্ট-বেইজড উদাহরণ থাকলে ভালো হতো।' },
  { name: 'Sabbir Ahmed', role: 'Web Developer', stars: 5, text: 'বাংলা টিউটোরিয়ালের মধ্যে এটাই সেরা। সাজেশন দিলাম।' },
  { name: 'Mim Akter', role: 'CSE Student', stars: 5, text: 'প্রতিটা চ্যাপ্টারের শেষে চ্যালেঞ্জ থাকায় শেখা পাকা হয়।' },
  { name: 'Fahim Reza', role: 'Backend Developer', stars: 4, text: 'API আর ডেটাবেজ নিয়ে আরও কনটেন্ট চাই। বাকি সব অসাধারণ।' },
  { name: 'Rumana Sultana', role: 'UI Designer', stars: 5, text: 'ইন্টারফেসটা খুব পরিচ্ছন্ন, পড়তে কোনো ঝামেলা হয় না।' },
  { name: 'Ashiqur Rahman', role: 'Learner', stars: 5, text: 'বিনা রেজিস্ট্রেশনে পড়া যায়, এটাই সবচেয়ে ভালো লেগেছে।' },
  { name: 'Sharmin Sultana', role: 'Student', stars: 4, text: 'কোড এডিটরে syntax highlight ঠিকঠাক কাজ করে। অভিজ্ঞতা ভালো।' },
  { name: 'Nayeem Islam', role: 'Junior Dev', stars: 5, text: 'ইন্টারভিউ প্রিপারেশনে help করেছে। ধন্যবাদ।' },
  { name: 'Ayesha Siddika', role: 'CSE Student', stars: 5, text: 'প্রত্যেকটা লেসনে practical উদাহরণ আছে — এটাই বেস্ট পার্ট।' },
  { name: 'Mahmudul Hasan', role: 'Freelancer', stars: 4, text: 'সার্চ ফিচারটা দ্রুত কাজ করে, দরকারি টপিক সহজে পাই।' },
  { name: 'Tania Islam', role: 'Career Switcher', stars: 5, text: 'শূন্য থেকে শুরু করে এখন নিজেই ছোট প্রজেক্ট বানাতে পারছি।' },
  { name: 'Rashed Khan', role: 'Web Developer', stars: 5, text: 'প্রোগ্রেস সেভ হয়ে থাকে, তাই যেখানে ছিলাম সেখান থেকেই শুরু করতে পারি।' },
  { name: 'Ishrat Jahan', role: 'Student', stars: 4, text: 'ভিডিও না থাকলেও লেখা পড়ে বুঝতে কোনো সমস্যা হয়নি।' },
  { name: 'Sajid Hossain', role: 'Full Stack Dev', stars: 5, text: 'সব মিলিয়ে একটি পূর্ণাঙ্গ শেখার প্লাটফর্ম। রিকমেন্ড করছি।' },
]

async function main() {
  console.log('🌱 30 demo reviews seeding...')

  // পুরনো demo রিভিউ মুছে ফেলি (ইডেম্পোটেন্ট)
  const removed = await prisma.review.deleteMany({
    where: { deviceId: DEMO_MARKER },
  })
  if (removed.count > 0) {
    console.log(`🗑️  আগের ${removed.count} টা demo review মুছে ফেলা হয়েছে`)
  }

  // ক্রমবর্ধমান createdAt দিতে old→new সাজিয়ে নিই, যাতে নিউজেস্ট আগে দেখায়
  const base = Date.now() - DEMO_REVIEWS.length * 60 * 60 * 1000 // ঘণ্টা করে ফাঁক
  const data = DEMO_REVIEWS.map((r, i) => ({
    name: r.name,
    role: r.role,
    stars: r.stars,
    text: r.text,
    status: 'approved' as const,
    deviceId: DEMO_MARKER,
    createdAt: new Date(base + i * 60 * 60 * 1000),
  }))

  await prisma.review.createMany({ data })

  const total = await prisma.review.count({ where: { status: 'approved' } })
  console.log(`✅ ${data.length} টা demo review যোগ হয়েছে`)
  console.log(`⭐ মোট approved review এখন: ${total}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
