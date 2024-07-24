"use client"

import { createServiceProduct } from "@/actions/products"
import { serviceCreateSchema, ServiceInput } from "@/schema/product"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { useCurrentStore } from "@/hooks/useCurrentStore"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { CategorySelect } from "../categories/category-select"
import { BookAccountsSelect } from "./book-accounts-select"
import { SkuInput } from "./sku-input"
import { SupplierSelect } from "./supplier-select"

interface Props {
  closeCallback?: () => void
}

export function ServiceTypeForm({ closeCallback }: Props) {
  const store = useCurrentStore()

  const form = useForm<ServiceInput>({
    resolver: zodResolver(serviceCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      sku: "",
      cost: 0,
      salesPriceOrRate: 0,
      isSelling: true,
    },
  })

  const createAction = useServerAction(createServiceProduct)

  const isBusy = createAction.isPending

  const isSelling = form.watch("isSelling")
  const isPurchasing = form.watch("isPurchasing")

  function onError(errors: FieldErrors<ServiceInput>) {
    console.log(errors)
  }

  async function onSubmit(
    { image, ...values }: ServiceInput,
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
                        placeholder="Service name"
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

          <Separator />

          <Label className="mt-6 inline-block">Description</Label>
          <FormField
            control={form.control}
            name="isSelling"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)

                      if (!checked && !isPurchasing) {
                        form.setValue("isPurchasing", true)
                      }
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I sell this product/service to my customers.
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {isSelling ? (
            <>
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Description</FormLabel>
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
            </>
          ) : null}
          <Separator />
          <Label className="mt-6 inline-block">Purchasing Information</Label>
          <FormField
            control={form.control}
            name="isPurchasing"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)

                      if (!checked && !isSelling) {
                        form.setValue("isSelling", true)
                      }
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I purchase this product/service from a supplier.
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          {isPurchasing ? (
            <>
              <FormField
                name="purchasingDescription"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">
                      Purchasing Information
                    </FormLabel>
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
            </>
          ) : null}
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
