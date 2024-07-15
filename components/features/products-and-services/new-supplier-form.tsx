"use client"

import { useState } from "react"
import { createSupplier } from "@/actions/suppliers"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { useCurrentStore } from "@/hooks/useCurrentStore"
import { useSuppliers } from "@/hooks/useSuppliers"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  initialValue?: string
  onAfterSave: (newCategory: string) => void
}

export function NewSupplierForm({ initialValue, onAfterSave }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="w-full justify-start">
          <PlusIcon className="mr-3 size-4" /> Add{" "}
          {initialValue ? `"${initialValue}"` : "New"}
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>New Supplier</DialogTitle>
          </DialogHeader>

          <SupplierForm
            initialValue={initialValue}
            onAfterSave={(value) => {
              onAfterSave(value)
              setOpen(false)
            }}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

function SupplierForm({ initialValue, onAfterSave }: Props) {
  const store = useCurrentStore()

  const suppliers = useSuppliers()

  const createSupplierAction = useServerAction(createSupplier)

  const [name, setName] = useState(() => initialValue)

  const isBusy = createSupplierAction.isPending || store.isLoading

  const disableBtn = isBusy || !name

  async function handleSave() {
    if (!name) return

    if (!store.data?.id) return

    const [result, err] = await createSupplierAction.execute({
      storeId: store.data?.id,
      name,
    })

    if (err) {
      toast.error(err.message)
      return
    }

    toast.success("Supplier saved!")

    await suppliers.refetch()

    if (result) {
      onAfterSave(result.id)
    }
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        handleSave()
      }}
    >
      <fieldset disabled={isBusy} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-right">
            Name <span>*</span>
          </Label>
          <Input
            id="name"
            placeholder="Supplier name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            autoFocus
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={disableBtn} loading={isBusy}>
            Save
          </Button>
        </DialogFooter>
      </fieldset>
    </form>
  )
}
