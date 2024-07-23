"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { PlusCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

interface DropdownFilterLinksProps {
  paramKey: string
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function DropdownFilterLinks({
  paramKey,
  title,
  options,
}: DropdownFilterLinksProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentValue = searchParams.get(paramKey)

  const createQueryString = React.useCallback(
    (value: string) => {
      const params = new URLSearchParams(
        searchParams ? searchParams : undefined
      )

      params.set(paramKey, value)

      return params.toString()
    },
    [paramKey, searchParams]
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircleIcon className="mr-2 size-4" />
          {title}
          {currentValue ? (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {currentValue}
              </Badge>
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuLabel>Filter by {title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuItem key={`${title}-option-${option.value}`} asChild>
            <Link href={`${pathname}?${createQueryString(option.value)}`}>
              {option.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
