"use client"

import { useId, useState } from "react"
import { useDebouncedValue } from "@mantine/hooks"
import { useCombobox } from "downshift"
import { ChevronDownIcon } from "lucide-react"
import { useSpinDelay } from "spin-delay"

import { useProductOptions } from "@/hooks/useProductOptions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/shared/spinner"

interface Props {
  value?: string
  onValueChange: (val: string | undefined) => void
  excludedIds?: string[]
}

export function ProductCombobox({ value, onValueChange, excludedIds }: Props) {
  const id = useId()

  const [search, setSearch] = useState("")

  const [debouncedSearch] = useDebouncedValue(search, 400)

  const { data, isRefetching } = useProductOptions(debouncedSearch, excludedIds)

  const [selectedItem, setSelectedItem] = useState<string | null>(
    value ? value : null
  )

  const showSpinner = useSpinDelay(isRefetching, {
    delay: 500,
    minDuration: 200,
  })

  const items = data?.map((d) => d.id) ?? []

  const {
    isOpen,
    getInputProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  } = useCombobox({
    id,
    items,
    selectedItem,
    itemToString(item) {
      if (!item) return ""

      const found = data?.find((d) => d.id === item)

      console.log(data, found)

      return found ? found.name : ""
    },
    onInputValueChange({ inputValue }) {
      setSearch(inputValue)
    },
    onSelectedItemChange({ selectedItem }) {
      setSelectedItem(selectedItem)
      onValueChange(selectedItem)
    },
    initialInputValue: data?.find((d) => d.id === value)?.name,
  })

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input {...getInputProps()} placeholder="Products" />

        {!showSpinner ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 size-8"
            {...getToggleButtonProps()}
          >
            <ChevronDownIcon className="size-4" />
          </Button>
        ) : (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Spinner />
          </div>
        )}
      </div>
      <ul
        {...getMenuProps()}
        className="absolute z-50 mt-3 max-h-60 w-full overflow-y-auto rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-none empty:hidden"
      >
        {isOpen &&
          !showSpinner &&
          data?.map((item, index) => (
            <li
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
              key={item.id}
              {...getItemProps({ item: item.id, index })}
            >
              <span>{item.name}</span>
            </li>
          ))}

        {items?.length === 0 && search ? (
          <li>
            <span className="text-sm text-muted-foreground">
              No results found
            </span>
          </li>
        ) : null}
      </ul>
    </div>
  )
}
