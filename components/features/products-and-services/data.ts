import { ProductServiceType } from "@prisma/client"

export const PRODUCT_TYPES = [
  {
    label: "Inventory",
    value: ProductServiceType.INVENTORY,
    color: "bg-primary",
  },
  {
    label: "Non-Inventory",
    value: ProductServiceType.NON_INVENTORY,
    color: "bg-sky-500",
  },
  {
    label: "Inventory Assembly",
    value: ProductServiceType.INVENTORY_ASSEMBLY,
    color: "bg-purple-500",
  },
  {
    label: "Service",
    value: ProductServiceType.SERVICE,
    color: "bg-green-600",
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
