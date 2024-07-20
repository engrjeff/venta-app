"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/prisma/client"
import { createCategorySchema } from "@/schema/category"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, getSkip } from "./config"
import { authedProcedure } from "./procedures/auth"
import {
  changeStatusSchema,
  withEntityId,
  withPaginationAndSort,
  withStoreId,
} from "./types"

export const getCategories = authedProcedure
  .createServerAction()
  .input(withStoreId.merge(withPaginationAndSort))
  .handler(async ({ ctx, input }) => {
    try {
      const pageSize = input.limit ?? DEFAULT_PAGE_SIZE

      const categories = await prisma.category.findMany({
        where: {
          ownerId: ctx.user.id,
          storeId: input.storeId,
        },
        take: pageSize,
        skip: getSkip({ limit: input.limit, page: input.page }),
        orderBy: {
          [input.sort]: input.order,
        },
      })

      const total = await prisma.category.count({
        where: { storeId: input.storeId },
      })

      const pageInfo = {
        currentPage: input.page ?? DEFAULT_PAGE,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      }

      return {
        items: categories,
        pageInfo,
      }
    } catch (error) {
      return {
        items: [],
        pageInfo: {
          currentPage: DEFAULT_PAGE,
          pageSize: DEFAULT_PAGE_SIZE,
          totalPages: 0,
        },
      }
    }
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
        include: {
          store: {
            select: {
              slug: true,
            },
          },
        },
      })

      // revalidate here
      revalidatePath(`/${result.store.slug}/items`)

      return result
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            throw `${input.name} already exists.`
        }
      }
    }
  })

export const updateCategoryStatus = authedProcedure
  .createServerAction()
  .input(changeStatusSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const category = await prisma.category.findUnique({
        where: { id: input.id },
      })

      if (!category) throw `Cannot find category with ID ${input.id}`

      const result = await prisma.category.update({
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
      revalidatePath(`/${result.store.slug}/categories`)

      return result
    } catch (error) {
      if (typeof error === "string") throw error
    }
  })

export const updateCategory = authedProcedure
  .createServerAction()
  .input(withEntityId.merge(createCategorySchema).partial())
  .handler(async ({ ctx, input }) => {
    try {
      const category = await prisma.category.findUnique({
        where: { id: input.id },
      })

      if (!category) throw `Cannot find category with ID ${input.id}`

      const result = await prisma.category.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
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
      revalidatePath(`/${result.store.slug}/categories`)

      return result
    } catch (error) {
      console.log(error)
      if (typeof error === "string") throw error

      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            throw `${input.name} already exists.`
          default:
            throw error.message
        }
      }
    }
  })
