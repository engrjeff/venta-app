"use client"

import { ProductItem } from "@/actions/products"
import { ProductServiceType } from "@prisma/client"

import { InventoryTypeEditForm } from "./inventory-type-edit-form"

interface Props {
  product: ProductItem
  closeCallback?: () => void
}

export function EditProductServiceForm({ product, closeCallback }: Props) {
  if (product.type === ProductServiceType.INVENTORY)
    return (
      <InventoryTypeEditForm product={product} closeCallback={closeCallback} />
    )

  return <div>{product.id}</div>
}
