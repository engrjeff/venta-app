"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "@mantine/hooks"
import { SearchIcon } from "lucide-react"
import { useSpinDelay } from "spin-delay"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

import { Spinner } from "./spinner"

export function SearchField({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  const [isPending, startTransition] = React.useTransition()

  const showSpinner = useSpinDelay(isPending, { delay: 500, minDuration: 200 })

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const currentQuery = searchParams.get("search")?.toString()

  const handleSearch = useDebouncedCallback((term: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (term) {
        params.set("search", term)
      } else {
        params.delete("search")
      }
      router.replace(`${pathname}?${params.toString()}`)
    })
  }, 300)

  return (
    <div className="relative h-8 min-w-80">
      <SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        {...props}
        className={cn("h-8 pl-8", className)}
        defaultValue={searchParams.get("search")?.toString()}
        onChange={(e) => {
          handleSearch(e.currentTarget.value)
        }}
      />
      {showSpinner && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Spinner />
        </div>
      )}
      {/* {currentQuery && !showSpinner && (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => handleSearch("")}
        >
          <XIcon className="size-4" />
        </button>
      )} */}
    </div>
  )
}
