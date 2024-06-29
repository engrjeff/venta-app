import Link from "next/link"
import { BellIcon, SettingsIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { buttonVariants } from "../ui/button"

export function HeaderToolbar() {
  return (
    <div className="flex items-center gap-1">
      <Link
        href="#"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "rounded-full"
        )}
      >
        <BellIcon className="size-5" />
      </Link>
      <Link
        href="#"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "rounded-full"
        )}
      >
        <SettingsIcon className="size-5" />
      </Link>
    </div>
  )
}
