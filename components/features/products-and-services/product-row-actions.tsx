"use client"

import { useState } from "react"
import { copyProductAction } from "@/actions/products"
import { CopyProductInput, copyProductSchema } from "@/schema/product"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogClose } from "@radix-ui/react-dialog"
import { MoreHorizontal } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { SkuInput } from "./sku-input"

interface Props {
  productId: string
  productName: string
}

interface PropsWithCallback extends Props {
  afterSave: () => void
}

type RowAction = "copy" | "make-inactive" | "delete"

export function ProductRowActions(props: Props) {
  const [action, setAction] = useState<RowAction>()

  return (
    <>
      <div className="flex items-center gap-4">
        <Button size="sm" variant="link">
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
            <DropdownMenuItem>Make Inactive</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAction("copy")}>
              Make a Copy
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Run Report</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={() => setAction("delete")}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog
        open={action === "copy"}
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
              <DialogTitle>Copy Product</DialogTitle>
            </DialogHeader>
            <ProductCopyForm
              {...props}
              afterSave={() => setAction(undefined)}
            />
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )
}

function ProductCopyForm({
  productId,
  productName,
  afterSave,
}: PropsWithCallback) {
  const form = useForm<CopyProductInput>({
    resolver: zodResolver(copyProductSchema),
    defaultValues: {
      productToCopyId: productId,
      name: productName + " - Copy",
      sku: "",
    },
  })

  const copyProduct = useServerAction(copyProductAction)

  const isBusy = copyProduct.isPending

  async function onSubmit(values: CopyProductInput) {
    try {
      const [data, err] = await copyProduct.execute(values)

      if (err) {
        toast.error(err.message)
        return
      }

      toast.success(`${values?.name} saved!`)

      afterSave()
    } catch (error) {}
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isBusy} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <SkuInput
                    placeholder="SKU"
                    productName={form.watch("name")}
                    {...field}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="flex items-center gap-3 pt-6">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isBusy}>Copy Product</Button>
          </DialogFooter>
        </fieldset>
      </form>
    </Form>
  )
}
