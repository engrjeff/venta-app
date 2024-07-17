import { BookAccountLabel, PrismaClient, ROLE } from "@prisma/client"

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

  // generate categories
  const storeACategories = await prisma.category.createMany({
    data: [
      "Hot Coffee",
      "Iced Coffee",
      "Drinks",
      "Bread & Pastries",
      "Supply",
    ].map((cat) => ({
      name: cat,
      ownerId: user.id,
      storeId: storeA.id,
    })),
  })

  const storeBCategories = await prisma.category.createMany({
    data: [
      "PVC ID",
      "Souvenir",
      "Document Print",
      "Design",
      "Invitation Cards",
    ].map((cat) => ({
      name: cat,
      ownerId: user.id,
      storeId: storeB.id,
    })),
  })

  console.log(
    `Generated categories for ${storeA.name}: `,
    storeACategories.count
  )
  console.log(
    `Generated categories for ${storeB.name}: `,
    storeBCategories.count
  )

  // generate book account types
  // for each book account type, generate detail account types
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
          include: {
            detailTypes: true,
          },
        })
    )
  ).then((values) => values)

  console.log(
    `Generated Book Account and Detail types: `,
    bookAccountTypes.length
  )

  // generate the ff. Book Accounts (Chart of Accounts)
  // - Inventory Asset Account
  // - Income Account
  // - Expense Account
  const currentAssetsAccType = bookAccountTypes.find(
    (b) => b.name === "Current assets"
  )

  await prisma.bookAccount.createMany({
    data: [storeA, storeB].map((s) => ({
      name: "Inventory",
      accountTypeId: currentAssetsAccType?.id!,
      detailTypeId: currentAssetsAccType?.detailTypes?.find(
        (d) => d.name === "Inventory"
      )?.id!,
      storeId: s.id,
      ownerId: user.id,
      label: BookAccountLabel.INVENTORY,
    })),
  })

  const incomeAccType = bookAccountTypes.find((b) => b.name === "Income")

  await prisma.bookAccount.createMany({
    data: [storeA, storeB].map((s) => ({
      name: "Sales of Product Income",
      accountTypeId: incomeAccType?.id!,
      detailTypeId: incomeAccType?.detailTypes?.find(
        (d) => d.name === "Sales of Product Income"
      )?.id!,
      storeId: s.id,
      ownerId: user.id,
      label: BookAccountLabel.INCOME,
    })),
  })

  const expenseAccType = bookAccountTypes.find(
    (b) => b.name === "Cost of sales"
  )

  await prisma.bookAccount.createMany({
    data: [storeA, storeB].map((s) => ({
      name: "Cost of sales",
      accountTypeId: expenseAccType?.id!,
      detailTypeId: expenseAccType?.detailTypes?.find(
        (d) => d.name === "Supplies and materials - COS"
      )?.id!,
      storeId: s.id,
      ownerId: user.id,
      label: BookAccountLabel.EXPENSE,
    })),
  })

  await prisma.bookAccount.createMany({
    data: [storeA, storeB].map((s) => ({
      name: "Inventory Shrinkage",
      accountTypeId: expenseAccType?.id!,
      detailTypeId: expenseAccType?.detailTypes?.find(
        (d) => d.name === "Supplies and materials - COS"
      )?.id!,
      storeId: s.id,
      ownerId: user.id,
      label: BookAccountLabel.EXPENSE,
    })),
  })

  await prisma.bookAccount.createMany({
    data: [storeA, storeB].map((s) => ({
      name: "Supplies and materials - COS",
      accountTypeId: expenseAccType?.id!,
      detailTypeId: expenseAccType?.detailTypes?.find(
        (d) => d.name === "Supplies and materials - COS"
      )?.id!,
      storeId: s.id,
      ownerId: user.id,
      label: BookAccountLabel.EXPENSE,
    })),
  })

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
