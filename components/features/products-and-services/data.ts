import { ProductServiceType } from "@prisma/client"

export const PRODUCT_TYPES = [
  {
    label: "Inventory",
    value: ProductServiceType.INVENTORY,
  },
  {
    label: "Non-Inventory",
    value: ProductServiceType.NON_INVENTORY,
  },
  {
    label: "Inventory Assembly",
    value: ProductServiceType.INVENTORY_ASSEMBLY,
  },
  {
    label: "Service",
    value: ProductServiceType.SERVICE,
  },
  {
    label: "Bundle",
    value: ProductServiceType.BUNDLE,
  },
]

export const PRODUCT_STATUS_OPTIONS = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
]
