import { AppNavigation } from "./app-navigation"
import { QuickNewButton } from "./quick-new-button"
import { StoreSelector } from "./store-selector"

export function AppSideBar() {
  return (
    <div className="fixed z-20 hidden h-screen max-h-screen w-[240px] overflow-y-auto border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b p-2">
          <StoreSelector />
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
