import { updateUnit } from "@/actions/units"
import { EditUnitInput, editUnitSchema } from "@/schema/unit"
import { zodResolver } from "@hookform/resolvers/zod"
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react"
import { FieldErrors, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
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

import { UnitWithConversion } from "./types"

interface EditUnitFormProps {
  unit: UnitWithConversion
  onAfterSave: () => void
}

export function EditUnitForm({ unit, onAfterSave }: EditUnitFormProps) {
  const form = useForm<EditUnitInput>({
    mode: "all",
    resolver: zodResolver(editUnitSchema),
    defaultValues: {
      id: unit.id,
      name: unit.name ?? "",
      conversions: unit.conversions?.map((c) => ({
        id: c.id,
        description: c.description ?? undefined,
        name: c.name,
        factor: c.factor.toString(),
        to: c.to,
      })),
    },
  })

  const conversions = useFieldArray<EditUnitInput>({
    control: form.control,
    name: "conversions",
  })

  const editUnitAction = useServerAction(updateUnit)

  const isBusy = editUnitAction.isPending

  function onError(errors: FieldErrors<EditUnitInput>) {
    console.log(errors)
  }

  async function onSubmit(values: EditUnitInput) {
    try {
      const [result, err] = await editUnitAction.execute({
        id: unit.id,
        name: values.name,
        conversions: values.conversions,
      })

      if (err) {
        toast.error(err.message)
        return
      }

      toast.success("Unit saved!")

      onAfterSave()
      onAfterSave()
    } catch (error) {}
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <fieldset className="space-y-2" disabled={isBusy}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name" className="text-right">
                  Name <span>*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Unit name e.g. kg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        {conversions.fields.length === 0 ? (
          <div className="my-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="py-0 text-xs"
              onClick={async () => {
                const isValidSoFar = await form.trigger()
                if (!isValidSoFar) return
                conversions.append({
                  to: "",
                  name: "",
                  factor: "",
                })
              }}
            >
              <PlusCircleIcon className="mr-2 size-3" /> Conversion
            </Button>
          </div>
        ) : (
          <fieldset className="my-4" disabled={isBusy}>
            <legend className="inline-block text-[10px] uppercase text-muted-foreground">
              Conversions
            </legend>

            <p className="mb-3 text-[10px] text-muted-foreground">
              {"Example: 1 bottle = 250 ml means a factor of 250"}
            </p>

            <div className="space-y-2">
              {conversions.fields.map((conversionField, index) => (
                <div
                  key={conversionField.id}
                  className="grid grid-cols-[auto,100px,150px] gap-4"
                >
                  <FormField
                    control={form.control}
                    name={`conversions.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor={`conversions.${index}.name`}
                          className={cn(
                            "text-right",
                            index === 0 ? "" : "sr-only"
                          )}
                        >
                          Name <span>*</span>
                        </FormLabel>
                        <FormControl>
                          <div>
                            <Input
                              id={`conversions.${index}.name`}
                              {...field}
                            />
                            {form.watch(`conversions.${index}.name`) &&
                            form.watch(`conversions.${index}.factor`) ? (
                              <p className="mt-2 text-xs text-muted-foreground">
                                1 {form.watch("name")} ={" "}
                                {form.watch(`conversions.${index}.factor`)}{" "}
                                {form.watch(`conversions.${index}.to`)}
                              </p>
                            ) : null}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`conversions.${index}.to`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor={`conversions.${index}.to`}
                          className={cn(
                            "text-right",
                            index === 0 ? "" : "sr-only "
                          )}
                        >
                          To <span>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input id={`conversions.${index}.to`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`conversions.${index}.factor`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor={`conversions.${index}.factor`}
                          className={cn(
                            "text-right",
                            index === 0 ? "" : "sr-only"
                          )}
                        >
                          Factor <span>*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-3">
                            <NumberInput
                              id={`conversions.${index}.factor`}
                              {...field}
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="shrink-0"
                              onClick={() => conversions.remove(index)}
                            >
                              <span className="sr-only">Remove</span>
                              <MinusCircleIcon className="size-4" />
                            </Button>
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <Button
              type="button"
              size="icon"
              variant="outline"
              className="mt-3 shrink-0"
              onClick={async () => {
                const isValidSoFar = await form.trigger()
                if (!isValidSoFar) return
                conversions.append({
                  name: "",
                  to: "",
                  factor: "",
                })
              }}
            >
              <span className="sr-only">Add</span>
              <PlusCircleIcon className="size-4" />
            </Button>
          </fieldset>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isBusy}>
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={isBusy} loading={editUnitAction.isPending}>
            Save
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
