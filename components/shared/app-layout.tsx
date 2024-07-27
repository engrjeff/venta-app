import React from "react"

import { AppHeader } from "./app-header"
import { AppSideBar } from "./app-sidebar"

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <AppSideBar />
      <div className="absolute inset-0 left-[240px] flex min-h-full flex-col">
        <AppHeader />
        <main>{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
