import * as z from "zod"

export const withStoreId = z.object({
  storeId: z
    .string({ required_error: "Store ID is required." })
    .min(1, { message: "Store ID is required." }),
})
