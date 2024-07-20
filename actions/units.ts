"use server"

import prisma from "@/prisma/client"
import { conversionSchema, createUnitSchema } from "@/schema/unit"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { z } from "zod"

import { authedProcedure } from "./procedures/auth"
import { withStoreId } from "./types"

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
              to: conversion.to,
              name: conversion.name,
              description: conversion.description,
              factor: Number(conversion.factor),
              ownerId: ctx.user.id,
              storeId: input.storeId,
            })),
          },
        },
      })

      return result
    } catch (error) {
      console.log(error)
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            throw `${input.name} already exists.`
        }
      }
    }
  })

//  unit conversions
export const createUnitConversion = authedProcedure
  .createServerAction()
  .input(conversionSchema.merge(withStoreId).extend({ unitId: z.string() }))
  .handler(async ({ ctx, input }) => {
    try {
      const result = await prisma.unitConversion.create({
        data: {
          ownerId: ctx.user.id,
          storeId: input.storeId,
          unitId: input.unitId,
          to: input.to,
          name: input.name,
          description: input.description,
          factor: Number(input.factor),
        },
      })

      return result
    } catch (error) {
      console.log(error)
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            throw `${input.name} already exists.`
        }
      }
    }
  })
