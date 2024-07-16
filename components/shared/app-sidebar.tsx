import { getStores } from "@/actions/stores"

import { AppNavigation } from "./app-navigation"
import { QuickNewButton } from "./quick-new-button"
import { StoreSelector } from "./store-selector"

export async function AppSideBar() {
  const [stores] = await getStores()

  return (
    <div className="fixed z-20 hidden h-screen max-h-screen w-[240px] overflow-y-auto border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center gap-3 border-b p-2">
          <StoreSelector stores={stores ?? []} />
          <QuickNewButton />
        </div>
        <div className="flex-1">
          <AppNavigation />
        </div>
      </div>
    </div>
  )
}
