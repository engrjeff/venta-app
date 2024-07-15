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
    <div className="rounded-lg border bg-background">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Sales</h1>
        <p className="text-sm text-muted-foreground">
          Manage sales, invoices, customers, and products & services.
        </p>
      </div>
      <div className="border-b px-0">
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
