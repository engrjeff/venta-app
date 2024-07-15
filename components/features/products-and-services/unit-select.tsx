"use client"

import { useUnits } from "@/hooks/useUnits"
import { AppCombobox } from "@/components/shared/app-combobox"

import { NewUnitForm } from "./new-unit-form"

export function UnitSelect({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (val?: string) => void
}) {
  const { data, isLoading } = useUnits()

  return (
    <AppCombobox
      label="Select unit"
      value={value}
      onValueChange={onValueChange}
      disabled={isLoading}
      key={value}
      options={
        data?.map((item) => ({ value: item.id, label: item.name })) ?? []
      }
      renderEmpty={(search) => (
        <NewUnitForm
          key={data?.length}
          initialValue={search}
          onAfterSave={onValueChange}
        />
      )}
    />
  )
}
