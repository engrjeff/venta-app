"use client"

import { ProductItem, updateProduct } from "@/actions/products"
import { InventoryCreateInput, inventoryCreateSchema } from "@/schema/product"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

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
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ConversionInfo } from "@/components/features/units/conversion-info"
import { UnitConversionPicker } from "@/components/features/units/unit-conversion-picker"
import { UnitSelect } from "@/components/features/units/unit-select"

import { CategorySelect } from "../categories/category-select"
import { BookAccountsSelect } from "./book-accounts-select"
import { SkuInput } from "./sku-input"
import { SupplierSelect } from "./supplier-select"

interface Props {
  closeCallback?: () => void
  product: ProductItem
}

export function InventoryTypeEditForm({ closeCallback, product }: Props) {
  const form = useForm<InventoryCreateInput>({
    resolver: zodResolver(inventoryCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: product.name,
      sku: product.sku ?? undefined,
      categoryId: product.categoryId ?? undefined,
      initialQuantity: product.initialQuantity ?? 0,
      reorderPoint: product.reorderPoint ?? 0,
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
      asOfDate: product.asOfDate ? format(product.asOfDate, "yyyy-MM-dd") : "",
    },
  })

  const editAction = useServerAction(updateProduct)

  const isBusy = editAction.isPending

  function onError(errors: FieldErrors<InventoryCreateInput>) {
    console.log(errors)
  }

  async function onSubmit(
    { image, ...values }: InventoryCreateInput,
    shouldClose?: boolean
  ) {
    try {
      if (!product.id) return

      const [data, err] = await editAction.execute({
        type: "inventory",
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
        <fieldset className="space-y-3 p-4" disabled={isBusy}>
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
                        placeholder="Product name"
                        className="min-h-[60px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="sku"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      SKU <span>*</span>
                    </FormLabel>
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
          <div className="grid grid-cols-3 gap-4">
            <FormField
              name="initialQuantity"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Initial Qty <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder="0"
                      min={0}
                      {...form.register("initialQuantity", {
                        valueAsNumber: true,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="asOfDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    As of Date <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      max={format(new Date(), "yyyy-MM-dd")}
                    />
                  </FormControl>
                  <Popover>
                    <PopoverTrigger>
                      <FormDescription className="hover:underline">
                        What is as of date?
                      </FormDescription>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-52 border bg-muted text-xs"
                    >
                      <p>
                        The inventory as of date is the date you start tracking
                        the quantity on hand of an inventory item in Venta.
                      </p>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="reorderPoint"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reorder Point</FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder="0"
                      min={0}
                      {...form.register("reorderPoint", {
                        valueAsNumber: true,
                      })}
                    />
                  </FormControl>
                  <Popover>
                    <PopoverTrigger>
                      <FormDescription className="hover:underline">
                        What is reorder point?
                      </FormDescription>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-52 border bg-muted text-xs"
                    >
                      <p>
                        A reorder point is the threshold when you should reorder
                        more of an inventory item.
                      </p>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
              name="cost"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <NumberInput
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
