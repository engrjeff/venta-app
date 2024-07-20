"use client"

import { ProductItems } from "@/actions/products"
import { ColumnDef } from "@tanstack/react-table"
import { XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableFacetedFilter } from "@/components/ui/data-table/faceted-filter"
import { SortLink } from "@/components/ui/data-table/sort-link"
import { useDataTable } from "@/components/ui/data-table/useDataTable"
import { Input } from "@/components/ui/input"

import { PRODUCT_TYPES } from "./data"
import { ProductRowActions } from "./product-row-actions"

type ProductItem = ProductItems["items"][number]

export const columns: ColumnDef<ProductItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortLink sortValue="name" title="Name" />
    },
    cell: ({ row }) => (
      <div className="text-nowrap">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "sku",
    header: ({ column }) => {
      return <SortLink sortValue="sku" title="SKU" />
    },
    cell: ({ row }) => <div className="text-nowrap">{row.getValue("sku")}</div>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <SortLink sortValue="type" title="Type" />
    },
    cell: ({ row }) => (
      <Badge className="capitalize">{row.original.type.toLowerCase()}</Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "initialQuantity",
    header: ({ column }) => {
      return <SortLink sortValue="initialQuantity" title="Qty on Hand" />
    },
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("initialQuantity")} {row.original.unit?.name}
      </div>
    ),
  },
  {
    accessorKey: "reorderPoint",
    header: ({ column }) => {
      return <SortLink sortValue="reorderPoint" title="Reorder Point" />
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("reorderPoint")}</div>
    ),
  },
  {
    accessorKey: "salesPriceOrRate",
    header: ({ column }) => {
      return (
        <SortLink
          className="justify-end"
          sortValue="salesPriceOrRate"
          title="Price"
        />
      )
    },
    cell: ({ row }) => (
      <div className="text-nowrap text-right">
        {row.getValue("salesPriceOrRate")}
      </div>
    ),
  },
  {
    accessorKey: "cost",
    header: ({ column }) => {
      return <SortLink className="justify-end" sortValue="cost" title="Cost" />
    },
    cell: ({ row }) => (
      <div className="text-nowrap text-right">{row.getValue("cost")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <ProductRowActions
          productId={row.original.id}
          productName={row.original.name}
        />
      )
    },
  },
]

interface ProductServiceTableProps {
  products: ProductItem[] | null
}

export function ProductServiceTable({ products }: ProductServiceTableProps) {
  const table = useDataTable({ data: products ?? [], columns })

  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search products"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 max-w-xs"
        />
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={PRODUCT_TYPES}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <DataTable table={table} columnLength={columns.length} />
    </div>
  )
}
