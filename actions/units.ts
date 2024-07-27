"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/prisma/client"
import {
  conversionSchema,
  createUnitSchema,
  editUnitSchema,
} from "@/schema/unit"
import { ItemStatus } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { z } from "zod"

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, getSkip } from "./config"
import { authedProcedure } from "./procedures/auth"
import { changeStatusSchema, withPaginationAndSort, withStoreId } from "./types"

export const getStoreUnits = authedProcedure
  .createServerAction()
  .input(
    withStoreId.merge(withPaginationAndSort).extend({
      status: z.string().default("true"),
      search: z.string().optional(),
    })
  )
  .handler(async ({ ctx, input }) => {
    try {
      const pageSize = input.limit ?? DEFAULT_PAGE_SIZE

      const units = await prisma.unit.findMany({
        where: {
          ownerId: ctx.user.id,
          storeId: input.storeId,
          status:
            input.status === "inactive"
              ? ItemStatus.INACTIVE
              : ItemStatus.ACTIVE,
          name: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        include: {
          conversions: true,
        },
        take: pageSize,
        skip: getSkip({ limit: input.limit, page: input.page }),
        orderBy: {
          [input.sort]: input.order,
        },
      })

      const totalCount = await prisma.unit.count({
        where: { storeId: input.storeId },
      })

      const total = await prisma.unit.count({
        where: {
          storeId: input.storeId,
          status:
            input.status === "inactive"
              ? ItemStatus.INACTIVE
              : ItemStatus.ACTIVE,
          name: {
            contains: input.search,
            mode: "insensitive",
          },
        },
      })

      const pageInfo = {
        currentPage: input.page ?? DEFAULT_PAGE,
        pageSize,
        totalCount,
        totalPages: Math.ceil(total / pageSize),
      }

      return {
        items: units,
        pageInfo,
      }
    } catch (error) {
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
        include: {
          store: {
            select: {
              slug: true,
            },
          },
        },
      })

      // revalidate here
      revalidatePath(`/${result.store.slug}/units`)

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

export const updateUnitStatus = authedProcedure
  .createServerAction()
  .input(changeStatusSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const category = await prisma.unit.findUnique({
        where: { id: input.id },
      })

      if (!category) throw `Cannot find unit with ID ${input.id}`

      const result = await prisma.unit.update({
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
      revalidatePath(`/${result.store.slug}/units`)

      return result
    } catch (error) {
      if (typeof error === "string") throw error
    }
  })

export const updateUnit = authedProcedure
  .createServerAction()
  .input(editUnitSchema)
  .handler(async ({ ctx, input }) => {})
