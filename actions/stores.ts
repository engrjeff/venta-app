"use server"

import prisma from "@/prisma/client"

import { authedProcedure } from "./procedures/auth"

export const getStores = authedProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    const stores = await prisma.store.findMany({
      where: {
        ownerId: ctx.user.id,
      },
    })

    return stores
  })
