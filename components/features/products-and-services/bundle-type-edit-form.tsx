"use client"

import { useEffect } from "react"
import { ProductItem, updateProduct } from "@/actions/products"
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
import { useProductOptions } from "@/hooks/useProductOptions"
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
import { ProductSelect } from "@/components/ui/product-select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { CategorySelect } from "../categories/category-select"
import { ConversionInfo } from "../units/conversion-info"
import { UnitConversionPicker } from "../units/unit-conversion-picker"
import { UnitSelect } from "../units/unit-select"
import { BookAccountsSelect } from "./book-accounts-select"
import { SkuInput } from "./sku-input"
import { SupplierSelect } from "./supplier-select"

interface Props {
  closeCallback?: () => void
  product: ProductItem
}

export function BundleTypeEditForm({ closeCallback, product }: Props) {
  const store = useCurrentStore()

  const form = useForm<InventoryAssemblyInput>({
    resolver: zodResolver(inventoryAssemblyCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: product.name,
      sku: product.sku ?? undefined,
      categoryId: product.categoryId ?? undefined,
      unitId: product.unitId ?? undefined,
      unitConversionId: product.unitConversionId ?? undefined,
      inventoryAssetAccountId: product.inventoryAssetAccountId ?? undefined,
      description: product.description ?? undefined,
      salesPriceOrRate: product.rawSalesOrPrice ?? 0,
      incomeAccountId: product.incomeAccountId ?? undefined,
      purchasingDescription: product.purchasingDescription ?? undefined,
      cost: product.rawCost ?? undefined,
      expenseAccountId: product.expenseAccountId ?? undefined,
      supplierId: product.supplierId ?? undefined,
      bundledProducts: product.bundledProducts.map((b) => ({
        productId: b.productId,
        quantity: b.quantity,
        id: b.id,
      })),
    },
  })

  const bundledProducts = useFieldArray<InventoryAssemblyInput>({
    name: "bundledProducts",
    control: form.control,
  })

  const { data: products } = useProductOptions()

  const editAction = useServerAction(updateProduct)

  const isBusy = editAction.isPending

  const bundledProductFormValues = form.watch("bundledProducts")

  const bundledProductIds = bundledProductFormValues.map(
    (item) => item.productId
  )

  const selectedProducts = products?.filter((p) =>
    bundledProductIds.includes(p.id)
  )

  const costTotal = selectedProducts?.reduce((total, item) => {
    const qty =
      bundledProductFormValues.find((b) => b.productId === item.id)?.quantity ??
      0

    const cost = item.cost ?? 0

    return total + Number(cost) * qty
  }, 0)

  useEffect(() => {
    if (costTotal) {
      form.setValue("cost", Number(costTotal.toFixed(2)))
    }
  }, [form, costTotal])

  function onError(errors: FieldErrors<InventoryAssemblyInput>) {
    console.log(errors)
  }

  async function onSubmit(
    { image, ...values }: InventoryAssemblyInput,
    shouldClose?: boolean
  ) {
    try {
      if (!store.data?.id) return

      const [data, err] = await editAction.execute({
        type: "inventory-assembly",
        id: product.id,
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
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategorySelect
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  A way to classify product items.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="unitId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <UnitSelect
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="unitConversionId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conversion</FormLabel>
                  <FormControl>
                    <UnitConversionPicker
                      unitId={form.watch("unitId")}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <ConversionInfo
            unitId={form.watch("unitId")}
            conversionId={form.watch("unitConversionId")}
          />

          <Separator />
          <FormField
            control={form.control}
            name="inventoryAssetAccountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inventory Asset Account</FormLabel>
                <FormControl>
                  <BookAccountsSelect
                    accountLabel="INVENTORY"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />

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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="salesPriceOrRate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales price/rate</FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder="0"
                      min={0}
                      {...form.register("salesPriceOrRate", {
                        valueAsNumber: true,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="incomeAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income Account</FormLabel>
                  <FormControl>
                    <BookAccountsSelect
                      accountLabel="INCOME"
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <FormField
            name="purchasingDescription"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchasing Information</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description on purchase forms"
                    className="min-h-[60px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expenseAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Account</FormLabel>
                  <FormControl>
                    <BookAccountsSelect
                      accountLabel="EXPENSE"
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="supplierId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Supplier</FormLabel>
                  <FormControl>
                    <SupplierSelect
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                            <ProductSelect
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

              <div className="flex items-center justify-between p-2">
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

                <FormField
                  name="cost"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex w-48 items-center gap-3 space-y-0">
                      <FormLabel>Cost</FormLabel>
                      <FormControl>
                        <NumberInput
                          currency="Php"
                          disabled
                          placeholder="0"
                          min={0}
                          {...form.register("cost", {
                            valueAsNumber: true,
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </fieldset>

        <div className="sticky bottom-0 border-t bg-background p-4">
          <div className="flex items-center justify-end gap-3">
            <Button
              type="reset"
              size="sm"
              variant="ghost"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" size="sm" loading={isBusy}>
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
