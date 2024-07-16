"use client"

import { BookAccountLabel } from "@prisma/client"

import { useBookOfAccountsByLabel } from "@/hooks/useBookOfAccountsByLabel"
import { AppCombobox } from "@/components/shared/app-combobox"

export function BookAccountsSelect({
  accountLabel,
  value,
  onValueChange,
  label,
}: {
  accountLabel: BookAccountLabel
  value?: string
  onValueChange: (val?: string) => void
  label?: string
}) {
  const { data, isLoading } = useBookOfAccountsByLabel(accountLabel)

  return (
    <AppCombobox
      label={label ?? "Select option"}
      value={value}
      onValueChange={onValueChange}
      disabled={isLoading}
      key={value}
      options={
        data?.map((item) => ({ value: item.id, label: item.name })) ?? []
      }
    />
  )
}
