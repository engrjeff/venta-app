import * as z from "zod"

export const conversionSchema = z.object({
  name: z.string().min(1, { message: "Required." }),
  to: z.string().min(1, { message: "Required." }),
  description: z.string().optional(),
  factor: z.string().min(1, { message: "Required." }),
  id: z.string().optional(),
})

export const createUnitSchema = z.object({
  storeId: z.string().min(1, { message: "Store is required." }),
  name: z.string().min(1, { message: "Unit name is required." }),
  conversions: z.array(conversionSchema),
})

export const editUnitSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Unit name is required." }),
  conversions: z.array(conversionSchema),
})

export type UnitConversionInput = z.infer<typeof conversionSchema>

export type CreateUnitInput = z.infer<typeof createUnitSchema>

export type EditUnitInput = z.infer<typeof editUnitSchema>
