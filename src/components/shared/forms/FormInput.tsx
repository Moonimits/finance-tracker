import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { FormFieldProps } from "@/types/formTypes"
import { useController, type FieldValues } from "react-hook-form"

const FormInput = <T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  isRequired,
}: FormFieldProps<T>) => {
  const { field, fieldState } = useController({ name })

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        type={type}
        {...field}
        placeholder={placeholder}
        required={isRequired}
      />
      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
    </Field>
  )
}

export default FormInput
