"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/prisma/client"
import { copyProductSchema, inventoryCreateSchema } from "@/schema/product"
import { appendCurrency } from "@/server/utils"
import { ProductServiceStatus, ProductServiceType } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import pluralize from "pluralize"
import { z } from "zod"

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, getSkip } from "./config"
import { authedProcedure } from "./procedures/auth"
import { changeStatusSchema, withPaginationAndSort, withStoreId } from "./types"

export const getProductServiceItems = authedProcedure
  .createServerAction()
  .input(
    withStoreId
      .merge(withPaginationAndSort)
      .extend({ status: z.string().default("true") })
  )
  .handler(async ({ ctx, input }) => {
    try {
      const pageSize = input.limit ?? DEFAULT_PAGE_SIZE

      const result = await prisma.productServiceItem.findMany({
        where: {
          ownerId: ctx.user.id,
          storeId: input.storeId,
          status:
            input.status === "inactive"
              ? ProductServiceStatus.INACTIVE
              : ProductServiceStatus.ACTIVE,
        },
        include: {
          unit: {
            select: { id: true, name: true },
          },
        },
        take: pageSize,
        skip: getSkip({ limit: input.limit, page: input.page }),
        orderBy: {
          [input.sort]: input.order,
        },
      })

      const items = result?.map((item) => ({
        ...item,
        cost: appendCurrency(item.cost),
        salesPriceOrRate: appendCurrency(item.salesPriceOrRate),
        unit: item.unit
          ? {
              id: item.unit?.id,
              name: pluralize(item.unit.name, item.initialQuantity ?? 0),
            }
          : undefined,
      }))

      const total = await prisma.productServiceItem.count({
        where: { storeId: input.storeId },
      })

      const pageInfo = {
        currentPage: input.page ?? DEFAULT_PAGE,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      }

      return {
        items,
        pageInfo,
      }
    } catch (error) {
      console.log(error)
      return {
        items: [],
        pageInfo: {
          currentPage: DEFAULT_PAGE,
          pageSize: DEFAULT_PAGE_SIZE,
          totalPages: 0,
        },
      }
    }
  })

export type ProductItems = NonNullable<
  Awaited<ReturnType<typeof getProductServiceItems>>["0"]
>

export const createInventoryProduct = authedProcedure
  .createServerAction()
  .input(inventoryCreateSchema.merge(withStoreId))
  .handler(async ({ ctx, input }) => {
    try {
      const result = await prisma.productServiceItem.create({
        data: {
          ownerId: ctx.user.id,
          type: ProductServiceType.INVENTORY,
          ...input,
          asOfDate: input.asOfDate ? new Date(input.asOfDate) : undefined,
        },
        include: {
          store: {
            select: {
              slug: true,
            },
          },
        },
      })

      // revalidate here
      revalidatePath(`/${result.store.slug}/items`)

      return result
    } catch (error) {
      console.log(error)
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            if (
              Array.isArray(error.meta?.target) &&
              error.meta?.target.includes("sku")
            ) {
              throw `The SKU "${input.sku}" already exists.`
            }
            throw `${input.name} already exists.`
        }
      }
    }
  })

export const copyProductAction = authedProcedure
  .createServerAction()
  .input(copyProductSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const productToCopy = await prisma.productServiceItem.findUnique({
        where: { id: input.productToCopyId },
        include: {
          bundledProducts: {
            select: {
              id: true,
            },
          },
        },
      })

      if (!productToCopy)
        throw `Cannot find product with ID ${input.productToCopyId}`

      const {
        id,
        name,
        sku,
        bundledProducts,
        createdAt,
        updatedAt,
        ...properties
      } = productToCopy

      const result = await prisma.productServiceItem.create({
        data: {
          ...properties,
          name: input.name,
          sku: input.sku,
          bundledProducts: {
            connect: bundledProducts,
          },
        },
        include: {
          store: {
            select: {
              slug: true,
            },
          },
        },
      })

      // revalidate here
      revalidatePath(`/${result.store.slug}/items`)

      return result
    } catch (error) {
      console.log(error)

      if (typeof error === "string") throw error

      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            if (
              Array.isArray(error.meta?.target) &&
              error.meta?.target.includes("sku")
            ) {
              throw `The SKU "${input.sku}" already exists.`
            }
            throw `Product name ${input.name} already exists.`
        }
      }
    }
  })

export const updateProductStatus = authedProcedure
  .createServerAction()
  .input(changeStatusSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const category = await prisma.productServiceItem.findUnique({
        where: { id: input.id },
      })

      if (!category) throw `Cannot find product/service with ID ${input.id}`

      const result = await prisma.productServiceItem.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
        include: {
          store: {
            select: {
              slug: true,
            },
          },
        },
      })

      // revalidate here
      revalidatePath(`/${result.store.slug}/items`)

      return result
    } catch (error) {
      if (typeof error === "string") throw error
    }
  })
