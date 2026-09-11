/**
 * prisma/seed-challenge.ts
 *
 * Sandbox code-execution test করার জন্য একটা sample challenge তৈরি করে।
 *
 * চালানোর কমান্ড:
 *   npx tsx prisma/seed-challenge.ts
 *
 * Idempotent — বারবার চালানো নিরাপদ:
 *  - category ও tutorial upsert হয় (থাকলে reuse, নাহলে তৈরি)
 *  - একই title-এর পুরনো challenge delete হয়, তারপর নতুন তৈরি
 *  - আপনার আসল ডেটা (অন্য category/tutorial) ছোঁয়া হয় না
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CATEGORY_SLUG = 'sandbox-demo'
const TUTORIAL_SLUG = 'sandbox-demo-tutorial'
const CHALLENGE_TITLE = 'Sum of Two Numbers'

// ইউজার যা দেখবে — Monaco-তে এটাই লোড হবে
const STARTER_CODE = `function solve(input) {
  // input: একটা string, ফরম্যাট "a b" — যেমন "2 3"
  // কাজ: দুইটা সংখ্যা যোগ করে STRING আকারে return করো, যেমন "5"

  // তোমার কোড এখানে লেখো:
  return ''
}
`

// সঠিক সমাধান — UI-তে "💡 সলিউশন দেখো" বাটনে দেখাবে
const SOLUTION_CODE = `function solve(input) {
  const [a, b] = input.split(' ').map(Number)
  return String(a + b)
}
`

async function main() {
  console.log('🌱 Seeding sandbox test challenge...')

  // 1. Category (upsert)
  const category = await prisma.category.upsert({
    where: { slug: CATEGORY_SLUG },
    update: {},
    create: {
      name: 'Sandbox Demo',
      slug: CATEGORY_SLUG,
      icon: '🧪',
      description: 'Code execution sandbox testing',
    },
  })

  // 2. Tutorial (upsert)
  const tutorial = await prisma.tutorial.upsert({
    where: { slug: TUTORIAL_SLUG },
    update: {},
    create: {
      title: 'Sandbox Demo Tutorial',
      slug: TUTORIAL_SLUG,
      description: 'Tutorial for testing sandbox code execution',
      difficulty: 'beginner',
      categoryId: category.id,
      isPublished: true,
    },
  })

  // 3. একই title-এর পুরনো challenge থাকলে মুছে দাও (testCases cascade-এ মুছে যাবে)
  await prisma.codeChallenge.deleteMany({
    where: { title: CHALLENGE_TITLE, tutorialId: tutorial.id },
  })

  // 4. নতুন challenge + test cases
  const challenge = await prisma.codeChallenge.create({
    data: {
      tutorialId: tutorial.id,
      title: CHALLENGE_TITLE,
      description:
        'একটা ফাংশন `solve(input)` লেখো যেটা "a b" ফরম্যাটের একটা string নেয় (যেমন "2 3") এবং দুইটা সংখ্যার যোগফল string আকারে return করে (যেমন "5")।',
      starterCode: STARTER_CODE,
      solution: SOLUTION_CODE,
      difficulty: 'Easy',
      points: 10,
      testCases: {
        create: [
          { input: '2 3', expectedOutput: '5', isHidden: false, testCaseOrder: 1 },
          { input: '10 20', expectedOutput: '30', isHidden: true, testCaseOrder: 2 },
          { input: '-5 3', expectedOutput: '-2', isHidden: true, testCaseOrder: 3 },
        ],
      },
    },
    include: { testCases: { orderBy: { testCaseOrder: 'asc' } } },
  })

  console.log('✅ সব ঠিকভাবে তৈরি হয়েছে!')
  console.log('')
  console.log('📌 Challenge:')
  console.log('   ID    :', challenge.id)
  console.log('   Title :', challenge.title)
  console.log('   Test  :', challenge.testCases.length, 'টা (১ visible + ২ hidden)')
  challenge.testCases.forEach((tc) => {
    console.log(`     ${tc.isHidden ? '🔒' : '👁 '} #${tc.testCaseOrder}  input="${tc.input}"  expected="${tc.expectedOutput}"`)
  })
  console.log('')
  console.log('🔗 ব্রাউজারে খুলুন:')
  console.log(`   http://localhost:3000/challenges/${challenge.id}`)
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
