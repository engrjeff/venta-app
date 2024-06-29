import type { Metadata } from "next"

import AppLayout from "@/components/shared/app-layout"

export const metadata: Metadata = {
  title: "CoFaith | Dei POS",
  description: "Dei POS App",
}

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AppLayout>{children}</AppLayout>
}
