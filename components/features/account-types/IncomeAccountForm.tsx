"use client"

import { ChevronDownIcon, PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function IncomeAccountForm({
  initialNameValue,
}: {
  initialNameValue?: string
}) {
  const form = useForm()

  const onSubmit = async () => {}

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="mb-1 w-full justify-start"
        >
          <PlusIcon className="mr-3 size-4" /> Add{" "}
          {initialNameValue ? `"${initialNameValue}"` : "New"}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-2xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="account_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Income" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Income">Income</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          defaultValue={initialNameValue}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="detail_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Detail Type <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sales of Product Income" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sales of Product Income">
                            Sales of Product Income
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 rounded-md bg-muted p-3 text-xs">
                  <p>
                    Use{" "}
                    <span className="font-semibold text-primary">
                      Sales of product income
                    </span>{" "}
                    to track income from selling products.
                  </p>
                  <p>
                    This can include all kinds of products, like crops and
                    livestock, rental fees, performances, and food served.
                  </p>
                </div>
              </div>
            </fieldset>
            <DialogFooter className="mt-8">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <div className="flex items-center justify-end divide-x divide-white/10">
                <Button type="submit" size="sm" className="rounded-r-none">
                  Save and Close
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" className="size-9 rounded-l-none">
                      <span className="sr-only">click for more</span>{" "}
                      <ChevronDownIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Save and New</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
