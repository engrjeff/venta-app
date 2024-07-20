"use client"

import { useState } from "react"
import { updateCategory } from "@/actions/categories"
import { Category } from "@prisma/client"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  category: Category
  onAfterSave?: () => void
  main?: boolean
}

export function EditCategoryForm({ category, onAfterSave }: Props) {
  const updateCategoryAction = useServerAction(updateCategory)

  const [name, setName] = useState(() => category.name)

  const isBusy = updateCategoryAction.isPending

  const disableBtn = isBusy || !name

  async function handleSave() {
    if (!name) return

    const [result, err] = await updateCategoryAction.execute({
      id: category.id,
      name,
    })

    if (err) {
      toast.error(err.message)
      return
    }

    toast.success("Category saved!")

    if (result && onAfterSave) {
      onAfterSave()
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
          <Button type="submit" disabled={disableBtn} loading={isBusy}>
            Save Changes
          </Button>
        </DialogFooter>
      </fieldset>
    </form>
  )
}
