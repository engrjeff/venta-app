"use client"

import { useId, useState } from "react"
import { getProductServiceOptions } from "@/actions/products"
import * as RadixPopover from "@radix-ui/react-popover"
import { Check, ChevronsUpDown } from "lucide-react"
import AsyncSelect from "react-select/async"
import { useServerAction } from "zsa-react"

import { cn } from "@/lib/utils"
import { useCurrentStore } from "@/hooks/useCurrentStore"
import { useProductOptions } from "@/hooks/useProductOptions"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverTrigger } from "@/components/ui/popover"

import { Input } from "./input"

export function AppReactSelect() {
  const store = useCurrentStore()

  const id = useId()

  const getProducts = useServerAction(getProductServiceOptions)

  async function fetcher(search: string) {
    const [products] = await getProducts.execute({
      storeId: store.data?.id!,
      search,
    })

    if (!products) return []

    const productOptions = products.map((p) => ({ value: p.id, label: p.name }))

    return productOptions
  }

  return (
    <AsyncSelect
      isClearable
      cacheOptions
      loadOptions={fetcher}
      instanceId={id}
    />
  )
}

interface ProductSelectProps {
  value: string
  onValueChange: (newValue: string) => void
}

export function ProductSelect({ value, onValueChange }: ProductSelectProps) {
  const [open, setOpen] = useState(false)

  const { data: products } = useProductOptions()

  const selectedProduct = products?.find((p) => p.id === value)

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? products?.find((item) => item.id === value)?.name
              : "Select product..."}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <RadixPopover.Content
          align="start"
          sideOffset={4}
          className="z-50 w-popover-trigger-width rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <Command
            filter={(value, search) => {
              if (
                products
                  ?.find((i) => i.id === value)
                  ?.name.toLowerCase()
                  .includes(search.toLowerCase())
              )
                return 1
              return 0
            }}
          >
            <CommandInput placeholder="Search product..." />
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup className="max-h-96 overflow-y-auto">
              <CommandList>
                {products?.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </RadixPopover.Content>
      </Popover>
      <Input
        disabled
        key={selectedProduct?.id}
        defaultValue={
          selectedProduct?.cost
            ? "Php " + selectedProduct?.cost?.toFixed(2)
            : ""
        }
        placeholder="Cost"
        className="w-32"
      />
    </div>
  )
}
