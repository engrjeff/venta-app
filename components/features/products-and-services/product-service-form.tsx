"use client"

import { ReactNode, useState } from "react"
import { ProductServiceType } from "@prisma/client"

import { Button } from "@/components/ui/button"

import { BundleTypeForm } from "./bundle-type-form"
import { InventoryTypeForm } from "./inventory-type-form"
import { NonInventoryTypeForm } from "./non-inventory-type-form"
import { ProductTypePicker } from "./product-type-picker"
import { ServiceTypeForm } from "./service-type-form"

interface Props {
  closeCallback?: () => void
}

export function ProductServiceForm({ closeCallback }: Props) {
  const [view, setView] = useState<"form" | "type-picker">("type-picker")
  const [productType, setProductType] = useState<ProductServiceType>()

  const formMap: Record<ProductServiceType, ReactNode> = {
    INVENTORY: <InventoryTypeForm closeCallback={closeCallback} />,
    NON_INVENTORY: <NonInventoryTypeForm closeCallback={closeCallback} />,
    SERVICE: <ServiceTypeForm closeCallback={closeCallback} />,
    INVENTORY_ASSEMBLY: <BundleTypeForm closeCallback={closeCallback} />,
  }

  function handleProducTypeChange(value: string) {
    setProductType(value as ProductServiceType)

    setTimeout(() => {
      setView("form")
    }, 500)
  }

  if (!productType)
    return (
      <ProductTypePicker
        value={productType}
        onChange={handleProducTypeChange}
      />
    )

  if (view === "type-picker")
    return (
      <ProductTypePicker
        value={productType}
        onChange={handleProducTypeChange}
      />
    )

  return (
    <div>
      <div className="flex items-center justify-between px-4">
        <span className="font-semibold capitalize">
          {productType.replaceAll("_", " ").toLowerCase()}{" "}
        </span>
        <Button
          variant="link"
          onClick={() => {
            setProductType(undefined)
            setView("type-picker")
          }}
        >
          Change type
        </Button>
      </div>
      {formMap[productType]}
    </div>
  )
}
