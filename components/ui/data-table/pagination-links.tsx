"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { usePagination } from "@mantine/hooks"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { buttonVariants } from "../button"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function PaginationLinks({ currentPage, totalPages }: PaginationProps) {
  const pageParamKey = "p"
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { range } = usePagination({
    total: totalPages,
    initialPage: currentPage > totalPages ? 1 : currentPage,
  })

  const createQueryString = React.useCallback(
    (value: string) => {
      const params = new URLSearchParams(
        searchParams ? searchParams : undefined
      )

      params.set(pageParamKey, value)

      return params.toString()
    },
    [searchParams]
  )

  if (totalPages === 1) {
    return null
  }

  return (
    <div>
      <ul className="flex items-center gap-1.5">
        {currentPage > 1 ? (
          <li>
            <Link
              href={`${pathname}?${createQueryString(
                (currentPage - 1).toString()
              )}`}
              className={cn(
                buttonVariants({ size: "icon", variant: "outline" }),
                "size-8"
              )}
            >
              <span className="sr-only">go to page {currentPage - 1}</span>
              <ChevronLeftIcon className="size-4" />
            </Link>
          </li>
        ) : null}
        {range.map((n, index) => (
          <li key={`page-${n}-${index + 1}`}>
            {n === "dots" ? (
              <span
                aria-hidden="true"
                className="inline-block translate-y-2 leading-none"
              >
                ....
              </span>
            ) : (
              <Link
                href={`${pathname}?${createQueryString(n.toString())}`}
                className={cn(
                  buttonVariants({
                    size: "icon",
                    variant: n === currentPage ? "default" : "outline",
                  }),
                  "size-8"
                )}
              >
                {n}
              </Link>
            )}
          </li>
        ))}
        {currentPage < totalPages ? (
          <li>
            <Link
              href={`${pathname}?${createQueryString(
                (currentPage + 1).toString()
              )}`}
              className={cn(
                buttonVariants({ size: "icon", variant: "outline" }),
                "size-8"
              )}
            >
              <span className="sr-only">go to page {currentPage + 1}</span>
              <ChevronRightIcon className="size-4" />
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  )
}
