import * as z from "zod"

export const createSupplierSchema = z.object({
  storeId: z.string().min(1, { message: "Store is required." }),
  name: z.string().min(1, { message: "Supplier name is required." }),
})

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>
