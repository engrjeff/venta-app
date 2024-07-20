"use client"

import { InfoIcon } from "lucide-react"

import { useUnits } from "@/hooks/useUnits"

export function ConversionInfo({
  unitId,
  conversionId,
}: {
  unitId?: string
  conversionId?: string
}) {
  const units = useUnits()

  if (!unitId || !conversionId) return null

  const unit = units.data?.find((u) => u.id === unitId)

  if (!unit) return null

  const conversion = unit?.conversions.find((c) => c.id === conversionId)

  return (
    <p className="flex items-center text-xs text-muted-foreground">
      <InfoIcon className="mr-1 size-3" /> 1 {unit.name} = {conversion?.factor}{" "}
      {conversion?.to}
    </p>
  )
}
