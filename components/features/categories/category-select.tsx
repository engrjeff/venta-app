"use client"

import { useCategories } from "@/hooks/useCategories"
import { AppCombobox } from "@/components/shared/app-combobox"

import { NewCategoryForm } from "./new-category-form"

export function CategorySelect({
  value,
  onValueChange,
}: {
  value?: string
  onValueChange: (val?: string) => void
}) {
  const { data, isLoading } = useCategories()

  return (
    <AppCombobox
      label="Select category"
      value={value}
      onValueChange={onValueChange}
      disabled={isLoading}
      key={value}
      options={
        data?.items?.map((item) => ({ value: item.id, label: item.name })) ?? []
      }
      renderEmpty={(search) => (
        <NewCategoryForm
          key={data?.items?.length}
          initialValue={search}
          onAfterSave={onValueChange}
        />
      )}
    />
  )
}
