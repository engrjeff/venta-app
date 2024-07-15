import * as z from "zod"

export const createCategorySchema = z.object({
  storeId: z.string().min(1, { message: "Store is required." }),
  name: z.string().min(1, { message: "Category name is required." }),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
