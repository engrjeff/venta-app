"use client"

import { Category } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table/data-table"
import { SortLink } from "@/components/ui/data-table/sort-link"
import { useDataTable } from "@/components/ui/data-table/useDataTable"
import { Input } from "@/components/ui/input"

import { CategoryRowActions } from "./category-row-actions"

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "status",
    header: ({ column }) => {
      return <SortLink sortValue="status" title="Status" />
    },
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "ACTIVE" ? "default" : "destructive"}
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <CategoryRowActions category={row.original} />
    },
  },
]

interface CategoriesTableProps {
  categories: Category[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const table = useDataTable({ data: categories ?? [], columns })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search categories"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 max-w-xs"
        />
        {/* {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={PRODUCT_TYPES}
          />
        )} */}
        {/* {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ml-2 size-4" />
          </Button>
        )} */}
      </div>
      <DataTable table={table} columnLength={columns.length} />
    </div>
  )
}
