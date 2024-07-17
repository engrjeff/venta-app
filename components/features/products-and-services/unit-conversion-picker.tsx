"use client"

import { useUnits } from "@/hooks/useUnits"
import { AppCombobox } from "@/components/shared/app-combobox"

export function UnitConversionPicker({
  unitId,
  value,
  onValueChange,
}: {
  unitId?: string
  value?: string
  onValueChange: (val?: string) => void
}) {
  const { data, isLoading } = useUnits()

  const unit = data?.find((u) => u.id === unitId)

  const disabled = isLoading || !unit?.conversions?.length

  return (
    <AppCombobox
      label="Conversion"
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      key={value}
      options={
        unit?.conversions?.map((item) => ({
          value: item.id,
          label: item.name,
        })) ?? []
      }
    />
  )
}
