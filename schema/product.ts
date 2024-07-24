import { ProductServiceStatus, ProductServiceStockStatus } from "@prisma/client"
import * as z from "zod"

export const productCreateSchema = z.object({
  name: z
    .string({ message: "Name is required." })
    .min(1, { message: "Name is required." }),
  sku: z
    .string({ message: "SKU is required." })
    .min(1, { message: "SKU is required." }),

  status: z.nativeEnum(ProductServiceStatus).default("ACTIVE"),
  stockStatus: z.nativeEnum(ProductServiceStockStatus).default("IN_STOCK"),

  categoryId: z.string().optional(),

  image: z.string().url({ message: "Invalid image URL." }).optional(),

  unitId: z.string().optional(),

  unitConversionId: z.string().optional(),

  description: z.string().optional(),

  salesPriceOrRate: z
    .number({ message: "Invalid sales price/rate." })
    .optional(),

  inventoryAssetAccountId: z.string().optional(),
  incomeAccountId: z.string().optional(),
  expenseAccountId: z.string().optional(),

  purchasingDescription: z.string().optional(),

  cost: z.number({ message: "Invalid cost." }).optional(),

  isSelling: z.boolean().optional(),
  isPurchasing: z.boolean().optional(),

  supplierId: z.string().optional(),
})

export const inventoryCreateSchema = productCreateSchema.extend({
  initialQuantity: z
    .number({ message: "Invalid quantity." })
    .int({ message: "Must be a whole number." })
    .positive({ message: "Must be greater than 0" })
    .optional(),

  asOfDate: z
    .string({ required_error: "Required." })
    .min(10, { message: "Required." }),

  reorderPoint: z
    .number({ message: "Invalid value." })
    .int({ message: "Must be a whole number." })
    .positive({ message: "Must be greater than 0" })
    .optional(),
})

export const serviceCreateSchema = productCreateSchema.extend({
  sku: z.string().optional(),
})

export const inventoryAssemblyCreateSchema = productCreateSchema.extend({
  bundledProducts: z
    .array(
      z.object({
        id: z.string().optional(),
        productId: z
          .string({ required_error: "Product is required." })
          .min(1, { message: "Product is required." }),
        quantity: z
          .number({ message: "Invalid qty." })
          .int({ message: "Must be a whole number." })
          .positive({ message: "Must be greater than 0." }),
      })
    )
    .min(2, { message: "Should have at least 2 products." }),
})

export const copyProductSchema = inventoryCreateSchema
  .pick({
    name: true,
    sku: true,
  })
  .extend({
    productToCopyId: z.string(),
  })

export const inventoryEditSchema = inventoryCreateSchema.extend({
  type: z.literal("inventory"),
  id: z.string(),
})

export const nonInventoryEditSchema = productCreateSchema.extend({
  type: z.literal("non-inventory"),
  id: z.string(),
})

export const serviceEditSchema = serviceCreateSchema.extend({
  type: z.literal("service"),
  id: z.string(),
})

export type ProductCreateInput = z.infer<typeof productCreateSchema>

export type InventoryCreateInput = z.infer<typeof inventoryCreateSchema>

export type CopyProductInput = z.infer<typeof copyProductSchema>

export type ServiceInput = z.infer<typeof serviceCreateSchema>

export type InventoryAssemblyInput = z.infer<
  typeof inventoryAssemblyCreateSchema
>
