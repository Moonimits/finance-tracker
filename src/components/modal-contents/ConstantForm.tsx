import FormDatePicker from "@/components/shared/forms/FormDatePicker"
import FormInput from "@/components/shared/forms/FormInput"
import FormSelect from "@/components/shared/forms/FormSelect"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import {
  useAddConstantMutation,
  useGetExpenseTypeQuery,
  useUpdateConstantMutation,
} from "@/store/api/supabaseApi"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { closeModal } from "@/store/slice/modalSlice"
import type { Constant, ConstantTypeMeta } from "@/types/constatTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { FormProvider, useForm, type Resolver } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const constantSchema = z.object({
  constantName: z.string().min(1, "Must have constant name"),
  constantType: z.string().min(1, "Must have constant type"),
  amount: z.coerce.number().min(1, "Amount must be greater than zero"),
  date: z.date(),
})

type ConstantForm = z.infer<typeof constantSchema>

const ConstantForm = () => {
  const { data: modalData } = useAppSelector((state) => state.modal)
  const [addConstant] = useAddConstantMutation()
  const [editConstant] = useUpdateConstantMutation()
  const dispatch = useAppDispatch()

  const { data } = useGetExpenseTypeQuery()
  const constantType = data?.expense_types ?? {}
  const constant = modalData as Constant
  const isEditing = !!constant

  const form = useForm<ConstantForm>({
    resolver: zodResolver(constantSchema) as Resolver<ConstantForm>,
    defaultValues: {
      constantName: constant?.constant_name ?? "",
      amount: constant?.amount ?? ("" as unknown as number),
      constantType: constant?.constant_type ?? "",
      date: constant?.date ? new Date(constant.date) : new Date(),
    },
  })

  const onSubmit = async (formData: ConstantForm) => {
    try {
      if (isEditing) {
        await editConstant({
          id: constant.id,
          constant_name: formData.constantName,
          amount: formData.amount,
          constant_type: formData.constantType,
          date: format(formData.date, "y-MM-dd"),
        }).unwrap()
      } else {
        await addConstant({
          constant_name: formData.constantName,
          amount: formData.amount,
          constant_type: formData.constantType,
          date: format(formData.date, "y-MM-dd"),
        }).unwrap()
      }

      toast.success(
        isEditing ? "Edit Constant Successful" : "Add Constant Successful"
      )
      dispatch(closeModal())
    } catch (error) {
      toast.error(isEditing ? "Edit Constant Failed" : "Add Constant Failed")
    }
  }

  return (
    <>
      <FormProvider {...form}>
        <form id="constantForm" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormInput<ConstantForm>
              name="constantName"
              label="Constant Name"
              placeholder="e.g. Netflix Subscription"
              isRequired={true}
            />

            <FormInput<ConstantForm>
              name="amount"
              label="Amount"
              placeholder="e.g. 1200"
              isRequired={true}
            />

            <FormSelect<ConstantForm, ConstantTypeMeta>
              name="constantType"
              label="Constant Type"
              items={constantType}
              placeholder="Select a Type"
              isRequired={true}
            />

            <FormDatePicker<ConstantForm>
              name="date"
              label="Date"
              isRequired={true}
            />
          </FieldGroup>
        </form>
      </FormProvider>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button form="constantForm" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? isEditing
              ? "Editing Constant..."
              : "Adding Constant..."
            : isEditing
              ? "Edit Constant"
              : "Add Constant"}
        </Button>
      </DialogFooter>
    </>
  )
}

export default ConstantForm
