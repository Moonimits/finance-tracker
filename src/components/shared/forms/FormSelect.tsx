import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FormFieldSelectProps } from "@/types/formTypes"
import { useController, type FieldValues } from "react-hook-form"

const FormSelect = <T extends FieldValues, TItem extends { label: string }>({
  name,
  label,
  items,
  placeholder,
  isRequired,
}: FormFieldSelectProps<T, TItem>) => {
  const { field, fieldState } = useController({ name })

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Select
        name={field.name}
        value={field.value ? String(field.value) : ""}
        onValueChange={field.onChange}
        required={isRequired}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper">
          {Object.entries(items).map(([key, item]) => (
            <SelectItem key={key} value={String(key)}>
              {item?.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
    </Field>
  )
}

export default FormSelect
