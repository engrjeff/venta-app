"use client"

import { Unit } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table/data-table"
import { SortLink } from "@/components/ui/data-table/sort-link"
import { useDataTable } from "@/components/ui/data-table/useDataTable"
import { Input } from "@/components/ui/input"

import { UnitRowActions } from "./unit-row-actions"

// import { CategoryRowActions } from "./category-row-actions"

export const columns: ColumnDef<Unit>[] = [
  {
    id: "select",
    header: ({ table }) => <span>#</span>,
    cell: ({ row }) => <span>{row.index + 1}</span>,
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
      return <UnitRowActions unit={row.original} />
    },
  },
]

interface UnitsTableProps {
  units: Unit[]
}

export function UnitsTable({ units }: UnitsTableProps) {
  const table = useDataTable({ data: units ?? [], columns })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search units"
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
