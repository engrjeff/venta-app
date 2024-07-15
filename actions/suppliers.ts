"use server"

import prisma from "@/prisma/client"
import { createSupplierSchema } from "@/schema/supplier"
import { z } from "zod"

import { authedProcedure } from "./procedures/auth"

export const getSuppliers = authedProcedure
  .createServerAction()
  .input(z.object({ storeId: z.string() }))
  .handler(async ({ ctx, input }) => {
    const suppliers = await prisma.supplier.findMany({
      where: {
        ownerId: ctx.user.id,
        storeId: input.storeId,
      },
      orderBy: {
        name: "asc",
      },
    })

    return suppliers
  })

export const createSupplier = authedProcedure
  .createServerAction()
  .input(createSupplierSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const result = await prisma.supplier.create({
        data: {
          ownerId: ctx.user.id,
          storeId: input.storeId,
          name: input.name,
        },
      })

      return result
    } catch (error) {}
  })
