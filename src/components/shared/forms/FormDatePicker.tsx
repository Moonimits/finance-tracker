import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { FormFieldProps } from "@/types/formTypes"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useController, type FieldValues } from "react-hook-form"

const FormDatePicker = <T extends FieldValues>({
  name,
  label,
}: FormFieldProps<T>) => {
  const { field, fieldState } = useController({ name })

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex">
            {format(field.value, "PPP")}
            <CalendarIcon className="ml-auto size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
          />
        </PopoverContent>
      </Popover>
      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
    </Field>
  )
}

export default FormDatePicker
