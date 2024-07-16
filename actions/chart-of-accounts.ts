"use server"

import prisma from "@/prisma/client"
import { BookAccountLabel } from "@prisma/client"
import { z } from "zod"

import { authedProcedure } from "./procedures/auth"

export const getBookAccountsByLabel = authedProcedure
  .createServerAction()
  .input(
    z.object({ storeId: z.string(), label: z.nativeEnum(BookAccountLabel) })
  )
  .handler(async ({ ctx, input }) => {
    const accounts = await prisma.bookAccount.findMany({
      where: {
        ownerId: ctx.user.id,
        storeId: input.storeId,
        label: input.label,
      },
      orderBy: {
        name: "asc",
      },
    })

    return accounts
  })
