"use client"

import { Suspense, useCallback } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { buttonVariants } from "../button"

interface SortLinkProps {
  title: string
  sortValue: string
  className?: string
}

function SortLinkComponent({ title, sortValue, className }: SortLinkProps) {
  const sortParamKey = "sort"
  const orderParamKey = "order"

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get(sortParamKey)
  const currentOrder = searchParams.get(orderParamKey)

  const createQueryString = useCallback(
    (sort: string, order: string) => {
      const params = new URLSearchParams(
        searchParams ? searchParams : undefined
      )

      params.set(sortParamKey, sort)
      params.set(orderParamKey, order)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Link
        href={`${pathname}?${createQueryString(
          sortValue,
          currentOrder === "desc" ? "asc" : "desc"
        )}`}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8")}
      >
        <span>{title}</span>
        {currentSort === sortValue ? (
          currentOrder === "desc" ? (
            <ArrowDownIcon className="ml-2 size-4" />
          ) : currentOrder === "asc" ? (
            <ArrowUpIcon className="ml-2 size-4" />
          ) : (
            <ChevronsUpDownIcon className="ml-2 size-4" />
          )
        ) : (
          <ChevronsUpDownIcon className="ml-2 size-4" />
        )}
      </Link>
    </div>
  )
}

export function SortLink(props: SortLinkProps) {
  return (
    <Suspense>
      <SortLinkComponent {...props} />
    </Suspense>
  )
}
