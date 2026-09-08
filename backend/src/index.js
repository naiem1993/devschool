const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('✅ Backend is running!')
  console.log('📚 Tutorials:', await prisma.tutorial.count())
  console.log('🧪 Quizzes:', await prisma.quiz.count())
  console.log('🏆 Challenges:', await prisma.challenge.count())
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect())