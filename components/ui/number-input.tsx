import * as React from "react"

import { cn } from "@/lib/utils"

import { Input } from "./input"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  currency?: string
}

const NumberInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, currency, ...props }, ref) => {
    if (currency)
      return (
        <div className="relative rounded-md">
          <div className="absolute left-0 top-0 flex h-full items-center justify-center rounded-l px-1.5 py-1">
            <span className="text-xs text-muted-foreground">{currency}</span>
          </div>
          <Input
            className={cn("pl-10", className)}
            ref={ref}
            type="number"
            inputMode="numeric"
            onWheel={(e) => {
              e.currentTarget?.blur()
            }}
            {...props}
          />
        </div>
      )

    return (
      <Input
        className={className}
        ref={ref}
        type="number"
        inputMode="numeric"
        onWheel={(e) => {
          e.currentTarget?.blur()
        }}
        {...props}
      />
    )
  }
)

NumberInput.displayName = "NumberInput"

export { NumberInput }
