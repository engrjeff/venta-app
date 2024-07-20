"use client"

import * as React from "react"
import { PencilLineIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  productName?: string
  onValueChange: (value: string) => void
}

const SkuInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, productName, onValueChange, ...props }, ref) => {
    function generateSku() {
      if (!productName) return

      const sku = productName
        .replaceAll("-", "")
        .split(" ")
        .filter(Boolean)
        .map((s) => s.slice(0, 3).toUpperCase())
        .join("-")

      onValueChange(sku)
    }

    return (
      <div className="relative w-full flex-1">
        <Input
          type="text"
          className={cn(className)}
          ref={ref}
          {...props}
          onChange={(e) => onValueChange(e.currentTarget.value)}
        />
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute right-1 top-1 size-8"
          title="click to generate SKU"
          onClick={(e) => {
            e.stopPropagation()
            generateSku()
          }}
        >
          <span className="sr-only">generate sku</span>
          <PencilLineIcon className="size-4" />
        </Button>
      </div>
    )
  }
)

SkuInput.displayName = "SkuInput"

export { SkuInput }
