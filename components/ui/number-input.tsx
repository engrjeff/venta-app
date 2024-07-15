import * as React from "react"

import { Input } from "./input"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const NumberInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
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
