import { PrismaClient, ROLE } from "@prisma/client"

import bookAccountsData from "../data/book-accounts.json"
import { hashPassword } from "../server/utils"

const prisma = new PrismaClient()

async function main() {
  // generate admin
  const ADMIN_NAME = "Admin"
  const ADMIN_EMAIL = "admin@venta.com"
  const ADMIN_PASSWORD = "@jeffkim19"

  const adminPassword = await hashPassword(ADMIN_PASSWORD)

  const admin = await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      hashedPassword: adminPassword,
      name: ADMIN_NAME,
      emailVerified: new Date(),
      role: ROLE.ADMIN,
    },
  })

  console.log(`Generated admin: `, admin.email)

  // generate user
  const USER_NAME = "Jeff Segovia"
  const USER_EMAIL = "jeff@venta.com"
  const USER_PASSWORD = "@jeff123"

  const userPassword = await hashPassword(USER_PASSWORD)

  const user = await prisma.user.create({
    data: {
      email: USER_EMAIL,
      name: USER_NAME,
      hashedPassword: userPassword,
      emailVerified: new Date(),
    },
  })

  console.log(`Generated user: `, user.email)

  // generate store
  const storeA = await prisma.store.create({
    data: {
      name: "CoFaith",
      slug: "cofaith",
      email: "cofaith@gmail.com",
      legalName: "CoFaith",
      logo: "/cofaith-logo.png",
      ownerId: user.id,
    },
  })

  const storeB = await prisma.store.create({
    data: {
      name: "Epistle Creatives Co.",
      slug: "epistle-creatives-co",
      email: "epistlce@gmail.com",
      legalName: "Epistle Creatives Co.",
      logo: "/epistle-logo.png",
      ownerId: user.id,
    },
  })

  console.log(`Generated stores: `, storeA.name, storeB.name)

  // generate book accounts
  // for each book account, generate detail account
  const bookAccountTypes = await Promise.all(
    bookAccountsData.map(
      async (accountType) =>
        await prisma.bookAccountType.create({
          data: {
            name: accountType.name,
            detailTypes: {
              createMany: {
                data: accountType.details.map((detailType) => ({
                  name: detailType,
                })),
              },
            },
          },
        })
    )
  ).then((values) => values)

  console.log(
    `Generated Book Account and Detail types: `,
    bookAccountTypes.length
  )

  const defaultPaymentMethods = [
    "Cash",
    "GCash",
    "Check",
    "Credit Card",
    "Direct Debit",
  ]

  // generate default payment methods for expenses
  const paymentMethods = await prisma.paymentMethod.createMany({
    data: defaultPaymentMethods.map((method) => ({
      name: method,
      isCreditCard: method === "Credit Card",
      ownerId: user.id,
      storeId: storeA.id,
    })),
  })

  const paymentMethodsB = await prisma.paymentMethod.createMany({
    data: defaultPaymentMethods.map((method) => ({
      name: method,
      isCreditCard: method === "Credit Card",
      ownerId: user.id,
      storeId: storeB.id,
    })),
  })

  console.log(`Generated Payment Methods: `, paymentMethods.count)
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
