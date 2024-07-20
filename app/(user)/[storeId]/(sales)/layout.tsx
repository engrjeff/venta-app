import { type ReactNode } from "react"

import { TabLink } from "@/components/shared/tab-link"

function SalesPagesLayout({
  children,
  params: { storeId },
}: {
  children: ReactNode
  params: { storeId: string }
}) {
  return (
    <div className="bg-background">
      <div className="border-b px-2">
        <TabLink href={`/${storeId}/sales`}>All Sales</TabLink>
        <TabLink href={`/${storeId}/invoices`}>Invoices</TabLink>
        <TabLink href={`/${storeId}/customers`}>Customers</TabLink>
        <TabLink href={`/${storeId}/items`}>Products & Services</TabLink>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export default SalesPagesLayout
