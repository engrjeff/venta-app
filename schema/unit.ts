import * as z from "zod"

export const createUnitSchema = z.object({
  storeId: z.string().min(1, { message: "Store is required." }),
  name: z.string().min(1, { message: "Unit name is required." }),
  conversions: z.array(
    z.object({
      name: z.string().min(1, { message: "Required." }),
      description: z.string().optional(),
      factor: z.string().min(1, { message: "Required." }),
    })
  ),
})

export type CreateUnitInput = z.infer<typeof createUnitSchema>
