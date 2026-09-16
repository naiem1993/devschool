import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'a@gmail.com'
  const password = '1'
  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, isActive: true },
    create: { email, passwordHash, name: 'Root Admin', isActive: true },
  })

  console.log('ADMIN_RESET_OK: ' + user.email + ' / ' + password)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
