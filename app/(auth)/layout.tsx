import type { Metadata } from "next"

import { AuthFooter } from "./components/AuthFooter"

export const metadata: Metadata = {
  title: "Venta",
  description: "Venta App",
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
      <AuthFooter />
    </div>
  )
}
