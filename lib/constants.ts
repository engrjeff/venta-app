import {
  Home,
  LineChart,
  ListTodo,
  Package,
  Receipt,
  type LucideIcon,
} from "lucide-react"

export type SimpleMenuItem = {
  label: string
  href: string
  Icon: LucideIcon
  type: "simple"
}

export type NestedMenuItem = {
  label: string
  Icon: LucideIcon
  type: "nested"
  subItems: {
    label: string
    href: string
    Icon: LucideIcon
  }[]
}

export type AppMenuItem = SimpleMenuItem | NestedMenuItem

export const APP_MENU: AppMenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    Icon: Home,
    type: "simple",
  },
  {
    label: "Tasks",
    href: "/tasks",
    Icon: ListTodo,
    type: "simple",
  },
  {
    label: "Sales",
    Icon: Package,
    type: "nested",
    subItems: [
      {
        label: "All Sales",
        href: "/sales",
        Icon: Receipt,
      },
      {
        label: "Invoices",
        href: "/invoices",
        Icon: Home,
      },
      {
        label: "Customers",
        href: "/customers",
        Icon: Home,
      },
      {
        label: "Products & Services",
        href: "/items",
        Icon: Package,
      },
    ],
  },
  {
    label: "Expenses",
    Icon: Receipt,
    type: "nested",
    subItems: [
      {
        label: "Expenses",
        href: "/expenses",
        Icon: Package,
      },
      {
        label: "Suppliers",
        href: "/suppliers",
        Icon: Package,
      },
    ],
  },
  {
    label: "Reports",
    href: "/reports",
    Icon: LineChart,
    type: "simple",
  },
]
