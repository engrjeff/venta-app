"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/prisma/client"
import {
  copyProductSchema,
  inventoryAssemblyCreateSchema,
  InventoryAssemblyEditInput,
  inventoryAssemblyEditSchema,
  inventoryCreateSchema,
  inventoryEditSchema,
  nonInventoryEditSchema,
  productCreateSchema,
  serviceCreateSchema,
  serviceEditSchema,
} from "@/schema/product"
import { appendCurrency } from "@/server/utils"
import {
  ProductServiceStatus,
  ProductServiceStockStatus,
  ProductServiceType,
} from "@prisma/client"
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library"
import pluralize from "pluralize"
import { z } from "zod"
import { inferServerActionReturnData } from "zsa"

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, getSkip } from "./config"
import { authedProcedure } from "./procedures/auth"
import {
  changeBulkStatusSchema,
  changeStatusSchema,
  withPaginationAndSort,
  withStoreId,
} from "./types"

const action = authedProcedure.createServerAction()

export const getProductServiceItems = action
  .input(
    withStoreId.merge(withPaginationAndSort).extend({
      status: z.string().default("true"),
      search: z.string().optional(),
      type: z.nativeEnum(ProductServiceType).optional(),
      stockStatus: z.nativeEnum(ProductServiceStockStatus).optional(),
    })
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
          stockStatus: input.stockStatus,
          name: {
            contains: input.search,
            mode: "insensitive",
          },
          type: input.type,
        },
        include: {
          unit: {
            select: { id: true, name: true },
          },
          bundledProducts: true,
        },
        take: pageSize,
        skip: getSkip({ limit: input.limit, page: input.page }),
        orderBy: {
          [input.sort]: input.order,
        },
      })

      const items = result?.map((item) => ({
        ...item,
        rawCost: item.cost,
        rawSalesOrPrice: item.salesPriceOrRate,
        cost: appendCurrency(item.cost),
        salesPriceOrRate: appendCurrency(item.salesPriceOrRate),
        unit: item.unit
          ? {
              id: item.unit?.id,
              name: item.initialQuantity
                ? pluralize(item.unit.name, item.initialQuantity ?? 0)
                : item.unit.name,
            }
          : undefined,
      }))

      const totalCount = await prisma.productServiceItem.count({
        where: { storeId: input.storeId },
      })

      const total = await prisma.productServiceItem.count({
        where: {
          storeId: input.storeId,
          status:
            input.status === "inactive"
              ? ProductServiceStatus.INACTIVE
              : ProductServiceStatus.ACTIVE,
          stockStatus: input.stockStatus,
          name: {
            contains: input.search,
            mode: "insensitive",
          },
          type: input.type,
        },
      })

      const pageInfo = {
        currentPage: input.page ?? DEFAULT_PAGE,
        pageSize,
        totalCount,
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
          totalCount: 0,
          totalPages: 0,
        },
      }
    }
  })

export type ProductItems = inferServerActionReturnData<
  typeof getProductServiceItems
>

export type ProductItem = ProductItems["items"][number]

export const createInventoryProduct = action
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

export const createServiceProduct = action
  .input(serviceCreateSchema.merge(withStoreId))
  .handler(async ({ ctx, input }) => {
    try {
      const result = await prisma.productServiceItem.create({
        data: {
          ownerId: ctx.user.id,
          type: ProductServiceType.SERVICE,
          ...input,
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

export const createNonInventoryProduct = action
  .input(productCreateSchema.merge(withStoreId))
  .handler(async ({ ctx, input }) => {
    try {
      const result = await prisma.productServiceItem.create({
        data: {
          ownerId: ctx.user.id,
          type: ProductServiceType.NON_INVENTORY,
          ...input,
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

export const createInventoryAssembly = action
  .input(inventoryAssemblyCreateSchema.merge(withStoreId))
  .handler(async ({ ctx, input }) => {
    try {
      const { bundledProducts, ...fields } = input

      const result = await prisma.productServiceItem.create({
        data: {
          ownerId: ctx.user.id,
          type: ProductServiceType.INVENTORY_ASSEMBLY,
          ...fields,
          bundledProducts: {
            createMany: {
              data: bundledProducts,
            },
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
      if (error instanceof PrismaClientValidationError) {
        throw "Database error"
      }

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

export const copyProductAction = action
  .input(copyProductSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const productToCopy = await prisma.productServiceItem.findUnique({
        where: { id: input.productToCopyId },
        include: {
          bundledProducts: {
            select: {
              id: true,
              quantity: true,
              productId: true,
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
            createMany: {
              data: bundledProducts.map((b) => ({
                productId: b.productId,
                quantity: b.quantity,
              })),
            },
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

export const updateProductStatus = action
  .input(changeStatusSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const product = await prisma.productServiceItem.findUnique({
        where: { id: input.id },
      })

      if (!product) throw `Cannot find product/service with ID ${input.id}`

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

export const updateBulkProductStatus = action
  .input(changeBulkStatusSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const result = await prisma.productServiceItem.updateMany({
        where: {
          id: {
            in: input.ids,
          },
        },
        data: {
          status: input.status,
        },
      })

      // revalidate here
      revalidatePath(`/${input.storeSlug}/items`)

      return result
    } catch (error) {
      console.log(error)
      if (typeof error === "string") throw error
    }
  })

export const updateProduct = action
  .input(
    z.discriminatedUnion("type", [
      inventoryEditSchema,
      nonInventoryEditSchema,
      serviceEditSchema,
      inventoryAssemblyEditSchema,
    ])
  )
  .handler(async ({ ctx, input }) => {
    try {
      const product = await prisma.productServiceItem.findUnique({
        where: { id: input.id },
      })

      if (!product) throw `Cannot find product/service with ID ${input.id}`

      const { type, id, ...properties } = input

      let fields = {}

      if (input.type === "inventory") {
        fields = {
          ...properties,
          asOfDate: input.asOfDate ? new Date(input.asOfDate) : undefined,
        }
      }

      if (input.type === "non-inventory") {
        fields = properties
      }

      if (input.type === "service") {
        fields = properties
      }

      if (input.type === "inventory-assembly") {
        return updateInventoryAssembly(input)
      }

      const result = await prisma.productServiceItem.update({
        where: {
          id,
        },
        data: fields,
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

// update bundled products
async function updateInventoryAssembly(input: InventoryAssemblyEditInput) {
  const { id, type, bundledProducts, ...fields } = input

  // update fields
  const result = await prisma.productServiceItem.update({
    where: {
      id,
    },
    data: fields,
    include: {
      store: {
        select: {
          slug: true,
        },
      },
    },
  })

  // collect bundledProducts
  // no Id means new, for create
  // with Id means for update
  const bundledItemsWithMainId = bundledProducts.map((b) => ({
    ...b,
    productServiceItemId: input.id,
  }))

  const bundledItemsForCreate = bundledItemsWithMainId.filter((b) => !b.id)

  const bundledItemsForUpdate = bundledItemsWithMainId.filter((b) => b.id)

  const bundledItemsToDelete = await prisma.productBundleItem.findMany({
    where: {
      productServiceItemId: input.id,
      AND: {
        id: {
          notIn: bundledItemsForUpdate.map((item) => item.id) as string[],
        },
      },
    },
  })

  if (bundledItemsToDelete?.length) {
    await prisma.productBundleItem.deleteMany({
      where: {
        id: {
          in: bundledItemsToDelete.map((item) => item.id),
        },
      },
    })
  }

  if (bundledItemsForUpdate?.length) {
    await Promise.all(
      bundledItemsForUpdate.map(
        async (item) =>
          await prisma.productBundleItem.update({
            data: item,
            where: {
              id: item.id,
            },
          })
      )
    )
  }

  if (bundledItemsForCreate?.length) {
    await prisma.productBundleItem.createMany({
      data: bundledItemsForCreate,
    })
  }

  // revalidate here
  revalidatePath(`/${result.store.slug}/items`)

  return result
}

// for product select
export const getProductServiceOptions = action
  .input(
    withStoreId.extend({
      search: z.string().optional(),
      excludedIds: z.string().array().optional(),
    })
  )
  .handler(async ({ ctx, input }) => {
    try {
      const result = await prisma.productServiceItem.findMany({
        where: {
          ownerId: ctx.user.id,
          storeId: input.storeId,
          status: ProductServiceStatus.ACTIVE,
          type: {
            not: ProductServiceType.INVENTORY_ASSEMBLY,
          },
          name: {
            contains: input.search,
            mode: "insensitive",
          },
          id: {
            notIn: input.excludedIds,
          },
        },
        orderBy: {
          name: "desc",
        },
      })

      return result
    } catch (error) {
      console.log(error)
      return []
    }
  })
