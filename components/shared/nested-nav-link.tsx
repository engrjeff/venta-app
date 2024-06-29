"use client"

import { usePathname, useSelectedLayoutSegment } from "next/navigation"
import * as Accordion from "@radix-ui/react-accordion"
import { ChevronRightIcon } from "lucide-react"

import { NestedMenuItem } from "@/lib/constants"
import { cn } from "@/lib/utils"

import { NavLink } from "./nav-link"

export function NestedNavLink({ menu }: { menu: NestedMenuItem }) {
  const segment = useSelectedLayoutSegment()
  const pathname = usePathname()

  const isActive = menu.subItems.some((item) => pathname.includes(item.href))

  return (
    <Accordion.Root type="single" collapsible defaultValue={menu.label}>
      <Accordion.Item value={menu.label}>
        <Accordion.Trigger
          className={cn(
            "w-full flex items-center gap-3 rounded px-3 py-2 transition-all [&[data-state=open]>svg:nth-child(2)]:rotate-90",
            isActive
              ? "text-primary-foreground bg-primary"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <menu.Icon className="size-4 transition-transform" />
          {menu.label}
          <ChevronRightIcon className="ml-auto size-4 transition-transform" />
        </Accordion.Trigger>
        <Accordion.Content className="relative space-y-1 overflow-hidden px-3 py-2 after:absolute after:bottom-0 after:left-5 after:h-full after:w-px after:border-l after:border-border after:pl-4">
          {menu.subItems.map((submenu) => (
            <NavLink
              key={`app-submenu-${submenu.label}`}
              data-submenu={true}
              href={"/" + segment + submenu.href}
              className="ml-4"
            >
              {submenu.label}
            </NavLink>
          ))}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}
