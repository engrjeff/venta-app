"use client"

import { useState } from "react"
import { createCategory } from "@/actions/categories"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { useCategories } from "@/hooks/useCategories"
import { useCurrentStore } from "@/hooks/useCurrentStore"
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
  onAfterSave?: (newCategory: string) => void
  main?: boolean
}

export function NewCategoryForm({ initialValue, onAfterSave, main }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={main ? "default" : "secondary"}
          className="w-full justify-start"
        >
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
            <DialogTitle>New Category</DialogTitle>
          </DialogHeader>

          <CategoryForm
            initialValue={initialValue}
            onAfterSave={(value) => {
              if (onAfterSave) {
                onAfterSave(value)
              }
              setOpen(false)
            }}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

function CategoryForm({ initialValue, onAfterSave }: Props) {
  const store = useCurrentStore()

  const categories = useCategories()

  const createCategoryAction = useServerAction(createCategory)

  const [name, setName] = useState(() => initialValue ?? "")

  const isBusy = createCategoryAction.isPending || store.isLoading

  const disableBtn = isBusy || !name

  async function handleSave() {
    if (!name) return

    if (!store.data?.id) return

    const [result, err] = await createCategoryAction.execute({
      storeId: store.data?.id,
      name,
    })

    if (err) {
      toast.error(err.message)
      return
    }

    toast.success("Category saved!")

    await categories.refetch()

    if (result && onAfterSave) {
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
            placeholder="Category name"
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
