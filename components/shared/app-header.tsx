import { auth } from "@/auth"

import { HeaderToolbar } from "./header-toolbar"
import MobileMenu from "./mobile-menu"
import UserMenu from "./user-menu"

export async function AppHeader() {
  const session = await auth()

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <MobileMenu />
      <div className="ml-auto flex items-center space-x-4">
        <HeaderToolbar />
        <UserMenu user={session?.user} />
      </div>
    </header>
  )
}
