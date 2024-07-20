"use client"

import { useState } from "react"
import { updateUnitStatus } from "@/actions/units"
import { ItemStatus, Unit } from "@prisma/client"
import { MoreHorizontal } from "lucide-react"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// import { EditCategoryForm } from "./edit-category-form"

interface Props {
  unit: Unit
}

type RowAction = "edit" | "change-status" | "assign-to-product"

export function UnitRowActions({ unit }: Props) {
  const [action, setAction] = useState<RowAction>()

  const updateStatusAction = useServerAction(updateUnitStatus)

  async function handleUpdateStatus() {
    try {
      const [data, err] = await updateStatusAction.execute({
        id: unit.id,
        status:
          unit.status === ItemStatus.ACTIVE
            ? ItemStatus.INACTIVE
            : ItemStatus.ACTIVE,
      })

      if (err) {
        toast.error(err.message)
        return
      }

      toast.success(`Unit status updated!`)
    } catch (error) {}
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Button
          disabled={unit.status === ItemStatus.INACTIVE}
          size="sm"
          variant="link"
          className={
            unit.status === ItemStatus.ACTIVE
              ? "text-primary"
              : "text-muted-foreground"
          }
          onClick={() => setAction("edit")}
        >
          Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setAction("change-status")}>
              {unit.status === ItemStatus.ACTIVE
                ? "Make Inactive"
                : "Make Active"}
            </DropdownMenuItem>
            <DropdownMenuItem>Assign to Product</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog
        open={action === "change-status"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setAction(undefined)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will make{" "}
              <strong className="text-primary">{unit.name}</strong>{" "}
              {unit.status === ItemStatus.ACTIVE
                ? `inactive. You will not be able to use this category unless you
              make it Active again.`
                : "active again."}
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

      <Dialog
        open={action === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setAction(undefined)
        }}
      >
        <DialogPortal>
          <DialogContent
            className="sm:max-w-md"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Edit {unit.name}</DialogTitle>
            </DialogHeader>

            {/* <EditCategoryForm
              category={category}
              onAfterSave={() => setAction(undefined)}
            /> */}
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )
}
