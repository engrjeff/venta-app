"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export const NavLink = React.forwardRef<
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
        "flex items-center gap-3 rounded px-3 py-1.5 transition-all text-sm",
        isActive
          ? "text-primary-foreground bg-primary data-[submenu=true]:bg-background data-[submenu=true]:text-primary"
          : "text-muted-foreground hover:text-primary",
        className
      )}
    />
  )
})

NavLink.displayName = "NavLink"
