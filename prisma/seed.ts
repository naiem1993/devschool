import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding demo data...')

  // 1. Create Categories
  const webCat = await prisma.category.create({
    data: {
      name: 'Web Development',
      slug: 'web-development',
      icon: '🌐',
      description: 'All about web development'
    }
  })

  const jsCat = await prisma.category.create({
    data: {
      name: 'JavaScript',
      slug: 'javascript',
      icon: '🚀',
      description: 'JavaScript programming language'
    }
  })

  const pythonCat = await prisma.category.create({
    data: {
      name: 'Python',
      slug: 'python',
      icon: '🐍',
      description: 'Python programming language'
    }
  })

  // 2. Create HTML Tutorial with Content
  const htmlTutorial = await prisma.tutorial.create({
    data: {
      title: 'Introduction to HTML',
      slug: 'html-intro',
      description: 'Learn the basics of HTML',
      difficulty: 'beginner',
      categoryId: webCat.id,
      contents: {
        create: [
          { chapterNo: 1, title: 'What is HTML?', content: 'HTML stands for HyperText Markup Language. It is the standard markup language for creating Web pages.', codeExample: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Page Title</title>\n</head>\n<body>\n  <h1>This is a heading</h1>\n  <p>This is a paragraph.</p>\n</body>\n</html>' },
          { chapterNo: 2, title: 'HTML Elements', content: 'HTML elements are the building blocks of HTML pages.', codeExample: '<h1>My First Heading</h1>\n<p>My first paragraph.</p>' }
        ]
      }
    }
  })

  // 3. Create Quiz Questions for HTML
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
          { text: '<header>', isCorrect: false, optionOrder: 4 }
        ]
      }
    }
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
          { text: '<text>', isCorrect: false, optionOrder: 4 }
        ]
      }
    }
  })

  // 4. Create HTML Reference
  await prisma.reference.create({
    data: {
      title: 'HTML Tag List',
      slug: 'html-tag-list',
      description: 'Complete list of HTML tags',
      syntax: '<tagname>content</tagname>',
      example: '<h1>Title</h1>\n<p>Paragraph</p>',
      tags: ['html', 'tags', 'elements'],
      language: 'html',
      categoryId: webCat.id
    }
  })

  // 5. Create JavaScript Tutorial with Content
  const jsTutorial = await prisma.tutorial.create({
    data: {
      title: 'JavaScript Basics',
      slug: 'js-basics',
      description: 'Learn JavaScript from scratch',
      difficulty: 'beginner',
      categoryId: jsCat.id,
      contents: {
        create: [
          { chapterNo: 1, title: 'Variables', content: 'Variables are containers for storing data values. In JavaScript, you can use var, let, and const.', codeExample: 'let name = "John";\nconst age = 25;\nvar city = "Dhaka";' },
          { chapterNo: 2, title: 'Functions', content: 'A function is a block of code designed to perform a particular task.', codeExample: 'function greet(name) {\n  return "Hello, " + name;\n}\nconsole.log(greet("John"));' }
        ]
      }
    }
  })

  // 6. Create Quiz Questions for JavaScript
  await prisma.quizQuestion.create({
    data: {
      tutorialId: jsTutorial.id,
      question: 'Which keyword is used to declare a variable in JavaScript?',
      explanation: 'var, let, and const all can be used to declare variables in JavaScript.',
      options: {
        create: [
          { text: 'var', isCorrect: false, optionOrder: 1 },
          { text: 'let', isCorrect: false, optionOrder: 2 },
          { text: 'const', isCorrect: false, optionOrder: 3 },
          { text: 'All of the above', isCorrect: true, optionOrder: 4 }
        ]
      }
    }
  })

  // 7. Create Code Challenge for JavaScript
  await prisma.codeChallenge.create({
    data: {
      tutorialId: jsTutorial.id,
      title: 'Sum of Two Numbers',
      description: 'Write a function that takes two numbers and returns their sum.',
      starterCode: 'function sum(a, b) {\n  // your code here\n}',
      difficulty: 'easy',
      points: 10,
      testCases: {
        create: [
          { input: '{"a": 2, "b": 3}', expectedOutput: '5', isHidden: false, testCaseOrder: 1 },
          { input: '{"a": 10, "b": 20}', expectedOutput: '30', isHidden: false, testCaseOrder: 2 },
          { input: '{"a": -1, "b": 1}', expectedOutput: '0', isHidden: true, testCaseOrder: 3 }
        ]
      }
    }
  })

  // 8. Create JavaScript Reference
  await prisma.reference.create({
    data: {
      title: 'JavaScript Array Methods',
      slug: 'js-array-methods',
      description: 'Common JavaScript array methods',
      syntax: 'array.method()',
      example: 'const arr = [1, 2, 3];\narr.push(4);\nconst doubled = arr.map(x => x * 2);',
      tags: ['javascript', 'arrays', 'methods'],
      language: 'javascript',
      categoryId: jsCat.id
    }
  })

  // 9. Create Python Tutorial
  const pythonTutorial = await prisma.tutorial.create({
    data: {
      title: 'Python Basics',
      slug: 'python-basics',
      description: 'Learn Python programming',
      difficulty: 'beginner',
      categoryId: pythonCat.id,
      contents: {
        create: [
          { chapterNo: 1, title: 'Variables', content: 'Python has no command for declaring a variable. A variable is created the moment you first assign a value to it.', codeExample: 'name = "John"\nage = 25\nprint(name, age)' }
        ]
      }
    }
  })

  // 10. Create Python Reference
  await prisma.reference.create({
    data: {
      title: 'Python Data Types',
      slug: 'python-data-types',
      description: 'Common Python data types',
      syntax: 'variable = value',
      example: 'x = 5  # int\ny = "Hello"  # str\nz = [1, 2, 3]  # list',
      tags: ['python', 'types', 'variables'],
      language: 'python',
      categoryId: pythonCat.id
    }
  })

  // 11. Create Site Settings
  await prisma.siteSettings.create({
    data: {
      key: 'general',
      value: {
        siteName: 'DevSchool',
        isDonationEnabled: true,
        isAdsEnabled: true
      } as any
    }
  })

  console.log('✅ Demo data seeded successfully!')
  console.log('📚 Categories:', await prisma.category.count())
  console.log('📖 Tutorials:', await prisma.tutorial.count())
  console.log('📝 TutorialContents:', await prisma.tutorialContent.count())
  console.log('❓ QuizQuestions:', await prisma.quizQuestion.count())
  console.log('📚 References:', await prisma.reference.count())
  console.log('🏆 CodeChallenges:', await prisma.codeChallenge.count())
  console.log('⚙️ SiteSettings:', await prisma.siteSettings.count())
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
