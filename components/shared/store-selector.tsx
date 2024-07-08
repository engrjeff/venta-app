"use client"

import Link from "next/link"
import { notFound, useSelectedLayoutSegment } from "next/navigation"
import { Store } from "@prisma/client"
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

export function StoreSelector({ stores }: { stores: Store[] }) {
  const segment = useSelectedLayoutSegment()

  const currentStore = stores.find((s) => s.slug === segment)

  if (!currentStore) return notFound()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start px-2 py-1"
        >
          <Avatar className="mr-3 size-7">
            <AvatarImage src={currentStore?.logo} alt={currentStore?.name} />
            <AvatarFallback>CF</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{currentStore?.name}</span>
          <ChevronDownIcon className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-trigger-width">
        <DropdownMenuLabel>Stores</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {stores.map((store) => (
          <DropdownMenuItem key={store.id} asChild>
            <Link href={`/${store.slug}/dashboard`}>
              <Avatar className="mr-3 size-7">
                <AvatarImage src={store?.logo} alt={store?.name} />
                <AvatarFallback>CF</AvatarFallback>
              </Avatar>
              {store.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
