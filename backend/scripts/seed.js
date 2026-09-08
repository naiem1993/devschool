const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 ডেমো ডেটা যোগ করা হচ্ছে...')

  // 1. ক্যাটাগরি তৈরি
  const webCat = await prisma.category.create({
    data: {
      name: 'Web Development',
      slug: 'web-development',
      description: 'All about web development'
    }
  })

  const jsCat = await prisma.category.create({
    data: {
      name: 'JavaScript',
      slug: 'javascript',
      description: 'JavaScript programming language'
    }
  })

  // 2. টিউটোরিয়াল তৈরি (HTML)
  const htmlTutorial = await prisma.tutorial.create({
    data: {
      title: 'Introduction to HTML',
      slug: 'html-intro',
      content: '# HTML Introduction\nHTML is the standard markup language for creating web pages.',
      categoryId: webCat.id,
      difficulty: 'beginner'
    }
  })

  // 3. HTML-এর Exercise
  await prisma.exercise.create({
    data: {
      tutorialId: htmlTutorial.id,
      question: 'What does HTML stand for?',
      hint: 'Think about the full form of HTML',
      solution: 'HyperText Markup Language',
      language: 'html'
    }
  })

  // 4. HTML-এর কুইজ
  const htmlQuiz = await prisma.quiz.create({
    data: {
      title: 'HTML Basics Quiz',
      tutorialId: htmlTutorial.id,
      description: 'Test your HTML knowledge'
    }
  })

  await prisma.quizQuestion.create({
    data: {
      quizId: htmlQuiz.id,
      question: 'Which tag is used for the largest heading?',
      options: JSON.stringify(['<h1>', '<h6>', '<head>', '<header>']),
      correctIndex: 0,
      explanation: '<h1> is the largest heading tag.'
    }
  })

  await prisma.quizQuestion.create({
    data: {
      quizId: htmlQuiz.id,
      question: 'Which tag is used to create a paragraph?',
      options: JSON.stringify(['<p>', '<para>', '<paragraph>', '<text>']),
      correctIndex: 0,
      explanation: '<p> tag is used for paragraphs.'
    }
  })

  // 5. HTML Reference
  await prisma.reference.create({
    data: {
      title: 'HTML Tag List',
      slug: 'html-tag-list',
      content: '## Common HTML Tags\n- `<html>`: Root element\n- `<head>`: Metadata\n- `<body>`: Content\n- `<h1>` to `<h6>`: Headings\n- `<p>`: Paragraph',
      language: 'html',
      categoryId: webCat.id
    }
  })

  // 6. JavaScript টিউটোরিয়াল
  const jsTutorial = await prisma.tutorial.create({
    data: {
      title: 'JavaScript Basics',
      slug: 'js-basics',
      content: '# JavaScript Basics\nJavaScript is a programming language for the web.',
      categoryId: jsCat.id,
      difficulty: 'beginner'
    }
  })

  // 7. JavaScript Exercise
  await prisma.exercise.create({
    data: {
      tutorialId: jsTutorial.id,
      question: 'What is the output of `console.log(typeof 42)`?',
      hint: 'Think about the type of a number in JavaScript',
      solution: 'number',
      language: 'javascript'
    }
  })

  // 8. JavaScript কুইজ
  const jsQuiz = await prisma.quiz.create({
    data: {
      title: 'JavaScript Basics Quiz',
      tutorialId: jsTutorial.id,
      description: 'Test your JS knowledge'
    }
  })

  await prisma.quizQuestion.create({
    data: {
      quizId: jsQuiz.id,
      question: 'Which keyword is used to declare a variable in JavaScript?',
      options: JSON.stringify(['var', 'let', 'const', 'All of the above']),
      correctIndex: 3,
      explanation: 'var, let, and const all can be used to declare variables.'
    }
  })

  // 9. JavaScript Reference
  await prisma.reference.create({
    data: {
      title: 'JavaScript Array Methods',
      slug: 'js-array-methods',
      content: '## Common Array Methods\n- `push()`: Adds element to end\n- `pop()`: Removes last element\n- `map()`: Creates new array\n- `filter()`: Filters array',
      language: 'javascript',
      categoryId: jsCat.id
    }
  })

  // 10. Code Challenge
  await prisma.challenge.create({
    data: {
      title: 'Sum of Two Numbers',
      description: 'Write a function that takes two numbers and returns their sum.',
      language: 'javascript',
      starterCode: 'function sum(a, b) {\n  // your code here\n}',
      difficulty: 'easy',
      points: 10,
      testCases: {
        create: [
          { input: '2,3', expectedOutput: '5' },
          { input: '10,20', expectedOutput: '30' },
          { input: '-1,1', expectedOutput: '0' }
        ]
      }
    }
  })

  console.log('✅ ডেমো ডেটা যোগ করা হয়েছে!')
  console.log('📚 ক্যাটাগরি:', await prisma.category.count())
  console.log('📖 টিউটোরিয়াল:', await prisma.tutorial.count())
  console.log('📝 এক্সারসাইজ:', await prisma.exercise.count())
  console.log('🧪 কুইজ:', await prisma.quiz.count())
  console.log('📚 রেফারেন্স:', await prisma.reference.count())
  console.log('🏆 চ্যালেঞ্জ:', await prisma.challenge.count())
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })