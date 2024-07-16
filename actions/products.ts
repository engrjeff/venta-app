"use server"

import prisma from "@/prisma/client"
import { inventoryCreateSchema } from "@/schema/product"
import { ProductServiceType } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

import { authedProcedure } from "./procedures/auth"
import { withPagination, withStoreId } from "./types"

export const getProductServiceItems = authedProcedure
  .createServerAction()
  .input(withStoreId.merge(withPagination))
  .handler(async ({ ctx, input }) => {
    try {
      const result = await prisma.productServiceItem.findMany({
        where: {
          ownerId: ctx.user.id,
          storeId: input.storeId,
        },
        take: input.limit,
        skip: input.limit * (input.page - 1),
        orderBy: {
          createdAt: "desc",
        },
      })

      return result
    } catch (error) {
      return []
    }
  })

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
      })

      return result
    } catch (error) {
      console.log(error)
      if (error instanceof PrismaClientKnownRequestError)
        switch (error.code) {
          case "P2002":
            throw `${input.name} already exists.`
        }
    }
  })
