import { Company } from "./company"
import { HeaderToolbar } from "./header-toolbar"
import MobileMenu from "./mobile-menu"
import UserMenu from "./user-menu"

export function AppHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <MobileMenu />
      <Company />
      <div className="ml-auto flex items-center space-x-4">
        <HeaderToolbar />
        <UserMenu />
      </div>
    </header>
  )
}
