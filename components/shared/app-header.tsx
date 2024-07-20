import { auth } from "@/auth"

import { DynamicHeading } from "./dynamic-heading"
import { HeaderToolbar } from "./header-toolbar"
import MobileMenu from "./mobile-menu"
import UserMenu from "./user-menu"

export async function AppHeader() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-20 flex shrink-0 items-center gap-4 bg-background px-2 py-3 lg:px-6">
      <MobileMenu />
      <DynamicHeading />
      <div className="ml-auto flex items-center space-x-4">
        <HeaderToolbar />
        <UserMenu user={session?.user} />
      </div>
    </header>
  )
}
