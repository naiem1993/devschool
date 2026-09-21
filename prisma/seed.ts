import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding demo data...')

  // 1. HTML tutorial (nested structure)
  const htmlTutorial = await prisma.tutorial.create({
    data: {
      title: 'Introduction to HTML',
      slug: 'html-intro',
      description: 'Learn the basics of HTML',
      difficulty: 'Beginner',
    },
  })

  // HTML chapter 1 (nested) with 2 lessons
  await prisma.chapter.create({
    data: {
      tutorialId: htmlTutorial.id,
      title: 'What is HTML?',
      slug: 'what-is-html',
      sortOrder: 1,
      lessons: {
        create: [
          {
            title: 'Introduction',
            slug: 'introduction',
            sortOrder: 0,
            content:
              'HTML stands for HyperText Markup Language. It is the standard markup language for creating Web pages.',
            codeExample:
              '<!DOCTYPE html>\n<html>\n<head>\n  <title>Page Title</title>\n</head>\n<body>\n  <h1>This is a heading</h1>\n  <p>This is a paragraph.</p>\n</body>\n</html>',
          },
          {
            title: 'HTML Basics',
            slug: 'basics',
            sortOrder: 1,
            content:
              'HTML elements are the building blocks of HTML pages. Each element is represented by a tag.',
            codeExample: '<h1>My First Heading</h1>\n<p>My first paragraph.</p>',
          },
        ],
      },
    },
  })

  // HTML chapter 2 (single-page)
  await prisma.chapter.create({
    data: {
      tutorialId: htmlTutorial.id,
      title: 'HTML Elements',
      slug: 'elements',
      sortOrder: 2,
      content: 'HTML elements are the building blocks of HTML pages.',
      codeExample: '<h1>My First Heading</h1>\n<p>My first paragraph.</p>',
    },
  })

  // 3. HTML Quiz
  await prisma.quizQuestion.create({
    data: {
      tutorialId: htmlTutorial.id,
      question: 'Which tag is used for the largest heading?',
      explanation: '<h1> is the largest heading tag in HTML.',
      options: {
        create: [
          { text: '<h1>', isCorrect: true, optionOrder: 1 },
          { text: '<h6>', isCorrect: false, optionOrder: 2 },
          { text: '<head>', isCorrect: false, optionOrder: 3 },
          { text: '<header>', isCorrect: false, optionOrder: 4 },
        ],
      },
    },
  })

  await prisma.quizQuestion.create({
    data: {
      tutorialId: htmlTutorial.id,
      question: 'Which tag is used to create a paragraph?',
      explanation: '<p> tag is used for paragraphs in HTML.',
      options: {
        create: [
          { text: '<p>', isCorrect: true, optionOrder: 1 },
          { text: '<para>', isCorrect: false, optionOrder: 2 },
          { text: '<paragraph>', isCorrect: false, optionOrder: 3 },
          { text: '<text>', isCorrect: false, optionOrder: 4 },
        ],
      },
    },
  })

  // 4. HTML Reference
  await prisma.reference.create({
    data: {
      title: 'HTML Tag List',
      slug: 'html-tag-list',
      description: 'Complete list of HTML tags',
      syntax: '<tagname>content</tagname>',
      example: '<h1>Title</h1>\n<p>Paragraph</p>',
      tags: ['html', 'tags', 'elements'],
      language: 'html',
      tutorialId: htmlTutorial.id,
    },
  })

  // 2. JavaScript tutorial
  const jsTutorial = await prisma.tutorial.create({
    data: {
      title: 'JavaScript Basics',
      slug: 'js-basics',
      description: 'Learn JavaScript from scratch',
      difficulty: 'Beginner',
    },
  })

  await prisma.chapter.create({
    data: {
      tutorialId: jsTutorial.id,
      title: 'Variables',
      slug: 'variables',
      sortOrder: 1,
      lessons: {
        create: [
          {
            title: 'Variables',
            slug: 'variables',
            sortOrder: 0,
            content:
              'Variables are containers for storing data values. In JavaScript, you can use var, let, and const.',
            codeExample:
              'let name = "John";\nconst age = 25;\nvar city = "Dhaka";',
          },
        ],
      },
    },
  })

  await prisma.chapter.create({
    data: {
      tutorialId: jsTutorial.id,
      title: 'Functions',
      slug: 'functions',
      sortOrder: 2,
      lessons: {
        create: [
          {
            title: 'Functions',
            slug: 'functions',
            sortOrder: 0,
            content:
              'A function is a block of code designed to perform a particular task.',
            codeExample:
              'function greet(name) {\n  return "Hello, " + name;\n}\nconsole.log(greet("John"));',
          },
        ],
      },
    },
  })

  // 6. JavaScript Quiz
  await prisma.quizQuestion.create({
    data: {
      tutorialId: jsTutorial.id,
      question: 'Which keyword is used to declare a variable in JavaScript?',
      explanation:
        'var, let, and const all can be used to declare variables in JavaScript.',
      options: {
        create: [
          { text: 'var', isCorrect: false, optionOrder: 1 },
          { text: 'let', isCorrect: false, optionOrder: 2 },
          { text: 'const', isCorrect: false, optionOrder: 3 },
          { text: 'All of the above', isCorrect: true, optionOrder: 4 },
        ],
      },
    },
  })

  // 7. JavaScript Code Challenge
  await prisma.codeChallenge.create({
    data: {
      tutorialId: jsTutorial.id,
      title: 'Sum of Two Numbers',
      description: 'Write a function that takes two numbers and returns their sum.',
      starterCode: 'function sum(a, b) {\n  // your code here\n}',
      difficulty: 'Easy',
      points: 10,
      testCases: {
        create: [
          { input: '{"a": 2, "b": 3}', expectedOutput: '5', isHidden: false, testCaseOrder: 1 },
          { input: '{"a": 10, "b": 20}', expectedOutput: '30', isHidden: false, testCaseOrder: 2 },
          { input: '{"a": -1, "b": 1}', expectedOutput: '0', isHidden: true, testCaseOrder: 3 },
        ],
      },
    },
  })

  // 8. JavaScript Reference
  await prisma.reference.create({
    data: {
      title: 'JavaScript Array Methods',
      slug: 'js-array-methods',
      description: 'Common JavaScript array methods',
      syntax: 'array.method()',
      example:
        'const arr = [1, 2, 3];\narr.push(4);\nconst doubled = arr.map(x => x * 2);',
      tags: ['javascript', 'arrays', 'methods'],
      language: 'javascript',
      tutorialId: jsTutorial.id,
    },
  })

  // 3. Python tutorial
  const pythonTutorial = await prisma.tutorial.create({
    data: {
      title: 'Python Basics',
      slug: 'python-basics',
      description: 'Learn Python programming',
      difficulty: 'Beginner',
    },
  })

  await prisma.chapter.create({
    data: {
      tutorialId: pythonTutorial.id,
      title: 'Variables',
      slug: 'variables',
      sortOrder: 1,
      lessons: {
        create: [
          {
            title: 'Variables',
            slug: 'variables',
            sortOrder: 0,
            content:
              'Python has no command for declaring a variable. A variable is created the moment you first assign a value to it.',
            codeExample: 'name = "John"\nage = 25\nprint(name, age)',
          },
        ],
      },
    },
  })

  // 10. Python Reference
  await prisma.reference.create({
    data: {
      title: 'Python Data Types',
      slug: 'python-data-types',
      description: 'Common Python data types',
      syntax: 'variable = value',
      example: 'x = 5  # int\ny = "Hello"  # str\nz = [1, 2, 3]  # list',
      tags: ['python', 'types', 'variables'],
      language: 'python',
      tutorialId: pythonTutorial.id,
    },
  })

  // 11. Site Settings
  await prisma.siteSettings.create({
    data: {
      key: 'general',
      value: {
        siteName: 'DevSchool',
        isDonationEnabled: true,
        isAdsEnabled: true,
      } as any,
    },
  })

  console.log('✅ Demo data seeded successfully!')
  console.log('📚 Tutorials:', await prisma.tutorial.count())
  console.log('📖 Tutorials:', await prisma.tutorial.count())
  console.log('📂 Chapters:', await prisma.chapter.count())
  console.log('📝 Lessons:', await prisma.lesson.count())
  console.log('❓ QuizQuestions:', await prisma.quizQuestion.count())
  console.log('📚 References:', await prisma.reference.count())
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
