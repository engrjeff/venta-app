import { type ReactNode } from "react"

import { TabLink } from "@/components/shared/tab-link"

function SalesPagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border bg-background">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Sales</h1>
        <p className="text-sm text-muted-foreground">
          Manage sales, invoices, customers, and products & services.
        </p>
      </div>
      <div className="border-b px-0">
        <TabLink href="/cofaith/sales">All Sales</TabLink>
        <TabLink href="/cofaith/invoices">Invoices</TabLink>
        <TabLink href="/cofaith/customers">Customers</TabLink>
        <TabLink href="/cofaith/items">Products & Services</TabLink>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export default SalesPagesLayout
