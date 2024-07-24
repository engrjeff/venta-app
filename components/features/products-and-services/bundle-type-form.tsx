"use client"

import { createInventoryAssembly } from "@/actions/products"
import {
  inventoryAssemblyCreateSchema,
  InventoryAssemblyInput,
} from "@/schema/product"
import { zodResolver } from "@hookform/resolvers/zod"
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react"
import { FieldErrors, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { useCurrentStore } from "@/hooks/useCurrentStore"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ImagePicker } from "@/components/ui/image-picker"
import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import { Textarea } from "@/components/ui/textarea"

import { ProductCombobox } from "./product-combobox"
import { SkuInput } from "./sku-input"

interface Props {
  closeCallback?: () => void
}

export function BundleTypeForm({ closeCallback }: Props) {
  const store = useCurrentStore()

  const form = useForm<InventoryAssemblyInput>({
    resolver: zodResolver(inventoryAssemblyCreateSchema),
    mode: "onChange",
    defaultValues: {
      sku: "",
      bundledProducts: [
        { productId: "", quantity: 0 },
        { productId: "", quantity: 0 },
      ],
    },
  })

  const bundledProducts = useFieldArray<InventoryAssemblyInput>({
    name: "bundledProducts",
    control: form.control,
  })

  const createAction = useServerAction(createInventoryAssembly)

  const isBusy = createAction.isPending

  function onError(errors: FieldErrors<InventoryAssemblyInput>) {
    console.log(errors)
  }

  async function onSubmit(
    { image, ...values }: InventoryAssemblyInput,
    shouldClose?: boolean
  ) {
    try {
      if (!store.data?.id) return

      const [data, err] = await createAction.execute({
        storeId: store.data.id,
        ...values,
      })

      if (err) {
        toast.error(err.message)
        return
      }

      toast.success(`${data?.name} was saved!`)

      form.reset()

      if (shouldClose) {
        // close form sheet
        if (closeCallback) {
          closeCallback()
        }
      }
    } catch (error) {}
  }

  async function saveAndNew() {
    const isValid = await form.trigger(undefined, { shouldFocus: true })

    if (!isValid) return

    const values = form.getValues()

    await onSubmit(values, false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data, true), onError)}
      >
        <fieldset className="space-y-3 p-4">
          <div className="flex justify-between gap-8">
            <div className="flex-1 space-y-3">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span>*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        autoFocus
                        placeholder="Assembly name"
                        className="min-h-[60px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="sku"
                control={form.control}
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
                    <FormDescription>Generate or type manually</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-32">
              <FormField
                name="image"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <ImagePicker
                        urlValue={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description on sales form"
                    className="min-h-[60px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Label className="mb-4 inline-block">
              Products/services included in the bundle
            </Label>
            <p>{form.formState.errors.bundledProducts?.root?.message}</p>
            <div className="rounded-md border">
              <div className="grid max-w-full grid-cols-[1fr_180px_56px] border-b bg-muted">
                <div className="p-2 text-sm font-medium">Product/Service</div>
                <div className="p-2 text-sm font-medium">Qty</div>
                <div></div>
              </div>
              {bundledProducts.fields.map((item, index) => (
                <div
                  key={item.id}
                  className="grid max-w-full grid-cols-[1fr_180px_auto] items-start border-b border-dashed"
                >
                  <div className="p-2">
                    <FormField
                      name={`bundledProducts.${index}.productId`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="sr-only">Product</FormLabel>
                          <FormControl>
                            <ProductCombobox
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="p-2">
                    <FormField
                      name={`bundledProducts.${index}.quantity`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="sr-only">Quantity</FormLabel>
                          <FormControl>
                            <NumberInput
                              placeholder="0"
                              min={0}
                              {...form.register(
                                `bundledProducts.${index}.quantity`,
                                {
                                  valueAsNumber: true,
                                }
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="p-2 pt-3">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => bundledProducts.remove(index)}
                      disabled={bundledProducts.fields.length < 3}
                      className="disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">
                        Delete row number {index + 1}
                      </span>
                      <MinusCircleIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="p-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="font-normal"
                  onClick={async () => {
                    const isValid = await form.trigger("bundledProducts")

                    if (!isValid) return

                    bundledProducts.append(
                      { productId: "", quantity: 0 },
                      { shouldFocus: false }
                    )
                  }}
                >
                  <PlusCircleIcon className="mr-2 size-3" /> Add Item
                </Button>
              </div>
            </div>
          </div>
        </fieldset>

        <div className="sticky bottom-0 border-t bg-background p-4">
          <div className="flex items-center justify-end gap-3">
            <Button type="submit" size="sm" loading={isBusy}>
              Save and Close
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={saveAndNew}
              loading={isBusy}
            >
              Save and New
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
