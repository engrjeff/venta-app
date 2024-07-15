import { type ReactNode } from "react"

import { TabLink } from "@/components/shared/tab-link"

function StoreSettingsPagesLayout({
  children,
  params: { storeId },
}: {
  children: ReactNode
  params: { storeId: string }
}) {
  return (
    <div className="rounded-lg border bg-background">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage categories, product units, chart of accounts.
        </p>
      </div>
      <div className="border-b px-0">
        <TabLink href={`/${storeId}/categories`}>Categories</TabLink>
        <TabLink href={`/${storeId}/units`}>Units</TabLink>
        <TabLink href={`/${storeId}/chart-of-accounts`}>
          Chart of Accounts
        </TabLink>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export default StoreSettingsPagesLayout
