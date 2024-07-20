"use client"

import { createUnitConversion } from "@/actions/units"
import { conversionSchema, UnitConversionInput } from "@/schema/unit"
import { zodResolver } from "@hookform/resolvers/zod"
import { InfoIcon, PlusIcon } from "lucide-react"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { useCurrentStore } from "@/hooks/useCurrentStore"
import { useUnits } from "@/hooks/useUnits"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"

interface UnitConversionFormProps {
  initialName?: string
  onAfterSave: (newValue: string) => void
  unitName?: string
  unitId?: string
}

export function UnitConversionForm({
  initialName,
  onAfterSave,
  unitName,
  unitId,
}: UnitConversionFormProps) {
  if (!unitId) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="mb-1 w-full justify-start"
        >
          <PlusIcon className="mr-3 size-4" /> Add{" "}
          {initialName ? `"${initialName}"` : "Conversion"}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>New Conversion for {unitName}</DialogTitle>
          <DialogDescription>
            Example: A factor of 250 means 1 bottle = 250 ml.
          </DialogDescription>
        </DialogHeader>
        <ConversionForm
          unitId={unitId}
          unitName={unitName}
          initialName={initialName}
          onAfterSave={onAfterSave}
        />
      </DialogContent>
    </Dialog>
  )
}

function ConversionForm({
  initialName,
  onAfterSave,
  unitName,
  unitId,
}: UnitConversionFormProps) {
  const form = useForm<UnitConversionInput>({
    resolver: zodResolver(conversionSchema),
    defaultValues: {
      name: initialName,
      description: "",
      factor: "",
    },
  })

  const store = useCurrentStore()

  const units = useUnits()

  const createAction = useServerAction(createUnitConversion)

  const isBusy = createAction.isPending

  function onError(errors: FieldErrors<UnitConversionInput>) {
    console.log(errors)
  }

  async function onSubmit(values: UnitConversionInput) {
    try {
      if (!store.data?.id) return

      if (!unitId) return

      const [result, err] = await createAction.execute({
        unitId,
        storeId: store.data?.id,
        to: values.to,
        name: values.name,
        description: values.description,
        factor: values.factor,
      })

      if (err) {
        toast.error(err.message)
        return
      }

      toast.success("Unit Conversion saved!")

      await units.refetch()

      if (result) {
        onAfterSave(result.id)
      }
    } catch (error) {}
  }

  return (
    <Form {...form}>
      <form
        onSubmit={async (e) => {
          const handler = form.handleSubmit(onSubmit, onError)

          e.preventDefault()
          e.stopPropagation()

          await handler(e)
        }}
      >
        <fieldset disabled={isBusy}>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel htmlFor="name">
                    Name <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input id="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="to">
                    To <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input id="to" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="factor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="factor">
                    Factor <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <NumberInput id="factor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.isValid ? (
              <p className="flex items-center text-xs text-muted-foreground">
                <InfoIcon className="mr-1 size-3" /> 1 {unitName} ={" "}
                {form.watch("factor")} {form.watch("name")}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isBusy}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isBusy} loading={createAction.isPending}>
              Save
            </Button>
          </DialogFooter>
        </fieldset>
      </form>
    </Form>
  )
}
