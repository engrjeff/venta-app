"use client"

import { useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { updateBulkProductStatus } from "@/actions/products"
import { ProductServiceStatus } from "@prisma/client"
import { ChevronDownIcon } from "lucide-react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type BulkAction = "change-status" | "assign-category"

export function ProductBulkActions({
  productIds,
  callback,
}: {
  productIds: string[]
  callback: () => void
}) {
  const [action, setAction] = useState<BulkAction>()

  const searchParams = useSearchParams()

  const { storeId } = useParams<{ storeId: string }>()

  const updateStatusAction = useServerAction(updateBulkProductStatus)

  if (productIds.length === 0) return null

  const newStatus =
    searchParams.get("status") === "inactive"
      ? ProductServiceStatus.ACTIVE
      : ProductServiceStatus.INACTIVE

  function resetAction() {
    setAction(undefined)
  }

  async function handleUpdateStatus() {
    try {
      const [data, err] = await updateStatusAction.execute({
        ids: productIds,
        status: newStatus,
        storeSlug: storeId,
      })

      if (err) {
        toast.error(err.message)
        return
      }

      toast.success(`Product/Service status updated!`)

      callback()
    } catch (error) {}
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="h-8" variant="outline">
            Bulk Actions <ChevronDownIcon className="ml-2 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          <DropdownMenuLabel>Select Action</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setAction("change-status")}>
            Make {newStatus.toLowerCase()}
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Assign Category</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={action === "change-status"}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetAction()
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will make the selected products/services{" "}
              <span className="font-semibold">{newStatus}</span>.
              <br />
              This will affect{" "}
              <strong className="text-primary">
                {productIds.length} products/services.
              </strong>{" "}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="button" onClick={handleUpdateStatus}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
