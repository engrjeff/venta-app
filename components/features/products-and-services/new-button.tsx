"use client"

import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { ProductServiceForm } from "./product-service-form"

export function NewButton() {
  return (
    <div className="flex items-center divide-x divide-white/10 overflow-hidden rounded-md">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="sm" className="rounded-none">
            New
          </Button>
        </SheetTrigger>
        <SheetContent
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
          className="overflow-y-auto p-0 sm:max-w-xl"
        >
          <SheetHeader className="border-b p-4">
            <SheetTitle>Products & Services</SheetTitle>
          </SheetHeader>
          <ProductServiceForm />
        </SheetContent>
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="size-9 rounded-none">
            <span className="sr-only">click for more</span>{" "}
            <ChevronDownIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>Import</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
