"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export const TabLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, ...props }, ref) => {
  const pathname = usePathname()

  const isActive = pathname === props.href

  return (
    <Link
      {...props}
      ref={ref}
      className={cn(
        "inline-flex items-center border-b-2 px-4 py-2 text-sm font-semibold",
        isActive ? "border-primary" : "border-transparent hover:border-muted",
        className
      )}
    />
  )
})

TabLink.displayName = "TabLink"
