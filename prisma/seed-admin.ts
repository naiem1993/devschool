import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'a@gmail.com'
  const password = process.env.ADMIN_PASSWORD || '1'
  const name = process.env.ADMIN_NAME || 'Root Admin'

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name, isActive: true },
    create: { email, passwordHash, name, isActive: true },
  })

  console.log(`✅ Admin user ready: ${user.email}`)
  console.log(`   password: ${password}  (change in production!)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
