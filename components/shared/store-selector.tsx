"use client"

import { ChevronDownIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function StoreSelector() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start px-2 py-1"
        >
          <Avatar className="mr-3 size-8">
            <AvatarImage src="/cofaith-logo.png" alt="CoFaith" />
            <AvatarFallback>CF</AvatarFallback>
          </Avatar>
          <span className="font-semibold">CoFaith</span>
          <ChevronDownIcon className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-trigger-width">
        <DropdownMenuLabel>Stores</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>CoFaith</DropdownMenuItem>
        <DropdownMenuItem>Made For His Glory</DropdownMenuItem>
        <DropdownMenuItem>Epistle Co.</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
