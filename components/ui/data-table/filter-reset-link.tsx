import { useCallback } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const NON_FILTER_PARAMS = ["p", "sort", "order", "search"]

function getFilterParamsCount(paramsObject: Record<string, string>) {
  let count = 0

  for (const key in paramsObject) {
    if (!NON_FILTER_PARAMS.includes(key)) {
      count++
    }
  }

  return count
}

export function FilterResetLink() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(() => {
    const params = new URLSearchParams(searchParams ? searchParams : undefined)

    const entries = Object.fromEntries(params.entries())

    for (const key in entries) {
      if (!NON_FILTER_PARAMS.includes(key)) {
        params.delete(key)
      }
    }

    return params.toString()
  }, [searchParams])

  const paramsCount = getFilterParamsCount(
    Object.fromEntries(searchParams.entries())
  )

  if (paramsCount === 0) return null

  return (
    <Link
      href={`${pathname}?${createQueryString()}`}
      className={cn(buttonVariants({ variant: "ghost" }), "h-8 px-2 lg:px-3")}
    >
      Reset
      <XIcon className="ml-2 size-4" />
    </Link>
  )
}
