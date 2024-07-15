"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"

export function UnitConversionForm({
  conversionFor,
}: {
  conversionFor?: string
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:underline"
        >
          <Plus className="size-3" /> Conversion{" "}
          {conversionFor ? `for ${conversionFor}` : ""}
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>New Conversion</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label htmlFor="from" className="text-right">
              From <span>*</span>
            </Label>
            <Input
              id="from"
              placeholder="bottle"
              defaultValue={conversionFor}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="to" className="text-right">
              To <span>*</span>
            </Label>
            <Input id="to" placeholder="ml" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="to" className="text-right">
              Factor <span>*</span>
            </Label>
            <NumberInput id="factor" placeholder="250" />
          </div>

          <div className="col-span-3">
            <p className="text-[10px] text-muted-foreground">
              {"Example: 1 bottle = 250 ml means a factor of 250"}
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
