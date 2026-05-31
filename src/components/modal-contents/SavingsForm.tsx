import FormDatePicker from "@/components/shared/forms/FormDatePicker"
import FormInput from "@/components/shared/forms/FormInput"
import FormSelect from "@/components/shared/forms/FormSelect"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import {
  useAddSavingsMutation,
  useGetSavingsForQuery,
  useUpdateSavingsMutation,
} from "@/store/api/supabaseApi"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { closeModal } from "@/store/slice/modalSlice"
import type { Savings, SavingsForMeta } from "@/types/savingsTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { FormProvider, useForm, type Resolver } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const savingsSchema = z.object({
  savings_for: z.string().min(1, "Must have Savings For"),
  amount: z.coerce.number().min(1, "Amount must be greater than zero"),
  date: z.coerce.date(),
})

type SavingsForm = z.infer<typeof savingsSchema>

const SavingsForm = () => {
  const { data: modalData } = useAppSelector((state) => state.modal)
  const [addSavings] = useAddSavingsMutation()
  const [updateSavings] = useUpdateSavingsMutation()
  const dispatch = useAppDispatch()
  const { data } = useGetSavingsForQuery()

  const savings = modalData as Savings
  const savingsFor = data?.savings_for ?? {}
  const isEditing = !!savings

  const form = useForm<SavingsForm>({
    resolver: zodResolver(savingsSchema) as Resolver<SavingsForm>,
    defaultValues: {
      savings_for: savings?.savings_for ?? "",
      amount: savings?.amount ?? ("" as unknown as number),
      date: savings?.date ? new Date(savings.date) : new Date(),
    },
  })

  const onSubmit = async (formData: SavingsForm) => {
    try {
      if (isEditing) {
        await updateSavings({
          id: savings.id,
          amount: formData.amount,
          savings_for: formData.savings_for,
          date: format(formData.date, "y-MM-dd"),
        }).unwrap()
      } else {
        await addSavings({
          amount: formData.amount,
          savings_for: formData.savings_for,
          date: format(formData.date, "y-MM-dd"),
        }).unwrap()
      }

      toast.success(
        isEditing ? "Edit Savings Successful" : "Add Savings Successful"
      )
      dispatch(closeModal())
    } catch (error) {
      toast.error(isEditing ? "Edit Savings Failed" : "Add Savings Failed")
    }
  }

  return (
    <>
      <FormProvider {...form}>
        <form id="savingsForm" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormSelect<SavingsForm, SavingsForMeta>
              name="savings_for"
              items={savingsFor}
              label="Savings For"
              placeholder="Select Savings for"
            />
            <FormInput<SavingsForm>
              name="amount"
              label="Amount"
              type="number"
              placeholder="e.g. 1200"
              isRequired={true}
            />
            <FormDatePicker<SavingsForm>
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
        <Button form="savingsForm" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? isEditing
              ? "Editing Savings..."
              : "Adding Savings..."
            : isEditing
              ? "Edit Savings"
              : "Add Savings"}
        </Button>
      </DialogFooter>
    </>
  )
}

export default SavingsForm
