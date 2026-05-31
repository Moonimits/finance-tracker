import FormDatePicker from "@/components/shared/forms/FormDatePicker"
import FormInput from "@/components/shared/forms/FormInput"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import {
  useAddBudgetMutation,
  useUpdateBudgetMutation,
} from "@/store/api/supabaseApi"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { closeModal } from "@/store/slice/modalSlice"
import type { Budget } from "@/types/budgetTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { FormProvider, useForm, type Resolver } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const budgetSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be greater than zero"),
  date: z.date(),
})

type BudgetForm = z.infer<typeof budgetSchema>

const BudgetForm = () => {
  const { data: modalData } = useAppSelector((state) => state.modal)
  const dispatch = useAppDispatch()

  const [addBudget] = useAddBudgetMutation()
  const [updateBudget] = useUpdateBudgetMutation()

  const budget = modalData as Budget
  const isEditing = !!budget

  const form = useForm<BudgetForm>({
    resolver: zodResolver(budgetSchema) as Resolver<BudgetForm>,
    defaultValues: {
      amount: budget?.amount ?? ("" as unknown as number),
      date: budget?.date ? new Date(budget.date) : new Date(),
    },
  })

  const onSubmit = async (formData: BudgetForm) => {
    try {
      if (isEditing) {
        await updateBudget({
          id: budget.id,
          amount: formData.amount,
          date: format(formData.date, "y-MM-dd"),
        }).unwrap()
      } else {
        await addBudget({
          amount: formData.amount,
          date: format(formData.date, "y-MM-dd"),
        }).unwrap()
      }

      toast.success(
        isEditing ? "Edit Budget Successful" : "Add Budget Successful"
      )
      dispatch(closeModal())
    } catch (error) {
      toast.error(isEditing ? "Edit Budget Failed" : "Add Budget Failed")
    }
  }
  return (
    <>
      <FormProvider {...form}>
        <form id="budgetForm" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormInput<BudgetForm>
              name="amount"
              label="Amount"
              placeholder="e.g. 1200"
              isRequired
            />
            <FormDatePicker<BudgetForm> name="date" label="Date" isRequired />
          </FieldGroup>
        </form>
      </FormProvider>
      <DialogFooter>
        <DialogClose>Close</DialogClose>
        <Button form="budgetForm" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? isEditing
              ? "Editing Budget..."
              : "Adding Budget..."
            : isEditing
              ? "Edit Budget"
              : "Add Budget"}
        </Button>
      </DialogFooter>
    </>
  )
}

export default BudgetForm
