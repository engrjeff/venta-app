"use client"

import { ProductCreateInput } from "@/schema/product"
import { ChevronDownIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { AppCombobox } from "@/components/shared/app-combobox"

import { ExpenseAccountForm } from "../account-types/ExpenseAccountForm"
import { IncomeAccountForm } from "../account-types/IncomeAccountForm"
import { InventoryAssetAccountForm } from "../account-types/InventoryAssetAccountForm"
import { CategorySelect } from "./category-select"
import { SupplierSelect } from "./supplier-select"
import { UnitSelect } from "./unit-select"

export function InventoryTypeForm() {
  const form = useForm<ProductCreateInput>({
    defaultValues: {
      initialQuantity: 0,
      reorderPoint: 0,
      cost: 0,
      salesPriceOrRate: 0,
    },
  })

  function onSubmit(values: ProductCreateInput) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      <Input placeholder="SKU" {...field} />
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
                      <ImagePicker />
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
              name="initialQuantity"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Initial Quantity on hand <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <NumberInput {...field} placeholder="0" min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="asOfDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    As of Date <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                    <NumberInput {...field} min={0} />
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
          <Separator />
          <FormField
            control={form.control}
            name="inventoryAssetAccountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inventory Asset Account</FormLabel>
                <FormControl>
                  <AppCombobox
                    label="Choose Inventory Asset"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={[
                      { value: "inventory", label: "Inventory" },
                      { value: "inventory_asset", label: "Inventory Asset" },
                    ]}
                    renderEmpty={(search) => (
                      <InventoryAssetAccountForm initialNameValue={search} />
                    )}
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
                <FormLabel>
                  Description <span>*</span>
                </FormLabel>
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
                    <NumberInput placeholder="100" {...field} />
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
                    <AppCombobox
                      label="Income Account"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={[
                        { value: "1", label: "Sales of Product Income" },
                      ]}
                      renderEmpty={(search) => (
                        <IncomeAccountForm initialNameValue={search} />
                      )}
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
                    <NumberInput placeholder="100" {...field} />
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
                    <AppCombobox
                      label="Expense Account"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={[{ value: "1", label: "Cost of sales" }]}
                      renderEmpty={(search) => (
                        <ExpenseAccountForm initialNameValue={search} />
                      )}
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
          <div className="flex items-center justify-end divide-x divide-white/10">
            <Button type="submit" size="sm" className="rounded-r-none">
              Save and New
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" className="size-9 rounded-l-none">
                  <span className="sr-only">click for more</span>{" "}
                  <ChevronDownIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Save and Close</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </form>
    </Form>
  )
}
