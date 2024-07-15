import * as z from "zod"

export const createUnitSchema = z.object({
  storeId: z.string().min(1, { message: "Store is required." }),
  name: z.string().min(1, { message: "Unit name is required." }),
  conversions: z.array(
    z.object({
      from: z.string().min(1, { message: "Required." }),
      to: z.string().min(1, { message: "Required." }),
      factor: z.string().min(1, { message: "Required." }),
    })
  ),
})

export type CreateUnitInput = z.infer<typeof createUnitSchema>
