import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.bookDetailType.deleteMany()
  await prisma.bookAccountType.deleteMany()
  await prisma.paymentMethod.deleteMany()
  await prisma.store.deleteMany()
  await prisma.user.deleteMany()

  console.log(`DB purge success!`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
