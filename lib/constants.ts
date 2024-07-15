import {
  FileBarChart,
  FileCog,
  Home,
  LibraryBig,
  LineChart,
  ListTodo,
  Package,
  PencilRuler,
  Receipt,
  ReceiptText,
  ShoppingBag,
  TicketMinus,
  UsersRound,
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
        Icon: ReceiptText,
      },
      {
        label: "Customers",
        href: "/customers",
        Icon: UsersRound,
      },
      {
        label: "Products & Services",
        href: "/items",
        Icon: Package,
      },
    ],
  },
  {
    label: "Store Settings",
    Icon: FileCog,
    type: "nested",
    subItems: [
      {
        label: "Categories",
        href: "/categories",
        Icon: LibraryBig,
      },
      {
        label: "Units",
        href: "/units",
        Icon: PencilRuler,
      },
      {
        label: "Chart of Accounts",
        href: "/chart-of-accounts",
        Icon: FileBarChart,
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
        Icon: TicketMinus,
      },
      {
        label: "Suppliers",
        href: "/suppliers",
        Icon: ShoppingBag,
      },
    ],
  },

  {
    label: "Reports",
    Icon: LineChart,
    type: "nested",
    subItems: [
      {
        label: "Reports",
        href: "/reports",
        Icon: LineChart,
      },
    ],
  },
]
