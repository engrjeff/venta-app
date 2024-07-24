"use client"

import { useState } from "react"
import { useDebouncedValue } from "@mantine/hooks"
import { ProductServiceItem } from "@prisma/client"
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
}

export function ProductCombobox({ value, onValueChange }: Props) {
  const [search, setSearch] = useState("")
  const [selectedItem, setSelectedItem] = useState<ProductServiceItem | null>(
    null
  )

  const [debouncedSearch] = useDebouncedValue(search, 400)

  const { data, isRefetching } = useProductOptions(debouncedSearch)

  const showSpinner = useSpinDelay(isRefetching, {
    delay: 500,
    minDuration: 200,
  })

  const {
    isOpen,
    getInputProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  } = useCombobox({
    items: data ?? [],
    itemToString(item) {
      return item ? item.name : ""
    },
    selectedItem,
    onInputValueChange({ inputValue }) {
      setSearch(inputValue)
    },
    onSelectedItemChange({ selectedItem }) {
      setSelectedItem(selectedItem)
      onValueChange(selectedItem.id)
    },
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
              {...getItemProps({ item, index })}
            >
              <span>{item.name}</span>
            </li>
          ))}

        {data?.length === 0 ? (
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
