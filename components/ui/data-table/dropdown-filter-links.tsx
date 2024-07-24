"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { CheckIcon, PlusCircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"
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
    color?: string
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

      if (!value) {
        params.delete(paramKey)
      } else {
        params.set(paramKey, value)
      }

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
                className="rounded-sm px-1 font-normal capitalize"
              >
                {currentValue.replaceAll("_", " ").toLowerCase()}
              </Badge>
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="start">
        <DropdownMenuLabel>Filter by {title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuItem key={`${title}-option-${option.value}`} asChild>
            <Link
              href={`${pathname}?${createQueryString(option.value)}`}
              className="relative flex items-center gap-3"
            >
              {option.color ? (
                <span
                  className={cn(
                    "size-1.5 inline-block rounded-full leading-none",
                    option.color
                  )}
                />
              ) : null}{" "}
              <span>{option.label}</span>
              {currentValue === option.value ? (
                <span className="ml-auto inline-block">
                  <CheckIcon className="size-4 text-primary" />
                </span>
              ) : null}
            </Link>
          </DropdownMenuItem>
        ))}
        {currentValue ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`${pathname}?${createQueryString("")}`}>
                Remove filter
              </Link>
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
