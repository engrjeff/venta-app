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
    <div className="bg-background">
      <div className="border-b px-2">
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
