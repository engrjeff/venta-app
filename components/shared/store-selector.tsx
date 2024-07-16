"use client"

import Link from "next/link"
import { notFound, useParams, usePathname } from "next/navigation"
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
  const { storeId } = useParams<{ storeId: string }>()

  const pathname = usePathname()

  const currentStore = stores.find((s) => s.slug === storeId)

  if (!currentStore) return notFound()

  const path = pathname.split("/").filter(Boolean)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto justify-start rounded-full px-2"
        >
          <Avatar className="mr-3 size-6">
            <AvatarImage src={currentStore?.logo} alt={currentStore?.name} />
            <AvatarFallback>CF</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium">{currentStore?.name}</span>
          <ChevronDownIcon className="ml-1 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-52">
        <DropdownMenuLabel>Stores</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {stores.map((store) => (
          <DropdownMenuItem key={store.id} asChild>
            <Link href={`/${store.slug}/${path.at(path.length - 1)}`}>
              <Avatar className="mr-3 size-7">
                <AvatarImage src={store?.logo} alt={store?.name} />
                <AvatarFallback>CF</AvatarFallback>
              </Avatar>
              <span className="text-nowrap">{store.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
