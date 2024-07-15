"use server"

import prisma from "@/prisma/client"
import { createUnitSchema } from "@/schema/unit"
import { z } from "zod"

import { authedProcedure } from "./procedures/auth"

export const getStoreUnits = authedProcedure
  .createServerAction()
  .input(z.object({ storeId: z.string() }))
  .handler(async ({ ctx, input }) => {
    const units = await prisma.unit.findMany({
      where: {
        ownerId: ctx.user.id,
        storeId: input.storeId,
      },
      include: {
        conversions: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return units
  })

export const createUnit = authedProcedure
  .createServerAction()
  .input(createUnitSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const result = await prisma.unit.create({
        data: {
          ownerId: ctx.user.id,
          storeId: input.storeId,
          name: input.name,
          conversions: {
            create: input.conversions.map((conversion) => ({
              from: conversion.from,
              to: conversion.to,
              factor: Number(conversion.factor),
              ownerId: ctx.user.id,
              storeId: input.storeId,
            })),
          },
        },
      })

      return result
    } catch (error) {}
  })
