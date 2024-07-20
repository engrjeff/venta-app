"use client"

import { useParams, usePathname } from "next/navigation"

export function DynamicHeading() {
  const pathname = usePathname()
  const params = useParams<{ storeId: string }>()

  const headings = {
    [`/${params.storeId}/items`]: {
      title: "Products & Services",
      subtitle: "Manage your products and services",
    },
    [`/${params.storeId}/categories`]: {
      title: "Categories",
      subtitle: "Manage categories for products and services",
    },
    [`/${params.storeId}/units`]: {
      title: "Units",
      subtitle: "Manage inventory units and conversions",
    },
    [`/${params.storeId}/chart-of-accounts`]: {
      title: "Chart of Accounts",
      subtitle: "Manage store book accounts",
    },
  }

  const heading = headings[pathname as keyof typeof headings] ?? {
    title: "Good day!",
    subtitle: "Keep grinding!",
  }

  return (
    <div className="py-2">
      <h1 className="text-xl font-semibold">{heading.title}</h1>
      <p className="text-sm text-muted-foreground">{heading.subtitle}</p>
    </div>
  )
}
