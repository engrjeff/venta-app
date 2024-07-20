"use client"

import { Suspense, useCallback, useState } from "react"
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

  const ORDERS = ["asc", "desc", null]

  const [orderIndex, setOrderIndex] = useState(() =>
    currentOrder ? ORDERS.indexOf(currentOrder) : 0
  )

  const order = ORDERS[orderIndex % 3]

  const createQueryString = useCallback(
    (sort: string) => {
      const params = new URLSearchParams(
        searchParams ? searchParams : undefined
      )

      if (order !== null) {
        params.set(sortParamKey, sort)
        params.set(orderParamKey, order)
      } else {
        params.delete(sortParamKey)
        params.delete(orderParamKey)
      }

      return params.toString()
    },
    [searchParams, order]
  )

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Link
        href={`${pathname}?${createQueryString(sortValue)}`}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8")}
        onClick={() => setOrderIndex((c) => c + 1)}
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
