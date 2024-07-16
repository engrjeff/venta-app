"use server"

import prisma from "@/prisma/client"
import { inventoryCreateSchema } from "@/schema/product"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

import { authedProcedure } from "./procedures/auth"
import { withStoreId } from "./types"

export const createInventoryProduct = authedProcedure
  .createServerAction()
  .input(inventoryCreateSchema.merge(withStoreId))
  .handler(async ({ ctx, input }) => {
    try {
      const result = await prisma.productServiceItem.create({
        data: {
          ownerId: ctx.user.id,
          ...input,
          asOfDate: input.asOfDate ? new Date(input.asOfDate) : undefined,
        },
      })

      return result
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        switch (error.code) {
          case "P2002":
            throw `${input.name} already exists.`
        }
    }
  })
