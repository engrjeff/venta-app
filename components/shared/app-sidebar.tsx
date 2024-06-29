import Link from "next/link"
import { Package2 } from "lucide-react"

import { AppNavigation } from "./app-navigation"
import { QuickNewButton } from "./quick-new-button"

export function AppSideBar() {
  return (
    <div className="fixed z-20 hidden h-screen max-h-screen w-[240px] overflow-y-auto border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="size-6" />
            <span className="">Venta</span>
          </Link>
        </div>
        <div className="px-4 py-2 lg:px-6">
          <QuickNewButton />
        </div>
        <div className="flex-1">
          <AppNavigation />
        </div>
      </div>
    </div>
  )
}
