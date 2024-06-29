import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dei POS",
  description: "Dei POS App",
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  )
}
