import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TUTORIAL_SLUG = 'sandbox-demo-tutorial'
const TUTORIAL_TITLE_BN = 'ডেমো চ্যালেঞ্জ'
const TUTORIAL_TITLE_EN = 'Demo Challenges'

// ============================================================
//  DEMO CHALLENGES — ৩টি classic beginner-friendly চ্যালেঞ্জ
// ============================================================

type DemoChallenge = {
  titleBn: string
  titleEn: string
  descriptionBn: string
  descriptionEn: string
  starterCode: string
  solution: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  points: number
  testCases: { input: string; expectedOutput: string; isHidden: boolean }[]
}

const CHALLENGES: DemoChallenge[] = [
  // ─────────────────────────────────────────────────────────
  //  1) SUM OF TWO NUMBERS — basic input parsing
  // ─────────────────────────────────────────────────────────
  {
    titleBn: 'দুই সংখ্যার যোগফল',
    titleEn: 'Sum of Two Numbers',
    descriptionBn:
      'একটা ফাংশন `solve(input)` লেখো যেটা `"a b"` ফরম্যাটের একটা string নেয় (যেমন `"2 3"`) এবং দুইটা সংখ্যার যোগফল string আকারে return করে (যেমন `"5"`)।',
    descriptionEn:
      'Write a function `solve(input)` that takes a string in the form `"a b"` (e.g. `"2 3"`) and returns the sum of the two numbers as a string (e.g. `"5"`).',
    starterCode: `function solve(input) {
  // input: একটা string, ফরম্যাট "a b" — যেমন "2 3"
  // কাজ: দুইটা সংখ্যা যোগ করে STRING আকারে return করো, যেমন "5"
  //
  // Input: a string like "a b" (e.g. "2 3")
  // Task : return the sum as a string (e.g. "5")

  // তোমার কোড এখানে লেখো / Write your code here:
  return ''
}
`,
    solution: `function solve(input) {
  const [a, b] = input.split(' ').map(Number)
  return String(a + b)
}
`,
    difficulty: 'Easy',
    points: 10,
    testCases: [
      { input: '2 3', expectedOutput: '5', isHidden: false },
      { input: '10 20', expectedOutput: '30', isHidden: false },
      { input: '-5 3', expectedOutput: '-2', isHidden: true },
      { input: '100 250', expectedOutput: '350', isHidden: true },
    ],
  },

  // ─────────────────────────────────────────────────────────
  //  2) REVERSE A STRING — string manipulation
  // ─────────────────────────────────────────────────────────
  {
    titleBn: 'স্ট্রিং উল্টো করো',
    titleEn: 'Reverse a String',
    descriptionBn:
      '`solve(input)` লেখো যেটা একটা string নেয় এবং উল্টো করে return করে। যেমন `"hello"` → `"olleh"`। খালি string দিলে খালি string-ই return করবে।',
    descriptionEn:
      'Write `solve(input)` that takes a string and returns it reversed. e.g. `"hello"` → `"olleh"`. Empty string returns empty string.',
    starterCode: `function solve(input) {
  // input: একটা string (যেমন "hello")
  // কাজ: উল্টো string return করো (যেমন "olleh")
  //
  // Input: a string (e.g. "hello")
  // Task : return the reversed string (e.g. "olleh")

  // তোমার কোড এখানে লেখো / Write your code here:
  return ''
}
`,
    solution: `function solve(input) {
  return input.split('').reverse().join('')
}
`,
    difficulty: 'Easy',
    points: 15,
    testCases: [
      { input: 'hello', expectedOutput: 'olleh', isHidden: false },
      { input: 'DevSchool', expectedOutput: 'loohcSveD', isHidden: false },
      { input: 'a', expectedOutput: 'a', isHidden: true },
      { input: 'abcd', expectedOutput: 'dcba', isHidden: true },
    ],
  },

  // ─────────────────────────────────────────────────────────
  //  3) FIZZBUZZ — classic logic
  // ─────────────────────────────────────────────────────────
  {
    titleBn: 'ফিজবাজ',
    titleEn: 'FizzBuzz',
    descriptionBn:
      'একটা সংখ্যা `n` নাও (string আকারে)। ১ থেকে `n` পর্যন্ত প্রতিটা সংখ্যার জন্য:\n• ৩ ও ৫ উভয় দিয়ে বিভাজ্য → `"FizzBuzz"`\n• শুধু ৩ দিয়ে বিভাজ্য → `"Fizz"`\n• শুধু ৫ দিয়ে বিভাজ্য → `"Buzz"`\n• নইলে → সংখ্যাটি\n\nসবগুলো কমা (`,`) দিয়ে জোড়া লাগিয়ে return করো। উদাহরণ `n=5` → `"1,2,Fizz,4,Buzz"`।',
    descriptionEn:
      'Take a number `n` (as string). For each number from 1 to `n`:\n• Divisible by both 3 and 5 → `"FizzBuzz"`\n• Divisible by 3 only → `"Fizz"`\n• Divisible by 5 only → `"Buzz"`\n• Otherwise → the number\n\nJoin all with commas (`,`). Example `n=5` → `"1,2,Fizz,4,Buzz"`.',
    starterCode: `function solve(input) {
  // input: একটা সংখ্যা string আকারে, যেমন "5"
  // কাজ: ১ থেকে n পর্যন্ত FizzBuzz array বানাও, comma দিয়ে জোড়া লাগাও
  //
  // Input: a number as string, e.g. "5"
  // Task : build FizzBuzz from 1 to n, join with commas

  const n = Number(input)
  const result = []

  // তোমার কোড এখানে লেখো / Write your code here:

  return result.join(',')
}
`,
    solution: `function solve(input) {
  const n = Number(input)
  const result = []
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push('FizzBuzz')
    else if (i % 3 === 0) result.push('Fizz')
    else if (i % 5 === 0) result.push('Buzz')
    else result.push(String(i))
  }
  return result.join(',')
}
`,
    difficulty: 'Medium',
    points: 25,
    testCases: [
      { input: '5', expectedOutput: '1,2,Fizz,4,Buzz', isHidden: false },
      { input: '15', expectedOutput: '1,2,Fizz,4,Buzz,Fizz,7,8,Fizz,Buzz,11,Fizz,13,14,FizzBuzz', isHidden: false },
      { input: '3', expectedOutput: '1,2,Fizz', isHidden: true },
      { input: '1', expectedOutput: '1', isHidden: true },
    ],
  },
]

async function main() {
  console.log('🌱 Seeding demo challenges (bilingual)...\n')

  // ── Tutorial (upsert) ─────────────────────────────────────
  const tutorial = await prisma.tutorial.upsert({
    where: { slug: TUTORIAL_SLUG },
    update: {
      titleBn: TUTORIAL_TITLE_BN,
      titleEn: TUTORIAL_TITLE_EN,
      descriptionBn: 'sandbox-এ কোড চালিয়ে দেখার জন্য ডেমো চ্যালেঞ্জ।',
      descriptionEn: 'Demo challenges for trying out the sandbox.',
      isPublished: true,
    },
    create: {
      titleBn: TUTORIAL_TITLE_BN,
      titleEn: TUTORIAL_TITLE_EN,
      slug: TUTORIAL_SLUG,
      descriptionBn: 'sandbox-এ কোড চালিয়ে দেখার জন্য ডেমো চ্যালেঞ্জ।',
      descriptionEn: 'Demo challenges for trying out the sandbox.',
      difficulty: 'beginner',
      icon: '🧪',
      isPublished: true,
    },
  })

  console.log('📚 Tutorial:', tutorial.titleBn, '/', tutorial.titleEn)
  console.log('   slug   :', tutorial.slug)
  console.log('')

  // ── পুরনো একই-নামের demo challenge মুছে ফেলা (idempotent) ──
  const titles = CHALLENGES.flatMap((c) => [c.titleBn, c.titleEn])
  await prisma.codeChallenge.deleteMany({
    where: {
      tutorialId: tutorial.id,
      OR: titles.flatMap((t) => [{ titleBn: t }, { titleEn: t }]),
    },
  })

  // ── প্রতিটা challenge create করা ──────────────────────────
  const created: { id: string; bn: string; en: string; tc: number }[] = []

  for (const c of CHALLENGES) {
    const created_c = await prisma.codeChallenge.create({
      data: {
        tutorialId: tutorial.id,
        titleBn: c.titleBn,
        titleEn: c.titleEn,
        descriptionBn: c.descriptionBn,
        descriptionEn: c.descriptionEn,
        starterCode: c.starterCode,
        solution: c.solution,
        difficulty: c.difficulty,
        points: c.points,
        testCases: {
          create: c.testCases.map((tc, i) => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden,
            testCaseOrder: i + 1,
          })),
        },
      },
      include: { testCases: true },
    })

    created.push({
      id: created_c.id,
      bn: c.titleBn,
      en: c.titleEn,
      tc: created_c.testCases.length,
    })

    console.log(`✅ ${c.titleBn} / ${c.titleEn}`)
    console.log(`   difficulty : ${c.difficulty}  ·  points : ${c.points}`)
    console.log(`   test cases : ${created_c.testCases.length} (${c.testCases.filter((t) => !t.isHidden).length} visible, ${c.testCases.filter((t) => t.isHidden).length} hidden)`)
    console.log(`   bn url     : http://localhost:3000/bn/challenges/${created_c.id}`)
    console.log(`   en url     : http://localhost:3000/en/challenges/${created_c.id}`)
    console.log('')
  }

  console.log(`\n🎉 Done — ${created.length} challenges added successfully.\n`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
