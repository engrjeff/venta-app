"use client"

import { useSuppliers } from "@/hooks/useSuppliers"
import { AppCombobox } from "@/components/shared/app-combobox"

import { NewSupplierForm } from "./new-supplier-form"

export function SupplierSelect({
  value,
  onValueChange,
}: {
  value?: string
  onValueChange: (val?: string) => void
}) {
  const { data, isLoading } = useSuppliers()

  return (
    <AppCombobox
      label="Select supplier"
      value={value}
      onValueChange={onValueChange}
      disabled={isLoading}
      key={value}
      options={
        data?.map((item) => ({ value: item.id, label: item.name })) ?? []
      }
      renderEmpty={(search) => (
        <NewSupplierForm
          key={data?.length}
          initialValue={search}
          onAfterSave={onValueChange}
        />
      )}
    />
  )
}
