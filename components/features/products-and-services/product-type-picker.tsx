"use client"

import { ProductServiceType } from "@prisma/client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const productItemTypes: Array<{
  name: string
  description: string
  type: ProductServiceType
}> = [
  {
    name: "Inventory",
    description: "Products you buy and/or sell that you track quantities of.",
    type: "INVENTORY",
  },
  {
    name: "Non-inventory",
    description:
      "Products you buy and/or sell but don't need to (or can't) track quantities of.",
    type: "NON_INVENTORY",
  },
  {
    name: "Service",
    description: "Services that you provide to customers. e.g. Delivery.",
    type: "SERVICE",
  },
  {
    name: "Inventory Assembly",
    description:
      "A collection of products and/or services that you sell together.",
    type: "INVENTORY_ASSEMBLY",
  },
]

export function ProductTypePicker({
  value,
  onChange,
}: {
  value: string | undefined
  onChange: (val: string) => void
}) {
  return (
    <RadioGroup className="block" value={value} onValueChange={onChange}>
      {productItemTypes.map((productType) => (
        <div
          key={`product-type-${productType.name}`}
          className="flex w-full items-start gap-4 border-b p-4 hover:bg-muted"
        >
          <RadioGroupItem
            className="peer shrink-0"
            value={productType.type}
            id={productType.name}
          />
          <Label
            htmlFor={productType.name}
            className="flex flex-1 cursor-pointer"
          >
            <div>
              <p className="mb-2 font-semibold">{productType.name}</p>
              <p className="text-sm text-muted-foreground">
                {productType.description}
              </p>
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
