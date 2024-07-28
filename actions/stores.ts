"use server"

import prisma from "@/prisma/client"
import * as z from "zod"

import { authedProcedure } from "./procedures/auth"

const action = authedProcedure.createServerAction()

export const getStores = action.handler(async ({ ctx }) => {
  const stores = await prisma.store.findMany({
    where: {
      ownerId: ctx.user.id,
    },
  })

  return stores
})

export const getStoreBySlug = action
  .input(z.object({ slug: z.string() }))
  .handler(async ({ ctx, input }) => {
    try {
      const result = await prisma.store.findFirst({
        where: {
          slug: input.slug,
          ownerId: ctx.user.id,
        },
      })

      return result
    } catch (error) {
      return null
    }
  })
