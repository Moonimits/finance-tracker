import type { FieldValues, Path } from "react-hook-form"

export type FormFieldProps<T extends FieldValues> = {
  name: Path<T>
  label: string
  type?: string
  placeholder?: string
  isRequired?: boolean
}

export type FormFieldSelectProps<
  T extends FieldValues,
  TItem extends { label: string },
> = FormFieldProps<T> & {
  items: Record<string, TItem>
}
