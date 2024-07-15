"use server"

import prisma from "@/prisma/client"
import { createCategorySchema } from "@/schema/category"
import { z } from "zod"

import { authedProcedure } from "./procedures/auth"

export const getCategories = authedProcedure
  .createServerAction()
  .input(z.object({ storeId: z.string() }))
  .handler(async ({ ctx, input }) => {
    const categories = await prisma.category.findMany({
      where: {
        ownerId: ctx.user.id,
        storeId: input.storeId,
      },
      orderBy: {
        name: "asc",
      },
    })

    return categories
  })

export const createCategory = authedProcedure
  .createServerAction()
  .input(createCategorySchema)
  .handler(async ({ ctx, input }) => {
    try {
      const result = await prisma.category.create({
        data: {
          ownerId: ctx.user.id,
          storeId: input.storeId,
          name: input.name,
        },
      })

      return result
    } catch (error) {}
  })
