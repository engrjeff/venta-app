"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function MoreDropDown() {
  const { storeId } = useParams<{ storeId: string }>()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          More <ChevronDownIcon className="ml-3 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${storeId}/categories`} className="">
            Manage Categories
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${storeId}/units`} className="">
            Manage Units
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Run Report</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
