"use client"

import { useSelectedLayoutSegment } from "next/navigation"

import { APP_MENU } from "@/lib/constants"

import { NavLink } from "./nav-link"
import { NestedNavLink } from "./nested-nav-link"

export function AppNavigation() {
  const segment = useSelectedLayoutSegment()

  return (
    <nav className="grid items-start space-y-1 px-2 text-sm lg:px-4">
      {APP_MENU.map((menu) => {
        if (menu.type === "simple")
          return (
            <NavLink
              key={`app-menu-${menu.label}`}
              href={"/" + segment + menu.href}
            >
              <menu.Icon className="size-4" />
              {menu.label}
            </NavLink>
          )

        return <NestedNavLink key={`app-menu-${menu.label}`} menu={menu} />
      })}
    </nav>
  )
}
