import { ItemStatus } from "@prisma/client"
import * as z from "zod"

export const withStoreId = z.object({
  storeId: z
    .string({ required_error: "Store ID is required." })
    .min(1, { message: "Store ID is required." }),
})

export const withPaginationAndSort = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().default(10),
  sort: z.string().default("createdAt"),
  order: z.string().default("desc"),
})

export const withEntityId = z.object({
  id: z.string({ required_error: "ID is required." }),
})

export const changeStatusSchema = z.object({
  id: z.string({ required_error: "ID is required." }),
  status: z.nativeEnum(ItemStatus),
})
