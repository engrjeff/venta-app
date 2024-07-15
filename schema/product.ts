import * as z from "zod"

export const productCreateSchema = z.object({
  name: z.string(),
  sku: z.string(),
  status: z.string(),
  stockStatus: z.string(),
  categoryId: z.string(),

  image: z.string(),

  unitId: z.string(),

  initialQuantity: z.number().int().positive(),
  asOfDate: z.string().date(),
  reorderPoint: z.number(),
  description: z.string(),
  salesPriceOrRate: z.number(),

  inventoryAssetAccountId: z.string(),
  incomeAccountId: z.string(),
  purchasingDescription: z.string(),
  expenseAccountId: z.string(),

  cost: z.number(),

  isSelling: z.boolean(),
  isPurchasing: z.boolean(),

  supplierId: z.string(),
})

export type ProductCreateInput = z.infer<typeof productCreateSchema>
