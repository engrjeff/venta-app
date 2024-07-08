"use client"

import { Session } from "next-auth"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignoutDialog } from "@/app/(auth)/components/SignoutDialog"

import { Avatar, AvatarFallback } from "../ui/avatar"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((s) => s.charAt(0))
    .join("")
}

function UserMenu({ user }: { user?: Session["user"] }) {
  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar>
            <AvatarFallback>{getInitials(user.name!)}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <SignoutDialog />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
