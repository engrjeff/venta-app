"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

interface OptionItem {
  value: string
  label: string
}

interface AppComboboxProps {
  options: OptionItem[]
  label: string
  inputPlaceholder?: string
  value?: string
  onValueChange: (val: string | undefined) => void
  renderEmpty?: (search: string) => React.ReactNode
}

export function AppCombobox({
  options,
  label,
  inputPlaceholder = "Search",
  value,
  onValueChange,
  renderEmpty,
}: AppComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const [search, setSearch] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full flex-1 justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : label}
          <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={inputPlaceholder}
            className="h-9"
          />
          <CommandList>
            {renderEmpty ? (
              <div className="px-1 pt-2">{renderEmpty(search)}</div>
            ) : (
              <CommandEmpty>No item found.</CommandEmpty>
            )}

            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
